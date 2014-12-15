/**
 * @typedef {AnimationJob} HighlightRadiateJob
 */

/**
 * This module defines a constructor for HighlightRadiateJob objects.
 *
 * @module HighlightRadiateJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.shimmerSpeed = 3; // pixels / millisecond
  config.shimmerWaveWidth = 500;
  config.duration = 500;

  config.deltaHue = 0;
  config.deltaSaturation = 0;
  config.deltaLightness = 50;

  config.opacity = 0.5;

  config.isRecurring = false;
  config.avgDelay = 4000;
  config.delayDeviationRange = 3800;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates the distance from each tile in the grid to the starting point of this
   * HighlightRadiateJob.
   *
   * This cheats by only calculating the distance to the tiles' original center. This allows us to
   * not need to re-calculate tile distances during each time step.
   *
   * @this HighlightRadiateJob
   */
  function calculateTileDistances() {
    var job, i, count, deltaX, deltaY, distanceOffset;

    job = this;

    distanceOffset = -window.hg.Grid.config.tileShortLengthWithGap;

    for (i = 0, count = job.grid.allNonContentTiles.length; i < count; i += 1) {
      deltaX = job.grid.allNonContentTiles[i].originalAnchor.x - job.startPoint.x;
      deltaY = job.grid.allNonContentTiles[i].originalAnchor.y - job.startPoint.y;
      job.distancesNonContentTiles[i] = Math.sqrt(deltaX * deltaX + deltaY * deltaY) +
          distanceOffset;
    }

    for (i = 0, count = job.grid.contentTiles.length; i < count; i += 1) {
      deltaX = job.grid.contentTiles[i].originalAnchor.x - job.startPoint.x;
      deltaY = job.grid.contentTiles[i].originalAnchor.y - job.startPoint.y;
      job.distancesContentTiles[i] = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + distanceOffset;
    }
  }

  /**
   * @this HighlightRadiateJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('HighlightRadiateJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the background screen opacity of the given content tile according to the given durationRatio.
   *
   * @param {Tile} tile
   * @param {Number} waveWidthRatio Specifies the tile's relative distance to the min and max
   * shimmer distances.
   * @param {Number} oneMinusDurationRatio Specifies how far this animation is through its overall
   * duration.
   */
  function updateTile(tile, waveWidthRatio, oneMinusDurationRatio) {
    tile.foregroundScreenOpacity += -waveWidthRatio * config.opacity * oneMinusDurationRatio *
        (window.hg.Tile.config.inactiveScreenOpacity - window.hg.Tile.config.activeScreenOpacity);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this HighlightRadiateJob as started.
   *
   * @this HighlightRadiateJob
   * @param {Number} startTime
   */
  function start(startTime) {
    var job = this;

    job.startTime = startTime;
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this HighlightRadiateJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this HighlightRadiateJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, currentMaxDistance, currentMinDistance, i, count, distance, waveWidthRatio,
        oneMinusDurationRatio, animatedSomeTile;

    job = this;

    if (currentTime > job.startTime + config.duration) {
      handleComplete.call(job, false);
    } else {
      oneMinusDurationRatio = 1 - (currentTime - job.startTime) / config.duration;

      currentMaxDistance = config.shimmerSpeed * (currentTime - job.startTime);
      currentMinDistance = currentMaxDistance - config.shimmerWaveWidth;

      animatedSomeTile = false;

      // TODO: update these two loops into one
      for (i = 0, count = job.grid.allNonContentTiles.length; i < count; i += 1) {
        distance = job.distancesNonContentTiles[i];

        if (distance > currentMinDistance && distance < currentMaxDistance) {
          waveWidthRatio = (distance - currentMinDistance) / config.shimmerWaveWidth;

          updateTile(job.grid.allNonContentTiles[i], waveWidthRatio,
              oneMinusDurationRatio);

          animatedSomeTile = true;
        }
      }

      for (i = 0, count = job.grid.contentTiles.length; i < count; i += 1) {
        distance = job.distancesContentTiles[i];

        if (distance > currentMinDistance && distance < currentMaxDistance) {
          waveWidthRatio = (distance - currentMinDistance) / config.shimmerWaveWidth;

          updateTile(job.grid.contentTiles[i], waveWidthRatio, oneMinusDurationRatio);

          animatedSomeTile = true;
        }
      }

      if (!animatedSomeTile) {
        handleComplete.call(job, false);
      }
    }
  }

  /**
   * Draws the current state of this HighlightRadiateJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this HighlightRadiateJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this HighlightRadiateJob, and returns the element its original form.
   *
   * @this HighlightRadiateJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this HighlightRadiateJob
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
   * @param {Function} [onComplete]
   */
  function HighlightRadiateJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.startPoint = {x: tile.originalAnchor.x, y: tile.originalAnchor.y};
    job.distancesNonContentTiles = [];
    job.distancesContentTiles = [];
    job.startTime = 0;
    job.isComplete = true;

    job.onComplete = onComplete || function () {};

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = init;

    calculateTileDistances.call(job);

    console.log('HighlightRadiateJob created: tileIndex=' + (tile && tile.originalIndex));
  }

  HighlightRadiateJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.HighlightRadiateJob = HighlightRadiateJob;

  console.log('HighlightRadiateJob module loaded');
})();
