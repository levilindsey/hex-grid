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
      job.grid.updateAllTilesCollection(job.grid.originalTiles);

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
    var job, i, count, alsoDestroyOriginalTileExpandedState;

    job = this;

    alsoDestroyOriginalTileExpandedState = job.grid.lastExpansionJob === job;

    // Destroy the sectors
    for (i = 0, count = job.sectors.length; i < count; i += 1) {
      job.sectors[i].destroy(alsoDestroyOriginalTileExpandedState);
    }

    job.sectors = [];
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
    var panDisplacement;
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    job.grid.isPostOpen = false;
    job.grid.isTransitioning = true;
    job.grid.lastExpansionJob = job;

    panDisplacement = {
      x: job.grid.originalCenter.x - job.grid.panCenter.x,
      y: job.grid.originalCenter.y - job.grid.panCenter.y
    };

    // Start the sub-jobs
    window.hg.controller.transientJobs.spread.create(job.grid, job.baseTile)
        .duration = config.duration + window.hg.OpenPostJob.config.spreadDurationOffset;
    window.hg.controller.transientJobs.pan.create(job.grid, job.baseTile, {
      x: job.grid.panCenter.x,
      y: job.grid.panCenter.y
    })
        .duration = config.duration + window.hg.OpenPostJob.config.panDurationOffset;
    window.hg.controller.transientJobs.dilateSectors.create(job.grid, job.baseTile, panDisplacement)
        .duration = config.duration + window.hg.OpenPostJob.config.dilateSectorsDurationOffset;
    window.hg.controller.transientJobs.fadePost.create(job.grid, job.baseTile)
        .duration = config.duration + window.hg.OpenPostJob.config.fadePostDurationOffset;

    job.grid.annotations.setExpandedAnnotations(false);

    // Turn scrolling back on
    job.grid.parent.style.overflowY = 'auto';
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
    var job = this;

    // Is the job done?
    if (currentTime - job.startTime >= config.duration) {
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
