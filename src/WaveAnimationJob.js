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

  config.period = 1800;
  config.displacementWavelengthX = 30;
  config.displacementWavelengthY = 30;
  config.waveProgressWavelength = 1000;

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

      length = -Math.sqrt(tile.originalCenterX * tile.originalCenterX +
          tile.originalCenterY * tile.originalCenterY);

      tile.waveProgressOffset = Math.sin(((length % config.twoWaveProgressWavelength -
          config.waveProgressWavelength) / config.waveProgressWavelength) * Math.PI);
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

//    tileProgressX = (((progress + 1 + tile.waveProgressOffsetX) % 2) + 2) % 2 - 1;
//    tileProgressY = (((progress + 1 + tile.waveProgressOffsetY) % 2) + 2) % 2 - 1;
//    tileProgressX = Math.sin(tileProgressX * Math.PI);
//    tileProgressY = Math.sin(tileProgressY * Math.PI);

//    tileProgressX = (progress + tile.waveProgressOffsetX) % 1;
//    tileProgressY = (progress + tile.waveProgressOffsetY) % 1;
//    if (tile.index === 0) {
//      console.log('****************************************************');
//      console.log('progress=' + progress);
//      console.log('tileProgressX=' + tileProgressX);
//      console.log('tileProgressY=' + tileProgressY);
//      console.log('tile.waveProgressOffsetX=' + tile.waveProgressOffsetX);
//      console.log('tile.waveProgressOffsetY=' + tile.waveProgressOffsetY);
//    }

    tile.centerX = tile.originalCenterX + config.displacementWavelengthX * tileProgress;
    tile.centerY = tile.originalCenterY + config.displacementWavelengthY * tileProgress;
//    tile.centerX = tile.originalCenterX + config.displacementWavelengthX * tileProgressX;
//    tile.centerY = tile.originalCenterY + config.displacementWavelengthY * tileProgressY;
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
//    progress =
//        Math.sin(((currentTime % config.twoPeriod - config.period) / config.period) * Math.PI);

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

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.WaveAnimationJob = WaveAnimationJob;

  console.log('WaveAnimationJob module loaded');
})();
