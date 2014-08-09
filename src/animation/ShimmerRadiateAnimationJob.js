'use strict';

/**
 * This module defines a constructor for ShimmerRadiateAnimationJob objects.
 *
 * @module ShimmerRadiateAnimationJob
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
//      console.log('ShimmerRadiateAnimationJob completed');
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
   * Sets this ShimmerRadiateAnimationJob as started.
   *
   * @this ShimmerRadiateAnimationJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO:
  }

  /**
   * Updates the animation progress of this ShimmerRadiateAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ShimmerRadiateAnimationJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    // TODO:

    checkForComplete.call(job);
  }

  /**
   * Stops this ShimmerRadiateAnimationJob, and returns the element its original form.
   *
   * @this ShimmerRadiateAnimationJob
   */
  function cancel() {
    var job = this;

    // TODO:

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HexGrid} grid
   */
  function ShimmerRadiateAnimationJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.cancel = cancel;

    console.log('ShimmerRadiateAnimationJob created');
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.ShimmerRadiateAnimationJob = ShimmerRadiateAnimationJob;

  console.log('ShimmerRadiateAnimationJob module loaded');
})();