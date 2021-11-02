/**
 * @typedef {AnimationJob} ColorShiftJob
 */

/**
 * @typedef {Object} ShiftStatus
 * @property {Number} timeStart
 * @property {Number} timeEnd
 */

/**
 * @typedef {ShiftStatus} NonContentTileShiftStatus
 * @property {Number} hueDeltaStart
 * @property {Number} hueDeltaEnd
 * @property {Number} saturationDeltaStart
 * @property {Number} saturationDeltaEnd
 * @property {Number} lightnessDeltaStart
 * @property {Number} lightnessDeltaEnd
 */

/**
 * @typedef {ShiftStatus} ContentTileShiftStatus
 * @property {Number} opacityDeltaStart
 * @property {Number} opacityDeltaEnd
 */

/**
 * This module defines a constructor for ColorShiftJob objects.
 *
 * ColorShiftJob objects animate the colors of the tiles in a random fashion.
 *
 * @module ColorShiftJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.hueDeltaMin = -20;
  config.hueDeltaMax = 20;
  config.saturationDeltaMin = 0;
  config.saturationDeltaMax = 0;
  config.lightnessDeltaMin = 0;
  config.lightnessDeltaMax = 0;

  config.imageBackgroundScreenOpacityDeltaMin = -0.05;
  config.imageBackgroundScreenOpacityDeltaMax = 0.05;

  config.transitionDurationMin = 200;
  config.transitionDurationMax = 2000;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates a shift status object for each tile to keep track of their individual animation
   * progress.
   *
   * @this ColorShiftJob
   */
  function initTileShiftStatuses() {
    var job, i, count;

    job = this;

    job.shiftStatusesNonContentTiles = [];
    job.shiftStatusesContentTiles = [];

    for (i = 0, count = job.grid.allNonContentTiles.length; i < count; i += 1) {
      job.shiftStatusesNonContentTiles[i] = {
        timeStart: 0,
        timeEnd: 0,
        hueDeltaStart: 0,
        hueDeltaEnd: 0,
        saturationDeltaStart: 0,
        saturationDeltaEnd: 0,
        lightnessDeltaStart: 0,
        lightnessDeltaEnd: 0,
      };
    }

    for (i = 0, count = job.grid.contentTiles.length; i < count; i += 1) {
      job.shiftStatusesContentTiles[i] = {
        timeStart: 0,
        timeEnd: 0,
        opacityDeltaStart: 0,
        opacityDeltaEnd: 0,
      };
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the animation progress of the given non-content tile.
   *
   * @param {Number} currentTime
   * @param {Tile} tile
   * @param {NonContentTileShiftStatus} shiftStatus
   */
  function updateNonContentTile(currentTime, tile, shiftStatus) {
    if (currentTime > shiftStatus.timeEnd) {
      assignNewNonContentTileTransition(currentTime, shiftStatus);
    }

    var progress = (currentTime - shiftStatus.timeStart) /
        (shiftStatus.timeEnd - shiftStatus.timeStart);

    tile.currentColor.h += progress *
        (shiftStatus.hueDeltaEnd - shiftStatus.hueDeltaStart) +
        shiftStatus.hueDeltaStart;
    tile.currentColor.s += progress *
        (shiftStatus.saturationDeltaEnd - shiftStatus.saturationDeltaStart) +
        shiftStatus.saturationDeltaStart;
    tile.currentColor.l += progress *
        (shiftStatus.lightnessDeltaEnd - shiftStatus.lightnessDeltaStart) +
        shiftStatus.lightnessDeltaStart;

    // Also add a gradual hue shift across all tiles.
    tile.currentColor.h += currentTime / 300;
    tile.currentColor.h %= 360;
  }

  /**
   * Updates the animation progress of the given content tile.
   *
   * @param {Number} currentTime
   * @param {Tile} tile
   * @param {ContentTileShiftStatus} shiftStatus
   */
  function updateContentTile(currentTime, tile, shiftStatus) {
    if (currentTime > shiftStatus.timeEnd) {
      assignNewContentTileTransition(currentTime, shiftStatus);
    }

    var progress = (currentTime - shiftStatus.timeStart) /
        (shiftStatus.timeEnd - shiftStatus.timeStart);

    tile.imageScreenOpacity += progress *
        (shiftStatus.opacityDeltaEnd - shiftStatus.opacityDeltaStart) +
        shiftStatus.opacityDeltaStart;
    // tile.imageScreenOpacity += -tileProgress * config.opacity *
    //     config.deltaOpacityImageBackgroundScreen;
  }

  /**
   * @param {Number} currentTime
   * @param {NonContentTileShiftStatus} shiftStatus
   */
  function assignNewNonContentTileTransition(currentTime, shiftStatus) {
    assignNewTransitionDuration(currentTime, shiftStatus);

    shiftStatus.hueDeltaStart = shiftStatus.hueDeltaEnd;
    shiftStatus.hueDeltaEnd = getNewHueDelta();

    shiftStatus.saturationDeltaStart = shiftStatus.saturationDeltaEnd;
    shiftStatus.saturationDeltaEnd = getNewSaturationDelta();

    shiftStatus.lightnessDeltaStart = shiftStatus.lightnessDeltaEnd;
    shiftStatus.lightnessDeltaEnd = getNewLightnessDelta();
  }

  /**
   * @param {Number} currentTime
   * @param {ContentTileShiftStatus} shiftStatus
   */
  function assignNewContentTileTransition(currentTime, shiftStatus) {
    assignNewTransitionDuration(currentTime, shiftStatus);

    shiftStatus.opacityDeltaStart = shiftStatus.opacityDeltaEnd;
    shiftStatus.opacityDeltaEnd = getNewOpacityDelta();
  }

  /**
   * Create a new duration value, and set up the start and end time to account for any time gap
   * between the end of the last transition and the current time.
   *
   * @param {Number} currentTime
   * @param {ShiftStatus} shiftStatus
   */
  function assignNewTransitionDuration(currentTime, shiftStatus) {
    var elapsedTimeSinceEnd = currentTime - shiftStatus.timeEnd;
    var newDuration = getNewTransitionDuration();
    while (newDuration <= elapsedTimeSinceEnd) {
      elapsedTimeSinceEnd -= newDuration;
      newDuration = getNewTransitionDuration();
    }

    shiftStatus.timeStart = currentTime - elapsedTimeSinceEnd;
    shiftStatus.timeEnd = shiftStatus.timeStart + newDuration;
  }

  /**
   * @returns {Number} A random shift transition duration value between the configured min and max.
   */
  function getNewTransitionDuration() {
    return Math.random() * (config.transitionDurationMax - config.transitionDurationMin) +
        config.transitionDurationMin;
  }

  /**
   * @returns {Number} A random hue delta value between the configured min and max.
   */
  function getNewHueDelta() {
    return Math.random() * (config.hueDeltaMax - config.hueDeltaMin) + config.hueDeltaMin;
  }

  /**
   * @returns {Number} A random saturation delta value between the configured min and max.
   */
  function getNewSaturationDelta() {
    return Math.random() * (config.saturationDeltaMax - config.saturationDeltaMin) +
        config.saturationDeltaMin;
  }

  /**
   * @returns {Number} A random lightness delta value between the configured min and max.
   */
  function getNewLightnessDelta() {
    return Math.random() * (config.lightnessDeltaMax - config.lightnessDeltaMin) +
        config.lightnessDeltaMin;
  }

  /**
   * @returns {Number} A random opacity delta value between the configured min and max.
   */
  function getNewOpacityDelta() {
    return Math.random() * (config.imageBackgroundScreenOpacityDeltaMax -
        config.imageBackgroundScreenOpacityDeltaMin) +
        config.imageBackgroundScreenOpacityDeltaMin;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ColorShiftJob as started.
   *
   * @this ColorShiftJob
   * @param {Number} startTime
   */
  function start(startTime) {
    var job, i, count;

    job = this;

    job.startTime = startTime;
    job.isComplete = false;

    for (i = 0, count = job.shiftStatusesNonContentTiles.length; i < count; i += 1) {
      job.shiftStatusesNonContentTiles[i].timeStart = startTime;
      job.shiftStatusesNonContentTiles[i].timeEnd = startTime;
    }

    for (i = 0, count = job.shiftStatusesContentTiles.length; i < count; i += 1) {
      job.shiftStatusesContentTiles[i].timeStart = startTime;
      job.shiftStatusesContentTiles[i].timeEnd = startTime;
    }
  }

  /**
   * Updates the animation progress of this ColorShiftJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorShiftJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    for (i = 0, count = job.grid.allNonContentTiles.length; i < count; i += 1) {
      updateNonContentTile(currentTime, job.grid.allNonContentTiles[i],
          job.shiftStatusesNonContentTiles[i]);
    }

    for (i = 0, count = job.grid.contentTiles.length; i < count; i += 1) {
      updateContentTile(currentTime, job.grid.contentTiles[i],
          job.shiftStatusesContentTiles[i]);
    }
  }

  /**
   * Draws the current state of this ColorShiftJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorShiftJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorShiftJob.
   *
   * @this ColorShiftJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  /**
   * @this ColorShiftJob
   */
  function refresh() {
    var job = this;

    init.call(job);
  }

  /**
   * @this ColorShiftJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
    initTileShiftStatuses.call(job);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function ColorShiftJob(grid) {
    var job = this;

    job.grid = grid;
    job.shiftStatusesNonContentTiles = null;
    job.shiftStatusesContentTiles = null;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.refresh = refresh;
    job.init = init;

    job.init();

    console.log('ColorShiftJob created');
  }

  ColorShiftJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.ColorShiftJob = ColorShiftJob;

  console.log('ColorShiftJob module loaded');
})();
