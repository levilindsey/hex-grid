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
  config.firstRowYOffset = config.tileOuterRadius * -0.8;
  config.contentDensity = 0.6;
  config.tileMass = 1;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.sqrtThreeOverTwo = Math.sqrt(3) / 2;
    config.twoOverSqrtThree = 2 / Math.sqrt(3);

    config.tileInnerRadius = config.tileOuterRadius * config.sqrtThreeOverTwo;

    config.tileShortLengthWithGap = config.tileInnerRadius * 2 + config.tileGap;
    config.tileLongLengthWithGap =
        config.tileOuterRadius * 2 + config.tileGap * config.twoOverSqrtThree;
  };

  config.computeDependentValues();

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

    grid.centerX = parentHalfWidth;
    grid.centerY = parentHeight * 0.5;

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
    grid.rowCount = rowIndex > grid.rowCount ? rowIndex : grid.rowCount;

    grid.height = (grid.rowCount - 2) * grid.rowDeltaY;
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
    count = (1 / config.contentDensity) * grid.tileData.length;
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
    updateBackgroundColor.call(grid);
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
    grid.borderTiles = [];
    tileIndex = 0;
    contentAreaIndex = 0;
    tileDataIndex = 0;
    centerY = config.firstRowYOffset;
    rowCount = grid.rowCount;
    tilesNeighborDeltaIndices = [];

    defaultNeighborDeltaIndices = getDefaultNeighborDeltaIndices.call(grid);
    oddRowIsLarger = grid.oddRowTileCount > grid.evenRowTileCount;

    for (rowIndex = 0; rowIndex < rowCount; rowIndex += 1, centerY += grid.rowDeltaY) {
      isOddRow = rowIndex % 2 === 0;
      isLargerRow = oddRowIsLarger && isOddRow || !oddRowIsLarger && !isOddRow;

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

        isBorderTile = grid.isVertical ?
            (columnIndex === 0 || columnIndex === columnCount - 1 ||
              rowIndex === 0 || rowIndex === rowCount - 1) :
            (rowIndex <= 1 || rowIndex >= rowCount - 2 ||
                isLargerRow && (columnIndex === 0 || columnIndex === columnCount - 1));

        grid.tiles[tileIndex] = new hg.HexTile(grid.svg, centerX, centerY, config.tileOuterRadius,
            grid.isVertical, config.tileHue, config.tileSaturation, config.tileLightness, null,
            tileIndex, rowIndex, columnIndex, isMarginTile, isBorderTile, isLargerRow,
            config.tileMass);

        if (isBorderTile) {
          grid.borderTiles.push(grid.tiles[tileIndex]);
        }

        // Is the current tile within the content column?
        if (!isMarginTile) {
          // Does the current tile get to hold content?
          if (contentAreaIndex === grid.actualContentInnerIndices[tileDataIndex]) {
            grid.tiles[tileIndex].setContent(grid.tileData[tileDataIndex]);
            tileDataIndex += 1;
          }
          contentAreaIndex += 1;
        }

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

    grid.annotations.destroyAnnotations.call(grid.annotations);

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

    console.log('// --- HexGrid Info: ------- //');
    console.log('// - Tile count=' + grid.tiles.length);
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
   * @this HexGrid
   */
  function resize() {
    var grid;

    grid = this;

    clearSvg.call(grid);
    computeGridParameters.call(grid);
    createTiles.call(grid);

    grid.svg.style.height = grid.height + 'px';

    grid.annotations.createAnnotations();

    logGridInfo.call(grid);
  }

  /**
   * Sets the color of this grid's background.
   *
   * @this HexGrid
   */
  function updateBackgroundColor() {
    var grid;

    grid = this;

    grid.svg.style.backgroundColor = 'hsl(' + config.backgroundHue + ',' +
        config.backgroundSaturation + '%,' + config.backgroundLightness + '%)';
  }

  /**
   * Sets the color of this grid's tiles.
   *
   * @this HexGrid
   */
  function updateTileColor() {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      grid.tiles[i].setColor(config.tileHue, config.tileSaturation, config.tileLightness);
    }
  }

  /**
   * Sets the mass of this grid's tiles.
   *
   * @this HexGrid
   * @param {number} mass
   */
  function updateTileMass(mass) {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      grid.tiles[i].particle.m = mass;
    }
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
    }

    grid.annotations.update(currentTime, deltaTime);
  }

  /**
   * Draws the current state of this AnimationJob.
   *
   * @this HexGrid
   */
  function draw() {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      grid.tiles[i].draw();
    }
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
   * @param {boolean} [isVertical]
   */
  function HexGrid(parent, tileData, isVertical) {
    var grid = this;

    grid.parent = parent;
    grid.tileData = tileData;
    grid.isVertical = isVertical;

    grid.actualContentAreaWidth = config.targetContentAreaWidth;

    grid.isComplete = false;

    grid.svg = null;
    grid.tiles = [];
    grid.borderTiles = [];
    grid.originalContentInnerIndices = null;
    grid.innerIndexOfLastContentTile = null;
    grid.centerX = Number.NaN;
    grid.centerY = Number.NaN;

    grid.animations = {};

    grid.annotations = new hg.HexGridAnnotations(grid);

    grid.resize = resize;
    grid.start = start;
    grid.update = update;
    grid.draw = draw;
    grid.cancel = cancel;
    grid.updateBackgroundColor = updateBackgroundColor;
    grid.updateTileColor = updateTileColor;
    grid.updateTileMass = updateTileMass;
    grid.computeContentIndices = computeContentIndices;

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

'use strict';

/**
 * This module defines a constructor for HexGridAnnotations objects.
 *
 * HexGridAnnotations objects creates and modifies visual representations of various aspects of a
 * HexGrid. This can be very useful for testing purposes.
 *
 * @module HexGridAnnotations
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.forceLineLengthMultiplier = 4000;
  config.velocityLineLengthMultiplier = 300;

  config.contentTileHue = 227;
  config.contentTileSaturation = 50;
  config.contentTileLightness = 30;

  config.borderTileHue = 227;
  config.borderTileSaturation = 0;
  config.borderTileLightness = 30;

  config.annotations = {
    'contentTiles': {
      enabled: true,
      create: fillContentTiles,
      destroy: unfillContentTiles,
      update: function () {/* Do nothing */}
    },
    'borderTiles': {
      enabled: true,
      create: fillBorderTiles,
      destroy: unfillBorderTiles,
      update: function () {/* Do nothing */}
    },
    'transparentTiles': {
      enabled: false,
      create: makeTilesTransparent,
      destroy: makeTilesVisible,
      update: function () {/* Do nothing */}
    },
    'tileAnchorCenters': {
      enabled: true,
      create: createTileAnchorCenters,
      destroy: destroyTileAnchorCenters,
      update: updateTileAnchorCenters
    },
    'tileParticleCenters': {
      enabled: false,
      create: createTileParticleCenters,
      destroy: destroyTileParticleCenters,
      update: updateTileParticleCenters
    },
    'tileDisplacementColors': {
      enabled: false,
      create: createTileDisplacementColors,
      destroy: destroyTileDisplacementColors,
      update: updateTileDisplacementColors
    },
    'tileInnerRadii': {
      enabled: false,
      create: createTileInnerRadii,
      destroy: destroyTileInnerRadii,
      update: updateTileInnerRadii
    },
    'tileOuterRadii': {
      enabled: false,
      create: createTileOuterRadii,
      destroy: destroyTileOuterRadii,
      update: updateTileOuterRadii
    },
    'tileIndices': {
      enabled: true,
      create: createTileIndices,
      destroy: destroyTileIndices,
      update: updateTileIndices
    },
    'tileForces': {
      enabled: true,
      create: createTileForces,
      destroy: destroyTileForces,
      update: updateTileForces
    },
    'tileVelocities': {
      enabled: true,
      create: createTileVelocities,
      destroy: destroyTileVelocities,
      update: updateTileVelocities
    },
    'tileNeighborConnections': {
      enabled: true,
      create: createTileNeighborConnections,
      destroy: destroyTileNeighborConnections,
      update: updateTileNeighborConnections
    },
    'contentAreaGuidelines': {
      enabled: false,
      create: drawContentAreaGuideLines,
      destroy: removeContentAreaGuideLines,
      update:  function () {/* Do nothing */}
    },
    'lineAnimationGapPoints': {
      enabled: true,
      create: function () {/* Do nothing */},
      destroy: destroyLineAnimationGapPoints,
      update:  updateLineAnimationGapPoints
    }
  };

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // --------------------------------------------------- //
  // Annotation creation functions

  /**
   * Draws content tiles with a different color.
   *
   * @this HexGridAnnotations
   */
  function fillContentTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      if (annotations.grid.tiles[i].holdsContent) {
        annotations.grid.tiles[i].setColor(config.contentTileHue, config.contentTileSaturation, config.contentTileLightness);
      }
    }
  }

  /**
   * Draws border tiles with a different color.
   *
   * @this HexGridAnnotations
   */
  function fillBorderTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.borderTiles.length; i < count; i += 1) {
      annotations.grid.borderTiles[i].setColor(config.borderTileHue, config.borderTileSaturation, config.borderTileLightness);
    }
  }

  /**
   * Draws all of the tiles as transparent.
   *
   * @this HexGridAnnotations
   */
  function makeTilesTransparent() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.grid.tiles[i].element.setAttribute('opacity', '0');
    }
  }

  /**
   * Draws vertical guidelines along the left and right sides of the main content area.
   *
   * @this HexGridAnnotations
   */
  function drawContentAreaGuideLines() {
    var annotations, line;

    annotations = this;
    annotations.contentAreaGuideLines = [];

    line = document.createElementNS(hg.util.svgNamespace, 'line');
    line.setAttribute('x1', annotations.grid.contentAreaLeft);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', annotations.grid.contentAreaLeft);
    line.setAttribute('y2', annotations.grid.height);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');
    annotations.grid.svg.appendChild(line);
    annotations.contentAreaGuideLines[0] = line;

    line = document.createElementNS(hg.util.svgNamespace, 'line');
    line.setAttribute('x1', annotations.grid.contentAreaRight);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', annotations.grid.contentAreaRight);
    line.setAttribute('y2', annotations.grid.height);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');
    annotations.grid.svg.appendChild(line);
    annotations.contentAreaGuideLines[1] = line;
  }

  /**
   * Creates a dot at the center of each tile at its current position.
   *
   * @this HexGridAnnotations
   */
  function createTileParticleCenters() {
    var annotations, i, count;

    annotations = this;
    annotations.tileParticleCenters = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileParticleCenters[i] = document.createElementNS(hg.util.svgNamespace, 'circle');
      annotations.tileParticleCenters[i].setAttribute('r', '4');
      annotations.tileParticleCenters[i].setAttribute('fill', 'gray');
      annotations.grid.svg.appendChild(annotations.tileParticleCenters[i]);
    }
  }

  /**
   * Creates a dot at the center of each tile at its anchor position.
   *
   * @this HexGridAnnotations
   */
  function createTileAnchorCenters() {
    var annotations, i, count;

    annotations = this;
    annotations.tileAnchorLines = [];
    annotations.tileAnchorCenters = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileAnchorLines[i] = document.createElementNS(hg.util.svgNamespace, 'line');
      annotations.tileAnchorLines[i].setAttribute('stroke', '#bbbbbb');
      annotations.tileAnchorLines[i].setAttribute('stroke-width', '2');
      annotations.grid.svg.appendChild(annotations.tileAnchorLines[i]);
      annotations.tileAnchorCenters[i] = document.createElementNS(hg.util.svgNamespace, 'circle');
      annotations.tileAnchorCenters[i].setAttribute('r', '4');
      annotations.tileAnchorCenters[i].setAttribute('fill', 'white');
      annotations.grid.svg.appendChild(annotations.tileAnchorCenters[i]);
    }
  }

  /**
   * Creates a circle over each tile at its anchor position, which will be used to show colors
   * that indicate its displacement from its original position.
   *
   * @this HexGridAnnotations
   */
  function createTileDisplacementColors() {
    var annotations, i, count;

    annotations = this;
    annotations.tileDisplacementCircles = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileDisplacementCircles[i] = document.createElementNS(hg.util.svgNamespace, 'circle');
      annotations.tileDisplacementCircles[i].setAttribute('r', '80');
      annotations.tileDisplacementCircles[i].setAttribute('opacity', '0.4');
      annotations.tileDisplacementCircles[i].setAttribute('fill', 'white');
      annotations.grid.svg.appendChild(annotations.tileDisplacementCircles[i]);
    }
  }

  /**
   * Creates the inner radius of each tile.
   *
   * @this HexGridAnnotations
   */
  function createTileInnerRadii() {
    var annotations, i, count;

    annotations = this;
    annotations.tileInnerRadii = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileInnerRadii[i] = document.createElementNS(hg.util.svgNamespace, 'circle');
      annotations.tileInnerRadii[i].setAttribute('stroke', 'blue');
      annotations.tileInnerRadii[i].setAttribute('stroke-width', '1');
      annotations.tileInnerRadii[i].setAttribute('fill', 'transparent');
      annotations.grid.svg.appendChild(annotations.tileInnerRadii[i]);
    }
  }

  /**
   * Creates the outer radius of each tile.
   *
   * @this HexGridAnnotations
   */
  function createTileOuterRadii() {
    var annotations, i, count;

    annotations = this;
    annotations.tileOuterRadii = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileOuterRadii[i] = document.createElementNS(hg.util.svgNamespace, 'circle');
      annotations.tileOuterRadii[i].setAttribute('stroke', 'green');
      annotations.tileOuterRadii[i].setAttribute('stroke-width', '1');
      annotations.tileOuterRadii[i].setAttribute('fill', 'transparent');
      annotations.grid.svg.appendChild(annotations.tileOuterRadii[i]);
    }
  }

  /**
   * Creates lines connecting each tile to each of its neighbors.
   *
   * @this HexGridAnnotations
   */
  function createTileNeighborConnections() {
    var annotations, i, j, iCount, jCount, tile, neighbor;

    annotations = this;
    annotations.neighborLines = [];

    for (i = 0, iCount = annotations.grid.tiles.length; i < iCount; i += 1) {
      tile = annotations.grid.tiles[i];
      annotations.neighborLines[i] = [];

      for (j = 0, jCount = tile.neighbors.length; j < jCount; j += 1) {
        neighbor = tile.neighbors[j];

        if (neighbor) {
          annotations.neighborLines[i][j] = document.createElementNS(hg.util.svgNamespace, 'line');
          annotations.neighborLines[i][j].setAttribute('stroke', 'purple');
          annotations.neighborLines[i][j].setAttribute('stroke-width', '1');
          annotations.grid.svg.appendChild(annotations.neighborLines[i][j]);
        }
      }
    }
  }

  /**
   * Creates lines representing the cumulative force acting on each tile.
   *
   * @this HexGridAnnotations
   */
  function createTileForces() {
    var annotations, i, count;

    annotations = this;
    annotations.forceLines = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.forceLines[i] = document.createElementNS(hg.util.svgNamespace, 'line');
      annotations.forceLines[i].setAttribute('stroke', 'orange');
      annotations.forceLines[i].setAttribute('stroke-width', '2');
      annotations.grid.svg.appendChild(annotations.forceLines[i]);
    }
  }

  /**
   * Creates lines representing the velocity of each tile.
   *
   * @this HexGridAnnotations
   */
  function createTileVelocities() {
    var annotations, i, count;

    annotations = this;
    annotations.velocityLines = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.velocityLines[i] = document.createElementNS(hg.util.svgNamespace, 'line');
      annotations.velocityLines[i].setAttribute('stroke', 'red');
      annotations.velocityLines[i].setAttribute('stroke-width', '2');
      annotations.grid.svg.appendChild(annotations.velocityLines[i]);
    }
  }

  /**
   * Creates the index of each tile.
   *
   * @this HexGridAnnotations
   */
  function createTileIndices() {
    var annotations, i, count;

    annotations = this;
    annotations.indexTexts = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.indexTexts[i] = document.createElementNS(hg.util.svgNamespace, 'text');
      annotations.indexTexts[i].setAttribute('font-size', '16');
      annotations.indexTexts[i].setAttribute('fill', 'black');
      annotations.indexTexts[i].innerHTML = annotations.grid.tiles[i].index;
      annotations.grid.svg.appendChild(annotations.indexTexts[i]);
    }
  }

  // --------------------------------------------------- //
  // Annotation destruction functions

  /**
   * Draws content tiles with a different color.
   *
   * @this HexGridAnnotations
   */
  function unfillContentTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      if (annotations.grid.tiles[i].holdsContent) {
        annotations.grid.tiles[i].setColor(hg.HexGrid.config.tileHue, hg.HexGrid.config.tileSaturation, hg.HexGrid.config.tileLightness);
      }
    }
  }

  /**
   * Draws border tiles with a different color.
   *
   * @this HexGridAnnotations
   */
  function unfillBorderTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.borderTiles.length; i < count; i += 1) {
      annotations.grid.borderTiles[i].setColor(hg.HexGrid.config.tileHue, hg.HexGrid.config.tileSaturation, hg.HexGrid.config.tileLightness);
    }
  }

  /**
   * Draws all of the tiles as transparent.
   *
   * @this HexGridAnnotations
   */
  function makeTilesVisible() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.grid.tiles[i].element.setAttribute('opacity', '1');
    }
  }

  /**
   * Draws vertical guidelines along the left and right sides of the main content area.
   *
   * @this HexGridAnnotations
   */
  function removeContentAreaGuideLines() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.contentAreaGuideLines.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.contentAreaGuideLines[i]);
    }

    annotations.contentAreaGuideLines = [];
  }

  /**
   * Destroys a dot at the center of each tile at its current position.
   *
   * @this HexGridAnnotations
   */
  function destroyTileParticleCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileParticleCenters.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileParticleCenters[i]);
    }

    annotations.tileParticleCenters = [];
  }

  /**
   * Destroys a dot at the center of each tile at its anchor position.
   *
   * @this HexGridAnnotations
   */
  function destroyTileAnchorCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileAnchorLines.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileAnchorLines[i]);
      annotations.grid.svg.removeChild(annotations.tileAnchorCenters[i]);
    }

    annotations.tileAnchorLines = [];
    annotations.tileAnchorCenters = [];
  }

  /**
   * Destroys a circle over each tile at its anchor position, which will be used to show colors
   * that indicate its displacement from its original position.
   *
   * @this HexGridAnnotations
   */
  function destroyTileDisplacementColors() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileDisplacementCircles.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileDisplacementCircles[i]);
    }

    annotations.tileDisplacementCircles = [];
  }

  /**
   * Destroys the inner radius of each tile.
   *
   * @this HexGridAnnotations
   */
  function destroyTileInnerRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileInnerRadii.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileInnerRadii[i]);
    }

    annotations.tileInnerRadii = [];
  }

  /**
   * Destroys the outer radius of each tile.
   *
   * @this HexGridAnnotations
   */
  function destroyTileOuterRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileOuterRadii.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileOuterRadii[i]);
    }

    annotations.tileOuterRadii = [];
  }

  /**
   * Destroys lines connecting each tile to each of its neighbors.
   *
   * @this HexGridAnnotations
   */
  function destroyTileNeighborConnections() {
    var annotations, i, j, iCount, jCount;

    annotations = this;

    for (i = 0, iCount = annotations.neighborLines.length; i < iCount; i += 1) {
      for (j = 0, jCount = annotations.neighborLines[i].length; j < jCount; j += 1) {
        if (annotations.neighborLines[i][j]) {
          annotations.grid.svg.removeChild(annotations.neighborLines[i][j]);
        }
      }
    }

    annotations.neighborLines = [];
  }

  /**
   * Destroys lines representing the cumulative force acting on each tile.
   *
   * @this HexGridAnnotations
   */
  function destroyTileForces() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.forceLines.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.forceLines[i]);
    }

    annotations.forceLines = [];
  }

  /**
   * Destroys lines representing the velocity of each tile.
   *
   * @this HexGridAnnotations
   */
  function destroyTileVelocities() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.velocityLines.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.velocityLines[i]);
    }

    annotations.velocityLines = [];
  }

  /**
   * Destroys the index of each tile.
   *
   * @this HexGridAnnotations
   */
  function destroyTileIndices() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.indexTexts.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.indexTexts[i]);
    }

    annotations.indexTexts = [];
  }

  /**
   * Destroys the dots at the positions of each corner gap point of each line animation.
   *
   * @this HexGridAnnotations
   */
  function destroyLineAnimationGapPoints() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.lineAnimationGapDots.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationGapDots[i]);
    }
  }

  // --------------------------------------------------- //
  // Annotation updating functions

  /**
   * Updates a dot at the center of each tile at its current position.
   *
   * @this HexGridAnnotations
   */
  function updateTileParticleCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileParticleCenters[i].setAttribute('cx', annotations.grid.tiles[i].particle.px);
      annotations.tileParticleCenters[i].setAttribute('cy', annotations.grid.tiles[i].particle.py);
    }
  }

  /**
   * Updates a dot at the center of each tile at its anchor position.
   *
   * @this HexGridAnnotations
   */
  function updateTileAnchorCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileAnchorLines[i].setAttribute('x1', annotations.grid.tiles[i].particle.px);
      annotations.tileAnchorLines[i].setAttribute('y1', annotations.grid.tiles[i].particle.py);
      annotations.tileAnchorLines[i].setAttribute('x2', annotations.grid.tiles[i].centerX);
      annotations.tileAnchorLines[i].setAttribute('y2', annotations.grid.tiles[i].centerY);
      annotations.tileAnchorCenters[i].setAttribute('cx', annotations.grid.tiles[i].centerX);
      annotations.tileAnchorCenters[i].setAttribute('cy', annotations.grid.tiles[i].centerY);
    }
  }

  /**
   * Updates the color of a circle over each tile at its anchor position according to its
   * displacement from its original position.
   *
   * @this HexGridAnnotations
   */
  function updateTileDisplacementColors() {
    var annotations, i, count, deltaX, deltaY, angle, distance, colorString;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      deltaX = annotations.grid.tiles[i].particle.px - annotations.grid.tiles[i].originalCenterX;
      deltaY = annotations.grid.tiles[i].particle.py - annotations.grid.tiles[i].originalCenterY;
      angle = Math.atan2(deltaX, deltaY) * 180 / Math.PI;
      distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      colorString = 'hsl(' + angle + ',' +
          distance / hg.WaveAnimationJob.config.displacementWavelength * 100 + '%,80%)';

      annotations.tileDisplacementCircles[i].setAttribute('fill', colorString);
      annotations.tileDisplacementCircles[i]
          .setAttribute('cx', annotations.grid.tiles[i].particle.px);
      annotations.tileDisplacementCircles[i]
          .setAttribute('cy', annotations.grid.tiles[i].particle.py);
    }
  }

  /**
   * Updates the inner radius of each tile.
   *
   * @this HexGridAnnotations
   */
  function updateTileInnerRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileInnerRadii[i].setAttribute('cx', annotations.grid.tiles[i].particle.px);
      annotations.tileInnerRadii[i].setAttribute('cy', annotations.grid.tiles[i].particle.py);
      annotations.tileInnerRadii[i].setAttribute('r', annotations.grid.tiles[i].outerRadius * hg.HexGrid.config.sqrtThreeOverTwo);
    }
  }

  /**
   * Updates the outer radius of each tile.
   *
   * @this HexGridAnnotations
   */
  function updateTileOuterRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileOuterRadii[i].setAttribute('cx', annotations.grid.tiles[i].particle.px);
      annotations.tileOuterRadii[i].setAttribute('cy', annotations.grid.tiles[i].particle.py);
      annotations.tileOuterRadii[i].setAttribute('r', annotations.grid.tiles[i].outerRadius);
    }
  }

  /**
   * Updates lines connecting each tile to each of its neighbors.
   *
   * @this HexGridAnnotations
   */
  function updateTileNeighborConnections() {
    var annotations, i, j, iCount, jCount, tile, neighbor;

    annotations = this;

    for (i = 0, iCount = annotations.grid.tiles.length; i < iCount; i += 1) {
      tile = annotations.grid.tiles[i];

      for (j = 0, jCount = tile.neighbors.length; j < jCount; j += 1) {
        neighbor = tile.neighbors[j];

        if (neighbor) {
          annotations.neighborLines[i][j].setAttribute('x1', tile.particle.px);
          annotations.neighborLines[i][j].setAttribute('y1', tile.particle.py);
          annotations.neighborLines[i][j].setAttribute('x2', neighbor.tile.particle.px);
          annotations.neighborLines[i][j].setAttribute('y2', neighbor.tile.particle.py);
        }
      }
    }
  }

  /**
   * Updates lines representing the cumulative force acting on each tile.
   *
   * @this HexGridAnnotations
   */
  function updateTileForces() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.forceLines[i].setAttribute('x1', annotations.grid.tiles[i].particle.px);
      annotations.forceLines[i].setAttribute('y1', annotations.grid.tiles[i].particle.py);
      annotations.forceLines[i].setAttribute('x2', annotations.grid.tiles[i].particle.px + annotations.grid.tiles[i].particle.fx * config.forceLineLengthMultiplier);
      annotations.forceLines[i].setAttribute('y2', annotations.grid.tiles[i].particle.py + annotations.grid.tiles[i].particle.fy * config.forceLineLengthMultiplier);
    }
  }

  /**
   * Updates lines representing the velocity of each tile.
   *
   * @this HexGridAnnotations
   */
  function updateTileVelocities() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.velocityLines[i].setAttribute('x1', annotations.grid.tiles[i].particle.px);
      annotations.velocityLines[i].setAttribute('y1', annotations.grid.tiles[i].particle.py);
      annotations.velocityLines[i].setAttribute('x2', annotations.grid.tiles[i].particle.px + annotations.grid.tiles[i].particle.vx * config.velocityLineLengthMultiplier);
      annotations.velocityLines[i].setAttribute('y2', annotations.grid.tiles[i].particle.py + annotations.grid.tiles[i].particle.vy * config.velocityLineLengthMultiplier);
    }
  }

  /**
   * Updates the index of each tile.
   *
   * @this HexGridAnnotations
   */
  function updateTileIndices() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.indexTexts[i].setAttribute('x', annotations.grid.tiles[i].particle.px - 10);
      annotations.indexTexts[i].setAttribute('y', annotations.grid.tiles[i].particle.py + 6);
    }
  }

  /**
   * Draws a dot at the position of each corner gap point of each line animation.
   *
   * @this HexGridAnnotations
   */
  function updateLineAnimationGapPoints() {
    var annotations, i, iCount, j, jCount, line;

    annotations = this;

    destroyLineAnimationGapPoints.call(annotations);
    annotations.lineAnimationGapDots = [];

    if (annotations.grid.animations.lineAnimations) {
      for (i = 0, iCount = annotations.grid.animations.lineAnimations.length; i < iCount; i += 1) {
        line = annotations.grid.animations.lineAnimations[i];

        for (j = 0, jCount = line.gapPoints.length; j < jCount; j += 1) {
          annotations.lineAnimationGapDots[i] =
              document.createElementNS(hg.util.svgNamespace, 'circle');
          annotations.lineAnimationGapDots[i].setAttribute('x', line.gapPoints[j].x);
          annotations.lineAnimationGapDots[i].setAttribute('y', line.gapPoints[j].y);
          annotations.lineAnimationGapDots[i].setAttribute('r', '4');
          annotations.lineAnimationGapDots[i].setAttribute('fill', 'chartreuse');
          annotations.grid.svg.appendChild(annotations.lineAnimationGapDots[i]);
        }
      }
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * @this HexGridAnnotations
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var annotations, key;

    annotations = this;

    for (key in annotations.annotations) {
      if (annotations.annotations[key].enabled) {
        annotations.annotations[key].update.call(annotations);
      }
    }
  }

  /**
   * Toggles whether the given annotation is enabled.
   *
   * @this HexGridAnnotations
   * @param {string} annotation
   * @param {boolean} enabled
   * @throws {Error}
   */
  function toggleAnnotationEnabled(annotation, enabled) {
    var annotations;

    annotations = this;

    annotations.annotations[annotation].enabled = enabled;

    if (enabled) {
      annotations.annotations[annotation].create.call(annotations);
    } else {
      annotations.annotations[annotation].destroy.call(annotations);
    }
  }

  /**
   * Computes spatial parameters of the tile annotations and creates SVG elements to represent
   * these annotations.
   *
   * @this HexGridAnnotations
   */
  function createAnnotations() {
    var annotations, key;

    annotations = this;

    for (key in annotations.annotations) {
      if (annotations.annotations[key].enabled) {
        annotations.annotations[key].create.call(annotations);
      }
    }
  }

  /**
   * Destroys the SVG elements used to represent grid annotations.
   *
   * @this HexGridAnnotations
   */
  function destroyAnnotations() {
    var annotations, key;

    annotations = this;

    for (key in annotations.annotations) {
      annotations.annotations[key].destroy.call(annotations);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @param {HexGrid} grid
   */
  function HexGridAnnotations(grid) {
    var annotations = this;

    annotations.grid = grid;
    annotations.annotations = hg.util.shallowCopy(config.annotations);

    annotations.contentAreaGuideLines = [];
    annotations.tileParticleCenters = [];
    annotations.tileAnchorLines = [];
    annotations.tileAnchorCenters = [];
    annotations.tileDisplacementCircles = [];
    annotations.tileInnerRadii = [];
    annotations.tileOuterRadii = [];
    annotations.neighborLines = [];
    annotations.forceLines = [];
    annotations.velocityLines = [];
    annotations.indexTexts = [];
    annotations.lineAnimationGapDots = [];

    annotations.toggleAnnotationEnabled = toggleAnnotationEnabled;
    annotations.update = update;
    annotations.createAnnotations = createAnnotations;
    annotations.destroyAnnotations = destroyAnnotations;
  }

  HexGridAnnotations.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.HexGridAnnotations = HexGridAnnotations;

  console.log('HexGridAnnotations module loaded');
})();

'use strict';

/**
 * This module defines a constructor for HexInput objects.
 *
 * HexInput objects handle the user-input logic for a HexGrid.
 *
 * @module HexInput
 */
(function () {
  var config = {};

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Adds event listeners for mouse and touch events for the grid.
   *
   * @this HexInput
   */
  function addPointerEventListeners() {
    var input;

    input = this;

    document.addEventListener('mouseout', handlePointerOut, false);
    document.addEventListener('mousemove', handlePointerMove, false);
    document.addEventListener('mousedown', handlePointerDown, false);
    document.addEventListener('mouseup', handlePointerUp, false);
    // TODO: add touch support

    function handlePointerOut(event) {
      if (!event.toElement && !event.relatedTarget) {
        // TODO: handle the mouse out event
      }
    }

    function handlePointerMove(event) {
      // TODO:
    }

    function handlePointerDown(event) {
      // TODO:
    }

    function handlePointerUp(event) {
      // TODO:
    }

    // TODO:
  }

  /**
   * Checks whether the given point intersects with the same tile that was intersected during the
   * last movement event.
   *
   * @this HexInput
   * @param {number} x
   * @param {number} y
   */
  function checkOldTileIntersection(x, y) {
    var input;

    input = this;

    // TODO:
  }

  /**
   * Checks whether the given point intersects with any tile in the grid.
   *
   * @this HexInput
   * @param {number} x
   * @param {number} y
   */
  function checkNewTileIntersection(x, y) {
    var input;

    input = this;

    // TODO:
    // - pre-compute the start and end x and y coordinates of each column and row
    // - this function then simply loops over these until finding the one or two rows and columns that the point intersects
    // - then there are at most four tiles to actually check for intersection within
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Checks whether the given point intersects with the given tile.
   *
   * @param {HexTile} tile
   * @param {number} x
   * @param {number} y
   */
  function checkTileIntersection(tile, x, y) {
    return checkTileBoundingBoxIntersection(tile, x, y) &&
        util.isPointInsidePolyline(x, y, tile.vertices, false);
  }

  /**
   * Checks whether the given point intersects with the bounding box of the given tile.
   *
   * @param {HexTile} tile
   * @param {number} x
   * @param {number} y
   */
  function checkTileBoundingBoxIntersection(tile, x, y) {
    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HexInput} grid
   */
  function HexInput(grid) {
    var input = this;

    input.grid = grid;

    addPointerEventListeners.call(input);
  }

  HexInput.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.HexInput = HexInput;

  console.log('HexInput module loaded');
})();

'use strict';

/**
 * This module defines a constructor for HexTile objects.
 *
 * HexTile objects handle the particle logic and the hexagon SVG-shape logic for a single
 * hexagonal tile within a HexGrid.
 *
 * @module HexTile
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config, deltaTheta, verticalStartTheta, verticalSines, verticalCosines, horizontalSines,
      horizontalCosines;

  config = {};

  // TODO: play with these
  config.dragCoeff = 0.01;

  config.neighborSpringCoeff = 0.00001;
  config.neighborDampingCoeff = 0.001;

  config.innerAnchorSpringCoeff = 0.00004;
  config.innerAnchorDampingCoeff = 0.001;

  config.borderAnchorSpringCoeff = 0.00004;
  config.borderAnchorDampingCoeff = 0.001;

  config.forceSuppressionLowerThreshold = 0.0005;
  config.velocitySuppressionLowerThreshold = 0.0005;
  // TODO: add similar, upper thresholds

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.forceSuppressionThresholdNegative = -config.forceSuppressionLowerThreshold;
    config.velocitySuppressionThresholdNegative = -config.velocitySuppressionLowerThreshold;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the polygon element for this tile.
   *
   * @this HexTile
   */
  function createElement() {
    var tile;

    tile = this;

    tile.vertexDeltas = computeVertexDeltas(tile.outerRadius, tile.isVertical);
    tile.vertices = computeVertices(tile.centerX, tile.centerY, tile.vertexDeltas);

    tile.element = document.createElementNS(hg.util.svgNamespace, 'polygon');
    tile.svg.appendChild(tile.element);

    setVertices.call(tile, tile.vertices);

    setColor.call(tile, tile.hue, tile.saturation, tile.lightness);
  }

  /**
   * Creates the particle properties for this tile.
   *
   * @this HexTile
   * @param {number} mass
   */
  function createParticle(mass) {
    var tile;

    tile = this;

    tile.particle = {};
    tile.particle.px = tile.centerX;
    tile.particle.py = tile.centerY;
    tile.particle.vx = 0;
    tile.particle.vy = 0;
    tile.particle.fx = 0;
    tile.particle.fy = 0;
    tile.particle.m = mass;
    tile.particle.forceAccumulatorX = 0;
    tile.particle.forceAccumulatorY = 0;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Initializes some static fields that can be pre-computed.
   */
  function initStaticFields() {
    var i, theta;

    deltaTheta = Math.PI / 3;
    verticalStartTheta = Math.PI / 6;

    horizontalSines = [];
    horizontalCosines = [];
    for (i = 0, theta = 0; i < 6; i += 1, theta += deltaTheta) {
      horizontalSines[i] = Math.sin(theta);
      horizontalCosines[i] = Math.cos(theta);
    }

    verticalSines = [];
    verticalCosines = [];
    for (i = 0, theta = verticalStartTheta; i < 6; i += 1, theta += deltaTheta) {
      verticalSines[i] = Math.sin(theta);
      verticalCosines[i] = Math.cos(theta);
    }
  }

  /**
   * Computes the offsets of the vertices from the center of the hexagon.
   *
   * @param {number} radius
   * @param {boolean} isVertical
   * @returns {Array.<number>}
   */
  function computeVertexDeltas(radius, isVertical) {
    var trigIndex, coordIndex, sines, cosines, vertexDeltas;

    // Grab the pre-computed sine and cosine values
    if (isVertical) {
      sines = verticalSines;
      cosines = verticalCosines;
    } else {
      sines = horizontalSines;
      cosines = horizontalCosines;
    }

    for (trigIndex = 0, coordIndex = 0, vertexDeltas = [];
        trigIndex < 6;
        trigIndex += 1) {
      vertexDeltas[coordIndex++] = radius * cosines[trigIndex];
      vertexDeltas[coordIndex++] = radius * sines[trigIndex];
    }

    return vertexDeltas;
  }

  /**
   * Computes the locations of the vertices of the hexagon described by the given parameters.
   *
   * @param {number} centerX
   * @param {number} centerY
   * @param {Array.<number>} vertexDeltas
   * @returns {Array.<number>} The coordinates of the vertices in the form [v1x, v1y, v2x, ...].
   */
  function computeVertices(centerX, centerY, vertexDeltas) {
    var trigIndex, coordIndex, vertices;

    for (trigIndex = 0, coordIndex = 0, vertices = [];
         trigIndex < 6;
         trigIndex += 1) {
      vertices[coordIndex] = centerX + vertexDeltas[coordIndex++];
      vertices[coordIndex] = centerY + vertexDeltas[coordIndex++];
    }

    return vertices;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this tile's content.
   *
   * @this HexTile
   * @param {?Object} tileData
   */
  function setContent(tileData) {
    var tile = this;

    tile.tileData = tileData;
    tile.holdsContent = !!tileData;
  }

  /**
   * Sets this tile's neighbor tiles.
   *
   * @this HexTile
   * @param {Array.<HexTile>} neighborTiles
   */
  function setNeighborTiles(neighborTiles) {
    var tile, i, iCount, j, jCount, neighborTile, deltaX, deltaY;

    tile = this;

    tile.neighbors = [];

    for (i = 0, iCount = neighborTiles.length; i < iCount; i += 1) {
      neighborTile = neighborTiles[i];

      if (neighborTile) {
        deltaX = tile.centerX - neighborTile.centerX;
        deltaY = tile.centerY - neighborTile.centerY;

        tile.neighbors[i] = {
          tile: neighborTile,
          restLength: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
          neighborsRelationshipObj: null,
          springForceX: 0,
          springForceY: 0
        };

        // Give neighbor tiles references to each others' relationship object
        if (neighborTile.neighbors) {
          for (j = 0, jCount = neighborTile.neighbors.length; j < jCount; j += 1) {
            if (neighborTile.neighbors[j] && neighborTile.neighbors[j].tile === tile) {
              tile.neighbors[i].neighborsRelationshipObj = neighborTile.neighbors[j];
              neighborTile.neighbors[j].neighborsRelationshipObj = tile.neighbors[i];
            }
          }
        }
      } else {
        tile.neighbors[i] = null;
      }
    }
  }

  /**
   * Sets this tile's vertex coordinates.
   *
   * @this HexTile
   * @param {Array.<number>} vertices
   */
  function setVertices(vertices) {
    var tile, i, pointsString;

    tile = this;

    for (i = 0, pointsString = ''; i < 12;) {
      pointsString += vertices[i++] + ',' + vertices[i++] + ' ';
    }

    tile.element.setAttribute('points', pointsString);
  }

  /**
   * Sets this tile's color values.
   *
   * @this HexTile
   * @param {number} hue
   * @param {number} saturation
   * @param {number} lightness
   */
  function setColor(hue, saturation, lightness) {
    var tile, colorString;
    tile = this;
    colorString = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)';
    tile.element.setAttribute('fill', colorString);
  }

  /**
   * Update the state of this tile particle for the current time step.
   *
   * @this HexTile
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var tile, i, count, neighbor, lx, ly, lDotX, lDotY, dotProd, length, temp, springForceX,
        springForceY;

    tile = this;

    if (!tile.particle.isFixed) {
      // --- Accumulate forces --- //

      // --- Drag force --- //
      tile.particle.forceAccumulatorX += -config.dragCoeff * tile.particle.vx;
      tile.particle.forceAccumulatorY += -config.dragCoeff * tile.particle.vy;

      // --- Spring forces from neighbor tiles --- //
      for (i = 0, count = tile.neighbors.length; i < count; i += 1) {
        neighbor = tile.neighbors[i];

        if (neighbor) {
          if (neighbor.springForceX) {
            tile.particle.forceAccumulatorX += neighbor.springForceX;
            tile.particle.forceAccumulatorY += neighbor.springForceY;

            neighbor.springForceX = 0;
            neighbor.springForceY = 0;
          } else {
            lx = neighbor.tile.particle.px - tile.particle.px;
            ly = neighbor.tile.particle.py - tile.particle.py;
            lDotX = neighbor.tile.particle.vx - tile.particle.vx;
            lDotY = neighbor.tile.particle.vy - tile.particle.vy;
            dotProd = lx * lDotX + ly * lDotY;
            length = Math.sqrt(lx * lx + ly * ly);

            temp = (config.neighborSpringCoeff * (length - neighbor.restLength) +
                config.neighborDampingCoeff * dotProd / length) / length;
            springForceX = lx * temp;
            springForceY = ly * temp;

            tile.particle.forceAccumulatorX += springForceX;
            tile.particle.forceAccumulatorY += springForceY;

            neighbor.neighborsRelationshipObj.springForceX = -springForceX;
            neighbor.neighborsRelationshipObj.springForceY = -springForceY;
          }
        }
      }

      // --- Spring forces from anchor point --- //

      lx = tile.centerX - tile.particle.px;
      ly = tile.centerY - tile.particle.py;
      length = Math.sqrt(lx * lx + ly * ly);

      if (length > 0) {
        lDotX = -tile.particle.vx;
        lDotY = -tile.particle.vy;
        dotProd = lx * lDotX + ly * lDotY;

        if (tile.isBorderTile) {
          temp = (config.borderAnchorSpringCoeff * length + config.borderAnchorDampingCoeff *
              dotProd / length) / length;
        } else {
          temp = (config.innerAnchorSpringCoeff * length + config.innerAnchorDampingCoeff *
              dotProd / length) / length;
        }

        springForceX = lx * temp;
        springForceY = ly * temp;

        tile.particle.forceAccumulatorX += springForceX;
        tile.particle.forceAccumulatorY += springForceY;
      }

      // --- Update particle state --- //

      tile.particle.fx = tile.particle.forceAccumulatorX / tile.particle.m * deltaTime;
      tile.particle.fy = tile.particle.forceAccumulatorY / tile.particle.m * deltaTime;
      tile.particle.px += tile.particle.vx * deltaTime;
      tile.particle.py += tile.particle.vy * deltaTime;
      tile.particle.vx += tile.particle.fx;
      tile.particle.vy += tile.particle.fy;

      ////////////////////////////////////////////////////////////////////////////////////
      // TODO: remove me!
      var ap = tile.particle,
          apx = ap.px,
          apy = ap.py,
          avx = ap.vx,
          avy = ap.vy,
          afx = ap.fx,
          afy = ap.fy,
          afAccx = ap.forceAccumulatorX,
          afAccy = ap.forceAccumulatorY;
      if (tile.index === 0) {
        //console.log('tile 0!');
      }
      if (isNaN(tile.particle.px)) {
        console.log('tile.particle.px=' + tile.particle.px);
      }
      if (isNaN(tile.particle.py)) {
        console.log('tile.particle.py=' + tile.particle.py);
      }
      if (isNaN(tile.particle.vx)) {
        console.log('tile.particle.vx=' + tile.particle.vx);
      }
      if (isNaN(tile.particle.vy)) {
        console.log('tile.particle.vy=' + tile.particle.vy);
      }
      if (isNaN(tile.particle.fx)) {
        console.log('tile.particle.fx=' + tile.particle.fx);
      }
      if (isNaN(tile.particle.fy)) {
        console.log('tile.particle.fy=' + tile.particle.fy);
      }
      // TODO: remove me!
      ////////////////////////////////////////////////////////////////////////////////////

      // Kill all velocities and forces below a threshold
      tile.particle.fx = tile.particle.fx < config.forceSuppressionLowerThreshold &&
          tile.particle.fx > config.forceSuppressionThresholdNegative ?
          0 : tile.particle.fx;
      tile.particle.fy = tile.particle.fy < config.forceSuppressionLowerThreshold &&
          tile.particle.fy > config.forceSuppressionThresholdNegative ?
          0 : tile.particle.fy;
      tile.particle.vx = tile.particle.vx < config.velocitySuppressionLowerThreshold &&
          tile.particle.vx > config.velocitySuppressionThresholdNegative ?
          0 : tile.particle.vx;
      tile.particle.vy = tile.particle.vy < config.velocitySuppressionLowerThreshold &&
          tile.particle.vy > config.velocitySuppressionThresholdNegative ?
          0 : tile.particle.vy;

      // Reset force accumulator for next time step
      tile.particle.forceAccumulatorX = 0;
      tile.particle.forceAccumulatorY = 0;

      // Compute new vertex locations
      tile.vertices = computeVertices(tile.particle.px, tile.particle.py, tile.vertexDeltas);
    }
  }

  /**
   * Update the SVG attributes for this tile to match its current particle state.
   *
   * @this HexTile
   */
  function draw() {
    var tile;

    tile = this;

    setVertices.call(tile, tile.vertices);
  }

  /**
   * Adds the given force, which will take effect during the next call to update.
   *
   * @this HexTile
   * @param {number} fx
   * @param {number} fy
   */
  function applyExternalForce(fx, fy) {
    var tile;

    tile = this;

    tile.particle.forceAccumulatorX += fx;
    tile.particle.forceAccumulatorY += fy;
  }

  /**
   * Fixes the position of this tile to the given coordinates.
   *
   * @this HexTile
   * @param {number} px
   * @param {number} py
   */
  function fixPosition(px, py) {
    var tile;

    tile = this;

    tile.particle.isFixed = true;
    tile.particle.px = px;
    tile.particle.py = py;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} svg
   * @param {number} centerX
   * @param {number} centerY
   * @param {number} outerRadius
   * @param {boolean} isVertical
   * @param {number} hue
   * @param {number} saturation
   * @param {number} lightness
   * @param {?Object} tileData
   * @param {number} tileIndex
   * @param {number} rowIndex
   * @param {number} columnIndex
   * @param {boolean} isMarginTile
   * @param {boolean} isBorderTile
   * @param {boolean} isInLargerRow
   * @param {number} mass
   */
  function HexTile(svg, centerX, centerY, outerRadius, isVertical, hue, saturation, lightness,
                   tileData, tileIndex, rowIndex, columnIndex, isMarginTile, isBorderTile,
                   isInLargerRow, mass) {
    var tile = this;

    tile.svg = svg;
    tile.element = null;
    tile.centerX = centerX;
    tile.centerY = centerY;
    tile.originalCenterX = centerX;
    tile.originalCenterY = centerY;
    tile.outerRadius = outerRadius;
    tile.isVertical = isVertical;
    tile.hue = hue;
    tile.saturation = saturation;
    tile.lightness = lightness;
    tile.tileData = tileData;
    tile.holdsContent = !!tileData;
    tile.index = tileIndex;
    tile.rowIndex = rowIndex;
    tile.columnIndex = columnIndex;
    tile.isMarginTile = isMarginTile;
    tile.isBorderTile = isBorderTile;
    tile.isInLargerRow = isInLargerRow;
    tile.neighbors = null;
    tile.vertices = null;
    tile.vertexDeltas = null;
    tile.particle = null;

    tile.setContent = setContent;
    tile.setNeighborTiles = setNeighborTiles;
    tile.setColor = setColor;
    tile.setVertices = setVertices;
    tile.update = update;
    tile.draw = draw;
    tile.applyExternalForce = applyExternalForce;
    tile.fixPosition = fixPosition;

    createElement.call(tile);
    createParticle.call(tile, mass);
  }

  HexTile.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.HexTile = HexTile;

  initStaticFields();

  console.log('HexTile module loaded');
})();

'use strict';

/**
 * This module defines a singleton that helps coordinate the various components of the hex-grid
 * package.
 *
 * The controller singleton handles provides convenient helper functions for creating and staring
 * grids and animations. It stores these objects and updates them in response to various system
 * events--e.g., window resize.
 *
 * @module controller
 */
(function () {
  var controller = {},
      config = {};

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Creates a HexGrid object and registers it with the animator.
   *
   * @param {HTMLElement} parent
   * @param {Array.<Object>} tileData
   * @param {boolean} isVertical
   * @returns {number} The ID (actually index) of the new HexGrid.
   */
  function createNewHexGrid(parent, tileData, isVertical) {
    var grid, index;

    grid = new hg.HexGrid(parent, tileData, isVertical);
    controller.grids.push(grid);
    hg.animator.startJob(grid);
    index = controller.grids.length - 1;

    createWaveAnimation(index);

    return index;
  }

  /**
   * Creates a new WaveAnimationJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createWaveAnimation(gridIndex) {
    var job = new hg.WaveAnimationJob(controller.grids[gridIndex]);
    controller.waveAnimationJobs.push(job);
    restartWaveAnimation(gridIndex);

    controller.grids[gridIndex].animations.waveAnimations =
        controller.grids[gridIndex].animations.waveAnimations || [];
    controller.grids[gridIndex].animations.waveAnimations.push(job);
  }

  /**
   * Restarts the WaveAnimationJob at the given index.
   *
   * @param {number} index
   */
  function restartWaveAnimation(index) {
    var job = controller.waveAnimationJobs[index];

    if (!job.isComplete) {
      hg.animator.cancelJob(job);
    }

    job.init();
    hg.animator.startJob(job);
  }

  /**
   * Creates a new LinesRadiateAnimationJob based off the tile at the given index.
   *
   * @param {number} gridIndex
   * @param {number} tileIndex
   */
  function createLinesRadiateAnimation(gridIndex, tileIndex) {
    var job, i, count;

    job = new hg.LinesRadiateAnimationJob();
    controller.linesRadiateAnimationJobs.push(job);
    hg.animator.startJob(job);

    controller.grids[gridIndex].animations.lineAnimations =
        controller.grids[gridIndex].animations.lineAnimations || [];

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      controller.grids[gridIndex].animations.lineAnimations.push(job.lineAnimationJobs[i]);
    }
  }

  /**
   * Creates a new RandomLIneAnimationJob.
   *
   * @param {number} gridIndex
   */
  function createRandomLineAnimation(gridIndex) {
    var job = hg.LineAnimationJob.createRandomLineAnimationJob(controller.grids[gridIndex]);
    controller.randomLineAnimationJobs.push(job);
    hg.animator.startJob(job);

    controller.grids[gridIndex].animations.lineAnimations =
        controller.grids[gridIndex].animations.lineAnimations || [];
    controller.grids[gridIndex].animations.lineAnimations.push(job);
  }

  /**
   * Creates a new ShimmerRadiateAnimationJob based off the tile at the given index.
   *
   * @param {number} gridIndex
   * @param {number} tileIndex
   */
  function createShimmerRadiateAnimation(gridIndex, tileIndex) {
//    var job = ;// TODO:
    controller.shimmerRadiateAnimationJobs.push(job);
    hg.animator.startJob(job);

    controller.grids[gridIndex].animations.shimmerAnimations =
        controller.grids[gridIndex].animations.shimmerAnimations || [];
    controller.grids[gridIndex].animations.shimmerAnimations.push(job);
  }

  /**
   * Event listener for the window resize event.
   *
   * Resizes all of the hex-grid components.
   */
  function resize() {
    controller.grids.forEach(function (grid, index) {
      grid.resize();
      restartWaveAnimation(index);
    });
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  controller.grids = [];
  controller.waveAnimationJobs = [];
  controller.linesRadiateAnimationJobs = [];
  controller.randomLineAnimationJobs = [];
  controller.shimmerRadiateAnimationJobs = [];

  controller.config = config;

  controller.createNewHexGrid = createNewHexGrid;
  controller.restartWaveAnimation = restartWaveAnimation;
  controller.createLinesRadiateAnimation = createLinesRadiateAnimation;
  controller.createRandomLineAnimation = createRandomLineAnimation;
  controller.createShimmerRadiateAnimation = createShimmerRadiateAnimation;
  controller.resize = resize;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.controller = controller;

  window.addEventListener('resize', resize, false);

  console.log('controller module loaded');
})();

'use strict';

/**
 * This module defines a collection of static general utility functions.
 *
 * @module util
 */
(function () {
  /**
   * Adds an event listener for each of the given events to each of the given elements.
   *
   * @param {Array.<HTMLElement>} elements The elements to add event listeners to.
   * @param {Array.<String>} events The event listeners to add to the elements.
   * @param {Function} callback The single callback for handling the events.
   */
  function listenToMultipleForMultiple(elements, events, callback) {
    elements.forEach(function (element) {
      events.forEach(function (event) {
        util.listen(element, event, callback);
      });
    });
  }

  /**
   * Creates a DOM element with the given tag name, appends it to the given parent element, and
   * gives it the given id and classes.
   *
   * @param {String} tagName The tag name to give the new element.
   * @param {HTMLElement} [parent] The parent element to append the new element to.
   * @param {String} [id] The id to give the new element.
   * @param {Array.<String>} [classes] The classes to give the new element.
   * @returns {HTMLElement} The new element.
   */
  function createElement(tagName, parent, id, classes) {
    var element = document.createElement(tagName);
    if (parent) {
      parent.appendChild(element);
    }
    if (id) {
      element.id = id;
    }
    if (classes) {
      classes.forEach(function (className) {
        addClass(element, className)
      });
    }
    return element;
  }

  /**
   * Determines whether the given element contains the given class.
   *
   * @param {HTMLElement} element The element to check.
   * @param {String} className The class to check for.
   * @returns {Boolean} True if the element does contain the class.
   */
  function containsClass(element, className) {
    var startIndex, indexAfterEnd;
    startIndex = element.className.indexOf(className);
    if (startIndex >= 0) {
      if (startIndex === 0 || element.className[startIndex - 1] === ' ') {
        indexAfterEnd = startIndex + className.length;
        if (indexAfterEnd === element.className.length ||
            element.className[indexAfterEnd] === ' ') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Toggles whether the given element has the given class. If the enabled argument is given, then
   * the inclusion of the class will be forced. That is, if enabled=true, then this will ensure the
   * element has the class; if enabled=false, then this will ensure the element does NOT have the
   * class; if enabled=undefined, then this will simply toggle whether the element has the class.
   *
   * @param {HTMLElement} element The element to add the class to or remove the class from.
   * @param {String} className The class to add or remove.
   * @param {Boolean} [enabled] If given, then the inclusion of the class will be forced.
   */
  function toggleClass(element, className, enabled) {
    if (typeof enabled === 'undefined') {
      if (containsClass(element, className)) {
        removeClass(element, className);
      } else {
        addClass(element, className);
      }
    } else if (enabled) {
      addClass(element, className);
    } else {
      removeClass(element, className);
    }
  }

  /**
   * Gets the coordinates of the element relative to the top-left corner of the page.
   *
   * @param {HTMLElement} element The element to get the coordinates of.
   * @returns {{x: Number, y: Number}} The coordinates of the element relative to the top-left
   * corner of the page.
   */
  function getPageOffset(element) {
    var x = 0, y = 0;
    while (element) {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    }
    x -= util.getScrollLeft();
    y -= util.getScrollTop();
    return { x: x, y: y };
  }

  /**
   * Gets the dimensions of the viewport.
   *
   * @returns {{w: Number, h: Number}} The dimensions of the viewport.
   */
  function getViewportSize() {
    var w, h;
    if (typeof window.innerWidth !== 'undefined') {
      // Good browsers
      w = window.innerWidth;
      h = window.innerHeight;
    } else if (typeof document.documentElement !== 'undefined' &&
        typeof document.documentElement.clientWidth !== 'undefined' &&
        document.documentElement.clientWidth !== 0) {
      // IE6 in standards compliant mode
      w = document.documentElement.clientWidth;
      h = document.documentElement.clientHeight;
    } else {
      // Older versions of IE
      w = document.getElementsByTagName('body')[0].clientWidth;
      h = document.getElementsByTagName('body')[0].clientHeight;
    }
    return { w: w, h: h };
  }

  /**
   * Removes the given child element from the given parent element if the child does indeed belong
   * to the parent.
   *
   * @param {HTMLElement} parent The parent to remove the child from.
   * @param {HTMLElement} child The child to remove.
   * @returns {Boolean} True if the child did indeed belong to the parent.
   */
  function removeChildIfPresent(parent, child) {
    if (child && child.parentNode === parent) {
      parent.removeChild(child);
      return true;
    }
    return false
  }

  /**
   * Adds the given class to the given element.
   *
   * @param {HTMLElement} element The element to add the class to.
   * @param {String} className The class to add.
   */
  function addClass(element, className) {
    element.className += ' ' + className;
  }

  /**
   * Removes the given class from the given element.
   *
   * @param {HTMLElement} element The element to remove the class from.
   * @param {String} className The class to remove.
   */
  function removeClass(element, className) {
    element.className = element.className.split(' ').filter(function (value) {
      return value !== className;
    }).join(' ');
  }

  /**
   * Removes all classes from the given element.
   *
   * @param {HTMLElement} element The element to remove all classes from.
   */
  function clearClasses(element) {
    element.className = '';
  }

  /**
   * Calculates the width that the DOM would give to a div with the given text. The given tag
   * name, parent, id, and classes allow the width to be affected by various CSS rules.
   *
   * @param {String} text The text to determine the width of.
   * @param {String} tagName The tag name this text would supposedly have.
   * @param {HTMLElement} [parent] The parent this text would supposedly be a child of; defaults
   * to the document body.
   * @param {String} [id] The id this text would supposedly have.
   * @param {Array.<String>} [classes] The classes this text would supposedly have.
   * @returns {Number} The width of the text under these conditions.
   */
  function getTextWidth(text, tagName, parent, id, classes) {
    var tmpElement, width;
    parent = parent || document.getElementsByTagName('body')[0];
    tmpElement = util.createElement(tagName, null, id, classes);
    tmpElement.style.position = 'absolute';
    tmpElement.style.visibility = 'hidden';
    tmpElement.style.whiteSpace = 'nowrap';
    parent.appendChild(tmpElement);
    tmpElement.innerHTML = text;
    width = tmpElement.clientWidth;
    parent.removeChild(tmpElement);
    return width;
  }

  /**
   * Encodes and concatenates the given URL parameters into a single query string.
   *
   * @param {Object} rawParams An object whose properties represent the URL query string
   * parameters.
   * @return {String} The query string.
   */
  function encodeQueryString(rawParams) {
    var parameter, encodedParams;
    encodedParams = [];
    for (parameter in rawParams) {
      if (rawParams.hasOwnProperty(parameter)) {
        encodedParams.push(encodeURIComponent(parameter) + '=' +
            encodeURIComponent(rawParams[parameter]));
      }
    }
    return '?' + encodedParams.join('&');
  }

  /**
   * Retrieves the value corresponding to the given name from the given query string.
   *
   * (borrowed from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript)
   *
   * @param {String} queryString The query string containing the parameter.
   * @param {String} name The (non-encoded) name of the parameter value to retrieve.
   * @returns {string} The query string parameter value, or null if the parameter was not found.
   */
  function getQueryStringParameterValue(queryString, name) {
    var regex, results;
    name = encodeURIComponent(name);
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    regex = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i');
    results = regex.exec(queryString);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  /**
   * Sets the CSS transition duration style of the given element.
   *
   * @param {HTMLElement} element The element.
   * @param {Number} value The duration.
   */
  function setTransitionDurationSeconds(element, value) {
    element.style.transitionDuration = value + 's';
    element.style.WebkitTransitionDuration = value + 's';
    element.style.MozTransitionDuration = value + 's';
    element.style.msTransitionDuration = value + 's';
    element.style.OTransitionDuration = value + 's';
  }

  /**
   * Sets the CSS transition delay style of the given element.
   *
   * @param {HTMLElement} element The element.
   * @param {Number} value The delay.
   */
  function setTransitionDelaySeconds(element, value) {
    element.style.transitionDelay = value + 's';
    element.style.WebkitTransitionDelay = value + 's';
    element.style.MozTransitionDelay = value + 's';
    element.style.msTransitionDelay = value + 's';
    element.style.OTransitionDelay = value + 's';
  }

  /**
   * Removes any children elements from the given parent that have the given class.
   *
   * @param {HTMLElement} parent The parent to remove children from.
   * @param {String} className The class to match.
   */
  function removeChildrenWithClass(parent, className) {
    var matchingChildren, i, count;

    matchingChildren = parent.querySelectorAll('.' + className);

    for (i = 0, count = matchingChildren.length; i < count; i++) {
      parent.removeChild(matchingChildren[i]);
    }
  }

  /**
   * Sets the CSS transition-timing-function style of the given element with the given cubic-
   * bezier points.
   *
   * @param {HTMLElement} element The element.
   * @param {{p1x: Number, p1y: Number, p2x: Number, p2y: Number}} bezierPts The cubic-bezier
   * points to use for this timing function.
   */
  function setTransitionCubicBezierTimingFunction(element, bezierPts) {
    var value = 'cubic-bezier(' + bezierPts.p1x + ',' + bezierPts.p1y + ',' + bezierPts.p2x + ',' +
        bezierPts.p2y + ')';
    element.style.transitionTimingFunction = value;
    element.style.WebkitTransitionTimingFunction = value;
    element.style.MozTransitionTimingFunction = value;
    element.style.msTransitionTimingFunction = value;
    element.style.OTransitionTimingFunction = value;
  }

  // A collection of different types of easing functions.
  var easingFunctions = {
    linear: function (t) {
      return t;
    },
    easeInQuad: function (t) {
      return t * t;
    },
    easeOutQuad: function (t) {
      return t * (2 - t);
    },
    easeInOutQuad: function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function (t) {
      return t * t * t;
    },
    easeOutCubic: function (t) {
      return 1 + --t * t * t;
    },
    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: function (t) {
      return t * t * t * t;
    },
    easeOutQuart: function (t) {
      return 1 - --t * t * t * t;
    },
    easeInOutQuart: function (t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint: function (t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function (t) {
      return 1 + --t * t * t * t * t;
    },
    easeInOutQuint: function (t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  // A collection of the inverses of different types of easing functions.
  var inverseEasingFunctions = {
    linear: function (t) {
      return t;
    },
    easeInQuad: function (t) {
      return Math.sqrt(t);
    },
    easeOutQuad: function (t) {
      return 1 - Math.sqrt(1 - t);
    },
    easeInOutQuad: function (t) {
      return t < 0.5 ? Math.sqrt(t * 0.5) : 1 - 0.70710678 * Math.sqrt(1 - t);
    }
  };

  /**
   * A cross-browser compatible requestAnimationFrame. From
   * https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
   *
   * @type {Function}
   */
  var requestAnimationFrame =
      (window.requestAnimationFrame || // the standard
      window.webkitRequestAnimationFrame || // chrome/safari
      window.mozRequestAnimationFrame || // firefox
      window.oRequestAnimationFrame || // opera
      window.msRequestAnimationFrame || // ie
      function (callback) { // default
        window.setTimeout(callback, 16); // 60fps
      }).bind(window);

  /**
   * Calculates the x and y coordinates represented by the given Bezier curve at the given
   * percentage.
   *
   * @param {number} percent Expressed as a number between 0 and 1.
   * @param {Array.<{x: number, y: number}>} controlPoints
   * @returns {{x: number, y: number}}
   */
  function getXYFromPercentWithBezier(percent, controlPoints) {
    var x, y, oneMinusPercent, tmp1, tmp2, tmp3, tmp4;

    oneMinusPercent = 1 - percent;
    tmp1 = oneMinusPercent * oneMinusPercent * oneMinusPercent;
    tmp2 = 3 * percent * oneMinusPercent * oneMinusPercent;
    tmp3 = 3 * percent * percent * oneMinusPercent;
    tmp4 = percent * percent * percent;

    x = controlPoints[0].x * tmp1 +
        controlPoints[1].x * tmp2 +
        controlPoints[2].x * tmp3 +
        controlPoints[3].x * tmp4;
    y = controlPoints[0].y * tmp1 +
        controlPoints[1].y * tmp2 +
        controlPoints[2].y * tmp3 +
        controlPoints[3].y * tmp4;

    return {x: x, y: y};
  }

  /**
   * Applies the given transform to the given element as a CSS style in a cross-browser compatible
   * manner.
   *
   * @param {HTMLElement} element
   * @param {string} transform
   */
  function applyTransform(element, transform) {
    element.style.webkitTransform = transform;
    element.style.MozTransform = transform;
    element.style.msTransform = transform;
    element.style.OTransform = transform;
    element.style.transform = transform;
  }

  /**
   * Returns a copy of the given array with its contents re-arranged in a random order.
   *
   * The original array is left in its original order.
   *
   * @param {Array} array
   * @returns {Array}
   */
  function shuffle(array) {
    var i, j, count, temp;

    for (i = 0, count = array.length; i < count; i += 1) {
      j = parseInt(Math.random() * count);
      temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }

    return array;
  }

  /**
   * Return true if the given point would be located within the given polyline if its two ends
   * were connected.
   *
   * If the given boolean is true, then the given polyline is interpreted as being a polygon--i.e.
   * the first and last points are equivalent.
   *
   * This is an implementation of the even-odd rule algorithm.
   *
   * @param {number} pointX
   * @param {number} pointY
   * @param {Array.<number>} coordinates
   * @param {boolean} isClosed
   */
  function isPointInsidePolyline(pointX, pointY, coordinates, isClosed) {
    var pointIsInside, i, count, p1X, p1Y, p2X, p2Y, previousX, previousY, currentX, currentY;

    pointIsInside = false;

    if (isClosed) {
      // There is no area within a straight line
      if (coordinates.length < 6) {
        return pointIsInside;
      }

      previousX = coordinates[coordinates.length - 4];
      previousY = coordinates[coordinates.length - 3];
    } else {
      // There is no area within a straight line
      if (coordinates.length < 4) {
        return pointIsInside;
      }

      previousX = coordinates[coordinates.length - 2];
      previousY = coordinates[coordinates.length - 1];
    }

    for (i = 0, count = coordinates.length - 2; i < count; i += 2) {
      currentX = coordinates[i];
      currentY = coordinates[i + 1];

      if (currentX > previousX) {
        p1X = previousX;
        p1Y = previousY;
        p2X = currentX;
        p2Y = currentY;
      } else {
        p1X = currentX;
        p1Y = currentY;
        p2X = previousX;
        p2Y = previousY;
      }

      if ((currentX < pointX) === (pointX <= previousX) &&
          (pointY - p1Y) * (p2X - p1X) < (p2Y - p1Y) * (pointX - p1X)) {
        pointIsInside = !pointIsInside;
      }

      previousX = currentX;
      previousY = currentY;
    }

    return pointIsInside;
  }

  /**
   * Performs a shallow copy of the given object.
   *
   * @param {Object} object
   * @returns {Object}
   */
  function shallowCopy(object) {
    var key, cloneObject;

    cloneObject = {};

    for (key in object) {
      cloneObject[key] = object[key];
    }

    return cloneObject;
  }

  /**
   * Converts the given HSL color values to HSV color values.
   *
   * @param {{h:number,s:number,l:number}} hsl
   * @returns {{h:number,s:number,v:number}}
   */
  function hslToHsv(hsl) {
    var temp = hsl.s * (hsl.l < 0.5 ? hsl.l : 1 - hsl.l);
    return {
      h: hsl.h,
      s: 2 * temp / (hsl.l + temp),
      v: hsl.l + temp
    };
  }

  /**
   * Converts the given HSV color values to HSL color values.
   *
   * @param {{h:number,s:number,v:number}} hsv
   * @returns {{h:number,s:number,l:number}}
   */
  function hsvToHsl(hsv) {
    var temp = (2 - hsv.s) * hsv.v;
    return {
      h: hsv.h,
      s: hsv.s * hsv.v / (temp < 1 ? temp : 1.9999999 - temp),
      l: temp * 0.5
    };
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module

  /**
   * Exposes the static util functions.
   *
   * @global
   */
  var util = {
    listenToMultipleForMultiple: listenToMultipleForMultiple,
    createElement: createElement,
    containsClass: containsClass,
    toggleClass: toggleClass,
    getPageOffset: getPageOffset,
    getViewportSize: getViewportSize,
    removeChildIfPresent: removeChildIfPresent,
    addClass: addClass,
    removeClass: removeClass,
    clearClasses: clearClasses,
    getTextWidth: getTextWidth,
    encodeQueryString: encodeQueryString,
    getQueryStringParameterValue: getQueryStringParameterValue,
    setTransitionDurationSeconds: setTransitionDurationSeconds,
    setTransitionDelaySeconds: setTransitionDelaySeconds,
    removeChildrenWithClass: removeChildrenWithClass,
    setTransitionCubicBezierTimingFunction: setTransitionCubicBezierTimingFunction,
    easingFunctions: easingFunctions,
    inverseEasingFunctions: inverseEasingFunctions,
    requestAnimationFrame: requestAnimationFrame,
    getXYFromPercentWithBezier: getXYFromPercentWithBezier,
    applyTransform: applyTransform,
    shuffle: shuffle,
    isPointInsidePolyline: isPointInsidePolyline,
    shallowCopy: shallowCopy,
    hsvToHsl: hsvToHsl,
    hslToHsv: hslToHsv,
    svgNamespace: 'http://www.w3.org/2000/svg'
  };

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.util = util;

  console.log('util module loaded');
})();

'use strict';

// TODO: remove this module after basing some other animation job implementations off of it

/**
 * This module defines a constructor for AnimationJob objects.
 *
 * @module AnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   */
  function checkForComplete() {
    var job = this;

    // TODO:
//    if (???) {
//      console.log('AnimationJob completed');
//
//      job.isComplete = true;
//      job.onComplete(true);
//    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this AnimationJob as started.
   *
   * @this AnimationJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO:
  }

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this AnimationJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    // TODO:

    checkForComplete.call(job);
  }

  /**
   * Draws the current state of this AnimationJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this AnimationJob
   */
  function draw() {
    var job = this;

    // TODO:
  }

  /**
   * Stops this AnimationJob, and returns the element its original form.
   *
   * @this AnimationJob
   */
  function cancel() {
    var job = this;

    // TODO:

    job.onComplete(false);

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HexGrid} grid
   * @param {Function} onComplete
   */
  function AnimationJob(grid, onComplete) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;

    console.log('AnimationJob created');
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.AnimationJob = AnimationJob;

  console.log('AnimationJob module loaded');
})();

'use strict';

/**
 * This module defines a constructor for LineAnimationJob objects.
 *
 * @module LineAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var NEIGHBOR = 0,
      LOWER_SELF = 1,
      UPPER_SELF = 2,
      config = {};

  config.duration = 4400;
  config.lineWidth = 26;
  config.lineLength = 300;
  config.lineSidePeriod = 300; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 70;
  config.startOpacity = 1;

  config.endSaturation = 50;
  config.endLightness = 100;
  config.endOpacity = 0;

  config.sameDirectionProb = 0.9;


  config.oppositeDirectionProb = 0;
  config.epsilon = 0.00001;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.distantSidewaysDirectionProb = (1 - config.sameDirectionProb) / 2;
    config.closeSidewaysDirectionProb = (1 - config.oppositeDirectionProb) / 2;
  };

config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the start and end hue for the line of this animation.
   *
   * @this LineAnimationJob
   */
  function createHues() {
    var job;

    job = this;

    job.startHue = Math.random() * 360;
    job.endHue = Math.random() * 360;
  }

  /**
   * Creates the polyline SVG element that is used to render this animation.
   *
   * @this LineAnimationJob
   */
  function createPolyline() {
    var job;

    job = this;

    job.polyline = document.createElementNS(hg.util.svgNamespace, 'polyline');
    job.polyline.setAttribute('fill-opacity', '0');
    job.grid.svg.insertBefore(job.polyline, job.grid.svg.firstChild);
  }

  /**
   * Updates the color values of the line of this animation.
   *
   * @this LineAnimationJob
   */
  function updateColorValues() {
    var job, progress, oneMinusProgress;

    job = this;

    progress = job.ellapsedTime / job.duration;
    oneMinusProgress = 1 - progress;

    job.currentHue = oneMinusProgress * job.startHue + progress * job.endHue;
    job.currentSaturation = oneMinusProgress * job.startSaturation + progress * job.endSaturation;
    job.currentLightness = oneMinusProgress * job.startLightness + progress * job.endLightness;
    job.currentOpacity = oneMinusProgress * job.startOpacity + progress * job.endOpacity;
  }

  /**
   * Updates the state of this job to handle its completion.
   *
   * @this LineAnimationJob
   */
  function handleCompletion() {
    var job;

    job = this;

    console.log('LineAnimationJob completed');

    if (job.polyline) {
      job.grid.svg.removeChild(job.polyline);
      job.polyline = null;
    }

    job.tiles = [];
    job.corners = [];
    job.direction = Number.NaN;
    job.currentCornerIndex = Number.NaN;
    job.hasReachedEdge = true;

    job.isComplete = true;
  }

  /**
   * Determines whether this LineAnimationJob has reached the edge of the grid.
   *
   * @this LineAnimationJob
   */
  function checkHasReachedEdge() {
    var job;

    job = this;

    if (job.direction === (job.corners[job.currentCornerIndex] + 3) % 6) {
      // When the job is at the opposite corner of a tile from the direction it is headed, then it
      // has not reached the edge
      job.hasReachedEdge = false;
    } else {
      job.hasReachedEdge = !job.lowerNeighbors[job.currentCornerIndex] ||
          !job.upperNeighbors[job.currentCornerIndex];
    }
  }

  /**
   * Determines the neighbors of this job's current tile at the current corner.
   *
   * @this LineAnimationJob
   */
  function determineNeighbors() {
    var job, lowerNeigborTileIndex, upperNeigborTileIndex;

    job = this;

    if (job.grid.isVertical) {
      lowerNeigborTileIndex = (job.corners[job.currentCornerIndex] + 5) % 6;
      upperNeigborTileIndex = job.corners[job.currentCornerIndex];
    } else {
      lowerNeigborTileIndex = job.corners[job.currentCornerIndex];
      upperNeigborTileIndex = (job.corners[job.currentCornerIndex] + 1) % 6;
    }

    job.lowerNeighbors[job.currentCornerIndex] =
        job.tiles[job.currentCornerIndex].neighbors[lowerNeigborTileIndex];
    job.upperNeighbors[job.currentCornerIndex] =
        job.tiles[job.currentCornerIndex].neighbors[upperNeigborTileIndex];

    job.lowerNeighborCorners[job.currentCornerIndex] =
        (job.corners[job.currentCornerIndex] + 1) % 6;
    job.upperNeighborCorners[job.currentCornerIndex] =
        (job.corners[job.currentCornerIndex] + 5) % 6;
  }

  /**
   * Returns the next vertex in the path of this animation.
   *
   * @this LineAnimationJob
   */
  function chooseNextVertex() {
    var job, cornerConfig, neighborProb, lowerSelfProb, upperSelfProb, random, relativeDirection,
        absoluteDirection, nextCorner, nextTile, currentCorner;

    job = this;
    currentCorner = job.corners[job.currentCornerIndex];

    // The first segment of a line animation is forced to go in a given direction
    if (job.currentCornerIndex === 0) {
      relativeDirection = job.forcedInitialRelativeDirection;
      job.latestDirection = relativeToAbsoluteDirection(relativeDirection, currentCorner);
    } else {
      cornerConfig = (currentCorner - job.direction + 6) % 6;

      // Determine relative direction probabilities
      switch (cornerConfig) {
        case 0:
          neighborProb = config.sameDirectionProb;
          lowerSelfProb = config.distantSidewaysDirectionProb;
          upperSelfProb = config.distantSidewaysDirectionProb;
          break;
        case 1:
          neighborProb = config.closeSidewaysDirectionProb;
          lowerSelfProb = config.closeSidewaysDirectionProb;
          upperSelfProb = config.oppositeDirectionProb;
          break;
        case 2:
          neighborProb = config.distantSidewaysDirectionProb;
          lowerSelfProb = config.sameDirectionProb;
          upperSelfProb = config.distantSidewaysDirectionProb;
          break;
        case 3:
          neighborProb = config.oppositeDirectionProb;
          lowerSelfProb = config.closeSidewaysDirectionProb;
          upperSelfProb = config.closeSidewaysDirectionProb;
          break;
        case 4:
          neighborProb = config.distantSidewaysDirectionProb;
          lowerSelfProb = config.distantSidewaysDirectionProb;
          upperSelfProb = config.sameDirectionProb;
          break;
        case 5:
          neighborProb = config.closeSidewaysDirectionProb;
          lowerSelfProb = config.oppositeDirectionProb;
          upperSelfProb = config.closeSidewaysDirectionProb;
          break;
        default:
          throw new Error('Invalid state: cornerConfig=' + cornerConfig);
      }

      // Determine the next direction to travel
      do {
        // Pick a random direction
        random = Math.random();
        relativeDirection = random < neighborProb ? NEIGHBOR :
                random < neighborProb + lowerSelfProb ? LOWER_SELF : UPPER_SELF;
        absoluteDirection = relativeToAbsoluteDirection(relativeDirection, currentCorner);
        console.log('r=' + relativeDirection);/////TODO/////
        console.log('a=' + absoluteDirection);/////TODO/////

        console.log('np=' + neighborProb);/////TODO/////
        console.log('lsp=' + lowerSelfProb);/////TODO/////
        console.log('usp=' + upperSelfProb);/////TODO/////
        console.log('ld=' + job.latestDirection);/////TODO/////

        // Disallow the line from going back the way it just came
      } while (absoluteDirection === (job.latestDirection + 3) % 6);

      job.latestDirection = absoluteDirection;
    }

    // Determine the next corner configuration
    switch (relativeDirection) {
      case NEIGHBOR:
        if (job.grid.isVertical) {
          nextCorner = (currentCorner + 1) % 6;
          nextTile = job.tiles[job.currentCornerIndex].neighbors[(currentCorner + 5) % 6].tile;
        } else {
          nextCorner = (currentCorner + 1) % 6;
          nextTile = job.tiles[job.currentCornerIndex].neighbors[currentCorner].tile;
        }
        break;
      case LOWER_SELF:
        nextCorner = (currentCorner + 5) % 6;
        nextTile = job.tiles[job.currentCornerIndex];
        break;
      case UPPER_SELF:
        nextCorner = (currentCorner + 1) % 6;
        nextTile = job.tiles[job.currentCornerIndex];
        break;
      default:
        throw new Error('Invalid state: relativeDirection=' + relativeDirection);
    }

    job.currentCornerIndex = job.corners.length;

    job.corners[job.currentCornerIndex] = nextCorner;
    job.tiles[job.currentCornerIndex] = nextTile;

    determineNeighbors.call(job);
    checkHasReachedEdge.call(job);
  }

  /**
   * Translates the givern relative direction to an absolute direction.
   *
   * @param {number} relativeDirection
   * @param {number} corner
   * @returns {number}
   */
  function relativeToAbsoluteDirection(relativeDirection, corner) {
    switch (relativeDirection) {
      case NEIGHBOR:
        return corner;
      case LOWER_SELF:
        return (corner + 4) % 6;
      case UPPER_SELF:
        return (corner + 2) % 6;
      default:
        throw new Error('Invalid state: relativeDirection=' + relativeDirection);
    }
  }

  /**
   * Updates the parameters of the segments of this animation.
   *
   * @this LineAnimationJob
   */
  function updateSegments() {
    var job, distanceTravelled, frontSegmentLength, backSegmentLength, segmentsTouchedCount,
        distancePastEdge, segmentsPastEdgeCount;

    job = this;

    // --- Compute some values of the polyline at the current time --- //

    distanceTravelled = job.ellapsedTime / job.lineSidePeriod * hg.HexGrid.config.tileOuterRadius;
    segmentsTouchedCount = parseInt(distanceTravelled / hg.HexGrid.config.tileOuterRadius) + 1;

    // Add additional vertices to the polyline as needed
    while (segmentsTouchedCount >= job.corners.length && !job.hasReachedEdge) {
      chooseNextVertex.call(job);
    }

    frontSegmentLength = distanceTravelled % hg.HexGrid.config.tileOuterRadius;
    backSegmentLength = (job.lineLength - frontSegmentLength +
        hg.HexGrid.config.tileOuterRadius) % hg.HexGrid.config.tileOuterRadius;

    job.frontSegmentEndRatio = frontSegmentLength / hg.HexGrid.config.tileOuterRadius;
    job.backSegmentStartRatio = 1 - (backSegmentLength / hg.HexGrid.config.tileOuterRadius);

    job.isShort = job.lineLength < hg.HexGrid.config.tileOuterRadius;
    job.isStarting = distanceTravelled < job.lineLength;

    // --- Determine how many segments are included in the polyline --- //

    // When the polyline is neither starting nor ending and is not shorter than the length of a
    // segment, then this is how many segments it includes
    job.segmentsIncludedCount = parseInt((job.lineLength - frontSegmentLength -
        backSegmentLength + config.epsilon) % hg.HexGrid.config.tileOuterRadius) + 2;
    job.completeSegmentsIncludedCount = job.segmentsIncludedCount - 2;

    // Subtract from the number of included segments depending on current conditions
    if (job.isShort) {
      // The polyline is shorter than a tile side
      job.completeSegmentsIncludedCount = 0;

      if (job.isStarting || job.hasReachedEdge) {
        // One end of the polyline would lie outside the grid
        job.segmentsIncludedCount = 1;
        console.log('>>>>>1.1');/////TODO/////
      } else {
        if (frontSegmentLength - job.lineLength >= 0) {
          // The polyline is between corners
          job.segmentsIncludedCount = 1;
          console.log('>>>>>1.2');/////TODO/////
        } else {
          // The polyline is across a corner
          job.segmentsIncludedCount = 2;
          console.log('>>>>>2.3');/////TODO/////
        }
      }
    } else {
      // The polyline is longer than a tile side
      console.log('>>>>>2.1');/////TODO/////

      if (job.isStarting) {
        // The polyline is starting; the back of the polyline would lie outside the grid
        job.segmentsIncludedCount = segmentsTouchedCount;
        job.completeSegmentsIncludedCount = segmentsTouchedCount - 1;
        console.log('>>>>>2.2');/////TODO/////
      }

      if (job.hasReachedEdge) {
        // The polyline is ending; the front of the polyline would lie outside the grid
        segmentsPastEdgeCount = segmentsTouchedCount - job.corners.length;
        distancePastEdge = segmentsPastEdgeCount * hg.HexGrid.config.tileOuterRadius;

        if (distancePastEdge > job.lineLength) {
          handleCompletion.call(job);
          return;
        }

        job.segmentsIncludedCount -= segmentsPastEdgeCount;
        job.completeSegmentsIncludedCount -= segmentsPastEdgeCount + 1;
        console.log('>>>>>2.3');/////TODO/////
      }
    }
  }


  /**
   * Calculates the points in the middle of the gaps between tiles at each known corner.
   *
   * @this LineAnimationJob
   */
  function computeCornerGapPoints() {
    var job, i, count;

    job = this;

    job.gapPoints = [];

    for (i = 0, count = job.corners.length; i < count; i += 1) {
      job.gapPoints[i] = computeCornerGapPoint(job.tiles[i], job.corners[i], job.lowerNeighbors[i],
          job.upperNeighbors[i], job.lowerNeighborCorners[i], job.upperNeighborCorners[i]);
    }
  }

  /**
   * Calculates the point in the middle of the gap between tiles at the given corner.
   *
   * @param {HexTile} tile
   * @param {number} corner
   * @param {Object} lowerNeighbor
   * @param {Object} upperNeighbor
   * @param {number} lowerNeighborCorner
   * @param {number} upperNeighborCorner
   * @returns {{x:number,y:number}}
   */
  function computeCornerGapPoint(tile, corner, lowerNeighbor, upperNeighbor, lowerNeighborCorner,
                             upperNeighborCorner) {
    var count, xSum, ySum;

    if (lowerNeighbor) {
      if (upperNeighbor) {
        count = 3;
        xSum = tile.particle.px + lowerNeighbor.tile.particle.px + upperNeighbor.tile.particle.px;
        ySum = tile.particle.py + lowerNeighbor.tile.particle.py + upperNeighbor.tile.particle.py;
      } else {
        count = 2;
        xSum = tile.vertices[corner * 2] + lowerNeighbor.tile.vertices[lowerNeighborCorner * 2];
        ySum = tile.vertices[corner * 2 + 1] +
            lowerNeighbor.tile.vertices[lowerNeighborCorner * 2 + 1];
      }
    } else {
      if (upperNeighbor) {
        count = 2;
        xSum = tile.vertices[corner * 2] + upperNeighbor.tile.vertices[upperNeighborCorner * 2];
        ySum = tile.vertices[corner * 2 + 1] +
            upperNeighbor.tile.vertices[upperNeighborCorner * 2 + 1];
      } else {
        count = 1;
        xSum = tile.vertices[corner * 2];
        ySum = tile.vertices[corner * 2 + 1];
      }
    }

    return {
      x: xSum / count,
      y: ySum / count
    };
  }

  /**
   * Calculates the points of the SVG polyline element.
   *
   * @this LineAnimationJob
   */
  function computePolylinePoints() {//**;// TODO: do we need i and count?
    var job, gapPointsIndex, polylinePointsIndex;

    job = this;

    job.polylinePoints = [];
    polylinePointsIndex = job.segmentsIncludedCount;
    gapPointsIndex = job.currentCornerIndex;

    // Add the front-end segment point
    if (!job.hasReachedEdge) {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex].x * job.frontSegmentEndRatio +
            job.gapPoints[gapPointsIndex - 1].x * (1 - job.frontSegmentEndRatio),
        y: job.gapPoints[gapPointsIndex].y * job.frontSegmentEndRatio +
            job.gapPoints[gapPointsIndex - 1].y * (1 - job.frontSegmentEndRatio)
      };
      polylinePointsIndex -= 1;
      gapPointsIndex -= 1;
    }

    // Add the internal segment points
    for (i = 0, count = job.completeSegmentsIncludedCount + 1; i < count;
         i += 1, polylinePointsIndex -= 1, gapPointsIndex -= 1) {
      job.polylinePoints[polylinePointsIndex] = job.gapPoints[gapPointsIndex];
    }

    // Add the back-end segment point
    if (!job.isStarting) {
      job.polylinePoints[0] = {
        x: job.gapPoints[gapPointsIndex + 1].x * job.backSegmentStartRatio +
            job.gapPoints[gapPointsIndex].x * (1 - job.backSegmentStartRatio),
        y: job.gapPoints[gapPointsIndex + 1].y * job.backSegmentStartRatio +
            job.gapPoints[gapPointsIndex].y * (1 - job.backSegmentStartRatio)
      }
    }
  }

  /**
   * Updates the actual SVG elements to render the current state of this animation.
   *
   * @this LineAnimationJob
   */
  function drawSegments() {
    var job, i, count, pointsString;

    job = this;

    // Create the points string
    pointsString = '';
    for (i = 0, count = job.polylinePoints.length; i < count; i += 1) {
      pointsString += job.polylinePoints[i].x + ',' + job.polylinePoints[i].y + ' ';
    }

    // Update the attributes of the polyline SVG element
    job.polyline.setAttribute('points', pointsString);
    job.polyline.setAttribute('stroke', 'hsl(' + job.currentHue + ',' + job.currentSaturation +
        '%,' + job.currentLightness + '%)');
    job.polyline.setAttribute('stroke-opacity', job.currentOpacity);
    job.polyline.setAttribute('stroke-width', job.lineWidth);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this LineAnimationJob as started.
   *
   * @this LineAnimationJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this LineAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this LineAnimationJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    job.ellapsedTime = currentTime - job.startTime;

    if (job.ellapsedTime >= job.duration) {
      handleCompletion.call(job);
      return;
    }

    updateColorValues.call(job);
    updateSegments.call(job);
    computeCornerGapPoints.call(job);
    computePolylinePoints.call(job);
  }

  /**
   * Draws the current state of this LineAnimationJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this LineAnimationJob
   */
  function draw() {
    var job = this;

    drawSegments.call(job);
  }

  /**
   * Stops this LineAnimationJob, and returns the element its original form.
   *
   * @this LineAnimationJob
   */
  function cancel() {
    var job;

    job = this;

    handleCompletion.call(job);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HexGrid} grid
   * @param {HexTile} tile
   * @param {number} corner
   * @param {number} direction
   * @param {number} forcedInitialRelativeDirection
   */
  function LineAnimationJob(grid, tile, corner, direction, forcedInitialRelativeDirection) {
    var job = this;

    job.grid = grid;
    job.tiles = [tile];
    job.corners = [corner];
    job.lowerNeighbors = [];
    job.upperNeighbors = [];
    job.lowerNeighborCorners = [];
    job.upperNeighborCorners = [];
    job.direction = direction;
    job.forcedInitialRelativeDirection = forcedInitialRelativeDirection;
    job.currentCornerIndex = 0;
    job.frontSegmentEndRatio = Number.NaN;
    job.backSegmentStartRatio = Number.NaN;
    job.latestDirection = direction;
    job.polyline = null;
    job.gapPoints = null;
    job.polylinePoints = null;
    job.hasReachedEdge = false;
    job.startTime = 0;
    job.ellapsedTime = 0;
    job.isComplete = false;

    job.startHue = Number.NaN;
    job.endHue = Number.NaN;
    job.currentHue = Number.NaN;

    job.duration = config.duration;
    job.lineWidth = config.lineWidth;
    job.lineLength = config.lineLength;
    job.lineSidePeriod = config.lineSidePeriod;

    job.startSaturation = config.startSaturation;
    job.startLightness = config.startLightness;
    job.startOpacity = config.startOpacity;

    job.endSaturation = config.endSaturation;
    job.endLightness = config.endLightness;
    job.endOpacity = config.endOpacity;

    job.sameDirectionProb = config.sameDirectionProb;

    job.currentSaturation = config.startSaturation;
    job.currentLightness = config.startLightness;
    job.currentOpacity = config.startOpacity;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;

    determineNeighbors.call(job);
    createHues.call(job);
    createPolyline.call(job);

    console.log('LineAnimationJob created: tileIndex=' + tile.index + ', corner=' + corner +
        ', direction=' + direction);
  }

  /**
   * Creates a LineAnimationJob that is initialized at a tile vertex along the border of the grid.
   *
   * @param {HexGrid} grid
   */
  function createRandomLineAnimationJob(grid) {
    var tile, corner, direction, forcedInitialRelativeDirection;

    // Pick a random border tile to start from
    tile = grid.borderTiles[parseInt(Math.random() * grid.borderTiles.length)];

    // Determine which corner and direction to use based on the selected tile
    if (grid.isVertical) {
      if (!tile.neighbors[4]) { // Left side
        if (tile.isInLargerRow) {
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 1;
          }
        } else { // Smaller row
          if (Math.random() < 0.5) {
            corner = 4;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 5;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 1;
          }
        }
        direction = tile.originalCenterY < grid.centerY ? 2 : 1;
      } else if (!tile.neighbors[1]) { // Right side
        if (tile.isInLargerRow) {
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 4;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          }
        } else { // Smaller row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          } else {
            corner = 2;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 4;
          }
        }
        direction = tile.originalCenterY < grid.centerY ? 4 : 5;
      } else if (!tile.neighbors[0]) { // Top side
        if (Math.random() < 0.5) {
          corner = 1;
          forcedInitialRelativeDirection = UPPER_SELF;
        } else {
          corner = 5;
          forcedInitialRelativeDirection = LOWER_SELF;
        }
        //forcedInitialAbsoluteDirection = 3;
        direction = 3;
      } else { // Bottom side
        if (Math.random() < 0.5) {
          corner = 2;
          forcedInitialRelativeDirection = LOWER_SELF;
        } else {
          corner = 4;
          forcedInitialRelativeDirection = UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 0;
        direction = 0;
      }
    } else { // Not vertical
      if (!tile.neighbors[0]) { // Top side
        if (tile.rowIndex === 0) { // First row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 3;
          } else {
            corner = 4;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          }
        } else { // Second row
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 5;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 3;
          }
        }
        direction = tile.originalCenterX < grid.centerX ? 2 : 3;
      } else if (!tile.neighbors[3]) { // Bottom side
        if (tile.rowIndex === grid.rowCount - 1) { // Last row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          } else {
            corner = 4;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 0;
          }
        } else { // Second-to-last row
          if (Math.random() < 0.5) {
            corner = 2;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 0;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          }
        }
        direction = tile.originalCenterX < grid.centerX ? 0 : 5;
      } else if (!tile.neighbors[4]) { // Left side
        if (Math.random() < 0.5) {
          corner = 3;
          forcedInitialRelativeDirection = LOWER_SELF;
        } else {
          corner = 5;
          forcedInitialRelativeDirection = UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 1;
        direction = 1;
      } else { // Right side
        if (Math.random() < 0.5) {
          corner = 0;
          forcedInitialRelativeDirection = LOWER_SELF;
        } else {
          corner = 2;
          forcedInitialRelativeDirection = UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 4;
        direction = 4;
      }
    }

    return new LineAnimationJob(grid, tile, corner, direction, forcedInitialRelativeDirection);
  }

  LineAnimationJob.config = config;
  LineAnimationJob.createRandomLineAnimationJob = createRandomLineAnimationJob;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.LineAnimationJob = LineAnimationJob;

  console.log('LineAnimationJob module loaded');
})();

