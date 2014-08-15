'use strict';

/**
 * This module defines a constructor for WaveAnimationJob objects.
 *
 * WaveAnimationJob objects animate the tiles of a HexGrid in order to create a wave motion.
 *
 * @module WaveAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.period = 3200;
  config.tileDeltaX = -15;
  config.tileDeltaY = -config.tileDeltaX * Math.sqrt(3);
  config.wavelength = 1800;
  config.originX = 0;
  config.originY = 0;

  config.displacementWavelength =
      Math.sqrt(config.tileDeltaX * config.tileDeltaX +
          config.tileDeltaY * config.tileDeltaY);

  config.halfPeriod = config.period / 2;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates a wave offset value for each tile according to their positions in the grid.
   *
   * @this WaveAnimationJob
   */
  function initTileProgressOffsets() {
    var job, i, count, tile, length, deltaX, deltaY, halfWaveProgressWavelength;

    job = this;

    halfWaveProgressWavelength = config.wavelength / 2;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      tile = job.grid.tiles[i];

      deltaX = tile.originalCenterX - config.originX;
      deltaY = tile.originalCenterY - config.originY;
      length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + config.wavelength;

      tile.waveProgressOffset = -(length % config.wavelength - halfWaveProgressWavelength)
          / halfWaveProgressWavelength;
    }
  }

  /**
   * Updates the animation progress of the given tile.
   *
   * @this WaveAnimationJob
   * @param {number} progress
   * @param {HexTile} tile
   */
  function updateTile(progress, tile) {
    var job, tileProgress;

    job = this;

    tileProgress =
        Math.sin(((((progress + 1 + tile.waveProgressOffset) % 2) + 2) % 2 - 1) * Math.PI);

    tile.centerX = tile.originalCenterX + config.tileDeltaX * tileProgress;
    tile.centerY = tile.originalCenterY + config.tileDeltaY * tileProgress;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this WaveAnimationJob as started.
   *
   * @this WaveAnimationJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this WaveAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this WaveAnimationJob
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
  }

  /**
   * Draws the current state of this WaveAnimationJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this WaveAnimationJob
   */
  function draw() {
    var job = this;
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this WaveAnimationJob, and returns the element its original form.
   *
   * @this WaveAnimationJob
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
   * @param {HexGrid} grid
   */
  function WaveAnimationJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = function () {
      initTileProgressOffsets.call(job);
    };

    job.init();

    console.log('WaveAnimationJob created');
  }

  WaveAnimationJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.WaveAnimationJob = WaveAnimationJob;

  console.log('WaveAnimationJob module loaded');
})();
