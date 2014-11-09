/**
 * This module defines a constructor for Input objects.
 *
 * Input objects handle the user-input logic for a Grid.
 *
 * @module Input
 */
(function () {
  var config = {};

  config.contentTileClickAnimation = 'Radiate Highlight'; // 'Radiate Highlight'|'Radiate Lines'|'Random Line'|'None'
  config.emptyTileClickAnimation = 'Radiate Highlight'; // 'Radiate Highlight'|'Radiate Lines'|'Random Line'|'None'

  config.possibleClickAnimations = {
    'Radiate Highlight': window.hg.controller.transientJobs.highlightRadiate.create,
    'Radiate Lines': window.hg.controller.transientJobs.linesRadiate.create,
    'Random Line': window.hg.controller.transientJobs.line.create,
    'None': function () {}
  };

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Adds event listeners for mouse and touch events for the grid.
   *
   * @this Input
   */
  function addPointerEventListeners() {
    var input;

    input = this;

    document.addEventListener('mouseover', handlePointerOver, false);
    document.addEventListener('mouseout', handlePointerOut, false);
    document.addEventListener('mousemove', handlePointerMove, false);
    document.addEventListener('mousedown', handlePointerDown, false);
    document.addEventListener('mouseup', handlePointerUp, false);
    // TODO: add touch support

    function handlePointerOver(event) {
      var tile;

      if (tile = getTileFromEvent(event)) {

        if (tile.element.getAttribute('data-hg-post-tile')) {
          // TODO: reset the other tile parameters
        }

        input.grid.setHoveredTile(tile);
      }
    }

    function handlePointerOut(event) {
      var tile;

      if (!event.relatedTarget || event.relatedTarget.nodeName === 'HTML') {
        console.log('The mouse left the viewport');

        input.grid.setHoveredTile(null);
      } else if (tile = getTileFromEvent(event)) {

        if (tile.element.getAttribute('data-hg-post-tile')) {
          // TODO: reset the other tile parameters
        }

        input.grid.setHoveredTile(null);

        window.hg.controller.transientJobs.highlightHover.create(input.grid, tile);

        event.stopPropagation();
      }
    }

    function handlePointerMove(event) {
      if (event.target.getAttribute('data-hg-post-tile')) {
        // TODO:
      } else if (event.target.getAttribute('data-hg-tile')) {
        // TODO:
      }
    }

    function handlePointerDown(event) {
      if (event.target.getAttribute('data-hg-post-tile')) {
        // TODO:
      }
    }

    function handlePointerUp(event) {
      var tile;

      if (event.button === 0 && (tile = getTileFromEvent(event))) {

        if (tile.element.getAttribute('data-hg-post-tile')) {
          // TODO:
        }

        createClickAnimation(input.grid, tile);
      }
    }

    function getTileFromEvent(event) {
      var tileIndex;

      if (event.target.getAttribute('data-hg-tile')) {
        tileIndex = event.target.getAttribute('data-hg-index');
        return input.grid.allTiles[tileIndex];
      } else {
        return null;
      }
    }
  }

  /**
   * @param {Grid} grid
   * @param {Tile} tile
   */
  function createClickAnimation(grid, tile) {
    // Close any open post
    if (grid.isPostOpen) {
      window.hg.controller.transientJobs.closePost.create(grid, grid.expandedTile);
    }

    if (tile.holdsContent) {
      // Trigger an animation for the click
      config.possibleClickAnimations[config.contentTileClickAnimation](grid, tile);

      // Open the post for the given tile
      window.hg.controller.transientJobs.openPost.create(grid, tile);
    } else {
      // Trigger an animation for the click
      config.possibleClickAnimations[config.emptyTileClickAnimation](grid, tile);
    }
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
   * @param {Grid} grid
   */
  function Input(grid) {
    var input = this;

    input.grid = grid;

    addPointerEventListeners.call(input);
  }

  Input.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Input = Input;

  console.log('Input module loaded');
})();
