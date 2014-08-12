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
   * @param {boolean} isMarginTile
   * @param {boolean} isBorderTile
   * @param {number} mass
   */
  function HexTile(svg, centerX, centerY, outerRadius, isVertical, hue, saturation, lightness,
                   tileData, tileIndex, isMarginTile, isBorderTile, mass) {
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
    tile.isMarginTile = isMarginTile;
    tile.isBorderTile = isBorderTile;
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
