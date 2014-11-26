/**
 * @typedef {AnimationJob} HighlightHoverJob
 */

/**
 * This module defines a constructor for HighlightHoverJob objects.
 *
 * @module HighlightHoverJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  config.deltaHue = 0;
  config.deltaSaturation = 0;
  config.deltaLightness = 50;

  config.opacity = 0.5;

  config.isRecurring = false;
  config.avgDelay = 30;
  config.delayDeviationRange = 20;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this HighlightHoverJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

//    console.log('HighlightHoverJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the background image screen opacity of the given content tile according to the given
   * durationRatio.
   *
   * @param {Tile} tile
   * @param {Number} durationRatio Specifies how far this animation is through its overall
   * duration.
   */
  function updateContentTile(tile, durationRatio) {
    var opacity = window.hg.TilePost.config.activeScreenOpacity +
        (durationRatio * (window.hg.TilePost.config.inactiveScreenOpacity -
        window.hg.TilePost.config.activeScreenOpacity));

    tile.imageScreenOpacity = opacity;
  }

  /**
   * Updates the color of the given non-content tile according to the given durationRatio.
   *
   * @param {Tile} tile
   * @param {Number} durationRatio Specifies how far this animation is through its overall
   * duration.
   */
  function updateNonContentTile(tile, durationRatio) {
    var opacity = config.opacity * (1 - durationRatio);

    tile.currentColor.h += config.deltaHue * opacity;
    tile.currentColor.s += config.deltaSaturation * opacity;
    tile.currentColor.l += config.deltaLightness * opacity;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this HighlightHoverJob as started.
   *
   * @this HighlightHoverJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this HighlightHoverJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this HighlightHoverJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, durationRatio;

    job = this;

    // When the tile is re-highlighted after this job has started, then this job should be
    // cancelled
    if (job.tile.isHighlighted) {
      job.cancel();
      return;
    }

    if (currentTime > job.startTime + config.duration) {
      job.updateTile(job.tile, 1);
      handleComplete.call(job, false);
    } else {
      durationRatio = (currentTime - job.startTime) / config.duration;

      job.updateTile(job.tile, durationRatio);
    }
  }

  /**
   * Draws the current state of this HighlightHoverJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this HighlightHoverJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this HighlightHoverJob, and returns the element its original form.
   *
   * @this HighlightHoverJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this HighlightHoverJob
   */
  function init() {
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   */
  function HighlightHoverJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.startTime = 0;
    job.isComplete = true;

    job.updateTile = tile.holdsContent ? updateContentTile : updateNonContentTile;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

//    console.log('HighlightHoverJob created: tileIndex=' + job.tile.originalIndex);
  }

  HighlightHoverJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.HighlightHoverJob = HighlightHoverJob;

  console.log('HighlightHoverJob module loaded');
})();
