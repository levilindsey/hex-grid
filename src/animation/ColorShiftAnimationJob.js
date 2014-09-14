'use strict';

/**
 * This module defines a constructor for ColorShiftAnimationJob objects.
 *
 * ColorShiftAnimationJob objects animate the colors of the tiles in a random fashion.
 *
 * @module ColorShiftAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  // TODO:

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    // TODO:
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ColorShiftAnimationJob as started.
   *
   * @this ColorShiftAnimationJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorShiftAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorShiftAnimationJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job;

    job = this;

    // TODO:
  }

  /**
   * Draws the current state of this ColorShiftAnimationJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorShiftAnimationJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorShiftAnimationJob.
   *
   * @this ColorShiftAnimationJob
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
  function ColorShiftAnimationJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = function () {
      config.computeDependentValues();
    };

    job.init();

    console.log('ColorShiftAnimationJob created');
  }

  ColorShiftAnimationJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.ColorShiftAnimationJob = ColorShiftAnimationJob;

  console.log('ColorShiftAnimationJob module loaded');
})();
