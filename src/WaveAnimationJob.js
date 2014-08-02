'use strict';

/**
 * This module defines a constructor for WaveAnimationJob objects.
 *
 * @module WaveAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.period = 1000;
  config.maxDeltaX = 130;
  config.maxDeltaY = 100;

  config.twoPeriod = config.period * 2;
  config.halfPeriod = config.period / 2;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   */
  function checkForComplete() {
    var job = this;

    // TODO:
//    if (???) {
//      console.log('WaveAnimationJob completed');
//
//      job.isComplete = true;
//      job.onComplete(true);
//    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this WaveAnimationJob as started.
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO:
  }

  /**
   * Updates the animation progress of this WaveAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, px, py;

    job = this;

//    if (parseInt((currentTime + config.halfPeriod) / config.period) % 2 === 0) {
    progress =
        Math.sin(((currentTime % config.twoPeriod - config.period) / config.period) * Math.PI);
    px = progress * config.maxDeltaX + job.grid.tiles[0].centerX;
    py = progress * config.maxDeltaY + job.grid.tiles[0].centerY;

    job.grid.tiles[0].fixPosition(px, py);

    checkForComplete.call(job);
  }

  /**
   * Stops this WaveAnimationJob, and returns the element its original form.
   */
  function cancel() {
    var job = this;

    // TODO:

    job.onComplete(false);

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HexGrid} grid
   */
  function WaveAnimationJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.cancel = cancel;

    console.log('WaveAnimationJob created');
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.WaveAnimationJob = WaveAnimationJob;

  console.log('WaveAnimationJob module loaded');
})();
