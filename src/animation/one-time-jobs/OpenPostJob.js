'use strict';

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

  config.expandedDisplacementTileCount = 3;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   */
  function checkForComplete() {
    var job = this;

    // TODO:
//    if (???) {
//      console.log('OpenPostJob completed');
//
//      job.isComplete = true;
//      job.onComplete(true);
//    }
  }

  /**
   * @this OpenPostJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('OpenPostJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    // TODO:
    // - reactivate neighbor forces; but make sure they are now using their temporary expanded neighborStates
    // - keep the sectors to re-use for closing

    // TODO: when closing the grid, make sure to de-allocate the sector objects and the tile.expandedState properties (sector.destroy)

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
    var job, i;

    job = this;

    job.grid.sectors = [];

    // Create the sectors
    for (i = 0; i < 6; i += 1) {
      job.grid.sectors[i] =
          new hg.Sector(job.grid, job.baseTile, i, config.expandedDisplacementTileCount);
    }

    // Connect the sectors' tiles' external neighbor states
    for (i = 0; i < 6; i += 1) {
      job.grid.sectors[i].initializeExpandedStateExternalTileNeighbors(job.grid.sectors);
    }

    dumpSectorInfo.call(job);// TODO: comment this out

    // De-allocate the now-unnecessary two-dimensional sector tile collections
    for (i = 0; i < 6; i += 1) {
      job.grid.sectors[i].tilesByIndex = null;
    }
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
      console.log(job.grid.sectors[i]);// TODO: print out something that's more helpful
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

    createSectors.call(job);

    job.grid.annotations.setExpandedAnnotations(true);


    // TODO:
    // - make sure that we are handling three different logical states for all appropriate logic in the app: closed, transitioning, open

    // TODO:
    // - deactivate all neighbor forces
    // - start tapering all current animations to zero
    // - start the panning animation to center on the given tile position
    // - calculate which positions will need additional tiles for the expanded grid at the new panned location
    // - create the new tiles; store them in auxiliary arrays within the new sector objects
  }

  /**
   * Updates the animation progress of this OpenPostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this OpenPostJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    // TODO:
    // - update the base offsets for each of the six sectors
    // -

    checkForComplete.call(job);
  }

  /**
   * Draws the current state of this OpenPostJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this OpenPostJob
   */
  function draw() {
    var job = this;

    // TODO:
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

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} baseTile
   * @param {Function} onComplete
   */
  function OpenPostJob(grid, baseTile, onComplete) {
    var job = this;

    job.grid = grid;
    job.baseTile = baseTile;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;

    console.log('OpenPostJob created');
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.OpenPostJob = OpenPostJob;

  console.log('OpenPostJob module loaded');
})();
