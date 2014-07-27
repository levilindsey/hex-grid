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
    var grid;

    grid = this;

    grid.tiles = [];

    // TODO:
    grid.tiles[0] = new hg.HexTile(grid.svg, 100, 100, 60, true, 20, 60, 60, {});
    grid.tiles[1] = new hg.HexTile(grid.svg, 300, 100, 60, false, 80, 60, 60, {});
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

    // TODO: calculate tile dimensions, how many tiles to show, tile positions, ...
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

    grid.hue = 50;
    grid.saturation = 20;
    grid.lightness = 20;

    grid.svg = null;
    grid.tiles = null;

    createSvg.call(grid);
    createTiles.call(grid);
    startAnimating.call(grid);

    onWindowResize.call(grid);
    window.addEventListener('resize', onWindowResize.bind(grid), false);
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
