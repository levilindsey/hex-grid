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

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

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
        annotations.grid.tiles[i].setColor(hg.HexGrid.config.tileHue + 80, hg.HexGrid.config.tileSaturation, hg.HexGrid.config.tileLightness);
      }
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
      annotations.grid.tiles[i].element.setAttribute('fill', 'transparent');
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

    line = document.createElementNS(hg.util.svgNamespace, 'line');
    line.setAttribute('x1', annotations.grid.contentAreaLeft);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', annotations.grid.contentAreaLeft);
    line.setAttribute('y2', annotations.grid.height);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');
    annotations.grid.svg.appendChild(line);

    line = document.createElementNS(hg.util.svgNamespace, 'line');
    line.setAttribute('x1', annotations.grid.contentAreaRight);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', annotations.grid.contentAreaRight);
    line.setAttribute('y2', annotations.grid.height);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');
    annotations.grid.svg.appendChild(line);
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
      annotations.tileParticleCenters[i].setAttribute('r', '2');
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
   * Updates the color of a dot at the center of each tile at its anchor position according to its
   * displacement from its original position.
   *
   * @this HexGridAnnotations
   */
  function updateTileAnchorCenterColorsWithDisplacement() {
    var annotations, i, count, deltaX, deltaY, angle, distance, colorString;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      deltaX = annotations.grid.tiles[i].centerX - annotations.grid.tiles[i].originalCenterX;
      deltaY = annotations.grid.tiles[i].centerY - annotations.grid.tiles[i].originalCenterY;
      angle = Math.atan2(deltaX, deltaY) * 180 / Math.PI;
      distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      colorString = 'hsl(' + angle + ',' +
          distance / hg.WaveAnimationJob.config.displacementWavelength * 100 + '%,80%)';

      annotations.tileAnchorCenters[i].setAttribute('fill', colorString);

      annotations.tileAnchorCenters[i].setAttribute('r', '80');
      annotations.tileAnchorCenters[i].setAttribute('opacity', '0.4');
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

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Computes spatial parameters of the tile annotations.
   *
   * @this HexGridAnnotations
   */
  function resize() {
    var annotations;

    annotations = this;

    fillContentTiles.call(annotations);
//    makeTilesTransparent.call(annotations);
    createTileAnchorCenters.call(annotations);
//    createTileParticleCenters.call(annotations);
//    createTileInnerRadii.call(annotations);
//    createTileOuterRadii.call(annotations);
//    createTileIndices.call(annotations);
    createTileVelocities.call(annotations);
    createTileForces.call(annotations);
//    createTileNeighborConnections.call(annotations);
//    drawContentAreaGuideLines.call(annotations);
  }

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * @this HexGridAnnotations
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var annotations;

    annotations = this;

    updateTileAnchorCenters.call(annotations);
//    updateTileAnchorCenterColorsWithDisplacement.call(annotations);
//    updateTileParticleCenters.call(annotations);
//    updateTileInnerRadii.call(annotations);
//    updateTileOuterRadii.call(annotations);
//    updateTileIndices.call(annotations);
    updateTileForces.call(annotations);
    updateTileVelocities.call(annotations);
//    updateTileNeighborConnections.call(annotations);
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

    annotations.update = update;
    annotations.resize = resize;
  }

  HexGridAnnotations.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.HexGridAnnotations = HexGridAnnotations;

  console.log('HexGridAnnotations module loaded');
})();