'use strict';

/**
 * This module defines a constructor for LinesRadiateAnimationJob objects.
 *
 * @module LinesRadiateAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 900;
  config.lineWidth = 6;
  config.lineLength = 140;
  config.lineSidePeriod = 200; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 70;
  config.startOpacity = 0.8;

  config.endSaturation = 50;
  config.endLightness = 90;
  config.endOpacity = 0;

  config.sameDirectionProb = 0.85;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the individual LineAnimationJobs that comprise this LinesRadiateAnimationJob.
   *
   * @this LinesRadiateAnimationJob
   */
  function createLineAnimationJobs() {
    var job, i;

    job = this;
    job.lineAnimationJobs = [];

    for (i = 0; i < 6; i += 1) {
      job.lineAnimationJobs[i] = new hg.LineAnimationJob(job.grid, job.tile, i, i);

      // Replace the line animation's normal parameters with some that are specific to radiating
      // lines
      job.lineAnimationJobs[i].duration = config.duration;
      job.lineAnimationJobs[i].lineWidth = config.lineWidth;
      job.lineAnimationJobs[i].lineLength = config.lineLength;
      job.lineAnimationJobs[i].lineSidePeriod = config.lineSidePeriod;

      job.lineAnimationJobs[i].startSaturation = config.startSaturation;
      job.lineAnimationJobs[i].startLightness = config.startLightness;
      job.lineAnimationJobs[i].startOpacity = config.startOpacity;

      job.lineAnimationJobs[i].endSaturation = config.endSaturation;
      job.lineAnimationJobs[i].endLightness = config.endLightness;
      job.lineAnimationJobs[i].endOpacity = config.endOpacity;

      job.lineAnimationJobs[i].sameDirectionProb = config.sameDirectionProb;
    }
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   *
   * @this LinesRadiateAnimationJob
   */
  function checkForComplete() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      if (job.lineAnimationJobs[i].isComplete) {
        job.lineAnimationJobs.splice(i, 1);
      } else {
        return;
      }
    }

    console.log('LinesRadiateAnimationJob completed');

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this LinesRadiateAnimationJob as started.
   *
   * @this LinesRadiateAnimationJob
   */
  function start() {
    var job, i, count;

    job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      job.lineAnimationJobs[i].start();
    }
  }

  /**
   * Updates the animation progress of this LinesRadiateAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this LinesRadiateAnimationJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      job.lineAnimationJobs[i].update(currentTime, deltaTime);
    }

    checkForComplete.call(job);
  }

  /**
   * Draws the current state of this LinesRadiateAnimationJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this LinesRadiateAnimationJob
   */
  function draw() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      job.lineAnimationJobs[i].draw();
    }
  }

  /**
   * Stops this LinesRadiateAnimationJob, and returns the element its original form.
   *
   * @this LinesRadiateAnimationJob
   */
  function cancel() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      job.lineAnimationJobs[i].cancel();
    }

    job.lineAnimationJobs = [];

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HexGrid} grid
   * @param {HexTile} tile
   */
  function LinesRadiateAnimationJob(grid, tile) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.startTime = 0;
    job.isComplete = false;
    job.lineAnimationJobs = null;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;

    createLineAnimationJobs.call(job);

    console.log('LinesRadiateAnimationJob created: tileIndex=' + tile.index);
  }

  LinesRadiateAnimationJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.LinesRadiateAnimationJob = LinesRadiateAnimationJob;

  console.log('LinesRadiateAnimationJob module loaded');
})();

