/**
 * @typedef {AnimationJob} ColorResetJob
 */

/**
 * This module defines a constructor for ColorResetJob objects.
 *
 * ColorResetJob objects reset tile color values during each animation frame.
 *
 * @module ColorResetJob
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
   * Sets this ColorResetJob as started.
   *
   * @this ColorResetJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorResetJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorResetJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      job.grid.allTiles[i].currentHue = job.grid.allTiles[i].originalHue;
      job.grid.allTiles[i].currentSaturation = job.grid.allTiles[i].originalSaturation;
      job.grid.allTiles[i].currentLightness = job.grid.allTiles[i].originalLightness;
    }
  }

  /**
   * Draws the current state of this ColorResetJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorResetJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorResetJob, and returns the element its original form.
   *
   * @this ColorResetJob
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
   * @param {Grid} grid
   */
  function ColorResetJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = function () {};

    job.init();

    console.log('ColorResetJob created');
  }

  ColorResetJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.ColorResetJob = ColorResetJob;

  console.log('ColorResetJob module loaded');
})();
