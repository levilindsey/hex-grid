/**
 * @typedef {AnimationJob} IntraTileRadiateJob
 */

/**
 * This module defines a constructor for IntraTileRadiateJob objects.
 *
 * @module IntraTileRadiateJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  // TODO:

  config.isRecurring = false;
  config.avgDelay = 4000;
  config.delayDeviationRange = 3800;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this IntraTileRadiateJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('IntraTileRadiateJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this IntraTileRadiateJob as started.
   *
   * @this IntraTileRadiateJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this IntraTileRadiateJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this IntraTileRadiateJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    // TODO:
//    var job, currentMaxDistance, currentMinDistance, i, count, distance, waveWidthRatio,
//        oneMinusDurationRatio, animatedSomeTile;
//
//    job = this;
//
//    if (currentTime > job.startTime + config.duration) {
//      handleComplete.call(job, false);
//    } else {
//      oneMinusDurationRatio = 1 - (currentTime - job.startTime) / config.duration;
//
//      currentMaxDistance = config.shimmerSpeed * (currentTime - job.startTime);
//      currentMinDistance = currentMaxDistance - config.shimmerWaveWidth;
//
//      animatedSomeTile = false;
//
//      for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
//        distance = job.tileDistances[i];
//
//        if (distance > currentMinDistance && distance < currentMaxDistance) {
//          waveWidthRatio = (distance - currentMinDistance) / config.shimmerWaveWidth;
//
//          updateTile(job.grid.tiles[i], waveWidthRatio, oneMinusDurationRatio);
//
//          animatedSomeTile = true;
//        }
//      }
//
//      if (!animatedSomeTile) {
//        handleComplete.call(job, false);
//      }
//    }**;
  }

  /**
   * Draws the current state of this IntraTileRadiateJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this IntraTileRadiateJob
   */
  function draw() {
    var job;

    job = this;

    // TODO:
  }

  /**
   * Stops this IntraTileRadiateJob, and returns the element its original form.
   *
   * @this IntraTileRadiateJob
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
  function IntraTileRadiateJob(grid, tile, onComplete) {
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

    console.log('IntraTileRadiateJob created');
  }

  IntraTileRadiateJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.IntraTileRadiateJob = IntraTileRadiateJob;

  console.log('IntraTileRadiateJob module loaded');
})();
