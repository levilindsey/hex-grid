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

  config.shimmerSpeed = 200; // pixels / millisecond
  config.shimmerWaveWidth = 400;
  config.duration = 1000;

  config.startHue = 120;
  config.startSaturation = 50;
  config.startLightness = 100;
  config.startOpacity = 1;

  config.endHue = 360;
  config.endSaturation = 50;
  config.endLightness = 100;
  config.endOpacity = 0;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates the distance from each tile in the grid to the starting point of this
   * ShimmerRadiateAnimationJob.
   *
   * This cheats by only calculating the distance to the tiles' original center. This allows us to
   * not need to re-calculate tile distances during each time step.
   *
   * @this ShimmerRadiateAnimationJob
   */
  function calculateTileDistances() {
    var job, i, count, deltaX, deltaY;

    job = this;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      deltaX = job.grid.tiles[i].originalCenterX - job.startPoint.x;
      deltaY = job.grid.tiles[i].originalCenterY - job.startPoint.y;
      job.tileDistances[i] = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   *
   * @this ShimmerRadiateAnimationJob
   */
  function checkForComplete() {
    var job = this;

    // TODO: two conditions: no tiles are in range any more; the duration value is past the threshold
//    if (???) {
//      console.log('ShimmerRadiateAnimationJob completed');
//
//      job.isComplete = true;
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
    var job;

    job = this;

    // TODO:

//    config.shimmerSpeed = 200; // pixels / millisecond
//    config.shimmerWaveWidth = 400;
//    config.duration = 1000;
//
//    config.startHue = 120;
//    config.startSaturation = 50;
//    config.startLightness = 100;
//    config.endOpacity = 1;
//
//    config.endHue = 360;
//    config.endSaturation = 50;
//    config.endLightness = 100;
//    config.endOpacity = 0;

    checkForComplete.call(job);

    if (job.isComplete) {
      job.onComplete(job);
    }
  }

  /**
   * Draws the current state of this ShimmerRadiateAnimationJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ShimmerRadiateAnimationJob
   */
  function draw() {
    var job;

    job = this;

    // TODO: will need to blend these color values with those of the tiles;
  }

  /**
   * Stops this ShimmerRadiateAnimationJob, and returns the element its original form.
   *
   * @this ShimmerRadiateAnimationJob
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
   * @param {{x:number,y:number}} startPoint
   * @param {HexGrid} grid
   */
  function ShimmerRadiateAnimationJob(startPoint, grid) {
    var job = this;

    job.grid = grid;
    job.startPoint = startPoint;
    job.tileDistances = [];
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;

    calculateTileDistances.call(job);

    console.log('ShimmerRadiateAnimationJob created');
  }

  ShimmerRadiateAnimationJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.ShimmerRadiateAnimationJob = ShimmerRadiateAnimationJob;

  console.log('ShimmerRadiateAnimationJob module loaded');
})();
