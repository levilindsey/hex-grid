'use strict';

/**
 * This module defines a constructor for HexGrid objects.
 *
 * @module HexGrid
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // TODO:
  // - update the tile radius and the targetContentAreaWidth with the screen width
  //   - we should always have the same number of content tiles in a given row

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
  config.contentDensity = 0.65;

  config.sqrtThreeOverTwo = Math.sqrt(3) / 2;
  config.twoOverSqrtThree = 2 / Math.sqrt(3);

  config.actualContentAreaWidth = config.targetContentAreaWidth;

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
   */
  function computeGridParameters() {
    var grid, parentHalfWidth, parentHeight;

    grid = this;

    parentHalfWidth = grid.parent.clientWidth * 0.5;
    parentHeight = grid.parent.clientHeight;

    grid.contentAreaLeft = parentHalfWidth - grid.actualContentAreaWidth * 0.5;
    grid.contentAreaRight = grid.contentAreaLeft + grid.actualContentAreaWidth;

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

    if (grid.isVertical) {
      grid.oddRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.oddRowXOffset - config.tileInnerRadius)) / config.tileDeltaX);
      grid.evenRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.evenRowXOffset - config.tileInnerRadius)) / config.tileDeltaX);
    } else {
      grid.oddRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.oddRowXOffset - config.tileOuterRadius)) / config.tileDeltaX);
      grid.evenRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.evenRowXOffset - config.tileOuterRadius)) / config.tileDeltaX);
    }

    grid.oddRowContentTileCount = grid.oddRowTileCount - grid.oddRowContentStartIndex * 2;
    grid.evenRowContentTileCount = grid.evenRowTileCount - grid.evenRowContentStartIndex * 2;

    grid.oddRowContentEndIndex = grid.oddRowContentStartIndex + grid.oddRowContentTileCount - 1;
    grid.evenRowContentEndIndex = grid.evenRowContentStartIndex + grid.evenRowContentTileCount - 1;

    **;// TODO: compute grid.innerIndexOfLastContentTile (don't forget that these indices are only representing the tiles WITHIN THE CONTENT COLUMN)
  }

  /**
   * Calculates the tile indices within the content area column that will represent tiles with
   * content.
   */
  function computeContentIndices() {
    var grid, i, j, count, tilesRepresentation;

    grid = this;

    // Copy the original data
    tilesRepresentation = [];
    count = grid.tileData.length;
    for (i = 0; i < count; i += 1) {
      tilesRepresentation[i] = grid.tileData[i];
    }

    // Add empty elements
    count = (1 / config.contentDensity) * grid.tileData.length;
    for (i = grid.tileData.length; i < count; i += 1) {
      tilesRepresentation[i] = null;
    }

    tilesRepresentation = hg.util.shuffle(tilesRepresentation);

    // Record the resulting indices of the elements representing tile content
    grid.contentInnerIndices = [];
    for (i = 0, j = 0, count = tilesRepresentation.length; i < count; i += 1) {
      if (tilesRepresentation[i]) {
        grid.contentInnerIndices[j++] = tilesRepresentation[i];
      }
    }
  }

  /**
   * Creates the SVG element for the grid.
   */
  function createSvg() {
    var grid;

    grid = this;

    grid.svg = document.createElementNS(hg.util.svgNamespace, 'svg');
    grid.svg.style.position = 'relative';
    grid.svg.style.width = '100%';
    grid.svg.style.height = '100%';
    grid.svg.style.zIndex = '2147483647';
    grid.svg.style.backgroundColor =
        'hsl(' + grid.hue + ',' + grid.saturation + '%,' + grid.lightness + '%)';
    grid.parent.appendChild(grid.svg);

    grid.svgDefs = document.createElementNS(hg.util.svgNamespace, 'defs');
    grid.svg.appendChild(grid.svgDefs);
  }

  /**
   * Creates the tile elements for the grid.
   */
  function createTiles() {
    var grid, tileIndex, rowIndex, rowCount, columnIndex, columnCount, centerX, centerY,
        isMarginTile;

    grid = this;

    grid.tiles = [];
    tileIndex = 0;
    centerY = config.firstRowYOffset;
    rowCount = grid.rowCount;

    for (rowIndex = 0; rowIndex < rowCount; rowIndex += 1, centerY += grid.rowDeltaY) {
      if (rowIndex % 2 === 0) {
        centerX = grid.oddRowXOffset;
        columnCount = grid.oddRowTileCount;
      } else {
        centerX = grid.evenRowXOffset;
        columnCount = grid.evenRowTileCount;
      }

      for (columnIndex = 0; columnIndex < columnCount;
           tileIndex += 1, columnIndex += 1, centerX += grid.tileDeltaX) {
        isMarginTile = **;// TODO:
        grid.tiles[tileIndex] = new hg.HexTile(grid.svg, centerX, centerY, config.tileOuterRadius,
            grid.isVertical, config.tileHue, config.tileSaturation, config.tileLightness, null,
            tileIndex, isMarginTile);
      }
    }

    addContentToTiles.call(grid);
    setNeighborTiles.call(grid);
  }

  /**
   * Adds content to the appropriate tiles.
   */
  function addContentToTiles() {
    var grid, i, count;

    grid = this;

    **;// TODO: don't forget that these indices are only representing the tiles WITHIN THE CONTENT COLUMN
    // - use grid.contentInnerIndices
    // - also, be sure to set

    // // TODO: add actual tile content
    // tile.setContent({});
    // config.contentDensity
  }

  /**
   * Connects each tile with references to its neighbors.
   */
  function setNeighborTiles() {
    var grid, i, count, neighborTiles;

    grid = this;

    // TODO:

    // tile.setNeighborTiles(neighborTiles)
  }

  /**
   * Starts animating the tiles of the grid.
   */
  function startAnimating() {
    var grid;

    grid = this;

    // TODO:
    // hg.animator.createJob
    // hg.animator.startJob
  }

  /**
   * Event listener for the window resize event.
   *
   * Computes spatial parameters of the tiles in the grid.
   */
  function onWindowResize() {
    var grid;

    grid = this;

    config.actualContentAreaWidth = grid.parent.clientWidth < config.targetContentAreaWidth ?
        grid.parent.clientWidth : config.targetContentAreaWidth;

    clearSvg.call(grid);

    computeGridParameters.call(grid);
    createTiles.call(grid);

    drawContentTiles.call(grid);
    drawTileCenters.call(grid);
//    drawTileInnerRadii.call(grid);
//    drawTileOuterRadii.call(grid);
    drawTileIndices.call(grid);
    drawContentAreaGuideLines.call(grid);

    logGridInfo.call(grid);
  }

  /**
   * Removes all content from the SVG.
   */
  function clearSvg() {
    var grid, svg;

    grid = this;
    svg = grid.svg;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  }

  /**
   * Draws vertical guidelines along the left and right sides of the main content area.
   *
   * This is useful for testing purposes.
   */
  function drawContentAreaGuideLines() {
    var grid, line;

    grid = this;

    line = document.createElementNS(hg.util.svgNamespace, 'line');
    line.setAttribute('x1', grid.contentAreaLeft);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', grid.contentAreaLeft);
    line.setAttribute('y2', grid.parent.clientHeight);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');
    grid.svg.appendChild(line);

    line = document.createElementNS(hg.util.svgNamespace, 'line');
    line.setAttribute('x1', grid.contentAreaRight);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', grid.contentAreaRight);
    line.setAttribute('y2', grid.parent.clientHeight);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');
    grid.svg.appendChild(line);
  }

  /**
   * Draws a dot at the center of each tile.
   *
   * This is useful for testing purposes.
   */
  function drawTileCenters() {
    var grid, i, count, tile, circle;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      tile = grid.tiles[i];
      circle = document.createElementNS(hg.util.svgNamespace, 'circle');
      circle.setAttribute('cx', tile.centerX);
      circle.setAttribute('cy', tile.centerY);
      circle.setAttribute('r', '2');
      circle.setAttribute('fill', 'gray');
      grid.svg.appendChild(circle);
    }
  }

  /**
   * Draws the inner radius of each tile.
   *
   * This is useful for testing purposes.
   */
  function drawTileInnerRadii() {
    var grid, i, count, tile, circle;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      tile = grid.tiles[i];
      circle = document.createElementNS(hg.util.svgNamespace, 'circle');
      circle.setAttribute('cx', tile.centerX);
      circle.setAttribute('cy', tile.centerY);
      circle.setAttribute('r', tile.outerRadius * config.sqrtThreeOverTwo);
      circle.setAttribute('stroke', 'blue');
      circle.setAttribute('stroke-width', '1');
      circle.setAttribute('fill', 'transparent');
      grid.svg.appendChild(circle);
    }
  }

  /**
   * Draws the outer radius of each tile.
   *
   * This is useful for testing purposes.
   */
  function drawTileOuterRadii() {
    var grid, i, count, tile, circle;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      tile = grid.tiles[i];
      circle = document.createElementNS(hg.util.svgNamespace, 'circle');
      circle.setAttribute('cx', tile.centerX);
      circle.setAttribute('cy', tile.centerY);
      circle.setAttribute('r', tile.outerRadius);
      circle.setAttribute('stroke', 'green');
      circle.setAttribute('stroke-width', '1');
      circle.setAttribute('fill', 'transparent');
      grid.svg.appendChild(circle);
    }
  }

  /**
   * Draws the index of each tile.
   *
   * This is useful for testing purposes.
   */
  function drawTileIndices() {
    var grid, i, count, tile, text;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      tile = grid.tiles[i];
      text = document.createElementNS(hg.util.svgNamespace, 'text');
      text.setAttribute('x', tile.centerX - 10);
      text.setAttribute('y', tile.centerY + 6);
      text.setAttribute('font-size', '16');
      text.setAttribute('fill', 'black');
      text.innerHTML = tile.index;
      grid.svg.appendChild(text);
    }
  }

  /**
   * Draws content tiles with a different color.
   *
   * This is useful for testing purposes.
   */
  function drawContentTiles() {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      if (grid.tiles[i].holdsContent) {
        grid.tiles[i].setColor(config.tileHue + 80, config.tileSaturation, config.tileLightness);
      }
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
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

    grid.actualContentAreaWidth = config.actualContentAreaWidth;
    grid.hue = config.backgroundHue;
    grid.saturation = config.backgroundSaturation;
    grid.lightness = config.backgroundLightness;

    grid.svg = null;
    grid.tiles = null;
    grid.contentInnerIndices = null;
    grid.innerIndexOfLastContentTile = null;

    createSvg.call(grid);
    computeContentIndices.call(grid);
    onWindowResize.call(grid);
    startAnimating.call(grid);

    window.addEventListener('resize', onWindowResize.bind(grid), false);
  }

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

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's factory function

  /**
   * @global
   * @param {HTMLElement} parent
   * @param {Array.<Object>} tileData
   * @param {boolean} isVertical
   * @returns {HexGrid}
   */
  function createNewHexGrid(parent, tileData, isVertical) {
    return new HexGrid(parent, tileData, isVertical);
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.createNewHexGrid = createNewHexGrid;

  console.log('HexGrid module loaded');
})();
