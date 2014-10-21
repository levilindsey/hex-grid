/**
 * @typedef {AnimationJob} PanJob
 */

/**
 * This module defines a constructor for PanJob objects.
 *
 * @module PanJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  config.displacementRatio = 0.28;

  config.isRecurring = false;
  config.avgDelay = 4000;
  config.delayDeviationRange = 3800;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this PanJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('PanJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this PanJob as started.
   *
   * @this PanJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this PanJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this PanJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    // TODO:
//    var job, progress, i, count;
//
//    job = this;
//
//    if (currentTime > job.startTime + config.duration) {
//      handleComplete.call(job, false);
//    } else {
//      // Ease-out halfway, then ease-in back
//      progress = (currentTime - job.startTime) / config.duration;
//      progress = (progress > 0.5 ? 1 - progress : progress) * 2;
//      progress = window.hg.util.easingFunctions.easeOutQuint(progress);
//
//      // Displace the tiles
//      for (i = 0, count = job.displacements.length; i < count; i += 1) {
//        job.displacements[i].tile.anchorX += job.displacements[i].displacementX * progress;
//        job.displacements[i].tile.anchorY += job.displacements[i].displacementY * progress;
//      }
//    }
  }

  /**
   * Draws the current state of this PanJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this PanJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this PanJob, and returns the element its original form.
   *
   * @this PanJob
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
   * @param {Tile} tile
   * @param {Function} onComplete
   */
  function PanJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;

    console.log('PanJob created');
  }

  PanJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.PanJob = PanJob;

  console.log('PanJob module loaded');
})();
