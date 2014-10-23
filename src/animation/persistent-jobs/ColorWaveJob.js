/**
 * @typedef {AnimationJob} ColorWaveJob
 */

/**
 * This module defines a constructor for ColorWaveJob objects.
 *
 * ColorWaveJob objects animate the tiles of a Grid in order to create waves of color.
 *
 * @module ColorWaveJob
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
   * @this ColorWaveJob
   */
  function initTileProgressOffsets() {
    var job, i, count, tile, length, deltaX, deltaY, halfWaveProgressWavelength;

    job = this;

    halfWaveProgressWavelength = config.wavelength / 2;
    job.waveProgressOffsets = [];

    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      tile = job.grid.allTiles[i];

      deltaX = tile.originalAnchor.x - config.originX;
      deltaY = tile.originalAnchor.y - config.originY;
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
   * @param {Tile} tile
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
   * Sets this ColorWaveJob as started.
   *
   * @this ColorWaveJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorWaveJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorWaveJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count;

    job = this;

    progress = (currentTime + config.halfPeriod) / config.period % 2 - 1;

    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      updateTile(progress, job.grid.allTiles[i], job.waveProgressOffsets[i]);
    }
  }

  /**
   * Draws the current state of this ColorWaveJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorWaveJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorWaveJob, and returns the element its original form.
   *
   * @this ColorWaveJob
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
   * @param {Grid} grid
   */
  function ColorWaveJob(grid) {
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

    console.log('ColorWaveJob created');
  }

  ColorWaveJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.ColorWaveJob = ColorWaveJob;

  console.log('ColorWaveJob module loaded');
})();
