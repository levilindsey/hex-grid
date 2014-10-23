/**
 * @typedef {AnimationJob} Annotations
 */

/**
 * This module defines a constructor for Annotations objects.
 *
 * Annotations objects creates and modifies visual representations of various aspects of a
 * Grid. This can be very useful for testing purposes.
 *
 * @module Annotations
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.forceLineLengthMultiplier = 4000;
  config.velocityLineLengthMultiplier = 300;

  config.contentTileHue = 187;
  config.contentTileSaturation = 50;
  config.contentTileLightness = 30;

  config.borderTileHue = 267;
  config.borderTileSaturation = 0;
  config.borderTileLightness = 30;

  config.cornerTileHue = 267;
  config.cornerTileSaturation = 50;
  config.cornerTileLightness = 30;

  config.annotations = {
    'contentTiles': {
      enabled: true,
      create: fillContentTiles,
      destroy: unfillContentTiles,
      update: fillContentTiles
    },
    'borderTiles': {
      enabled: false,
      create: fillBorderTiles,
      destroy: unfillBorderTiles,
      update: fillBorderTiles
    },
    'cornerTiles': {
      enabled: false,
      create: fillCornerTiles,
      destroy: unfillCornerTiles,
      update: fillCornerTiles
    },
    'transparentTiles': {
      enabled: false,
      create: makeTilesTransparent,
      destroy: makeTilesVisible,
      update: function () {/* Do nothing */}
    },
    'tileAnchorCenters': {
      enabled: false,
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
      enabled: false,
      create: createTileForces,
      destroy: destroyTileForces,
      update: updateTileForces
    },
    'tileVelocities': {
      enabled: false,
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
      enabled: false,
      create: function () {/* Do nothing */},
      destroy: destroyLineAnimationGapPoints,
      update:  updateLineAnimationGapPoints
    },
    'lineAnimationCornerData': {
      enabled: false,
      create: function () {/* Do nothing */},
      destroy: destroyLineAnimationCornerConfigurations,
      update:  updateLineAnimationCornerConfigurations
    },
    'sectorColors': {
      enabled: true,
      create: fillSectorColors,
      destroy: unfillSectorColors,
      update: fillSectorColors
    },
    'panCenterPoints': {
      enabled: true,
      create: createPanCenterPoints,
      destroy: destroyPanCenterPoints,
      update: updatePanCenterPoints
    }
  };

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // --------------------------------------------------- //
  // Annotation creation functions

  /**
   * Draws content tiles with a different color.
   *
   * @this Annotations
   */
  function fillContentTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.originalTiles.length; i < count; i += 1) {
      if (annotations.grid.originalTiles[i].holdsContent) {
        annotations.grid.originalTiles[i].currentHue = config.contentTileHue;
        annotations.grid.originalTiles[i].currentSaturation = config.contentTileSaturation;
        annotations.grid.originalTiles[i].currentLightness = config.contentTileLightness;
      }
    }
  }

  /**
   * Draws border tiles with a different color.
   *
   * @this Annotations
   */
  function fillBorderTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.borderTiles.length; i < count; i += 1) {
      annotations.grid.originalTiles[i].currentHue = config.borderTileHue;
      annotations.grid.originalTiles[i].currentSaturation = config.borderTileSaturation;
      annotations.grid.originalTiles[i].currentLightness = config.borderTileLightness;
    }
  }

  /**
   * Draws corner tiles with a different color.
   *
   * @this Annotations
   */
  function fillCornerTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.borderTiles.length; i < count; i += 1) {
      if (annotations.grid.borderTiles[i].isCornerTile) {
        annotations.grid.originalTiles[i].currentHue = config.cornerTileHue;
        annotations.grid.originalTiles[i].currentSaturation = config.cornerTileSaturation;
        annotations.grid.originalTiles[i].currentLightness = config.cornerTileLightness;
      }
    }
  }

  /**
   * Draws all of the tiles as transparent.
   *
   * @this Annotations
   */
  function makeTilesTransparent() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.grid.allTiles[i].element.setAttribute('opacity', '0');
    }
  }

  /**
   * Draws vertical guidelines along the left and right sides of the main content area.
   *
   * @this Annotations
   */
  function drawContentAreaGuideLines() {
    var annotations, line;

    annotations = this;
    annotations.contentAreaGuideLines = [];

    line = document.createElementNS(window.hg.util.svgNamespace, 'line');
    annotations.grid.svg.appendChild(line);
    annotations.contentAreaGuideLines[0] = line;

    line.setAttribute('x1', annotations.grid.contentAreaLeft);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', annotations.grid.contentAreaLeft);
    line.setAttribute('y2', annotations.grid.height);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');

    line = document.createElementNS(window.hg.util.svgNamespace, 'line');
    annotations.grid.svg.appendChild(line);
    annotations.contentAreaGuideLines[1] = line;

    line.setAttribute('x1', annotations.grid.contentAreaRight);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', annotations.grid.contentAreaRight);
    line.setAttribute('y2', annotations.grid.height);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');
  }

  /**
   * Creates a dot at the center of each tile at its current position.
   *
   * @this Annotations
   */
  function createTileParticleCenters() {
    var annotations, i, count;

    annotations = this;
    annotations.tileParticleCenters = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileParticleCenters[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileParticleCenters[i]);

      annotations.tileParticleCenters[i].setAttribute('r', '4');
      annotations.tileParticleCenters[i].setAttribute('fill', 'gray');
    }
  }

  /**
   * Creates a dot at the center of each tile at its currentAnchor position.
   *
   * @this Annotations
   */
  function createTileAnchorCenters() {
    var annotations, i, count;

    annotations = this;
    annotations.tileAnchorLines = [];
    annotations.tileAnchorCenters = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileAnchorLines[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'line');
      annotations.grid.svg.appendChild(annotations.tileAnchorLines[i]);

      annotations.tileAnchorLines[i].setAttribute('stroke', '#666666');
      annotations.tileAnchorLines[i].setAttribute('stroke-width', '2');

      annotations.tileAnchorCenters[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileAnchorCenters[i]);

      annotations.tileAnchorCenters[i].setAttribute('r', '4');
      annotations.tileAnchorCenters[i].setAttribute('fill', '#888888');
    }
  }

  /**
   * Creates a circle over each tile at its currentAnchor position, which will be used to show colors
   * that indicate its displacement from its original position.
   *
   * @this Annotations
   */
  function createTileDisplacementColors() {
    var annotations, i, count;

    annotations = this;
    annotations.tileDisplacementCircles = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileDisplacementCircles[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileDisplacementCircles[i]);

      annotations.tileDisplacementCircles[i].setAttribute('r', '80');
      annotations.tileDisplacementCircles[i].setAttribute('opacity', '0.4');
      annotations.tileDisplacementCircles[i].setAttribute('fill', 'white');
    }
  }

  /**
   * Creates the inner radius of each tile.
   *
   * @this Annotations
   */
  function createTileInnerRadii() {
    var annotations, i, count;

    annotations = this;
    annotations.tileInnerRadii = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileInnerRadii[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileInnerRadii[i]);

      annotations.tileInnerRadii[i].setAttribute('stroke', 'blue');
      annotations.tileInnerRadii[i].setAttribute('stroke-width', '1');
      annotations.tileInnerRadii[i].setAttribute('fill', 'transparent');
    }
  }

  /**
   * Creates the outer radius of each tile.
   *
   * @this Annotations
   */
  function createTileOuterRadii() {
    var annotations, i, count;

    annotations = this;
    annotations.tileOuterRadii = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileOuterRadii[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileOuterRadii[i]);

      annotations.tileOuterRadii[i].setAttribute('stroke', 'green');
      annotations.tileOuterRadii[i].setAttribute('stroke-width', '1');
      annotations.tileOuterRadii[i].setAttribute('fill', 'transparent');
    }
  }

  /**
   * Creates lines connecting each tile to each of its neighborStates.
   *
   * @this Annotations
   */
  function createTileNeighborConnections() {
    var annotations, i, j, iCount, jCount, tile, neighborStates, neighbor;

    annotations = this;
    annotations.neighborLines = [];

    for (i = 0, iCount = annotations.grid.allTiles.length; i < iCount; i += 1) {
      tile = annotations.grid.allTiles[i];
      neighborStates = tile.getNeighborStates();
      annotations.neighborLines[i] = [];

      for (j = 0, jCount = neighborStates.length; j < jCount; j += 1) {
        neighbor = neighborStates[j];

        if (neighbor) {
          annotations.neighborLines[i][j] =
              document.createElementNS(window.hg.util.svgNamespace, 'line');
          annotations.grid.svg.appendChild(annotations.neighborLines[i][j]);

          annotations.neighborLines[i][j].setAttribute('stroke', 'purple');
          annotations.neighborLines[i][j].setAttribute('stroke-width', '1');
        }
      }
    }
  }

  /**
   * Creates lines representing the cumulative force acting on each tile.
   *
   * @this Annotations
   */
  function createTileForces() {
    var annotations, i, count;

    annotations = this;
    annotations.forceLines = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.forceLines[i] = document.createElementNS(window.hg.util.svgNamespace, 'line');
      annotations.grid.svg.appendChild(annotations.forceLines[i]);

      annotations.forceLines[i].setAttribute('stroke', 'orange');
      annotations.forceLines[i].setAttribute('stroke-width', '2');
    }
  }

  /**
   * Creates lines representing the velocity of each tile.
   *
   * @this Annotations
   */
  function createTileVelocities() {
    var annotations, i, count;

    annotations = this;
    annotations.velocityLines = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.velocityLines[i] = document.createElementNS(window.hg.util.svgNamespace, 'line');
      annotations.grid.svg.appendChild(annotations.velocityLines[i]);

      annotations.velocityLines[i].setAttribute('stroke', 'red');
      annotations.velocityLines[i].setAttribute('stroke-width', '2');
    }
  }

  /**
   * Creates the index of each tile.
   *
   * @this Annotations
   */
  function createTileIndices() {
    var annotations, i, count;

    annotations = this;
    annotations.indexTexts = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.indexTexts[i] = document.createElementNS(window.hg.util.svgNamespace, 'text');
      annotations.indexTexts[i].innerHTML =
          !isNaN(annotations.grid.allTiles[i].index) ? annotations.grid.allTiles[i].index : '?';
      annotations.grid.svg.appendChild(annotations.indexTexts[i]);

      annotations.indexTexts[i].setAttribute('font-size', '16');
      annotations.indexTexts[i].setAttribute('fill', 'black');
      annotations.indexTexts[i].setAttribute('pointer-events', 'none');
    }
  }

  /**
   * Draws the tiles of each Sector with a different color.
   *
   * @this Annotations
   */
  function fillSectorColors() {
    var annotations, i, iCount, j, jCount, sector, sectorHue;

    annotations = this;

    if (annotations.grid.sectors) {
      for (i = 0, iCount = annotations.grid.sectors.length; i < iCount; i += 1) {
        sector = annotations.grid.sectors[i];
        sectorHue = 60 * i + 20;

        for (j = 0, jCount = sector.tiles.length; j < jCount; j += 1) {
          sector.tiles[j].setColor(sectorHue, window.hg.Grid.config.tileSaturation,
              window.hg.Grid.config.tileLightness);
        }
      }
    }
  }

  /**
   * Creates a dot at the center of the grid, the center of the viewport, and highlights the base tile for the current
   * pan.
   *
   * @this Annotations
   */
  function createPanCenterPoints() {
    var annotations;

    annotations = this;

    // Current grid center dot
    annotations.currentGridCenterDot = document.createElementNS(window.hg.util.svgNamespace, 'circle');
    annotations.grid.svg.appendChild(annotations.currentGridCenterDot);

    annotations.currentGridCenterDot.setAttribute('r', '8');
    annotations.currentGridCenterDot.setAttribute('fill', 'chartreuse');

    // Current pan center dot
    annotations.panCenterDot = document.createElementNS(window.hg.util.svgNamespace, 'circle');
    annotations.grid.svg.appendChild(annotations.panCenterDot);

    annotations.panCenterDot.setAttribute('r', '5');
    annotations.panCenterDot.setAttribute('fill', 'red');

    // Original grid center dot
    annotations.originalGridCenterDot = document.createElementNS(window.hg.util.svgNamespace, 'circle');
    annotations.grid.svg.appendChild(annotations.originalGridCenterDot);

    annotations.originalGridCenterDot.setAttribute('r', '2');
    annotations.originalGridCenterDot.setAttribute('fill', 'yellow');
  }

  // --------------------------------------------------- //
  // Annotation destruction functions

  /**
   * Draws content tiles with a different color.
   *
   * @this Annotations
   */
  function unfillContentTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.originalTiles.length; i < count; i += 1) {
      if (annotations.grid.originalTiles[i].holdsContent) {
        annotations.grid.originalTiles[i].setColor(window.hg.Grid.config.tileHue,
            window.hg.Grid.config.tileSaturation, window.hg.Grid.config.tileLightness);
      }
    }
  }

  /**
   * Draws border tiles with a different color.
   *
   * @this Annotations
   */
  function unfillBorderTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.borderTiles.length; i < count; i += 1) {
      annotations.grid.borderTiles[i].setColor(window.hg.Grid.config.tileHue,
          window.hg.Grid.config.tileSaturation, window.hg.Grid.config.tileLightness);
    }
  }

  /**
   * Draws corner tiles with a different color.
   *
   * @this Annotations
   */
  function unfillCornerTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.borderTiles.length; i < count; i += 1) {
      if (annotations.grid.borderTiles[i].isCornerTile) {
        annotations.grid.borderTiles[i].setColor(window.hg.Grid.config.tileHue,
            window.hg.Grid.config.tileSaturation, window.hg.Grid.config.tileLightness);
      }
    }
  }

  /**
   * Draws all of the tiles as transparent.
   *
   * @this Annotations
   */
  function makeTilesVisible() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.originalTiles.length; i < count; i += 1) {
      annotations.grid.originalTiles[i].element.setAttribute('opacity', '1');
    }
  }

  /**
   * Draws vertical guidelines along the left and right sides of the main content area.
   *
   * @this Annotations
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
   * @this Annotations
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
   * Destroys a dot at the center of each tile at its currentAnchor position.
   *
   * @this Annotations
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
   * Destroys a circle over each tile at its currentAnchor position, which will be used to show colors
   * that indicate its displacement from its original position.
   *
   * @this Annotations
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
   * @this Annotations
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
   * @this Annotations
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
   * Destroys lines connecting each tile to each of its neighborStates.
   *
   * @this Annotations
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
   * @this Annotations
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
   * @this Annotations
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
   * @this Annotations
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
   * @this Annotations
   */
  function destroyLineAnimationGapPoints() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.lineAnimationGapDots.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationGapDots[i]);
    }

    annotations.lineAnimationGapDots = [];
  }

  /**
   * Destroys annotations describing the corner configurations of each line animation.
   *
   * @this Annotations
   */
  function destroyLineAnimationCornerConfigurations() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.lineAnimationSelfCornerDots.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationSelfCornerDots[i]);
    }

    for (i = 0, count = annotations.lineAnimationLowerNeighborCornerDots.length;
         i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationLowerNeighborCornerDots[i]);
    }

    for (i = 0, count = annotations.lineAnimationUpperNeighborCornerDots.length;
         i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationUpperNeighborCornerDots[i]);
    }

    annotations.lineAnimationSelfCornerDots = [];
    annotations.lineAnimationLowerNeighborCornerDots = [];
    annotations.lineAnimationUpperNeighborCornerDots = [];
  }

  /**
   * Draws the tiles of each Sector with a different color.
   *
   * @this Annotations
   */
  function unfillSectorColors() {
    var annotations, i, iCount, j, jCount, sector, sectorHue;

    annotations = this;

    if (annotations.grid.sectors) {
      for (i = 0, iCount = annotations.grid.sectors.length; i < iCount; i += 1) {

        sector = annotations.grid.sectors[i];
        sectorHue = 60 * i;

        for (j = 0, jCount = sector.tiles.length; j < jCount; j += 1) {

          sector.tiles[j].setColor(sectorHue, window.hg.Grid.config.tileSaturation,
              window.hg.Grid.config.tileLightness);
        }
      }

      // Reset any other tile-color annotations
      ['contentTiles', 'borderTiles', 'cornerTiles'].forEach(function (key) {
        if (annotations.annotations[key].enabled) {
          annotations.annotations[key].create.call(annotations);
        }
      });
    }
  }

  /**
   * Destroys the dots at the center of the grid and the center of the viewport and stops highlighting the base tile
   * for the current pan.
   *
   * @this Annotations
   */
  function destroyPanCenterPoints() {
    var annotations;

    annotations = this;

    if (annotations.originalGridCenterDot) {
      annotations.grid.svg.removeChild(annotations.originalGridCenterDot);
      annotations.grid.svg.removeChild(annotations.currentGridCenterDot);
      annotations.grid.svg.removeChild(annotations.panCenterDot);

      annotations.originalGridCenterDot = null;
      annotations.currentGridCenterDot = null;
      annotations.panCenterDot = null;
    }
  }

  // --------------------------------------------------- //
  // Annotation updating functions

  /**
   * Updates a dot at the center of each tile at its current position.
   *
   * @this Annotations
   */
  function updateTileParticleCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileParticleCenters[i].setAttribute('cx', annotations.grid.allTiles[i].particle.px);
      annotations.tileParticleCenters[i].setAttribute('cy', annotations.grid.allTiles[i].particle.py);
    }
  }

  /**
   * Updates a dot at the center of each tile at its currentAnchor position.
   *
   * @this Annotations
   */
  function updateTileAnchorCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileAnchorLines[i].setAttribute('x1', annotations.grid.allTiles[i].particle.px);
      annotations.tileAnchorLines[i].setAttribute('y1', annotations.grid.allTiles[i].particle.py);
      annotations.tileAnchorLines[i].setAttribute('x2', annotations.grid.allTiles[i].currentAnchor.x);
      annotations.tileAnchorLines[i].setAttribute('y2', annotations.grid.allTiles[i].currentAnchor.y);
      annotations.tileAnchorCenters[i].setAttribute('cx', annotations.grid.allTiles[i].currentAnchor.x);
      annotations.tileAnchorCenters[i].setAttribute('cy', annotations.grid.allTiles[i].currentAnchor.y);
    }
  }

  /**
   * Updates the color of a circle over each tile at its currentAnchor position according to its
   * displacement from its original position.
   *
   * @this Annotations
   */
  function updateTileDisplacementColors() {
    var annotations, i, count, deltaX, deltaY, angle, distance, colorString;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      deltaX = annotations.grid.allTiles[i].particle.px - annotations.grid.allTiles[i].originalAnchor.x;
      deltaY = annotations.grid.allTiles[i].particle.py - annotations.grid.allTiles[i].originalAnchor.y;

      angle = Math.atan2(deltaX, deltaY) * 180 / Math.PI;
      distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      colorString = 'hsl(' + angle + ',' +
          distance / window.hg.DisplacementWaveJob.config.displacementAmplitude * 100 + '%,80%)';

      annotations.tileDisplacementCircles[i].setAttribute('fill', colorString);
      annotations.tileDisplacementCircles[i]
          .setAttribute('cx', annotations.grid.allTiles[i].particle.px);
      annotations.tileDisplacementCircles[i]
          .setAttribute('cy', annotations.grid.allTiles[i].particle.py);
    }
  }

  /**
   * Updates the inner radius of each tile.
   *
   * @this Annotations
   */
  function updateTileInnerRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileInnerRadii[i].setAttribute('cx', annotations.grid.allTiles[i].particle.px);
      annotations.tileInnerRadii[i].setAttribute('cy', annotations.grid.allTiles[i].particle.py);
      annotations.tileInnerRadii[i].setAttribute('r',
              annotations.grid.allTiles[i].outerRadius * window.hg.Grid.config.sqrtThreeOverTwo);
    }
  }

  /**
   * Updates the outer radius of each tile.
   *
   * @this Annotations
   */
  function updateTileOuterRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileOuterRadii[i].setAttribute('cx', annotations.grid.allTiles[i].particle.px);
      annotations.tileOuterRadii[i].setAttribute('cy', annotations.grid.allTiles[i].particle.py);
      annotations.tileOuterRadii[i].setAttribute('r', annotations.grid.allTiles[i].outerRadius);
    }
  }

  /**
   * Updates lines connecting each tile to each of its neighborStates.
   *
   * @this Annotations
   */
  function updateTileNeighborConnections() {
    var annotations, i, j, iCount, jCount, tile, neighborStates, neighbor;

    annotations = this;

    for (i = 0, iCount = annotations.grid.allTiles.length; i < iCount; i += 1) {
      tile = annotations.grid.allTiles[i];
      neighborStates = tile.getNeighborStates();

      for (j = 0, jCount = neighborStates.length; j < jCount; j += 1) {
        neighbor = neighborStates[j];

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
   * @this Annotations
   */
  function updateTileForces() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.forceLines[i].setAttribute('x1', annotations.grid.allTiles[i].particle.px);
      annotations.forceLines[i].setAttribute('y1', annotations.grid.allTiles[i].particle.py);
      annotations.forceLines[i].setAttribute('x2', annotations.grid.allTiles[i].particle.px +
          annotations.grid.allTiles[i].particle.fx * config.forceLineLengthMultiplier);
      annotations.forceLines[i].setAttribute('y2', annotations.grid.allTiles[i].particle.py +
          annotations.grid.allTiles[i].particle.fy * config.forceLineLengthMultiplier);
    }
  }

  /**
   * Updates lines representing the velocity of each tile.
   *
   * @this Annotations
   */
  function updateTileVelocities() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.velocityLines[i].setAttribute('x1', annotations.grid.allTiles[i].particle.px);
      annotations.velocityLines[i].setAttribute('y1', annotations.grid.allTiles[i].particle.py);
      annotations.velocityLines[i].setAttribute('x2', annotations.grid.allTiles[i].particle.px +
          annotations.grid.allTiles[i].particle.vx * config.velocityLineLengthMultiplier);
      annotations.velocityLines[i].setAttribute('y2', annotations.grid.allTiles[i].particle.py +
          annotations.grid.allTiles[i].particle.vy * config.velocityLineLengthMultiplier);
    }
  }

  /**
   * Updates the index of each tile.
   *
   * @this Annotations
   */
  function updateTileIndices() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.indexTexts[i].setAttribute('x', annotations.grid.allTiles[i].particle.px - 10);
      annotations.indexTexts[i].setAttribute('y', annotations.grid.allTiles[i].particle.py + 6);
    }
  }

  /**
   * Draws a dot at the position of each corner gap point of each line animation.
   *
   * @this Annotations
   */
  function updateLineAnimationGapPoints() {
    var annotations, i, iCount, j, jCount, k, line;

    annotations = this;

    destroyLineAnimationGapPoints.call(annotations);
    annotations.lineAnimationGapDots = [];

    for (k = 0, i = 0,
             iCount = window.hg.controller.transientJobs.line.jobs[annotations.grid.index].length;
         i < iCount;
         i += 1) {
      line = window.hg.controller.transientJobs.line.jobs[annotations.grid.index][i];

      for (j = 0, jCount = line.gapPoints.length; j < jCount; j += 1, k += 1) {
        annotations.lineAnimationGapDots[k] =
            document.createElementNS(window.hg.util.svgNamespace, 'circle');
        annotations.lineAnimationGapDots[k].setAttribute('cx', line.gapPoints[j].x);
        annotations.lineAnimationGapDots[k].setAttribute('cy', line.gapPoints[j].y);
        annotations.lineAnimationGapDots[k].setAttribute('r', '4');
        annotations.lineAnimationGapDots[k].setAttribute('fill', 'white');
        annotations.grid.svg.appendChild(annotations.lineAnimationGapDots[k]);
      }
    }
  }

  /**
   * Draws some annotations describing the corner configurations of each line animation.
   *
   * @this Annotations
   */
  function updateLineAnimationCornerConfigurations() {
    var annotations, i, iCount, j, jCount, line, pos, dot;

    annotations = this;

    destroyLineAnimationCornerConfigurations.call(annotations);
    annotations.lineAnimationSelfCornerDots = [];
    annotations.lineAnimationLowerNeighborCornerDots = [];
    annotations.lineAnimationUpperNeighborCornerDots = [];

    for (i = 0, iCount = window.hg.controller.transientJobs.line.jobs[annotations.grid.index].length;
         i < iCount; i += 1) {
      line = window.hg.controller.transientJobs.line.jobs[annotations.grid.index][i];

      for (j = 0, jCount = line.corners.length; j < jCount; j += 1) {
        // Self corner: red dot
        pos = getCornerPosition(line.tiles[j], line.corners[j]);
        dot = document.createElementNS(window.hg.util.svgNamespace, 'circle');
        dot.setAttribute('cx', pos.x);
        dot.setAttribute('cy', pos.y);
        dot.setAttribute('r', '3');
        dot.setAttribute('fill', '#ffaaaa');
        annotations.grid.svg.appendChild(dot);
        annotations.lineAnimationSelfCornerDots.push(dot);

        // Lower neighbor corner: green dot
        if (line.lowerNeighbors[j]) {
          pos = getCornerPosition(line.lowerNeighbors[j].tile, line.lowerNeighborCorners[j]);
          dot = document.createElementNS(window.hg.util.svgNamespace, 'circle');
          dot.setAttribute('cx', pos.x);
          dot.setAttribute('cy', pos.y);
          dot.setAttribute('r', '3');
          dot.setAttribute('fill', '#aaffaa');
          annotations.grid.svg.appendChild(dot);
          annotations.lineAnimationLowerNeighborCornerDots.push(dot);
        }

        // Upper neighbor corner: blue dot
        if (line.upperNeighbors[j]) {
          pos = getCornerPosition(line.upperNeighbors[j].tile, line.upperNeighborCorners[j]);
          dot = document.createElementNS(window.hg.util.svgNamespace, 'circle');
          dot.setAttribute('cx', pos.x);
          dot.setAttribute('cy', pos.y);
          dot.setAttribute('r', '3');
          dot.setAttribute('fill', '#aaaaff');
          annotations.grid.svg.appendChild(dot);
          annotations.lineAnimationUpperNeighborCornerDots.push(dot);
        }
      }
    }

    function getCornerPosition(tile, corner) {
      return {
        x: tile.vertices[corner * 2],
        y: tile.vertices[corner * 2 + 1]
      };
    }
  }

  /**
   * Updates the dots at the center of the grid and the center of the viewport and highlights the base tile for the
   * current pan.
   *
   * @this Annotations
   */
  function updatePanCenterPoints() {
    var annotations, panJob;

    annotations = this;

    if (annotations.originalGridCenterDot) {
      annotations.originalGridCenterDot.setAttribute('cx', annotations.grid.originalCenter.x);
      annotations.originalGridCenterDot.setAttribute('cy', annotations.grid.originalCenter.y);

      annotations.currentGridCenterDot.setAttribute('cx', annotations.grid.currentCenter.x);
      annotations.currentGridCenterDot.setAttribute('cy', annotations.grid.currentCenter.y);

      annotations.panCenterDot.setAttribute('cx', annotations.grid.panCenter.x);
      annotations.panCenterDot.setAttribute('cy', annotations.grid.panCenter.y);

      panJob = window.hg.controller.transientJobs.pan.jobs[annotations.grid.index][0];
      if (panJob) {
        panJob.baseTile.currentHue = 0;
        panJob.baseTile.currentSaturation = 0;
        panJob.baseTile.currentLightness = 90;
      }
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Toggles whether the given annotation is enabled.
   *
   * @this Annotations
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
   * @this Annotations
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
   * @this Annotations
   */
  function destroyAnnotations() {
    var annotations, key;

    annotations = this;

    for (key in annotations.annotations) {
      annotations.annotations[key].destroy.call(annotations);
    }
  }

  /**
   * Updates the annotation states to reflect whether the grid is currently expanded.
   *
   * @this Annotations
   * @param {boolean} isExpanded
   */
  function setExpandedAnnotations(isExpanded) {
    var annotations;

    annotations = this;

    if (annotations.annotations.tileNeighborConnections.enabled) {
      destroyTileNeighborConnections.call(annotations);
      createTileNeighborConnections.call(annotations);
    }

    if (isExpanded && annotations.annotations.sectorColors.enabled) {
      unfillSectorColors.call(annotations);
      fillSectorColors.call(annotations);
    } else {
      unfillSectorColors.call(annotations);
    }
  }

  /**
   * Sets this AnimationJob as started.
   *
   * @this Annotations
   */
  function start() {
    var grid = this;

    grid.isComplete = false;
  }

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * @this Annotations
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
   * Draws the current state of this AnimationJob.
   *
   * @this Annotations
   */
  function draw() {
    // TODO: is there any of the update logic that should instead be handled here?
  }

  /**
   * Stops this AnimationJob, and returns the element to its original form.
   *
   * @this Annotations
   */
  function cancel() {
    var grid = this;

    grid.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @param {Grid} grid
   */
  function Annotations(grid) {
    var annotations = this;

    annotations.grid = grid;
    annotations.startTime = 0;
    annotations.isComplete = false;
    annotations.annotations = window.hg.util.shallowCopy(config.annotations);

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
    annotations.lineAnimationSelfCornerDots = [];
    annotations.lineAnimationLowerNeighborCornerDots = [];
    annotations.lineAnimationUpperNeighborCornerDots = [];

    annotations.originalGridCenterDot = null;
    annotations.currentGridCenterDot = null;
    annotations.panCenterDot = null;

    annotations.toggleAnnotationEnabled = toggleAnnotationEnabled;
    annotations.createAnnotations = createAnnotations;
    annotations.destroyAnnotations = destroyAnnotations;
    annotations.setExpandedAnnotations = setExpandedAnnotations;

    annotations.start = start;
    annotations.update = update;
    annotations.draw = draw;
    annotations.cancel = cancel;
  }

  Annotations.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Annotations = Annotations;

  console.log('Annotations module loaded');
})();
