/**
 * @typedef {AnimationJob} DisplacementWaveJob
 */

/**
 * This module defines a constructor for DisplacementWaveJob objects.
 *
 * DisplacementWaveJob objects animate the tiles of a Grid in order to create waves of
 * motion.
 *
 * @module DisplacementWaveJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.period = 3200;
  config.wavelength = 1800;
  config.originX = 0;
  config.originY = 0;

  // Amplitude (will range from negative to positive)
  config.tileDeltaX = -15;
  config.tileDeltaY = -config.tileDeltaX * Math.sqrt(3);

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.halfPeriod = config.period / 2;

    config.displacementAmplitude =
        Math.sqrt(config.tileDeltaX * config.tileDeltaX +
            config.tileDeltaY * config.tileDeltaY);
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates a wave offset value for each tile according to their positions in the grid.
   *
   * @this DisplacementWaveJob
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
   * @param {Number} progress
   * @param {Tile} tile
   * @param {Number} waveProgressOffset
   */
  function updateTile(progress, tile, waveProgressOffset) {
    var tileProgress =
        Math.sin(((((progress + 1 + waveProgressOffset) % 2) + 2) % 2 - 1) * Math.PI);

    tile.currentAnchor.x += config.tileDeltaX * tileProgress;
    tile.currentAnchor.y += config.tileDeltaY * tileProgress;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this DisplacementWaveJob as started.
   *
   * @this DisplacementWaveJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this DisplacementWaveJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this DisplacementWaveJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
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
   * Draws the current state of this DisplacementWaveJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this DisplacementWaveJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this DisplacementWaveJob, and returns the element its original form.
   *
   * @this DisplacementWaveJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  /**
   * @this DisplacementWaveJob
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
  function DisplacementWaveJob(grid) {
    var job = this;

    job.grid = grid;
    job.waveProgressOffsets = null;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = init;

    job.init();

    console.log('DisplacementWaveJob created');
  }

  DisplacementWaveJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.DisplacementWaveJob = DisplacementWaveJob;

  console.log('DisplacementWaveJob module loaded');
})();
