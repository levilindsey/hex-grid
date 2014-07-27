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

    tile.vertexDeltas = computeVertexDeltas(tile.radius, tile.isVertical);
    tile.vertices = computeVertices(tile.centerX, tile.centerY, tile.vertexDeltas);

    tile.element = document.createElementNS(hg.util.svgNamespace, 'polygon');
    tile.svg.appendChild(tile.element);

    setElementVertices(tile.element, tile.vertices);

    setElementColor(tile.element, tile.hue, tile.saturation, tile.lightness);
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

  /**
   * Sets the given polygon element's points attribute according to the given vertex coordinates.
   *
   * @param {HTMLElement} element
   * @param {Array.<number>} vertices
   */
  function setElementVertices(element, vertices) {
    var i, pointsString;

    for (i = 0, pointsString = ''; i < 12;) {
      pointsString += vertices[i++] + ',' + vertices[i++] + ' ';
    }

    element.setAttribute('points', pointsString);
  }

  /**
   * Sets the given polygon element's color attributes according to the given color values.
   *
   * @param {HTMLElement} element
   * @param {number} hue
   * @param {number} saturation
   * @param {number} lightness
   */
  function setElementColor(element, hue, saturation, lightness) {
    var colorString = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)';
    element.setAttribute('fill', colorString);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} svg
   * @param {number} centerX
   * @param {number} centerY
   * @param {number} radius
   * @param {boolean} isVertical
   * @param {number} hue
   * @param {number} saturation
   * @param {number} lightness
   * @param {Object} tileData
   */
  function HexTile(svg, centerX, centerY, radius, isVertical, hue, saturation, lightness, tileData) {
    var tile = this;

    tile.svg = svg;
    tile.element = null;
    tile.centerX = centerX;
    tile.centerY = centerY;
    tile.radius = radius;
    tile.isVertical = isVertical;
    tile.hue = hue;
    tile.saturation = saturation;
    tile.lightness = lightness;
    tile.vertices = null;
    tile.tileData = tileData;

    createElement.call(tile);
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.HexTile = HexTile;

  initStaticFields();

  console.log('HexTile module loaded');
})();
