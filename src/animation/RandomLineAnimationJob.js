'use strict';

/**
 * This module defines a constructor for RandomLineAnimationJob objects.
 *
 * @module RandomLineAnimationJob
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
//      console.log('RandomLineAnimationJob completed');
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
   * Sets this RandomLineAnimationJob as started.
   *
   * @this RandomLineAnimationJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO:
  }

  /**
   * Updates the animation progress of this RandomLineAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this RandomLineAnimationJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    // TODO:

    checkForComplete.call(job);
  }

  /**
   * Stops this RandomLineAnimationJob, and returns the element its original form.
   *
   * @this RandomLineAnimationJob
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
  function RandomLineAnimationJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.cancel = cancel;

    console.log('RandomLineAnimationJob created');
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.RandomLineAnimationJob = RandomLineAnimationJob;

  console.log('RandomLineAnimationJob module loaded');
})();
