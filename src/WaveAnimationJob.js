'use strict';

/**
 * This module defines a constructor for WaveAnimationJob objects.
 *
 * @module WaveAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.period = 2200;
  config.displacementWavelengthX = -15;
  config.displacementWavelengthY = -config.displacementWavelengthX * Math.sqrt(3);
  config.waveProgressWavelength = 900;

  config.displacementWavelength =
      Math.sqrt(config.displacementWavelengthX * config.displacementWavelengthX +
          config.displacementWavelengthY * config.displacementWavelengthY);

  config.twoPeriod = config.period * 2;
  config.halfPeriod = config.period / 2;

  config.twoWaveProgressWavelength = config.waveProgressWavelength * 2;
  config.halfWaveProgressWavelength = config.waveProgressWavelength / 2;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates a wave offset value for each tile according to their positions in the grid.
   */
  function initTileProgressOffsets() {
    var job, i, count, tile, length;

    job = this;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      tile = job.grid.tiles[i];

      length = Math.sqrt(tile.originalCenterX * tile.originalCenterX +
          tile.originalCenterY * tile.originalCenterY) + config.twoWaveProgressWavelength;

      tile.waveProgressOffset = -(length % config.twoWaveProgressWavelength -
          config.waveProgressWavelength) / config.waveProgressWavelength;
    }
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   */
  function checkForComplete() {
    var job = this;

    // TODO:
//    if (???) {
//      console.log('WaveAnimationJob completed');
//
//      job.isComplete = true;
//      job.onComplete(true);
//    }
  }

  /**
   * Updates the animation progress of the given tile.
   *
   * @param {number} progress
   * @param {HexTile} tile
   */
  function updateTile(progress, tile) {
    var job, tileProgress;

    job = this;

    tileProgress =
        Math.sin(((((progress + 1 + tile.waveProgressOffset) % 2) + 2) % 2 - 1) * Math.PI);

    tile.centerX = tile.originalCenterX + config.displacementWavelengthX * tileProgress;
    tile.centerY = tile.originalCenterY + config.displacementWavelengthY * tileProgress;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this WaveAnimationJob as started.
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO:
  }

  /**
   * Updates the animation progress of this WaveAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count;

    job = this;

    progress = (currentTime + config.halfPeriod) / config.period % 2 - 1;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      updateTile.call(job, progress, job.grid.tiles[i]);
    }

    checkForComplete.call(job);
  }

  /**
   * Stops this WaveAnimationJob, and returns the element its original form.
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
   * @param {HexGrid} grid
   */
  function WaveAnimationJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.cancel = cancel;

    initTileProgressOffsets.call(job);

    console.log('WaveAnimationJob created');
  }

  WaveAnimationJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.WaveAnimationJob = WaveAnimationJob;

  console.log('WaveAnimationJob module loaded');
})();
