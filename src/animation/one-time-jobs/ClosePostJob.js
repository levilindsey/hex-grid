'use strict';

/**
 * @typedef {AnimationJob} ClosePostJob
 */

/**
 * This module defines a constructor for ClosePostJob objects.
 *
 * @module ClosePostJob
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
//      console.log('ClosePostJob completed');
//
//      job.isComplete = true;
//      job.onComplete(true);
//    }
  }

  /**
   * @this ClosePostJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('ClosePostJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ClosePostJob as started.
   *
   * @this ClosePostJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO:
  }

  /**
   * Updates the animation progress of this ClosePostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ClosePostJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    // TODO:

    checkForComplete.call(job);
  }

  /**
   * Draws the current state of this ClosePostJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ClosePostJob
   */
  function draw() {
    var job = this;

    // TODO:
  }

  /**
   * Stops this ClosePostJob, and returns the element its original form.
   *
   * @this ClosePostJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Function} onComplete
   */
  function ClosePostJob(grid, onComplete) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;

    console.log('ClosePostJob created');
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.ClosePostJob = ClosePostJob;

  console.log('ClosePostJob module loaded');
})();
