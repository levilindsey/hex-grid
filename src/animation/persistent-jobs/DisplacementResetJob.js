/**
 * @typedef {AnimationJob} DisplacementResetJob
 */

/**
 * This module defines a constructor for DisplacementResetJob objects.
 *
 * DisplacementResetJob objects reset tile displacement values during each animation frame.
 *
 * @module DisplacementResetJob
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
   * Sets this DisplacementResetJob as started.
   *
   * @this DisplacementResetJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this DisplacementResetJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this DisplacementResetJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    // Update the tiles
    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      job.grid.allTiles[i].currentAnchor.x = job.grid.allTiles[i].originalAnchor.x;
      job.grid.allTiles[i].currentAnchor.y = job.grid.allTiles[i].originalAnchor.y;
    }
  }

  /**
   * Draws the current state of this DisplacementResetJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this DisplacementResetJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this DisplacementResetJob, and returns the element its original form.
   *
   * @this DisplacementResetJob
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
  function DisplacementResetJob(grid) {
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

    console.log('DisplacementResetJob created');
  }

  DisplacementResetJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.DisplacementResetJob = DisplacementResetJob;

  console.log('DisplacementResetJob module loaded');
})();
