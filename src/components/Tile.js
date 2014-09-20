'use strict';

/**
 * This module defines a constructor for Tile objects.
 *
 * Tile objects handle the particle logic and the hexagon SVG-shape logic for a single
 * hexagonal tile within a Grid.
 *
 * @module Tile
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config;

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
   * @this Tile
   */
  function createElement() {
    var tile;

    tile = this;

    tile.vertexDeltas = computeVertexDeltas(tile.outerRadius, tile.isVertical);
    tile.vertices = [];
    updateVertices.call(tile, tile.centerX, tile.centerY);

    tile.element = document.createElementNS(hg.util.svgNamespace, 'polygon');
    tile.svg.appendChild(tile.element);

    tile.element.id = 'hg-' + tile.index;
    tile.element.classList.add('hg-tile');

    // Set the color and vertices
    draw.call(tile);
  }

  /**
   * Creates the particle properties for this tile.
   *
   * @this Tile
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

  /**
   * Computes and stores the locations of the vertices of the hexagon for this tile.
   *
   * @this Tile
   * @param {number} centerX
   * @param {number} centerY
   */
  function updateVertices(centerX, centerY) {
    var tile, trigIndex, coordIndex;

    tile = this;

    for (trigIndex = 0, coordIndex = 0; trigIndex < 6; trigIndex += 1) {
      tile.vertices[coordIndex] = centerX + tile.vertexDeltas[coordIndex++];
      tile.vertices[coordIndex] = centerY + tile.vertexDeltas[coordIndex++];
    }
  }

  /**
   * Creates a new TilePost object with this Tile's post data.
   *
   * @this Tile
   */
  function createTilePost() {
    var tile;

    tile = this;

    // TODO: tile.tilePost = new hg.TilePost(tile, tile.postData);
  }

  /**
   * Destroys this Tile's TilePost object.
   *
   * @this Tile
   */
  function destroyTilePost() {
    var tile;

    tile = this;

    // TODO: tile.tilePost.remove();

    tile.tilePost = null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Initializes some static fields that can be pre-computed.
   */
  function initStaticFields() {
    var i, theta, deltaTheta, horizontalStartTheta, verticalStartTheta;

    deltaTheta = Math.PI / 3;
    horizontalStartTheta = -deltaTheta;
    verticalStartTheta = Math.PI / 6 - 2 * deltaTheta;

    config.horizontalSines = [];
    config.horizontalCosines = [];
    for (i = 0, theta = horizontalStartTheta; i < 6; i += 1, theta += deltaTheta) {
      config.horizontalSines[i] = Math.sin(theta);
      config.horizontalCosines[i] = Math.cos(theta);
    }

    config.verticalSines = [];
    config.verticalCosines = [];
    for (i = 0, theta = verticalStartTheta; i < 6; i += 1, theta += deltaTheta) {
      config.verticalSines[i] = Math.sin(theta);
      config.verticalCosines[i] = Math.cos(theta);
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
      sines = config.verticalSines;
      cosines = config.verticalCosines;
    } else {
      sines = config.horizontalSines;
      cosines = config.horizontalCosines;
    }

    for (trigIndex = 0, coordIndex = 0, vertexDeltas = [];
        trigIndex < 6;
        trigIndex += 1) {
      vertexDeltas[coordIndex++] = radius * cosines[trigIndex];
      vertexDeltas[coordIndex++] = radius * sines[trigIndex];
    }

    return vertexDeltas;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this tile's content.
   *
   * @this Tile
   * @param {?Object} postData
   */
  function setContent(postData) {
    var tile, usedToHoldContent;

    tile = this;

    usedToHoldContent = tile.holdsContent;

    tile.postData = postData;
    tile.holdsContent = !!postData;

    if (usedToHoldContent) {
      destroyTilePost.call(tile);
      createTilePost.call(tile);
    } else {
      createTilePost.call(tile);
    }
  }

  /**
   * Sets this tile's neighbor tiles.
   *
   * @this Tile
   * @param {Array.<Tile>} neighborTiles
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
   * Sets this tile's color values.
   *
   * @this Tile
   * @param {number} hue
   * @param {number} saturation
   * @param {number} lightness
   */
  function setColor(hue, saturation, lightness) {
    var tile = this;

    tile.originalHue = hue;
    tile.originalSaturation = saturation;
    tile.originalLightness = lightness;
    
    tile.currentHue = hue;
    tile.currentSaturation = saturation;
    tile.currentLightness = lightness;
  }

  /**
   * Update the state of this tile particle for the current time step.
   *
   * @this Tile
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
      updateVertices.call(tile, tile.particle.px, tile.particle.py);
    }
  }

  /**
   * Update the SVG attributes for this tile to match its current particle state.
   *
   * @this Tile
   */
  function draw() {
    var tile, i, pointsString, colorString;

    tile = this;

    // --- Set the position of the TilePost --- //

    // TODO: tile.tilePost.element.top; tile.tilePost.element.left

    // --- Set the vertices --- //

    for (i = 0, pointsString = ''; i < 12;) {
      pointsString += tile.vertices[i++] + ',' + tile.vertices[i++] + ' ';
    }

    tile.element.setAttribute('points', pointsString);

    // --- Set the color --- //

    colorString = 'hsl(' + tile.currentHue + ',' +
        tile.currentSaturation + '%,' +
        tile.currentLightness + '%)';
    tile.element.setAttribute('fill', colorString);
  }

  /**
   * Adds the given force, which will take effect during the next call to update.
   *
   * @this Tile
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
   * @this Tile
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
   * @param {?Object} postData
   * @param {number} tileIndex
   * @param {number} rowIndex
   * @param {number} columnIndex
   * @param {boolean} isMarginTile
   * @param {boolean} isBorderTile
   * @param {boolean} isCornerTile
   * @param {boolean} isInLargerRow
   * @param {number} mass
   */
  function Tile(svg, centerX, centerY, outerRadius, isVertical, hue, saturation, lightness,
                   postData, tileIndex, rowIndex, columnIndex, isMarginTile, isBorderTile,
                   isCornerTile, isInLargerRow, mass) {
    var tile = this;

    tile.svg = svg;
    tile.element = null;
    tile.centerX = centerX;
    tile.centerY = centerY;
    tile.originalCenterX = centerX;
    tile.originalCenterY = centerY;
    tile.outerRadius = outerRadius;
    tile.isVertical = isVertical;

    tile.originalHue = hue;
    tile.originalSaturation = saturation;
    tile.originalLightness = lightness;
    tile.currentHue = hue;
    tile.currentSaturation = saturation;
    tile.currentLightness = lightness;

    tile.postData = postData;
    tile.holdsContent = !!postData;
    tile.tilePost = null;
    tile.index = tileIndex;
    tile.rowIndex = rowIndex;
    tile.columnIndex = columnIndex;
    tile.isMarginTile = isMarginTile;
    tile.isBorderTile = isBorderTile;
    tile.isCornerTile = isCornerTile;
    tile.isInLargerRow = isInLargerRow;

    tile.neighbors = null;
    tile.vertices = null;
    tile.vertexDeltas = null;
    tile.particle = null;

    tile.setContent = setContent;
    tile.setNeighborTiles = setNeighborTiles;
    tile.setColor = setColor;
    tile.update = update;
    tile.draw = draw;
    tile.applyExternalForce = applyExternalForce;
    tile.fixPosition = fixPosition;

    createElement.call(tile);
    createParticle.call(tile, mass);

    if (tile.holdsContent) {
      createTilePost.call(tile);
    }
  }

  Tile.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.Tile = Tile;

  initStaticFields();

  console.log('Tile module loaded');
})();