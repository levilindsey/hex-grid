/**
 * This module defines a constructor for Input objects.
 *
 * Input objects handle the user-input logic for a Grid.
 *
 * @module Input
 */
(function () {

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.contentTileClickAnimation = 'Radiate Highlight'; // 'Radiate Highlight'|'Radiate Lines'|'Random Line'|'None'
  config.emptyTileClickAnimation = 'Radiate Highlight'; // 'Radiate Highlight'|'Radiate Lines'|'Random Line'|'None'

  config.possibleClickAnimations = {
    'Radiate Highlight': window.hg.controller.transientJobs.HighlightRadiateJob.create,
    'Radiate Lines': window.hg.controller.transientJobs.LinesRadiateJob.create,
    'Random Line': window.hg.controller.transientJobs.LineJob.create,
    'None': function () {}
  };

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

    // Exposing this function so that we can automatically open the post corresponding to the URL.
    // How this is accessed should be refactored.
    input.createClickAnimation = createClickAnimation;

    addPointerEventListeners.call(input);
  }

  Input.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Input = Input;

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
    document.addEventListener('keydown', handleKeyDown, false);
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

        window.hg.controller.transientJobs.HighlightHoverJob.create(input.grid, tile);

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

    function handleKeyDown(event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        // Close any open post
        if (input.grid.isPostOpen) {
          window.hg.controller.transientJobs.ClosePostJob.create(
              input.grid, input.grid.expandedTile, false);
        }
      }
    }

    function getTileFromEvent(event) {
      var tileIndex;

      if (event.target.getAttribute('data-hg-tile')) {
        tileIndex = event.target.getAttribute('data-hg-index');
        return input.grid.allTiles[tileIndex];
      } else if (event.target.parentElement.getAttribute('data-hg-tile')) {
        tileIndex = event.target.parentElement.getAttribute('data-hg-index');
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
    if (tile.holdsContent) {
      // Trigger an animation for the click
      config.possibleClickAnimations[config.contentTileClickAnimation](grid, tile);

      // Close any open post
      if (grid.isPostOpen) {
        window.hg.controller.transientJobs.ClosePostJob.create(grid, grid.expandedTile, true);
      }

      // Open the post for the given tile
      window.hg.controller.transientJobs.OpenPostJob.create(grid, tile);
    } else {
      // Trigger an animation for the click
      config.possibleClickAnimations[config.emptyTileClickAnimation](grid, tile);

      // Close any open post
      if (grid.isPostOpen) {
        window.hg.controller.transientJobs.ClosePostJob.create(grid, grid.expandedTile, false);
      }
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  console.log('Input module loaded');
})();
