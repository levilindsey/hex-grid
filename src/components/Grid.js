/**
 * @typedef {AnimationJob} Grid
 */

/**
 * @typedef {Object} PostData
 * @property {String} id
 * @property {String} titleShort
 * @property {String} titleLong
 * @property {Array.<String>} urls
 * @property {String} jobTitle
 * @property {String} location
 * @property {String} date
 * @property {Array.<String>} categories
 * @property {Array.<ImageData>} images
 * @property {Array.<VideoData>} videos
 * @property {String} content An extended description of the post in markdown syntax.
 */

/**
 * @typedef {Object} ImageData
 * @property {String} fileName
 * @property {String} description
 */

/**
 * @typedef {Object} VideoData
 * @property {'youtube'|'vimeo'} videoHost
 * @property {String} id
 * @property {String} description
 */

/**
 * This module defines a constructor for Grid objects.
 *
 * Grid objects define a collection of hexagonal tiles that animate and display dynamic,
 * textual content.
 *
 * @module Grid
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // TODO:
  // - update the tile radius and the targetContentAreaWidth with the screen width?
  //   - what is my plan for mobile devices?

  var config = {};

  config.targetContentAreaWidth = 800;
  config.backgroundHue = 230;
  config.backgroundSaturation = 1;
  config.backgroundLightness = 4;
  config.tileHue = 230;//147;
  config.tileSaturation = 67;
  config.tileLightness = 22;
  config.tileOuterRadius = 80;
  config.tileGap = 12;
  config.contentStartingRowIndex = 2;
  config.firstRowYOffset = config.tileOuterRadius * -0.8;
  config.contentDensity = 1.0;//0.6;
  config.tileMass = 1;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.sqrtThreeOverTwo = Math.sqrt(3) / 2;
    config.twoOverSqrtThree = 2 / Math.sqrt(3);

    config.tileInnerRadius = config.tileOuterRadius * config.sqrtThreeOverTwo;

    config.longGap = config.tileGap * config.twoOverSqrtThree;

    config.tileShortLengthWithGap = config.tileInnerRadius * 2 + config.tileGap;
    config.tileLongLengthWithGap = config.tileOuterRadius * 2 + config.longGap;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @global
   * @constructor
   * @param {Number} index
   * @param {HTMLElement} parent
   * @param {Array.<PostData>} postData
   * @param {Boolean} [isVertical]
   */
  function Grid(index, parent, postData, isVertical) {
    var grid = this;

    grid.index = index;
    grid.parent = parent;
    grid.postData = postData;
    grid.isVertical = isVertical;

    grid.actualContentAreaWidth = config.targetContentAreaWidth;

    grid.isComplete = true;

    grid.svg = null;
    grid.svgDefs = null;
    grid.originalTiles = [];
    grid.originalBorderTiles = [];
    grid.contentTiles = [];
    grid.originalContentInnerIndices = null;
    grid.innerIndexOfLastContentTile = null;
    grid.originalCenter = null;
    grid.currentCenter = null;
    grid.panCenter = null;
    grid.isPostOpen = false;
    grid.pagePost = null;
    grid.isTransitioning = false;
    grid.expandedTile = null;
    grid.sectors = null;
    grid.allTiles = null;
    grid.allNonContentTiles = null;
    grid.lastExpansionJob = null;
    grid.scrollTop = Number.NaN;

    grid.annotations = new window.hg.Annotations(grid);

    grid.actualContentAreaWidth = Number.NaN;
    grid.rowDeltaY = Number.NaN;
    grid.tileDeltaX = Number.NaN;
    grid.tileNeighborDistance = Number.NaN;
    grid.oddRowTileCount = Number.NaN;
    grid.evenRowTileCount = Number.NaN;
    grid.oddRowXOffset = Number.NaN;
    grid.rowCount = Number.NaN;
    grid.evenRowXOffset = Number.NaN;
    grid.contentAreaLeft = Number.NaN;
    grid.contentAreaRight = Number.NaN;
    grid.oddRowContentStartIndex = Number.NaN;
    grid.evenRowContentStartIndex = Number.NaN;
    grid.oddRowContentTileCount = Number.NaN;
    grid.evenRowContentTileCount = Number.NaN;
    grid.oddRowContentEndIndex = Number.NaN;
    grid.evenRowContentEndIndex = Number.NaN;
    grid.actualContentInnerIndices = Number.NaN;
    grid.innerIndexOfLastContentTile = Number.NaN;
    grid.rowCount = Number.NaN;
    grid.height = Number.NaN;

    grid.resize = resize;
    grid.start = start;
    grid.update = update;
    grid.draw = draw;
    grid.cancel = cancel;
    grid.init = init;

    grid.setBackgroundColor = setBackgroundColor;
    grid.updateTileColor = updateTileColor;
    grid.updateTileMass = updateTileMass;
    grid.setHoveredTile = setHoveredTile;
    grid.createPagePost = createPagePost;
    grid.destroyPagePost = destroyPagePost;
    grid.updateAllTilesCollection = updateAllTilesCollection;
    grid.computeContentIndices = computeContentIndices;

    grid.parent.setAttribute('data-hg-grid-parent', 'data-hg-grid-parent');

    createSvg.call(grid);
    setBackgroundColor.call(grid);
    computeContentIndices.call(grid);
    resize.call(grid);
  }

  Grid.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Grid = Grid;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Computes various parameters of the grid. These include:
   *
   * - row count
   * - number of tiles in even and odd rows
   * - the vertical and horizontal displacement between neighbor tiles
   * - the horizontal positions of the first tiles in even and odd rows
   *
   * @this Grid
   */
  function computeGridParameters() {
    var grid, parentHalfWidth, parentHeight, innerContentCount, rowIndex, i, count,
        emptyRowsContentTileCount, minInnerTileCount;

    grid = this;

    parentHalfWidth = grid.parent.clientWidth * 0.5;
    parentHeight = grid.parent.clientHeight;

    grid.originalCenter.x = parentHalfWidth;
    grid.originalCenter.y = parentHeight * 0.5;
    grid.currentCenter.x = grid.originalCenter.x;
    grid.currentCenter.y = grid.originalCenter.y;
    grid.panCenter.x = grid.originalCenter.x;
    grid.panCenter.y = grid.originalCenter.y;

    grid.actualContentAreaWidth = grid.parent.clientWidth < config.targetContentAreaWidth ?
        grid.parent.clientWidth : config.targetContentAreaWidth;

    if (grid.isVertical) {
      grid.rowDeltaY = config.tileOuterRadius * 1.5 + config.tileGap * config.sqrtThreeOverTwo;
      grid.tileDeltaX = config.tileShortLengthWithGap;

      grid.oddRowTileCount = Math.ceil((parentHalfWidth - (config.tileInnerRadius + config.tileGap)) / config.tileShortLengthWithGap) * 2 + 1;
      grid.evenRowTileCount = Math.ceil((parentHalfWidth - (config.tileShortLengthWithGap + config.tileGap * 0.5)) / config.tileShortLengthWithGap) * 2 + 2;

      grid.oddRowXOffset = parentHalfWidth - config.tileShortLengthWithGap * (grid.oddRowTileCount - 1) / 2;

      grid.rowCount = Math.ceil((parentHeight - (config.firstRowYOffset + config.tileOuterRadius * 2 + config.tileGap * Math.sqrt(3))) / grid.rowDeltaY) + 2;
    } else {
      grid.rowDeltaY = config.tileInnerRadius + config.tileGap * 0.5;
      grid.tileDeltaX = config.tileOuterRadius * 3 + config.tileGap * Math.sqrt(3);

      grid.oddRowTileCount = Math.ceil((parentHalfWidth - (grid.tileDeltaX - config.tileOuterRadius)) / grid.tileDeltaX) * 2 + 1;
      grid.evenRowTileCount = Math.ceil((parentHalfWidth - (grid.tileDeltaX + (config.tileGap * config.sqrtThreeOverTwo) + config.tileOuterRadius * 0.5)) / grid.tileDeltaX) * 2 + 2;

      grid.oddRowXOffset = parentHalfWidth - grid.tileDeltaX * (grid.oddRowTileCount - 1) / 2;

      grid.rowCount = Math.ceil((parentHeight - (config.firstRowYOffset + config.tileInnerRadius * 3 + config.tileGap * 2)) / grid.rowDeltaY) + 4;
    }

    grid.evenRowXOffset = grid.oddRowXOffset +
        (grid.evenRowTileCount > grid.oddRowTileCount ? -1 : 1) * grid.tileDeltaX * 0.5;

    // --- Row inner content information --- //

    grid.contentAreaLeft = parentHalfWidth - grid.actualContentAreaWidth * 0.5;
    grid.contentAreaRight = grid.contentAreaLeft + grid.actualContentAreaWidth;

    if (grid.isVertical) {
      grid.oddRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.oddRowXOffset - config.tileInnerRadius)) / grid.tileDeltaX);
      grid.evenRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.evenRowXOffset - config.tileInnerRadius)) / grid.tileDeltaX);
    } else {
      grid.oddRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.oddRowXOffset - config.tileOuterRadius)) / grid.tileDeltaX);
      grid.evenRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.evenRowXOffset - config.tileOuterRadius)) / grid.tileDeltaX);
    }

    grid.oddRowContentTileCount = grid.oddRowTileCount - grid.oddRowContentStartIndex * 2;
    grid.evenRowContentTileCount = grid.evenRowTileCount - grid.evenRowContentStartIndex * 2;

    grid.oddRowContentEndIndex = grid.oddRowContentStartIndex + grid.oddRowContentTileCount - 1;
    grid.evenRowContentEndIndex = grid.evenRowContentStartIndex + grid.evenRowContentTileCount - 1;

    // Update the content inner indices to account for empty rows at the start of the grid
    grid.actualContentInnerIndices = [];
    emptyRowsContentTileCount = Math.ceil(config.contentStartingRowIndex / 2) * grid.oddRowContentTileCount +
        Math.floor(config.contentStartingRowIndex / 2) * grid.evenRowContentTileCount;
    for (i = 0, count = grid.originalContentInnerIndices.length; i < count; i += 1) {
      grid.actualContentInnerIndices[i] = grid.originalContentInnerIndices[i] + emptyRowsContentTileCount;
    }

    grid.innerIndexOfLastContentTile = grid.actualContentInnerIndices[grid.actualContentInnerIndices.length - 1];

    // Add empty rows at the end of the grid
    minInnerTileCount = emptyRowsContentTileCount + grid.innerIndexOfLastContentTile + 1;
    innerContentCount = 0;
    rowIndex = 0;

    while (minInnerTileCount > innerContentCount) {
      innerContentCount += rowIndex % 2 === 0 ?
          grid.oddRowContentTileCount : grid.evenRowContentTileCount;
      rowIndex += 1;
    }

    // Make sure the grid element is tall enough to contain the needed number of rows
    if (rowIndex > grid.rowCount) {
      grid.rowCount = rowIndex + (grid.isVertical ? 0 : 1);
      grid.height = (grid.rowCount - 2) * grid.rowDeltaY;
    } else {
      grid.height = parentHeight;
    }
  }

  /**
   * Calculates the tile indices within the content area column that will represent tiles with
   * content.
   *
   * @this Grid
   */
  function computeContentIndices() {
    var grid, i, j, count, tilesRepresentation;

    grid = this;

    // Use 1s to represent the tiles that hold data
    tilesRepresentation = [];
    count = grid.postData.length;
    for (i = 0; i < count; i += 1) {
      tilesRepresentation[i] = 1;
    }

    // Use 0s to represent the empty tiles
    count = (1 / config.contentDensity) * grid.postData.length;
    for (i = grid.postData.length; i < count; i += 1) {
      tilesRepresentation[i] = 0;
    }

    tilesRepresentation = window.hg.util.shuffle(tilesRepresentation);

    // Record the resulting indices of the elements representing tile content
    grid.originalContentInnerIndices = [];
    for (i = 0, j = 0, count = tilesRepresentation.length; i < count; i += 1) {
      if (tilesRepresentation[i]) {
        grid.originalContentInnerIndices[j++] = i;
      }
    }
  }

  /**
   * Creates the SVG element for the grid.
   *
   * @this Grid
   */
  function createSvg() {
    var grid;

    grid = this;

    grid.svg = document.createElementNS(window.hg.util.svgNamespace, 'svg');
    grid.parent.appendChild(grid.svg);

    grid.svg.style.display = 'block';
    grid.svg.style.position = 'relative';
    grid.svg.style.width = '1px';
    grid.svg.style.height = '1px';
    grid.svg.style.zIndex = '1000';
    grid.svg.style.overflow = 'visible';
    grid.svg.setAttribute('data-hg-svg', 'data-hg-svg');

    grid.svgDefs = document.createElementNS(window.hg.util.svgNamespace, 'defs');
    grid.svg.appendChild(grid.svgDefs);
  }

  /**
   * Creates the tile elements for the grid.
   *
   * @this Grid
   */
  function createTiles() {
    var grid, tileIndex, rowIndex, rowCount, columnIndex, columnCount, anchorX, anchorY,
        isMarginTile, isBorderTile, isCornerTile, isOddRow, contentAreaIndex, postDataIndex,
        defaultNeighborDeltaIndices, tilesNeighborDeltaIndices, oddRowIsLarger, isLargerRow;

    grid = this;

    grid.originalTiles = [];
    grid.originalBorderTiles = [];
    tileIndex = 0;
    contentAreaIndex = 0;
    postDataIndex = 0;
    anchorY = config.firstRowYOffset;
    rowCount = grid.rowCount;
    tilesNeighborDeltaIndices = [];

    defaultNeighborDeltaIndices = getDefaultNeighborDeltaIndices.call(grid);
    oddRowIsLarger = grid.oddRowTileCount > grid.evenRowTileCount;

    for (rowIndex = 0; rowIndex < rowCount; rowIndex += 1, anchorY += grid.rowDeltaY) {
      isOddRow = rowIndex % 2 === 0;
      isLargerRow = oddRowIsLarger && isOddRow || !oddRowIsLarger && !isOddRow;

      if (isOddRow) {
        anchorX = grid.oddRowXOffset;
        columnCount = grid.oddRowTileCount;
      } else {
        anchorX = grid.evenRowXOffset;
        columnCount = grid.evenRowTileCount;
      }

      for (columnIndex = 0; columnIndex < columnCount;
           tileIndex += 1, columnIndex += 1, anchorX += grid.tileDeltaX) {
        isMarginTile = isOddRow ?
            columnIndex < grid.oddRowContentStartIndex ||
                columnIndex > grid.oddRowContentEndIndex :
            columnIndex < grid.evenRowContentStartIndex ||
                columnIndex > grid.evenRowContentEndIndex;

        isBorderTile = grid.isVertical ?
            (columnIndex === 0 || columnIndex === columnCount - 1 ||
              rowIndex === 0 || rowIndex === rowCount - 1) :
            (rowIndex <= 1 || rowIndex >= rowCount - 2 ||
                isLargerRow && (columnIndex === 0 || columnIndex === columnCount - 1));

        isCornerTile = isBorderTile && (grid.isVertical ?
            ((columnIndex === 0 || columnIndex === columnCount - 1) &&
                (rowIndex === 0 || rowIndex === rowCount - 1)) :
            ((rowIndex <= 1 || rowIndex >= rowCount - 2) &&
                (isLargerRow && (columnIndex === 0 || columnIndex === columnCount - 1))));

        grid.originalTiles[tileIndex] = new window.hg.Tile(grid.svg, grid, anchorX, anchorY,
            config.tileOuterRadius, grid.isVertical, config.tileHue, config.tileSaturation,
            config.tileLightness, null, tileIndex, rowIndex, columnIndex, isMarginTile,
            isBorderTile, isCornerTile, isLargerRow, config.tileMass);

        if (isBorderTile) {
          grid.originalBorderTiles.push(grid.originalTiles[tileIndex]);
        }

        // Is the current tile within the content column?
        if (!isMarginTile) {
          // Does the current tile get to hold content?
          if (contentAreaIndex === grid.actualContentInnerIndices[postDataIndex]) {
            grid.originalTiles[tileIndex].setContent(grid.postData[postDataIndex]);
            grid.contentTiles[postDataIndex] = grid.originalTiles[tileIndex];
            postDataIndex += 1;
          }
          contentAreaIndex += 1;
        }

        // Determine the neighbor index offsets for the current tile
        tilesNeighborDeltaIndices[tileIndex] = getNeighborDeltaIndices.call(grid, rowIndex, rowCount,
            columnIndex, columnCount, isLargerRow, defaultNeighborDeltaIndices);
      }
    }

    setNeighborTiles.call(grid, tilesNeighborDeltaIndices);

    updateAllTilesCollection.call(grid, grid.originalTiles);
  }

  /**
   * Connects each tile with references to its neighborStates.
   *
   * @this Grid
   * @param {Array.<Array.<Number>>} tilesNeighborDeltaIndices
   */
  function setNeighborTiles(tilesNeighborDeltaIndices) {
    var grid, i, j, iCount, jCount, neighborTiles;

    grid = this;

    neighborTiles = [];

    // Give each tile references to each of its neighborStates
    for (i = 0, iCount = grid.originalTiles.length; i < iCount; i += 1) {
      // Get the neighborStates around the current tile
      for (j = 0, jCount = 6; j < jCount; j += 1) {
        neighborTiles[j] = !isNaN(tilesNeighborDeltaIndices[i][j]) ?
            grid.originalTiles[i + tilesNeighborDeltaIndices[i][j]] : null;
      }

      grid.originalTiles[i].setNeighborTiles(neighborTiles);
    }
  }

  /**
   * Get the actual neighbor index offsets for the tile described by the given parameters.
   *
   * NaN is used to represent the tile not having a neighbor on that side.
   *
   * @this Grid
   * @param {Number} rowIndex
   * @param {Number} rowCount
   * @param {Number} columnIndex
   * @param {Number} columnCount
   * @param {Boolean} isLargerRow
   * @param {Array.<Number>} defaultNeighborDeltaIndices
   * @returns {Array.<Number>}
   */
  function getNeighborDeltaIndices(rowIndex, rowCount, columnIndex, columnCount, isLargerRow,
                                   defaultNeighborDeltaIndices) {
    var grid, neighborDeltaIndices;

    grid = this;

    neighborDeltaIndices = defaultNeighborDeltaIndices.slice(0);

    // Remove neighbor indices according to the tile's position in the grid
    if (grid.isVertical) {
      // Is this the row with more or fewer tiles?
      if (isLargerRow) {
        // Is this the first column?
        if (columnIndex === 0) {
          neighborDeltaIndices[3] = Number.NaN;
          neighborDeltaIndices[4] = Number.NaN;
          neighborDeltaIndices[5] = Number.NaN;
        }

        // Is this the last column?
        if (columnIndex === columnCount - 1) {
          neighborDeltaIndices[0] = Number.NaN;
          neighborDeltaIndices[1] = Number.NaN;
          neighborDeltaIndices[2] = Number.NaN;
        }
      } else {
        // Is this the first column?
        if (columnIndex === 0) {
          neighborDeltaIndices[4] = Number.NaN;
        }

        // Is this the last column?
        if (columnIndex === columnCount - 1) {
          neighborDeltaIndices[1] = Number.NaN;
        }
      }

      // Is this the first row?
      if (rowIndex === 0) {
        neighborDeltaIndices[0] = Number.NaN;
        neighborDeltaIndices[5] = Number.NaN;
      }

      // Is this the last row?
      if (rowIndex === rowCount - 1) {
        neighborDeltaIndices[2] = Number.NaN;
        neighborDeltaIndices[3] = Number.NaN;
      }
    } else {
      if (isLargerRow) {
        // Is this the first column?
        if (columnIndex === 0) {
          neighborDeltaIndices[4] = Number.NaN;
          neighborDeltaIndices[5] = Number.NaN;
        }

        // Is this the last column?
        if (columnIndex === columnCount - 1) {
          neighborDeltaIndices[1] = Number.NaN;
          neighborDeltaIndices[2] = Number.NaN;
        }
      }

      // Is this the first or second row?
      if (rowIndex ===0) {
        neighborDeltaIndices[0] = Number.NaN;
        neighborDeltaIndices[1] = Number.NaN;
        neighborDeltaIndices[5] = Number.NaN;
      } else if (rowIndex === 1) {
        neighborDeltaIndices[0] = Number.NaN;
      }

      // Is this the last or second-to-last row?
      if (rowIndex === rowCount - 1) {
        neighborDeltaIndices[2] = Number.NaN;
        neighborDeltaIndices[3] = Number.NaN;
        neighborDeltaIndices[4] = Number.NaN;
      } else if (rowIndex === rowCount - 2) {
        neighborDeltaIndices[3] = Number.NaN;
      }
    }

    return neighborDeltaIndices;
  }

  /**
   * Calculates the index offsets of the neighborStates of a tile.
   *
   * @this Grid
   * @returns {Array.<Number>}
   */
  function getDefaultNeighborDeltaIndices() {
    var grid, maxColumnCount, neighborDeltaIndices;

    grid = this;
    neighborDeltaIndices = [];
    maxColumnCount = grid.oddRowTileCount > grid.evenRowTileCount ?
        grid.oddRowTileCount : grid.evenRowTileCount;

    // Neighbor delta indices are dependent on current screen dimensions
    if (grid.isVertical) {
      neighborDeltaIndices[0] = -maxColumnCount + 1; // top-right
      neighborDeltaIndices[1] = 1; // right
      neighborDeltaIndices[2] = maxColumnCount; // bottom-right
      neighborDeltaIndices[3] = maxColumnCount - 1; // bottom-left
      neighborDeltaIndices[4] = -1; // left
      neighborDeltaIndices[5] = -maxColumnCount; // top-left
    } else {
      neighborDeltaIndices[0] = -maxColumnCount * 2 + 1; // top
      neighborDeltaIndices[1] = -maxColumnCount + 1; // top-right
      neighborDeltaIndices[2] = maxColumnCount; // bottom-right
      neighborDeltaIndices[3] = maxColumnCount * 2 - 1; // bottom
      neighborDeltaIndices[4] = maxColumnCount - 1; // bottom-left
      neighborDeltaIndices[5] = -maxColumnCount; // top-left
    }

    return neighborDeltaIndices;
  }

  /**
   * Removes all content from the SVG.
   *
   * @this Grid
   */
  function clearSvg() {
    var grid, svg;

    grid = this;
    svg = grid.svg;

    grid.annotations.destroyAnnotations();

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    grid.svg.appendChild(grid.svgDefs);
  }

  /**
   * Sets an 'data-hg-index' attribute on each tile element to match that tile's current index in this
   * grid's allTiles array.
   *
   * @this Grid
   */
  function setTileIndexAttributes() {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.allTiles.length; i < count; i += 1) {
      grid.allTiles[i].element.setAttribute('data-hg-index', i);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Prints to the console some information about this grid.
   *
   * This is useful for testing purposes.
   */
  function logGridInfo() {
    var grid = this;

    console.log('// --- Grid Info: ------- //');
    console.log('// - Tile count=' + grid.originalTiles.length);
    console.log('// - Row count=' + grid.rowCount);
    console.log('// - Odd row tile count=' + grid.oddRowTileCount);
    console.log('// - Even row tile count=' + grid.evenRowTileCount);
    console.log('// ------------------------- //');
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Computes spatial parameters of the tiles in this grid.
   *
   * @this Grid
   */
  function resize() {
    var grid;

    grid = this;

    if (grid.allTiles) {
      grid.allTiles.forEach(function (tile) {
        tile.destroy();
      });
    }

    if (grid.isPostOpen) {
      grid.pagePost.destroy();
    }

    grid.originalCenter = {x: Number.NaN, y: Number.NaN};
    grid.currentCenter = {x: Number.NaN, y: Number.NaN};
    grid.panCenter = {x: Number.NaN, y: Number.NaN};
    grid.isPostOpen = false;
    grid.isTransitioning = false;
    grid.expandedTile = null;
    grid.sectors = [];
    grid.allTiles = null;
    grid.allNonContentTiles = null;
    grid.lastExpansionJob = null;
    grid.parent.style.overflowX = 'hidden';
    grid.parent.style.overflowY = 'auto';

    clearSvg.call(grid);
    computeGridParameters.call(grid);

    createTiles.call(grid);

    logGridInfo.call(grid);
  }

  /**
   * Sets the color of this grid's background.
   *
   * @this Grid
   */
  function setBackgroundColor() {
    var grid = this;

    grid.parent.style.backgroundColor = 'hsl(' + config.backgroundHue + ',' +
        config.backgroundSaturation + '%,' + config.backgroundLightness + '%)';
  }

  /**
   * Sets the color of this grid's tiles.
   *
   * @this Grid
   */
  function updateTileColor() {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.allNonContentTiles.length; i < count; i += 1) {
      grid.allNonContentTiles[i].setColor(config.tileHue, config.tileSaturation,
          config.tileLightness);
    }
  }

  /**
   * Sets the mass of this grid's tiles.
   *
   * @this Grid
   * @param {Number} mass
   */
  function updateTileMass(mass) {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.allTiles.length; i < count; i += 1) {
      grid.allTiles[i].particle.m = mass;
    }
  }

  /**
   * Sets this AnimationJob as started.
   *
   * @this Grid
   */
  function start() {
    var grid = this;

    grid.isComplete = false;
  }

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * @this Grid
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.allTiles.length; i < count; i += 1) {
      grid.allTiles[i].update(currentTime, deltaTime);
    }
  }

  /**
   * Draws the current state of this AnimationJob.
   *
   * @this Grid
   */
  function draw() {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.allTiles.length; i < count; i += 1) {
      grid.allTiles[i].draw();
    }

    if (grid.isPostOpen) {
      grid.pagePost.draw();
    }
  }

  /**
   * Stops this AnimationJob, and returns the element to its original form.
   *
   * @this Grid
   */
  function cancel() {
    var grid = this;

    grid.isComplete = true;
  }

  /**
   * Sets the tile that the pointer is currently hovering over.
   *
   * @this Grid
   * @param {Tile} hoveredTile
   */
  function setHoveredTile(hoveredTile) {
    var grid = this;

    if (grid.hoveredTile) {
      grid.hoveredTile.setIsHighlighted(false);
    }

    if (hoveredTile) {
      hoveredTile.setIsHighlighted(true);
    }

    grid.hoveredTile = hoveredTile;
  }

  /**
   * @this Grid
   * @param {Tile} tile
   * @param {{x:Number,y:Number}} startPosition
   * @returns {PagePost}
   */
  function createPagePost(tile, startPosition) {
    var grid = this;

    grid.pagePost = new window.hg.PagePost(tile, startPosition);

    return grid.pagePost;
  }

  /**
   * @this Grid
   */
  function destroyPagePost() {
    var grid = this;

    grid.pagePost.destroy();
    grid.pagePost = null;
  }

  /**
   * Sets the allTiles property to be the given array.
   *
   * @this Grid
   * @param {Array.<Tile>} newTiles
   */
  function updateAllTilesCollection(newTiles) {
    var grid = this;
    var i, count, j;

    grid.allTiles = newTiles;
    grid.allNonContentTiles = [];

    // Create a collection of all of the non-content tiles
    for (j = 0, i = 0, count = newTiles.length; i < count; i += 1) {
      if (!newTiles[i].holdsContent) {
        grid.allNonContentTiles[j++] = newTiles[i];
      }
    }

    // Reset the annotations for the new tile collection
    grid.annotations.destroyAnnotations();
    grid.annotations.createAnnotations();

    setTileIndexAttributes.call(grid);
  }

  /**
   * @this Grid
   */
  function init() {
    var job = this;

    config.computeDependentValues();
  }

  console.log('Grid module loaded');
})();