'use strict';

/**
 * This module defines a constructor for ShimmerRadiateAnimationJob objects.
 *
 * @module ShimmerRadiateAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   *
   * @this ShimmerRadiateAnimationJob
   */
  function checkForComplete() {
    var job = this;

    // TODO:
//    if (???) {
//      console.log('ShimmerRadiateAnimationJob completed');
//
//      job.isComplete = true;
//    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ShimmerRadiateAnimationJob as started.
   *
   * @this ShimmerRadiateAnimationJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO:
  }

  /**
   * Updates the animation progress of this ShimmerRadiateAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ShimmerRadiateAnimationJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    // TODO:

    checkForComplete.call(job);
  }

  /**
   * Draws the current state of this ShimmerRadiateAnimationJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ShimmerRadiateAnimationJob
   */
  function draw() {
    var job = this;

    // TODO:
  }

  /**
   * Stops this ShimmerRadiateAnimationJob, and returns the element its original form.
   *
   * @this ShimmerRadiateAnimationJob
   */
  function cancel() {
    var job = this;

    // TODO:

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HexGrid} grid
   */
  function ShimmerRadiateAnimationJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;

    console.log('ShimmerRadiateAnimationJob created');
  }

  ShimmerRadiateAnimationJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.ShimmerRadiateAnimationJob = ShimmerRadiateAnimationJob;

  console.log('ShimmerRadiateAnimationJob module loaded');
})();

