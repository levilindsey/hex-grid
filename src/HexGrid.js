'use strict';

/**
 * This module defines a constructor for HexGrid objects.
 *
 * HexGrid objects define a collection of hexagonal tiles which animate and display dynamic,
 * textual content.
 *
 * @module HexGrid
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // TODO:
  // - update the tile radius and the targetContentAreaWidth with the screen width
  //   - we should always have the same number of content tiles in a given row

  // TODO:
  // - give tiles references to their next DOM sibling
  //   - this will be important for maintaining correct z-indices when removing/adding

  var config = {};

  config.targetContentAreaWidth = 800;
  config.backgroundHue = 327;
  config.backgroundSaturation = 20;
  config.backgroundLightness = 10;
  config.tileHue = 147;
  config.tileSaturation = 50;
  config.tileLightness = 30;
  config.tileOuterRadius = 80;
  config.tileGap = 12;
  config.contentStartingRowIndex = 2;
  config.firstRowYOffset = config.tileOuterRadius * 0;
  config.contentDensity = 0.6;
  config.emptyInitialRowCount = 2;
  config.tileMass = 1;

  config.sqrtThreeOverTwo = Math.sqrt(3) / 2;
  config.twoOverSqrtThree = 2 / Math.sqrt(3);

  config.tileInnerRadius = config.tileOuterRadius * config.sqrtThreeOverTwo;

  config.tileShortLengthWithGap = config.tileInnerRadius * 2 + config.tileGap;
  config.tileLongLengthWithGap = config.tileOuterRadius * 2 + config.tileGap * config.twoOverSqrtThree;

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
   * @this HexGrid
   */
  function computeGridParameters() {
    var grid, parentHalfWidth, parentHeight, innerContentCount, rowIndex, i, count,
        emptyRowsContentTileCount, minInnerTileCount;

    grid = this;

    parentHalfWidth = grid.parent.clientWidth * 0.5;
    parentHeight = grid.parent.clientHeight;

    if (grid.isVertical) {
      grid.rowDeltaY = hg.HexGrid.config.tileOuterRadius * 1.5 + hg.HexGrid.config.tileGap * hg.HexGrid.config.sqrtThreeOverTwo;
      grid.tileDeltaX = hg.HexGrid.config.tileShortLengthWithGap;

      grid.oddRowTileCount = Math.ceil((parentHalfWidth - (hg.HexGrid.config.tileInnerRadius + hg.HexGrid.config.tileGap)) / hg.HexGrid.config.tileShortLengthWithGap) * 2 + 1;
      grid.evenRowTileCount = Math.ceil((parentHalfWidth - (hg.HexGrid.config.tileShortLengthWithGap + hg.HexGrid.config.tileGap * 0.5)) / hg.HexGrid.config.tileShortLengthWithGap) * 2 + 2;

      grid.oddRowXOffset = parentHalfWidth - hg.HexGrid.config.tileShortLengthWithGap * (grid.oddRowTileCount - 1) / 2;

      grid.rowCount = Math.ceil((parentHeight - (hg.HexGrid.config.firstRowYOffset + hg.HexGrid.config.tileOuterRadius * 2 + hg.HexGrid.config.tileGap * Math.sqrt(3))) / grid.rowDeltaY) + 2;
    } else {
      grid.rowDeltaY = hg.HexGrid.config.tileInnerRadius + hg.HexGrid.config.tileGap * 0.5;
      grid.tileDeltaX = hg.HexGrid.config.tileOuterRadius * 3 + hg.HexGrid.config.tileGap * Math.sqrt(3);

      grid.oddRowTileCount = Math.ceil((parentHalfWidth - (grid.tileDeltaX - hg.HexGrid.config.tileOuterRadius)) / grid.tileDeltaX) * 2 + 1;
      grid.evenRowTileCount = Math.ceil((parentHalfWidth - (grid.tileDeltaX + (hg.HexGrid.config.tileGap * hg.HexGrid.config.sqrtThreeOverTwo) + hg.HexGrid.config.tileOuterRadius * 0.5)) / grid.tileDeltaX) * 2 + 2;

      grid.oddRowXOffset = parentHalfWidth - grid.tileDeltaX * (grid.oddRowTileCount - 1) / 2;

      grid.rowCount = Math.ceil((parentHeight - (hg.HexGrid.config.firstRowYOffset + hg.HexGrid.config.tileInnerRadius * 3 + hg.HexGrid.config.tileGap * 2)) / grid.rowDeltaY) + 4;
    }

    grid.evenRowXOffset = grid.oddRowXOffset +
        (grid.evenRowTileCount > grid.oddRowTileCount ? -1 : 1) * grid.tileDeltaX * 0.5;

    // --- Row inner content information --- //

    grid.contentAreaLeft = parentHalfWidth - grid.actualContentAreaWidth * 0.5;
    grid.contentAreaRight = grid.contentAreaLeft + grid.actualContentAreaWidth;

    if (grid.isVertical) {
      grid.oddRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.oddRowXOffset - hg.HexGrid.config.tileInnerRadius)) / grid.tileDeltaX);
      grid.evenRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.evenRowXOffset - hg.HexGrid.config.tileInnerRadius)) / grid.tileDeltaX);
    } else {
      grid.oddRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.oddRowXOffset - hg.HexGrid.config.tileOuterRadius)) / grid.tileDeltaX);
      grid.evenRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.evenRowXOffset - hg.HexGrid.config.tileOuterRadius)) / grid.tileDeltaX);
    }

    grid.oddRowContentTileCount = grid.oddRowTileCount - grid.oddRowContentStartIndex * 2;
    grid.evenRowContentTileCount = grid.evenRowTileCount - grid.evenRowContentStartIndex * 2;

    grid.oddRowContentEndIndex = grid.oddRowContentStartIndex + grid.oddRowContentTileCount - 1;
    grid.evenRowContentEndIndex = grid.evenRowContentStartIndex + grid.evenRowContentTileCount - 1;

    // Update the content inner indices to account for empty rows at the start of the grid
    grid.actualContentInnerIndices = [];
    emptyRowsContentTileCount = Math.ceil(hg.HexGrid.config.emptyInitialRowCount / 2) * grid.oddRowContentTileCount +
        Math.floor(hg.HexGrid.config.emptyInitialRowCount / 2) * grid.evenRowContentTileCount;
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
    grid.rowCount = rowIndex > grid.rowCount ? rowIndex : grid.rowCount;

    grid.height = (grid.rowCount - 1) * grid.rowDeltaY;
  }

  /**
   * Calculates the tile indices within the content area column that will represent tiles with
   * content.
   *
   * @this HexGrid
   */
  function computeContentIndices() {
    var grid, i, j, count, tilesRepresentation;

    grid = this;

    // Use 1s to represent the tiles that hold data
    tilesRepresentation = [];
    count = grid.tileData.length;
    for (i = 0; i < count; i += 1) {
      tilesRepresentation[i] = 1;
    }

    // Use 0s to represent the empty tiles
    count = (1 / hg.HexGrid.config.contentDensity) * grid.tileData.length;
    for (i = grid.tileData.length; i < count; i += 1) {
      tilesRepresentation[i] = 0;
    }

    tilesRepresentation = hg.util.shuffle(tilesRepresentation);

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
   * @this HexGrid
   */
  function createSvg() {
    var grid;

    grid = this;

    grid.svg = document.createElementNS(hg.util.svgNamespace, 'svg');
    grid.svg.style.display = 'block';
    grid.svg.style.position = 'relative';
    grid.svg.style.width = '100%';
    grid.svg.style.zIndex = '2147483647';
    grid.svg.style.backgroundColor =
        'hsl(' + grid.hue + ',' + grid.saturation + '%,' + grid.lightness + '%)';
    grid.parent.appendChild(grid.svg);

    grid.svgDefs = document.createElementNS(hg.util.svgNamespace, 'defs');
    grid.svg.appendChild(grid.svgDefs);
  }

  /**
   * Creates the tile elements for the grid.
   *
   * @this HexGrid
   */
  function createTiles() {
    var grid, tileIndex, rowIndex, rowCount, columnIndex, columnCount, centerX, centerY,
        isMarginTile, isBorderTile, isOddRow, contentAreaIndex, tileDataIndex,
        defaultNeighborDeltaIndices, tilesNeighborDeltaIndices, oddRowIsLarger, isLargerRow;

    grid = this;

    grid.tiles = [];
    tileIndex = 0;
    contentAreaIndex = 0;
    tileDataIndex = 0;
    centerY = hg.HexGrid.config.firstRowYOffset;
    rowCount = grid.rowCount;
    tilesNeighborDeltaIndices = [];

    defaultNeighborDeltaIndices = getDefaultNeighborDeltaIndices.call(grid);
    oddRowIsLarger = grid.oddRowTileCount > grid.evenRowTileCount;

    for (rowIndex = 0; rowIndex < rowCount; rowIndex += 1, centerY += grid.rowDeltaY) {
      isOddRow = rowIndex % 2 === 0;

      if (isOddRow) {
        centerX = grid.oddRowXOffset;
        columnCount = grid.oddRowTileCount;
      } else {
        centerX = grid.evenRowXOffset;
        columnCount = grid.evenRowTileCount;
      }

      for (columnIndex = 0; columnIndex < columnCount;
           tileIndex += 1, columnIndex += 1, centerX += grid.tileDeltaX) {
        isMarginTile = isOddRow ?
            columnIndex < grid.oddRowContentStartIndex ||
                columnIndex > grid.oddRowContentEndIndex :
            columnIndex < grid.evenRowContentStartIndex ||
                columnIndex > grid.evenRowContentEndIndex;

        isBorderTile = columnIndex === 0 || columnIndex === columnCount - 1 ||
            rowIndex === 0 || rowIndex === rowCount - 1;

        grid.tiles[tileIndex] = new hg.HexTile(grid.svg, centerX, centerY, hg.HexGrid.config.tileOuterRadius,
            grid.isVertical, hg.HexGrid.config.tileHue, hg.HexGrid.config.tileSaturation, hg.HexGrid.config.tileLightness, null,
            tileIndex, isMarginTile, isBorderTile, hg.HexGrid.config.tileMass);

        // Is the current tile within the content column?
        if (!isMarginTile) {
          // Does the current tile get to hold content?
          if (contentAreaIndex === grid.actualContentInnerIndices[tileDataIndex]) {
            grid.tiles[tileIndex].setContent(grid.tileData[tileDataIndex]);
            tileDataIndex += 1;
          }
          contentAreaIndex += 1;
        }

        isLargerRow = oddRowIsLarger && isOddRow || !oddRowIsLarger && !isOddRow;

        // Determine the neighbor index offsets for the current tile
        tilesNeighborDeltaIndices[tileIndex] = getNeighborDeltaIndices.call(grid, rowIndex, rowCount,
            columnIndex, columnCount, isLargerRow, defaultNeighborDeltaIndices);
      }
    }

    setNeighborTiles.call(grid, tilesNeighborDeltaIndices);
  }

  /**
   * Connects each tile with references to its neighbors.
   *
   * @this HexGrid
   * @param {Array.<Array.<number>>} tilesNeighborDeltaIndices
   */
  function setNeighborTiles(tilesNeighborDeltaIndices) {
    var grid, i, j, iCount, jCount, neighbors;

    grid = this;

    neighbors = [];

    // Give each tile references to each of its neighbors
    for (i = 0, iCount = grid.tiles.length; i < iCount; i += 1) {
      // Get the neighbors around the current tile
      for (j = 0, jCount = 6; j < jCount; j += 1) {
        neighbors[j] = !isNaN(tilesNeighborDeltaIndices[i][j]) ?
            grid.tiles[i + tilesNeighborDeltaIndices[i][j]] : null;
      }

      grid.tiles[i].setNeighborTiles(neighbors);
    }
  }

  /**
   * Get the actual neighbor index offsets for the tile described by the given parameters.
   *
   * NaN is used to represent the tile not having a neighbor on that side.
   *
   * @this HexGrid
   * @param {number} rowIndex
   * @param {number} rowCount
   * @param {number} columnIndex
   * @param {number} columnCount
   * @param {boolean} isLargerRow
   * @param {Array.<number>} defaultNeighborDeltaIndices
   * @returns {Array.<number>}
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
          neighborDeltaIndices[2] = Number.NaN;
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
   * Calculates the index offsets of the neighbors of a tile.
   *
   * @this HexGrid
   * @returns {Array.<number>}
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
   * @this HexGrid
   */
  function clearSvg() {
    var grid, svg;

    grid = this;
    svg = grid.svg;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
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

    console.log('--- HexGrid Info: --------');
    console.log('--- Tile count=' + grid.tiles.length);
    console.log('--- Row count=' + grid.rowCount);
    console.log('--- Odd row tile count=' + grid.oddRowTileCount);
    console.log('--- Even row tile count=' + grid.evenRowTileCount);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Computes spatial parameters of the tiles in the grid.
   *
   * @this HexGrid
   */
  function resize() {
    var grid;

    grid = this;

    grid.actualContentAreaWidth = grid.parent.clientWidth < hg.HexGrid.config.targetContentAreaWidth ?
        grid.parent.clientWidth : hg.HexGrid.config.targetContentAreaWidth;

    clearSvg.call(grid);

    computeGridParameters.call(grid);
    createTiles.call(grid);

    grid.svg.style.height = grid.height + 'px';

    grid.annotations.resize();

    logGridInfo.call(grid);
  }

  /**
   * Sets this AnimationJob as started.
   *
   * @this HexGrid
   */
  function start() {
    var grid = this;

    grid.isComplete = false;
  }

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * @this HexGrid
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      grid.tiles[i].update(currentTime, deltaTime);
      grid.tiles[i].draw();
    }

    grid.annotations.update(currentTime, deltaTime);
  }

  /**
   * Stops this AnimationJob, and returns the element to its original form.
   *
   * @this HexGrid
   */
  function cancel() {
    var grid = this;

    // TODO:

    grid.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @global
   * @constructor
   * @param {HTMLElement} parent
   * @param {Array.<Object>} tileData
   * @param {boolean} isVertical
   */
  function HexGrid(parent, tileData, isVertical) {
    var grid = this;

    grid.parent = parent;
    grid.tileData = tileData;
    grid.isVertical = isVertical;

    grid.actualContentAreaWidth = hg.HexGrid.config.actualContentAreaWidth;
    grid.hue = hg.HexGrid.config.backgroundHue;
    grid.saturation = hg.HexGrid.config.backgroundSaturation;
    grid.lightness = hg.HexGrid.config.backgroundLightness;

    grid.isComplete = false;

    grid.svg = null;
    grid.tiles = null;
    grid.originalContentInnerIndices = null;
    grid.innerIndexOfLastContentTile = null;

    grid.annotations = new hg.HexGridAnnotations(grid);

    grid.resize = resize;
    grid.start = start;
    grid.update = update;
    grid.cancel = cancel;

    createSvg.call(grid);
    computeContentIndices.call(grid);
    resize.call(grid);
  }

  HexGrid.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.HexGrid = HexGrid;

  console.log('HexGrid module loaded');
})();
