/**
 * @typedef {AnimationJob} ClosePostJob
 */

/**
 * This module defines a constructor for ClosePostJob objects.
 *
 * @module ClosePostJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this ClosePostJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('ClosePostJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    destroySectors.call(job);

    // Don't reset some state if another expansion job started after this one did
    if (job.grid.lastExpansionJob === job) {
      // Destroy the expanded tile expanded state
      job.baseTile.expandedState = null;

      job.grid.sectors = [];
      job.grid.lastExpansionJob = null;
      job.grid.updateAllTilesCollection(job.grid.originalTiles);

      // Turn scrolling back on
      job.grid.parent.style.overflow = 'auto';

      job.grid.isTransitioning = false;
      job.grid.expandedTile = null;

      // TODO: this should instead fade out the old persistent animations and fade in the new ones
      // Restart the persistent jobs now the the overall collection of tiles has changed
      window.hg.controller.resetPersistentJobs(job.grid);
    }

    job.isComplete = true;

    job.onComplete();
  }

  /**
   * @this ClosePostJob
   */
  function destroySectors() {
    var job, i, alsoDestroyOriginalTileExpandedState;

    job = this;

    alsoDestroyOriginalTileExpandedState = job.grid.lastExpansionJob === job;

    // Destroy the sectors
    for (i = 0; i < 6; i += 1) {
      job.sectors[i].destroy(alsoDestroyOriginalTileExpandedState);
    }

    job.sectors = [];
  }

  /**
   * @this ClosePostJob
   * @param {Number} panDisplacementX
   * @param {Number} panDisplacementY
   */
  function setFinalPositions(panDisplacementX, panDisplacementY) {
    var job, i;

    job = this;

    // Displace the sectors
    for (i = 0; i < 6; i += 1) {
      // Update the Sector's base position to account for the panning
      job.sectors[i].originalAnchor.x -= panDisplacementX;
      job.sectors[i].originalAnchor.y -= panDisplacementY;

      job.sectors[i].setOriginalPositionForExpansion(false);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ClosePostJob as started.
   *
   * @this ClosePostJob
   */
  function start() {
    var panDisplacementX, panDisplacementY;
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    job.grid.isPostOpen = false;
    job.grid.isTransitioning = true;
    job.grid.lastExpansionJob = job;

    panDisplacementX = job.grid.panCenter.x - job.grid.originalCenter.x;
    panDisplacementY = job.grid.panCenter.y - job.grid.originalCenter.y;

    // Start the sub-jobs
    window.hg.controller.transientJobs.spread.create(job.grid, job.baseTile);
    window.hg.controller.transientJobs.pan.create(job.grid, job.baseTile, {
      x: job.grid.panCenter.x,
      y: job.grid.panCenter.y
    });

    // Set the final positions at the start, and animate everything in "reverse"
    setFinalPositions.call(job, panDisplacementX, panDisplacementY);

    job.grid.annotations.setExpandedAnnotations(false);
  }

  /**
   * Updates the animation progress of this ClosePostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ClosePostJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, dx, dy;

    job = this;

    // Calculate progress with an easing function
    // Because the final positions were set at the start, the progress needs to update in "reverse"
    progress = (currentTime - job.startTime) / config.duration;
    progress = 1 - window.hg.util.easingFunctions.easeOutQuint(progress);
    progress = progress < 0 ? 0 : progress;

    // Update the offsets for each of the six sectors
    for (i = 0; i < 6; i += 1) {
      dx = -job.sectors[i].expandedDisplacement.x * progress;
      dy = -job.sectors[i].expandedDisplacement.y * progress;

      job.sectors[i].updateCurrentPosition(dx, dy);
    }

    // Update the opacity of the center tile
    job.baseTile.element.style.opacity = 1 - progress;

    // Is the job done?
    if (progress === 0) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this ClosePostJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ClosePostJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ClosePostJob, and returns the element its original form.
   *
   * @this ClosePostJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this ClosePostJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
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
  function ClosePostJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.baseTile = grid.expandedTile;
    job.startTime = 0;
    job.isComplete = true;
    job.sectors = grid.sectors;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('ClosePostJob created: tileIndex=' + job.baseTile.originalIndex);
  }

  ClosePostJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.ClosePostJob = ClosePostJob;

  console.log('ClosePostJob module loaded');
})();
