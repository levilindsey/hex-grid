'use strict';

/**
 * This module defines a constructor for LinesRadiateAnimationJob objects.
 *
 * @module LinesRadiateAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 900;
  config.lineWidth = 6;
  config.lineLength = 140;
  config.lineSidePeriod = 200; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 70;
  config.startOpacity = 0.8;

  config.endSaturation = 50;
  config.endLightness = 90;
  config.endOpacity = 0;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the individual LineAnimationJobs that comprise this LinesRadiateAnimationJob.
   *
   * @this LinesRadiateAnimationJob
   */
  function createLineAnimationJobs() {
    var job, i;

    job = this;
    job.lineAnimationJobs = [];

    for (i = 0; i < 6; i += 1) {
      job.lineAnimationJobs[i] = new hg.LineAnimationJob(job.grid, job.tile, i, i);

      // Replace the line animation's normal parameters with some that are specific to radiating
      // lines
      job.lineAnimationJobs[i].duration = config.duration;
      job.lineAnimationJobs[i].lineWidth = config.lineWidth;
      job.lineAnimationJobs[i].lineLength = config.lineLength;
      job.lineAnimationJobs[i].lineSidePeriod = config.lineSidePeriod;

      job.lineAnimationJobs[i].startSaturation = config.startSaturation;
      job.lineAnimationJobs[i].startLightness = config.startLightness;
      job.lineAnimationJobs[i].startOpacity = config.startOpacity;

      job.lineAnimationJobs[i].endSaturation = config.endSaturation;
      job.lineAnimationJobs[i].endLightness = config.endLightness;
      job.lineAnimationJobs[i].endOpacity = config.endOpacity;
      // TODO: add the other radiate-specific line-animation parameters
    }
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   *
   * @this LinesRadiateAnimationJob
   */
  function checkForComplete() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      if (job.lineAnimationJobs[i].isComplete) {
        job.lineAnimationJobs.splice(i, 1);
      } else {
        return;
      }
    }

    console.log('LinesRadiateAnimationJob completed');

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this LinesRadiateAnimationJob as started.
   *
   * @this LinesRadiateAnimationJob
   */
  function start() {
    var job, i, count;

    job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      job.lineAnimationJobs[i].start();
    }
  }

  /**
   * Updates the animation progress of this LinesRadiateAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this LinesRadiateAnimationJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      job.lineAnimationJobs[i].update(currentTime, deltaTime);
    }

    checkForComplete.call(job);
  }

  /**
   * Stops this LinesRadiateAnimationJob, and returns the element its original form.
   *
   * @this LinesRadiateAnimationJob
   */
  function cancel() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      job.lineAnimationJobs[i].cancel();
    }

    job.lineAnimationJobs = [];

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HexGrid} grid
   * @param {HexTile} tile
   */
  function LinesRadiateAnimationJob(grid, tile) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.startTime = 0;
    job.isComplete = false;
    job.lineAnimationJobs = null;

    job.start = start;
    job.update = update;
    job.cancel = cancel;

    createLineAnimationJobs.call(job);

    console.log('LinesRadiateAnimationJob created: tileIndex=' + tile.index);
  }

  LinesRadiateAnimationJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.LinesRadiateAnimationJob = LinesRadiateAnimationJob;

  console.log('LinesRadiateAnimationJob module loaded');
})();