'use strict';

/**
 * This module defines a constructor for WaveAnimationJob objects.
 *
 * WaveAnimationJob objects animate the tiles of a HexGrid in order to create a wave motion.
 *
 * @module WaveAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.period = 3200;
  config.tileDeltaX = -15;
  config.tileDeltaY = -config.tileDeltaX * Math.sqrt(3);
  config.wavelength = 1800;
  config.originX = 0;
  config.originY = 0;

  config.displacementWavelength =
      Math.sqrt(config.tileDeltaX * config.tileDeltaX +
          config.tileDeltaY * config.tileDeltaY);

  config.halfPeriod = config.period / 2;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates a wave offset value for each tile according to their positions in the grid.
   *
   * @this WaveAnimationJob
   */
  function initTileProgressOffsets() {
    var job, i, count, tile, length, deltaX, deltaY, halfWaveProgressWavelength;

    job = this;

    halfWaveProgressWavelength = config.wavelength / 2;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      tile = job.grid.tiles[i];

      deltaX = tile.originalCenterX - config.originX;
      deltaY = tile.originalCenterY - config.originY;
      length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + config.wavelength;

      tile.waveProgressOffset = -(length % config.wavelength - halfWaveProgressWavelength)
          / halfWaveProgressWavelength;
    }
  }

  /**
   * Updates the animation progress of the given tile.
   *
   * @this WaveAnimationJob
   * @param {number} progress
   * @param {HexTile} tile
   */
  function updateTile(progress, tile) {
    var job, tileProgress;

    job = this;

    tileProgress =
        Math.sin(((((progress + 1 + tile.waveProgressOffset) % 2) + 2) % 2 - 1) * Math.PI);

    tile.centerX = tile.originalCenterX + config.tileDeltaX * tileProgress;
    tile.centerY = tile.originalCenterY + config.tileDeltaY * tileProgress;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this WaveAnimationJob as started.
   *
   * @this WaveAnimationJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this WaveAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this WaveAnimationJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count;

    job = this;

    progress = (currentTime + config.halfPeriod) / config.period % 2 - 1;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      updateTile.call(job, progress, job.grid.tiles[i]);
    }
  }

  /**
   * Draws the current state of this WaveAnimationJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this WaveAnimationJob
   */
  function draw() {
    var job = this;
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this WaveAnimationJob, and returns the element its original form.
   *
   * @this WaveAnimationJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HexGrid} grid
   */
  function WaveAnimationJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = function () {
      initTileProgressOffsets.call(job);
    };

    job.init();

    console.log('WaveAnimationJob created');
  }

  WaveAnimationJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.WaveAnimationJob = WaveAnimationJob;

  console.log('WaveAnimationJob module loaded');
})();

