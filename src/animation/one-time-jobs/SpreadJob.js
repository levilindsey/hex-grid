/**
 * @typedef {AnimationJob} SpreadJob
 */

/**
 * This module defines a constructor for SpreadJob objects.
 *
 * @module SpreadJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  config.displacementRatio = 0.28;

  config.isRecurring = false;
  config.avgDelay = 4000;
  config.delayDeviationRange = 3800;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates and stores the maximal displacement values for all tiles.
   *
   * @this SpreadJob
   */
  function initializeDisplacements() {
    var job, i, iCount, j, jCount, k, tiles, displacementRatio;

    job = this;

    job.displacements = [];

    k = 0;

    if (job.grid.isPostOpen) {
      // Consider all of the old AND new tiles
      for (i = 0, iCount = job.grid.sectors.length; i < iCount; i += 1) {
        tiles = job.grid.sectors[i].tiles;

        for (j = 0, jCount = tiles.length; j < jCount; j += 1) {
          job.displacements[k] = {
            tile: tiles[j],
            displacementX: config.displacementRatio *
                (tiles[j].originalAnchorX - job.tile.originalAnchorX),
            displacementY: config.displacementRatio *
                (tiles[j].originalAnchorY - job.tile.originalAnchorY)
          };
          k += 1;
        }
      }
    } else {
      for (i = 0, iCount = job.grid.tiles.length; i < iCount; i += 1) {
        job.displacements[i] = {
          tile: job.grid.tiles[i],
          displacementX: config.displacementRatio *
              (job.grid.tiles[i].originalAnchorX - job.tile.originalAnchorX),
          displacementY: config.displacementRatio *
              (job.grid.tiles[i].originalAnchorY - job.tile.originalAnchorY)
        };
      }
    }
  }

  /**
   * @this SpreadJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('SpreadJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this SpreadJob as started.
   *
   * @this SpreadJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this SpreadJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this SpreadJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count;

    job = this;

    if (currentTime > job.startTime + config.duration) {
      handleComplete.call(job, false);
    } else {
      // Ease-out halfway, then ease-in back
      progress = (currentTime - job.startTime) / config.duration;
      progress = (progress > 0.5 ? 1 - progress : progress) * 2;
      progress = window.hg.util.easingFunctions.easeOutQuint(progress);

      // Displace the tiles
      for (i = 0, count = job.displacements.length; i < count; i += 1) {
        job.displacements[i].tile.anchorX += job.displacements[i].displacementX * progress;
        job.displacements[i].tile.anchorY += job.displacements[i].displacementY * progress;
      }
    }
  }

  /**
   * Draws the current state of this SpreadJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this SpreadJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this SpreadJob, and returns the element its original form.
   *
   * @this SpreadJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
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
  function SpreadJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.startTime = 0;
    job.isComplete = false;

    job.displacements = null;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;

    initializeDisplacements.call(job);

    console.log('SpreadJob created');
  }

  SpreadJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.SpreadJob = SpreadJob;

  console.log('SpreadJob module loaded');
})();
