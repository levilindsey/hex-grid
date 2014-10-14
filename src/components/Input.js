'use strict';

/**
 * This module defines a constructor for Input objects.
 *
 * Input objects handle the user-input logic for a Grid.
 *
 * @module Input
 */
(function () {
  var config = {};

  config.clickAnimation = 'Radiate Highlight'; // 'Radiate Highlight'|'Radiate Lines'|'Random Line'|'None'

  config.possibleClickAnimations = {
    'Radiate Highlight': hg.controller.createHighlightRadiateAnimation,
    'Radiate Lines': hg.controller.createLinesRadiateAnimation,
    'Random Line': hg.controller.createRandomLineAnimation,
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

        hg.controller.createHighlightHoverAnimation(input.grid.index, tile);

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

        createClickAnimation(input.grid.index, tile);
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

  function createClickAnimation(gridIndex, tile) {
//    config.possibleClickAnimations[config.clickAnimation](gridIndex, tile);// TODO:
    hg.controller.openPost(gridIndex, tile);
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
  if (!window.hg) window.hg = {};
  window.hg.Input = Input;

  console.log('Input module loaded');
})();
