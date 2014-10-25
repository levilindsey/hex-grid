/**
 * @typedef {AnimationJob} PanJob
 */

/**
 * This module defines a constructor for PanJob objects.
 *
 * @module PanJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  config.displacementRatio = 0.28;

  config.isRecurring = false;
  config.avgDelay = 300;
  config.delayDeviationRange = 0;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this PanJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('PanJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  /**
   * @this PanJob
   */
  function setFinalPositions() {
    var job, i, count;

    job = this;

    // Displace the tiles
    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      job.grid.allTiles[i].originalAnchor.x += job.displacement.x;
      job.grid.allTiles[i].originalAnchor.y += job.displacement.y;
    }

    // Update the grid
    job.grid.panCenter.x += job.displacement.x;
    job.grid.panCenter.y += job.displacement.y;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this PanJob as started.
   *
   * @this PanJob
   */
  function start() {
    var job = this;

    job.reverseDisplacement = {x: job.endPoint.x - job.startPoint.x, y: job.endPoint.y - job.startPoint.y};
    job.displacement = {x: -job.reverseDisplacement.x, y: -job.reverseDisplacement.y};

    job.startTime = Date.now();
    job.isComplete = false;

    setFinalPositions.call(job);
  }

  /**
   * Updates the animation progress of this PanJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this PanJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count, displacementX, displacementY;

    job = this;

    // Calculate progress with an easing function
    progress = (currentTime - job.startTime) / config.duration;
    progress = 1 - window.hg.util.easingFunctions.easeOutQuint(progress);
    progress = progress < 0 ? 0 : progress;

    displacementX = job.reverseDisplacement.x * progress;
    displacementY = job.reverseDisplacement.y * progress;

    // Displace the tiles
    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      job.grid.allTiles[i].currentAnchor.x += displacementX;
      job.grid.allTiles[i].currentAnchor.y += displacementY;
    }

    // Update the grid
    job.grid.currentCenter.x = job.grid.panCenter.x + displacementX;
    job.grid.currentCenter.y = job.grid.panCenter.y + displacementY;

    // Is the job done?
    if (progress === 0) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this PanJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this PanJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this PanJob, and returns the element its original form.
   *
   * @this PanJob
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
   * @param {?Tile} tile
   * @param {Function} onComplete
   * @param {{x:Number,y:Number}} [destinationPoint]
   */
  function PanJob(grid, tile, onComplete, destinationPoint) {
    var job = this;

    job.grid = grid;
    job.baseTile = tile;
    job.reverseDisplacement = null;
    job.displacement = null;
    job.startTime = 0;
    job.isComplete = false;

    // The current viewport coordinates of the point that we would like to move to the center of the viewport
    job.endPoint = destinationPoint || {x: tile.originalAnchor.x, y: tile.originalAnchor.y};

    // The center of the viewport
    job.startPoint = {x: grid.originalCenter.x, y: grid.originalCenter.y};

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = function () {};

    console.log('PanJob created');
  }

  PanJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.PanJob = PanJob;

  console.log('PanJob module loaded');
})();
