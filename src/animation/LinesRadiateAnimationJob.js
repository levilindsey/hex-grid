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

  config.duration = 1400;
  config.lineWidth = 7;
  config.lineLength = 600;
  config.lineSidePeriod = 100; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 100;
  config.startOpacity = 0.8;

  config.endSaturation = 100;
  config.endLightness = 70;
  config.endOpacity = 0;

  config.sameDirectionProb = 0.85;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the individual LineAnimationJobs that comprise this LinesRadiateAnimationJob.
   *
   * @this LinesRadiateAnimationJob
   */
  function createLineAnimationJobs() {
    var job, i, line;

    job = this;
    job.lineAnimationJobs = [];

    for (i = 0; i < 6; i += 1) {
      try {
        line = new hg.LineAnimationJob(job.grid, job.tile, i, i,
            hg.LineAnimationJob.config.NEIGHBOR, job.onComplete, job.extraStartPoint);
      } catch (error) {
        console.debug(error.message);
        continue;
      }

      job.lineAnimationJobs.push(line);

      // Replace the line animation's normal parameters with some that are specific to radiating
      // lines
      line.duration = config.duration;
      line.lineWidth = config.lineWidth;
      line.lineLength = config.lineLength;
      line.lineSidePeriod = config.lineSidePeriod;

      line.startSaturation = config.startSaturation;
      line.startLightness = config.startLightness;
      line.startOpacity = config.startOpacity;

      line.endSaturation = config.endSaturation;
      line.endLightness = config.endLightness;
      line.endOpacity = config.endOpacity;

      line.sameDirectionProb = config.sameDirectionProb;
    }
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   *
   * @this LinesRadiateAnimationJob
   */
  function checkForComplete() {
    var job, i;

    job = this;

    for (i = 0; i < job.lineAnimationJobs.length; i += 1) {
      if (job.lineAnimationJobs[i].isComplete) {
        job.lineAnimationJobs.splice(i--, 1);
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

    // Update the extra point
    job.extraStartPoint.x = job.tile.particle.px;
    job.extraStartPoint.y = job.tile.particle.py;

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      job.lineAnimationJobs[i].update(currentTime, deltaTime);

      if (job.lineAnimationJobs[i].isComplete) {
        job.lineAnimationJobs.splice(i, 1);
        i--;
        count--;
      }
    }

    checkForComplete.call(job);
  }

  /**
   * Draws the current state of this LinesRadiateAnimationJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this LinesRadiateAnimationJob
   */
  function draw() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      job.lineAnimationJobs[i].draw();
    }
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
   * @param {Function} onComplete
   */
  function LinesRadiateAnimationJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.extraStartPoint = { x: tile.particle.px, y: tile.particle.py };
    job.startTime = 0;
    job.isComplete = false;
    job.lineAnimationJobs = null;

    job.onComplete = onComplete;

    job.start = start;
    job.update = update;
    job.draw = draw;
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
