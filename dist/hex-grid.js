'use strict';

/**
 * This module defines a constructor for AnimationJob objects.
 *
 * @module AnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

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

  /**
   * Sets the given class on the given element. The class describes an animation state:
   * waiting-to-animate, is-animating, done-animating
   *
   * @param {HTMLElement} element
   * @param {'waiting-to-animate'|'is-animating'|'done-animating'} animatingClass
   */
  function setAnimatingClassOnElement(element, animatingClass) {
    hg.util.removeClass(element, 'waiting-to-animate');
    hg.util.removeClass(element, 'is-animating');
    hg.util.removeClass(element, 'done-animating');
    hg.util.addClass(element, animatingClass);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this AnimationJob as started.
   */
  function start() {
    var job = this;

    console.log('AnimationJob starting');

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO:
  }

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   */
  function update(currentTime) {
    var job = this;

    // TODO:

    checkForComplete.call(job);
  }

  /**
   * Stops this AnimationJob, and returns the element its original form.
   */
  function cancel() {
    var job = this;

    console.log('AnimationJob cancelling');

    // TODO:

    job.onComplete(false);

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} element
   * @param {number} duration In milliseconds.
   * @param {string} easingFunctionName
   * @param {Function} animationFunction
   * @param {Function} onComplete
   */
  function AnimationJob(element, duration, easingFunctionName, animationFunction, onComplete) {
    var job = this;

    job.element = element;
    job.duration = duration;
    job.animationFunction = animationFunction;
    job.startTime = 0;
    job.isComplete = false;

    job.easingFunction = hg.util.easingFunctions[easingFunctionName];
    job.start = start;
    job.update = update;
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
  config.contentDensity = 0.6;
  config.emptyInitialRowCount = 2;

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
   */
  function computeGridParameters() {
    var grid, parentHalfWidth, parentHeight, innerContentCount, rowIndex, i, count,
        emptyRowsContentTileCount, minInnerTileCount;

    grid = this;

    parentHalfWidth = grid.parent.clientWidth * 0.5;
    parentHeight = grid.parent.clientHeight;

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
    emptyRowsContentTileCount = Math.ceil(config.emptyInitialRowCount / 2) * grid.oddRowContentTileCount +
        Math.floor(config.emptyInitialRowCount / 2) * grid.evenRowContentTileCount;
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
   */
  function createTiles() {
    var grid, tileIndex, rowIndex, rowCount, columnIndex, columnCount, centerX, centerY,
        isMarginTile, isOddRow, contentAreaIndex, tileDataIndex;

    grid = this;

    grid.tiles = [];
    tileIndex = 0;
    contentAreaIndex = 0;
    tileDataIndex = 0;
    centerY = config.firstRowYOffset;
    rowCount = grid.rowCount;

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

        grid.tiles[tileIndex] = new hg.HexTile(grid.svg, centerX, centerY, config.tileOuterRadius,
            grid.isVertical, config.tileHue, config.tileSaturation, config.tileLightness, null,
            tileIndex, isMarginTile);

        if (!isMarginTile) {
          if (contentAreaIndex === grid.actualContentInnerIndices[tileDataIndex]) {
            grid.tiles[tileIndex].setContent(grid.tileData[tileDataIndex]);
            tileDataIndex += 1;
          }
          contentAreaIndex += 1;
        }
      }
    }

    setNeighborTiles.call(grid);
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

    grid.actualContentAreaWidth = grid.parent.clientWidth < config.targetContentAreaWidth ?
        grid.parent.clientWidth : config.targetContentAreaWidth;

    clearSvg.call(grid);

    computeGridParameters.call(grid);
    createTiles.call(grid);

    grid.svg.style.height = grid.height + 'px';

    drawContentTiles.call(grid);
//    drawTileCenters.call(grid);
//    drawTileInnerRadii.call(grid);
//    drawTileOuterRadii.call(grid);
//    drawTileIndices.call(grid);
//    drawContentAreaGuideLines.call(grid);

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
    line.setAttribute('y2', grid.height);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');
    grid.svg.appendChild(line);

    line = document.createElementNS(hg.util.svgNamespace, 'line');
    line.setAttribute('x1', grid.contentAreaRight);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', grid.contentAreaRight);
    line.setAttribute('y2', grid.height);
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
    grid.originalContentInnerIndices = null;
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

'use strict';

/**
 * This module defines a constructor for HexTile objects.
 *
 * @module HexTile
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var deltaTheta, verticalStartTheta, verticalSines, verticalCosines, horizontalSines,
      horizontalCosines;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the polygon element for the tile.
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
   * @param {Array.<HexTile>} neighborTiles
   */
  function setNeighborTiles(neighborTiles) {
    var tile = this;

    tile.neighborTiles = neighborTiles;
  }

  /**
   * Sets this tile's vertex coordinates.
   *
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
   * @param {boolean} isMarginTile
   */
  function HexTile(svg, centerX, centerY, outerRadius, isVertical, hue, saturation, lightness,
                   tileData, tileIndex, isMarginTile) {
    var tile = this;

    tile.svg = svg;
    tile.element = null;
    tile.centerX = centerX;
    tile.centerY = centerY;
    tile.outerRadius = outerRadius;
    tile.isVertical = isVertical;
    tile.hue = hue;
    tile.saturation = saturation;
    tile.lightness = lightness;
    tile.tileData = tileData;
    tile.holdsContent = !!tileData;
    tile.index = tileIndex;
    tile.isMarginTile = isMarginTile;
    tile.neighborTiles = null;
    tile.vertices = null;

    tile.setContent = setContent;
    tile.setNeighborTiles = setNeighborTiles;
    tile.setColor = setColor;
    tile.setVertices = setVertices;

    createElement.call(tile);
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.HexTile = HexTile;

  initStaticFields();

  console.log('HexTile module loaded');
})();

'use strict';

/**
 * This module defines a singleton for animating things.
 *
 * @module animator
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * This is the animation loop that drives all of the animation.
   */
  function animationLoop() {
    var currentTime = Date.now();
    animator.isLooping = true;

    if (!animator.isPaused) {
      updateJobs(currentTime);
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
   */
  function updateJobs(currentTime) {
    var i, count;

    for (i = 0, count = animator.jobs.length; i < count; i += 1) {
      animator.jobs[i].update(currentTime);

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

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Creates a new AnimationJob.
   *
   * @param {HTMLElement} element
   * @param {number} duration In milliseconds.
   * @param {string} easingFunctionName
   * @param {Function} animationFunction
   * @param {Function} onComplete
   * @returns {Window.hg.AnimationJob}
   */
  function createJob(element, duration, easingFunctionName, animationFunction, onComplete) {
    // Just make sure that any state that should be completed from a previous animation is ready
    animationLoop();

    return new hg.AnimationJob(element, duration, easingFunctionName, animationFunction,
        onComplete);
  }

  /**
   * Starts the given AnimationJob.
   *
   * @param {AnimationJob} job
   */
  function startJob(job) {
    job.start();
    animator.jobs.push(job);

    // Start the animation loop if it were not already running
    animator.isPaused = false;
    if (!animator.isLooping) {
      animationLoop();
    }
  }

  /**
   * Cancels the given AnimationJob.
   *
   * @param {AnimationJob} job
   */
  function cancelJob(job) {
    job.cancel();
    removeJob(job);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  var animator = {};
  animator.jobs = [];
  animator.createJob = createJob;
  animator.startJob = startJob;
  animator.cancelJob = cancelJob;
  animator.isPaused = true;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.animator = animator;

  console.log('animator module loaded');
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
   * @function util.listenToMultipleForMultiple
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
   * @function util.createElement
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
   * @function util~containsClass
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
   * @function util.toggleClass
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
   * @function util.getPageOffset
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
   * @function util.getViewportSize
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
   * @function util.removeChildIfPresent
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
   * @function util.addClass
   * @param {HTMLElement} element The element to add the class to.
   * @param {String} className The class to add.
   */
  function addClass(element, className) {
    element.className += ' ' + className;
  }

  /**
   * Removes the given class from the given element.
   * @function util.removeClass
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
   * @function util.clearClasses
   * @param {HTMLElement} element The element to remove all classes from.
   */
  function clearClasses(element) {
    element.className = '';
  }

  /**
   * Calculates the width that the DOM would give to a div with the given text. The given tag
   * name, parent, id, and classes allow the width to be affected by various CSS rules.
   * @function util.getTextWidth
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
   * @function util.encodeQueryString
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
   * (borrowed from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript)
   * @function util.getQueryStringParameterValue
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
   * @function util.setTransitionDurationSeconds
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
   * @function util.setTransitionDelaySeconds
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
   * @function util.removeChildrenWithClass
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
    svgNamespace: 'http://www.w3.org/2000/svg'
  };

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.util = util;

  console.log('util module loaded');
})();
