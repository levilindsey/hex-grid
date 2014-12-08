/**
 * @typedef {AnimationJob} TileBorderJob
 */

/**
 * This module defines a constructor for TileBorderJob objects.
 *
 * @module TileBorderJob
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

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    // TODO:
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this TileBorderJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('TileBorderJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this TileBorderJob as started.
   *
   * @this TileBorderJob
   * @param {Number} startTime
   */
  function start(startTime) {
    var job = this;

    job.startTime = startTime;
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this TileBorderJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this TileBorderJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
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
//      for (i = 0, count = job.grid.originalTiles.length; i < count; i += 1) {
//        distance = job.tileDistances[i];
//
//        if (distance > currentMinDistance && distance < currentMaxDistance) {
//          waveWidthRatio = (distance - currentMinDistance) / config.shimmerWaveWidth;
//
//          updateTile(job.grid.originalTiles[i], waveWidthRatio, oneMinusDurationRatio);
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
   * Draws the current state of this TileBorderJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this TileBorderJob
   */
  function draw() {
    var job;

    job = this;

    // TODO:
  }

  /**
   * Stops this TileBorderJob, and returns the element its original form.
   *
   * @this TileBorderJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this TileBorderJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
    // TODO:
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
  function TileBorderJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('TileBorderJob created: tileIndex=' + job.baseTile.originalIndex);
  }

  TileBorderJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.TileBorderJob = TileBorderJob;

  console.log('TileBorderJob module loaded');
})();
