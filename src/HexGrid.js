'use strict';

/**
 * This module defines a constructor for HexGrid objects.
 *
 * @module HexGrid
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the SVG element for the grid.
   */
  function createSvg() {
    var grid;

    grid = this;

    // TODO:
  }

  /**
   * Creates the tile elements for the grid.
   */
  function createTiles() {
    var grid;

    grid = this;

    // TODO:
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

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * @constructor
   * @param {HTMLElement} parent
   * @param {Object} tileData
   */
  function HexGrid(parent, tileData) {
    var grid = this;

    grid.parent = parent;
    grid.tileData = tileData;

    grid.svg = null;
    grid.tiles = null;

    createSvg.call(grid);
    createTiles.call(grid);
    startAnimating.call(grid);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's factory function

  /**
   * @global
   * @param {HTMLElement} parent
   * @param {Object} tileData
   * @returns {HexGrid}
   */
  function createNewHexGrid(parent, tileData) {
    var hexGrid = new HexGrid(parent, tileData);

    console.log('HexGrid created');

    return hexGrid;
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.createNewHexGrid = createNewHexGrid;

  console.log('HexGrid module loaded');
})();
