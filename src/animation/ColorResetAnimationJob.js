'use strict';

/**
 * This module defines a constructor for ColorResetAnimationJob objects.
 *
 * ColorResetAnimationJob objects reset tile color values during each animation frame.
 *
 * @module ColorResetAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ColorResetAnimationJob as started.
   *
   * @this ColorResetAnimationJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorResetAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorResetAnimationJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      job.grid.tiles[i].currentHue = job.grid.tiles[i].originalHue;
      job.grid.tiles[i].currentSaturation = job.grid.tiles[i].originalSaturation;
      job.grid.tiles[i].currentLightness = job.grid.tiles[i].originalLightness;
    }
  }

  /**
   * Draws the current state of this ColorResetAnimationJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorResetAnimationJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorResetAnimationJob, and returns the element its original form.
   *
   * @this ColorResetAnimationJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HexGrid} grid
   */
  function ColorResetAnimationJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = function () {
    };

    job.init();

    console.log('ColorResetAnimationJob created');
  }

  ColorResetAnimationJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.ColorResetAnimationJob = ColorResetAnimationJob;

  console.log('ColorResetAnimationJob module loaded');
})();
