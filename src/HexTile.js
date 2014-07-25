'use strict';

/**
 * This module defines a constructor for HexTile objects.
 *
 * @module HexTile
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the tile elements for the tile.
   */
  function createElements() {
    var tile;

    tile = this;

    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

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
   * @param {number} width
   * @param {boolean} isVertical
   * @param {Object} tileData
   */
  function HexTile(svg, centerX, centerY, width, isVertical, tileData) {
    var tile = this;

    tile.svg = svg;
    tile.center = {x: centerX, y: centerY};
    tile.width = width;
    tile.isVertical = isVertical;
    tile.tileData = tileData;

    tile.elements = null;

    createElements.call(tile);
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.HexTile = HexTile;

  console.log('HexTile module loaded');
})();
