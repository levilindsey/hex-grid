'use strict';

/**
 * @typedef {AnimationJob} ShimmerHoverJob
 */

/**
 * This module defines a constructor for ShimmerHoverJob objects.
 *
 * @module ShimmerHoverJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   */
  function checkForComplete() {
    var job = this;

    // TODO:
//    if (???) {
//      console.log('ShimmerHoverJob completed');
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
   * Sets this ShimmerHoverJob as started.
   *
   * @this ShimmerHoverJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO:
  }

  /**
   * Updates the animation progress of this ShimmerHoverJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ShimmerHoverJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    // TODO:

    checkForComplete.call(job);
  }

  /**
   * Draws the current state of this ShimmerHoverJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ShimmerHoverJob
   */
  function draw() {
    var job = this;

    // TODO:
  }

  /**
   * Stops this ShimmerHoverJob, and returns the element its original form.
   *
   * @this ShimmerHoverJob
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
   * @param {Grid} grid
   * @param {Function} onComplete
   */
  function ShimmerHoverJob(grid, onComplete) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;

    console.log('ShimmerHoverJob created');
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.ShimmerHoverJob = ShimmerHoverJob;

  console.log('ShimmerHoverJob module loaded');
})();
