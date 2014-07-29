'use strict';

/**
 * This module defines a constructor for HexTile objects.
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
  config.coeffOfDrag = 0.1;
  config.coeffOfSpring = 0.1;
  config.coeffOfDamping = 0.1;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the polygon element for this tile.
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
    var tile, i, iCount, j, jCount, neighborTile, deltaX, deltaY;

    tile = this;

    tile.neighbors = [];

    for (i = 0, iCount = neighborTiles.length; i < iCount; i += 1) {
      neighborTile = neighborTiles[i];
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
          if (neighborTile.neighbors[j].tile === tile) {
            tile.neighbors[i].neighborsRelationshipObj = neighborTile.neighbors[j];
            neighborTile.neighbors[j].neighborsRelationshipObj = tile.neighbors[i];
          }
        }
      }
    }
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

  /**
   * Update the state of this tile particle for the current time step.
   *
   * @params {number} deltaT
   */
  function eulerStep(deltaT) {
    var tile, i, count, lx, ly, ldotx, ldoty, dotProd, length, temp, springForceX, springForceY;

    tile = this;

    // --- Accumulate forces --- //

    // Add drag force
    tile.particle.fx += -config.coeffOfDrag * tile.particle.vx;
    tile.particle.fy += -config.coeffOfDrag * tile.particle.vy;

    // Add spring forces
    for (i = 0, count = tile.neighbors.length; i < count; i += 1) {
      if (tile.neighbors[i].springForceX) {
        tile.particle.fx += tile.neighbors[i].springForceX;
        tile.particle.fy += tile.neighbors[i].springForceY;

        tile.neighbors[i].springForceX = 0;
        tile.neighbors[i].springForceY = 0;
      } else {
        lx = tile.neighbors[i].particle.px - tile.particle.px;
        ly = tile.neighbors[i].particle.py - tile.particle.py;
        ldotx = tile.neighbors[i].particle.vx - tile.particle.vx;
        ldoty = tile.neighbors[i].particle.vy - tile.particle.vy;
        dotProd = lx * ldotx + ly * ldoty;
        length = Math.sqrt(lx * lx + ly * ly);

        temp = (config.coeffOfSpring * (length - tile.neighbors[i].restLength) +
            config.coeffOfDamping * dotProd / length) / length;
        springForceX = lx * temp;
        springForceY = ly * temp;

        tile.particle.fx += springForceX;
        tile.particle.fy += springForceY;

        tile.neighbors[i].neighborsRelationshipObj.springForceX = -springForceX;
        tile.neighbors[i].neighborsRelationshipObj.springForceY = -springForceY;
      }
    }

    // --- Update particle state --- //

    tile.particle.px += tile.particle.vx * deltaT;
    tile.particle.py += tile.particle.vy * deltaT;
    tile.particle.vx += tile.particle.fx / tile.particle.m * deltaT;
    tile.particle.vy += tile.particle.fy / tile.particle.m * deltaT;

    // --- Reset forces for next time step --- //

    tile.particle.fx = 0;
    tile.particle.fy = 0;
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
   * @param {number} mass
   */
  function HexTile(svg, centerX, centerY, outerRadius, isVertical, hue, saturation, lightness,
                   tileData, tileIndex, isMarginTile, mass) {
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
    tile.neighbors = null;
    tile.vertices = null;

    tile.particle = null;

    tile.setContent = setContent;
    tile.setNeighborTiles = setNeighborTiles;
    tile.setColor = setColor;
    tile.setVertices = setVertices;
    tile.eulerStep = eulerStep;
    **;// TODO: call eulerStep, and also add and call a function for adding external forces to the system (from the mouse and from periodic, automatic animations)

    createElement.call(tile);
    createParticle.call(tile, mass);
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.HexTile = HexTile;

  initStaticFields();

  console.log('HexTile module loaded');
})();
