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

    document.addEventListener('mouseout', handlePointerOut, false);
    document.addEventListener('mousemove', handlePointerMove, false);
    document.addEventListener('mousedown', handlePointerDown, false);
    document.addEventListener('mouseup', handlePointerUp, false);
    // TODO: add touch support

    function handlePointerOut(event) {
      if (!event.toElement && !event.relatedTarget) {
        // The mouse has left the viewport

        // TODO: handle the mouse out event
      } else if (event.target.classList.contains('hg-post-tile')) {
        // TODO: trigger a HighlightHoverJob

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
      if (event.target.classList.contains('hg-post-tile')) {
        // TODO:
      }
    }

    // TODO:
  }

  /**
   * Checks whether the given point intersects with the same tile that was intersected during the
   * last movement event.
   *
   * @this Input
   * @param {number} x
   * @param {number} y
   */
  function checkOldTileIntersection(x, y) {
    var input;

    input = this;

    // TODO:
  }

  /**
   * Checks whether the given point intersects with any tile in the grid.
   *
   * @this Input
   * @param {number} x
   * @param {number} y
   */
  function checkNewTileIntersection(x, y) {
    var input;

    input = this;

    // TODO:
    // - pre-compute the start and end x and y coordinates of each column and row
    // - this function then simply loops over these until finding the one or two rows and columns that the point intersects
    // - then there are at most four tiles to actually check for intersection within
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Checks whether the given point intersects with the given tile.
   *
   * @param {Tile} tile
   * @param {number} x
   * @param {number} y
   */
  function checkTileIntersection(tile, x, y) {
    return checkTileBoundingBoxIntersection(tile, x, y) &&
        util.isPointInsidePolyline(x, y, tile.vertices, false);
  }

  /**
   * Checks whether the given point intersects with the bounding box of the given tile.
   *
   * @param {Tile} tile
   * @param {number} x
   * @param {number} y
   */
  function checkTileBoundingBoxIntersection(tile, x, y) {
    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Input} grid
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
