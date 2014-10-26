/**
 * @typedef {AnimationJob} OpenPostJob
 */

/**
 * This module defines a constructor for OpenPostJob objects.
 *
 * @module OpenPostJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  config.expandedDisplacementTileCount = 3;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    // TODO:
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this OpenPostJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('OpenPostJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    // TODO:
    // - reactivate neighbor forces; but make sure they are now using their temporary expanded neighborStates
    // - keep the sectors to re-use for closing

    // TODO: when closing the grid, make sure to:
    // - job.grid.sectors[i].destroy();
    // - job.grid.sectors = [];
    // - job.grid.expandedTile = null;
    // - job.grid.allTiles = job.grid.originalTiles;
    // - job.grid.parent.style.overflow = 'auto';
    // - window.hg.controller.resetPersistentJobs(job.grid);

    job.grid.isTransitioning = false;

    job.isComplete = true;

    job.onComplete();
  }

  /**
   * Creates the Sectors for expanding the grid.
   *
   * @this OpenPostJob
   */
  function createSectors() {
    var job, i, j, jCount, k, sectorTiles, allExpandedTiles;

    job = this;

    job.grid.sectors = [];

    // Create the sectors
    for (i = 0; i < 6; i += 1) {
      job.grid.sectors[i] = new window.hg.Sector(job.grid, job.baseTile, i,
          config.expandedDisplacementTileCount);
    }

    // Connect the sectors' tiles' external neighbor states
    for (i = 0; i < 6; i += 1) {
      job.grid.sectors[i].initializeExpandedStateExternalTileNeighbors(job.grid.sectors);
    }

//    dumpSectorInfo.call(job);

    // De-allocate the now-unnecessary two-dimensional sector tile collections
    for (i = 0; i < 6; i += 1) {
      job.grid.sectors[i].tilesByIndex = null;
    }

    // Set up the expanded state for the selected tile (which is a member of no sector)
    window.hg.Tile.initializeTileExpandedState(job.baseTile, null, Number.NaN, Number.NaN);

    // Give the grid a reference to the new complete collection of all tiles
    allExpandedTiles = [];
    for (k = 0, i = 0; i < 6; i += 1) {
      sectorTiles = job.grid.sectors[i].tiles;

      for (j = 0, jCount = sectorTiles.length; j < jCount; j += 1, k += 1) {
        allExpandedTiles[k] = sectorTiles[j];
      }
    }
    allExpandedTiles[k] = job.baseTile;
    job.grid.updateAllTilesCollection(allExpandedTiles);
  }

  /**
   * Logs the new Sector data.
   *
   * @this OpenPostJob
   */
  function dumpSectorInfo() {
    var job, i;

    job = this;

    for (i = 0; i < 6; i += 1) {
      console.log(job.grid.sectors[i]);
    }
  }

  /**
   * @this PanJob
   */
  function setFinalPositions() {
    var job, i, x, y;

    job = this;

    // Displace the sectors
    for (i = 0; i < 6; i += 1) {
      // Update the Sector's base position to account for the panning
      job.grid.sectors[i].originalAnchor.x += job.grid.panCenter.x - job.grid.originalCenter.x;
      job.grid.sectors[i].originalAnchor.y += job.grid.panCenter.y - job.grid.originalCenter.y;

      // Calculate the Sector's end position after the animation has completed
      x = job.grid.sectors[i].originalAnchor.x + job.grid.sectors[i].expandedDisplacement.x;
      y = job.grid.sectors[i].originalAnchor.y + job.grid.sectors[i].expandedDisplacement.y;

      job.grid.sectors[i].setSectorOriginalPosition(x, y);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this OpenPostJob as started.
   *
   * @this OpenPostJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    job.grid.isPostOpen = true;
    job.grid.isTransitioning = true;
    job.grid.expandedTile = job.baseTile;

    // Turn scrolling off while the grid is expanded
    job.grid.parent.style.overflow = 'hidden';

    createSectors.call(job);

    // TODO: this should instead fade out the old persistent animations and fade in the new ones
    job.grid.annotations.setExpandedAnnotations(true);

    // Start the sub-jobs
    window.hg.controller.transientJobs.spread.create(job.grid, job.baseTile);
    window.hg.controller.transientJobs.pan.create(job.grid, job.baseTile);

    // Set the final positions at the start, and animate everything in "reverse"
    setFinalPositions.call(job);

    window.hg.controller.resetPersistentJobs(job.grid);

    // TODO:
    // - make sure that we are handling three different logical states for all appropriate logic in the app: closed, transitioning, open
    // - turn off the recurring LineJobs/LinesRadiateJobs
  }

  /**
   * Updates the animation progress of this OpenPostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this OpenPostJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, x, y;

    job = this;

    // Calculate progress with an easing function
    // Because the final positions were set at the start, the progress needs to update in "reverse"
    progress = (currentTime - job.startTime) / config.duration;
    progress = 1 - window.hg.util.easingFunctions.easeOutQuint(progress);
    progress = progress < 0 ? 0 : progress;

    // Update the offsets for each of the six sectors
    for (i = 0; i < 6; i += 1) {
      x = job.grid.sectors[i].originalAnchor.x -
          job.grid.sectors[i].expandedDisplacement.x * progress;
      y = job.grid.sectors[i].originalAnchor.y -
          job.grid.sectors[i].expandedDisplacement.y * progress;
      job.grid.sectors[i].setSectorCurrentPosition(x, y);
    }

    // Update the opacity of the center tile
    job.baseTile.element.style.opacity = progress;

    // Is the job done?
    if (progress === 0) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this OpenPostJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this OpenPostJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this OpenPostJob, and returns the element its original form.
   *
   * @this OpenPostJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this OpenPostJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
    // TODO:
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
  function OpenPostJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.baseTile = tile;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('OpenPostJob created');
  }

  OpenPostJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.OpenPostJob = OpenPostJob;

  console.log('OpenPostJob module loaded');
})();
