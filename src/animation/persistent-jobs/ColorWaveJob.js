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

  config.deltaOpacityImageBackgroundScreen = 0.18;

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
    job.waveProgressOffsetsNonContentTiles = [];
    job.waveProgressOffsetsContentTiles = [];

    // Calculate offsets for the non-content tiles
    for (i = 0, count = job.grid.allNonContentTiles.length; i < count; i += 1) {
      tile = job.grid.allNonContentTiles[i];

      deltaX = tile.originalAnchor.x - config.originX;
      deltaY = tile.originalAnchor.y - config.originY;
      length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + config.wavelength;

      job.waveProgressOffsetsNonContentTiles[i] =
          -(length % config.wavelength - halfWaveProgressWavelength) / halfWaveProgressWavelength;
    }

    // Calculate offsets for the content tiles
    for (i = 0, count = job.grid.contentTiles.length; i < count; i += 1) {
      tile = job.grid.contentTiles[i];

      deltaX = tile.originalAnchor.x - config.originX;
      deltaY = tile.originalAnchor.y - config.originY;
      length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + config.wavelength;

      job.waveProgressOffsetsContentTiles[i] =
          -(length % config.wavelength - halfWaveProgressWavelength) / halfWaveProgressWavelength;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the animation progress of the given non-content tile.
   *
   * @param {Number} progress From -1 to 1
   * @param {Tile} tile
   * @param {Number} waveProgressOffset From -1 to 1
   */
  function updateNonContentTile(progress, tile, waveProgressOffset) {
    var tileProgress =
        Math.sin(((((progress + 1 + waveProgressOffset) % 2) + 2) % 2 - 1) * Math.PI);

    tile.currentColor.h += config.deltaHue * tileProgress * config.opacity;
    tile.currentColor.s += config.deltaSaturation * tileProgress * config.opacity;
    tile.currentColor.l += config.deltaLightness * tileProgress * config.opacity;
  }

  /**
   * Updates the animation progress of the given content tile.
   *
   * @param {Number} progress From -1 to 1
   * @param {Tile} tile
   * @param {Number} waveProgressOffset From -1 to 1
   */
  function updateContentTile(progress, tile, waveProgressOffset) {
    var tileProgress =
        Math.sin(((((progress + 1 + waveProgressOffset) % 2) + 2) % 2 - 1) * Math.PI) * 0.5 + 0.5;

    tile.imageScreenOpacity += -tileProgress * config.opacity *
        config.deltaOpacityImageBackgroundScreen;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ColorWaveJob as started.
   *
   * @this ColorWaveJob
   * @param {Number} startTime
   */
  function start(startTime) {
    var job = this;

    job.startTime = startTime;
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorWaveJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorWaveJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count;

    job = this;

    progress = (currentTime + config.halfPeriod) / config.period % 2 - 1;

    for (i = 0, count = job.grid.allNonContentTiles.length; i < count; i += 1) {
      updateNonContentTile(progress, job.grid.allNonContentTiles[i],
          job.waveProgressOffsetsNonContentTiles[i]);
    }

    for (i = 0, count = job.grid.contentTiles.length; i < count; i += 1) {
      updateContentTile(progress, job.grid.contentTiles[i],
          job.waveProgressOffsetsContentTiles[i]);
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

  /**
   * @this ColorWaveJob
   */
  function refresh() {
    var job = this;

    init.call(job);
  }

  /**
   * @this ColorWaveJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
    initTileProgressOffsets.call(job);
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
    job.waveProgressOffsetsNonContentTiles = null;
    job.waveProgressOffsetsContentTiles = null;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.refresh = refresh;
    job.init = init;

    job.init();

    console.log('ColorWaveJob created');
  }

  ColorWaveJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.ColorWaveJob = ColorWaveJob;

  console.log('ColorWaveJob module loaded');
})();
