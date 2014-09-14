'use strict';

/**
 * This module defines a constructor for ColorWaveAnimationJob objects.
 *
 * ColorWaveAnimationJob objects animate the tiles of a HexGrid in order to create waves of color.
 *
 * @module ColorWaveAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.period = 1000;
  config.wavelength = 600;
  config.originX = -100;
  config.originY = 1400;

  // Amplitude (will range from negative to positive)
  config.deltaHue = 0;
  config.deltaSaturation = 0;
  config.deltaLightness = 5;

  config.opacity = 0.5;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.halfPeriod = config.period / 2;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates a wave offset value for each tile according to their positions in the grid.
   *
   * @this ColorWaveAnimationJob
   */
  function initTileProgressOffsets() {
    var job, i, count, tile, length, deltaX, deltaY, halfWaveProgressWavelength;

    job = this;

    halfWaveProgressWavelength = config.wavelength / 2;
    job.waveProgressOffsets = [];

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      tile = job.grid.tiles[i];

      deltaX = tile.originalCenterX - config.originX;
      deltaY = tile.originalCenterY - config.originY;
      length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + config.wavelength;

      job.waveProgressOffsets[i] = -(length % config.wavelength - halfWaveProgressWavelength)
          / halfWaveProgressWavelength;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the animation progress of the given tile.
   *
   * @param {number} progress
   * @param {HexTile} tile
   * @param {number} waveProgressOffset
   */
  function updateTile(progress, tile, waveProgressOffset) {
    var tileProgress =
        Math.sin(((((progress + 1 + waveProgressOffset) % 2) + 2) % 2 - 1) * Math.PI);

    tile.currentHue = tile.currentHue + config.deltaHue * tileProgress * config.opacity;
    tile.currentSaturation =
        tile.currentSaturation + config.deltaSaturation * tileProgress * config.opacity;
    tile.currentLightness =
        tile.currentLightness + config.deltaLightness * tileProgress * config.opacity;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ColorWaveAnimationJob as started.
   *
   * @this ColorWaveAnimationJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorWaveAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorWaveAnimationJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count;

    job = this;

    progress = (currentTime + config.halfPeriod) / config.period % 2 - 1;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      updateTile(progress, job.grid.tiles[i], job.waveProgressOffsets[i]);
    }
  }

  /**
   * Draws the current state of this ColorWaveAnimationJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorWaveAnimationJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorWaveAnimationJob, and returns the element its original form.
   *
   * @this ColorWaveAnimationJob
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
  function ColorWaveAnimationJob(grid) {
    var job = this;

    job.grid = grid;
    job.waveProgressOffsets = null;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = function () {
      config.computeDependentValues();
      initTileProgressOffsets.call(job);
    };

    job.init();

    console.log('ColorWaveAnimationJob created');
  }

  ColorWaveAnimationJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.ColorWaveAnimationJob = ColorWaveAnimationJob;

  console.log('ColorWaveAnimationJob module loaded');
})();
