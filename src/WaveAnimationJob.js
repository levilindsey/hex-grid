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

  config.period = 1000;
  config.displacementWavelengthX = 100;
  config.displacementWavelengthY = 100;
  config.waveProgressWavelengthX = 100;
  config.waveProgressWavelengthY = 100;

  config.twoPeriod = config.period * 2;
  config.halfPeriod = config.period / 2;

  config.twoWaveProgressWavelengthX = config.waveProgressWavelengthX * 2;
  config.twoWaveProgressWavelengthY = config.waveProgressWavelengthY * 2;
  config.halfWaveProgressWavelengthX = config.waveProgressWavelengthX / 2;
  config.halfWaveProgressWavelengthY = config.waveProgressWavelengthY / 2;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates a wave offset value for each tile according to their positions in the grid.
   */
  function initTileProgressOffsets() {
    var job, i, count, tile;

    job = this;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      tile = job.grid.tiles[i];
      tile.waveProgressOffsetX = Math.sin(((Math.abs(tile.originalCenterX) %
          config.twoWaveProgressWavelengthX - config.waveProgressWavelengthX) /
          config.waveProgressWavelengthX) * Math.PI);
      tile.waveProgressOffsetY = Math.sin(((Math.abs(tile.originalCenterY) %
          config.twoWaveProgressWavelengthY - config.waveProgressWavelengthY) /
          config.waveProgressWavelengthY) * Math.PI);
      // TODO: make sure that this curve is continuous across zero
      **;
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
    var job, tileProgressX, tileProgressY;

    job = this;

    tileProgressX = (progress + tile.waveProgressOffsetX) % 1;
    tileProgressY = (progress + tile.waveProgressOffsetY) % 1;

    tile.centerX = tile.originalCenterX + config.displacementWavelengthX * tileProgressX;
    tile.centerY = tile.originalCenterY + config.displacementWavelengthY * tileProgressY;
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

    //progress = (currentTime + config.halfPeriod) / config.period % 1;
    progress =
        Math.sin(((currentTime % config.twoPeriod - config.period) / config.period) * Math.PI);

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      updateTile.call(job, progress, job.grid.tiles[i]);
    }

//    progress =
//        Math.sin(((currentTime % config.twoPeriod - config.period) / config.period) * Math.PI);
//    px = progress * config.maxDeltaX + job.grid.tiles[0].centerX;
//    py = progress * config.maxDeltaY + job.grid.tiles[0].centerY;
//
//    job.grid.tiles[0].fixPosition(px, py);

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