'use strict';

/**
 * This module defines a singleton for animating things.
 *
 * The animator singleton handles the animation loop for the application and updates all
 * registered AnimationJobs during each animation frame.
 *
 * @module animator
 */
(function () {
  /**
   * @typedef {{start: Function, update: Function(number, number), draw: Function, cancel: Function, isComplete: boolean}} AnimationJob
   */

  var animator = {};
  var config = {};

  config.deltaTimeUpperThreshold = 200;

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * This is the animation loop that drives all of the animation.
   */
  function animationLoop() {
    var currentTime, deltaTime;

    currentTime = Date.now();
    deltaTime = currentTime - animator.previousTime;
    deltaTime = deltaTime > config.deltaTimeUpperThreshold ?
        config.deltaTimeUpperThreshold : deltaTime;
    animator.isLooping = true;

    if (!animator.isPaused) {
      updateJobs(currentTime, deltaTime);
      drawJobs();
      hg.util.requestAnimationFrame(animationLoop);
    } else {
      animator.isLooping = false;
    }

    animator.previousTime = currentTime;
  }

  /**
   * Updates all of the active AnimationJobs.
   *
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function updateJobs(currentTime, deltaTime) {
    var i, count;

    for (i = 0, count = animator.jobs.length; i < count; i += 1) {
      animator.jobs[i].update(currentTime, deltaTime);

      // Remove jobs from the list after they are complete
      if (animator.jobs[i].isComplete) {
        removeJob(animator.jobs[i], i);
        i--;
        count--;
      }
    }
  }

  /**
   * Removes the given job from the collection of active, animating jobs.
   *
   * @param {AnimationJob} job
   * @param {number} [index]
   */
  function removeJob(job, index) {
    var count;

    if (typeof index === 'number') {
      animator.jobs.splice(index, 1);
    } else {
      for (index = 0, count = animator.jobs.length; index < count; index += 1) {
        if (animator.jobs[index] === job) {
          animator.jobs.splice(index, 1);
          break;
        }
      }
    }

    // Stop the animation loop when there are no more jobs to animate
    if (animator.jobs.length === 0) {
      animator.isPaused = true;
    }
  }

  /**
   * Draws all of the active AnimationJobs.
   */
  function drawJobs() {
    var i, count;

    for (i = 0, count = animator.jobs.length; i < count; i += 1) {
      animator.jobs[i].draw();
    }
  }

  /**
   * Starts the animation loop if it is not already running
   */
  function startAnimationLoop() {
    animator.isPaused = false;
    if (!animator.isLooping) {
      animator.previousTime = Date.now();
      animationLoop();
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Starts the given AnimationJob.
   *
   * @param {AnimationJob} job
   */
  function startJob(job) {
    console.log('AnimationJob starting: ' + job.constructor.name);

    job.start();
    animator.jobs.push(job);

    startAnimationLoop();
  }

  /**
   * Cancels the given AnimationJob.
   *
   * @param {AnimationJob} job
   */
  function cancelJob(job) {
    console.log('AnimationJob cancelling: ' + job.constructor.name);

    job.cancel();
    removeJob(job);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  animator.jobs = [];
  animator.previousTime = Date.now();
  animator.isLooping = false;
  animator.isPaused = true;
  animator.startJob = startJob;
  animator.cancelJob = cancelJob;

  animator.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.animator = animator;

  console.log('animator module loaded');
})();
