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
  config.emptyTileClickAnimation = 'Radiate Lines'; // 'Radiate Highlight'|'Radiate Lines'|'Random Line'|'None'

  config.possibleClickAnimations = {
    'Radiate Highlight': window.hg.controller.oneTimeJobs.highlightRadiate.create,
    'Radiate Lines': window.hg.controller.oneTimeJobs.linesRadiate.create,
    'Random Line': window.hg.controller.oneTimeJobs.line.create,
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

        if (tile.element.classList.contains('hg-post-tile')) {
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

        if (tile.element.classList.contains('hg-post-tile')) {
          // TODO: reset the other tile parameters
        }

        input.grid.setHoveredTile(null);

        window.hg.controller.oneTimeJobs.highlightHover.create(input.grid, tile);

        event.stopPropagation();
      }
    }

    function handlePointerMove(event) {
      if (event.target.classList.contains('hg-post-tile')) {
        // TODO:
      } else if (event.target.classList.contains('hg-tile')) {
        // TODO:
      }
    }

    function handlePointerDown(event) {
      if (event.target.classList.contains('hg-post-tile')) {
        // TODO:
      }
    }

    function handlePointerUp(event) {
      var tile;

      if (tile = getTileFromEvent(event)) {

        if (tile.element.classList.contains('hg-post-tile')) {
          // TODO:
        }

        createClickAnimation(input.grid, tile);
      }
    }

    function getTileFromEvent(event) {
      var tileIndex;

      if (event.target.classList.contains('hg-tile')) {
        tileIndex = event.target.id.substr(3);
        return input.grid.tiles[tileIndex];
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
      config.possibleClickAnimations[config.contentTileClickAnimation](grid, tile);
      window.hg.controller.oneTimeJobs.openPost.create(grid, tile);
    } else {
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
