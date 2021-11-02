/**
 * @typedef {AnimationJob} DilateSectorsJob
 */

/**
 * This module defines a constructor for DilateSectorsJob objects.
 *
 * @module DilateSectorsJob
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
   * @this DilateSectorsJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('DilateSectorsJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;
    job.onComplete();
  }

  /**
   * @this OpenPostJob
   */
  function setFinalPositions() {
    var i;

    var job = this;

    // Displace the sectors
    for (i = 0; i < 6; i += 1) {
      // Update the Sector's base position to account for the panning
      job.sectors[i].originalAnchor.x += job.panDisplacement.x;
      job.sectors[i].originalAnchor.y += job.panDisplacement.y;

      job.sectors[i].setOriginalPositionForExpansion(job.isExpanding);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this DilateSectorsJob as started.
   *
   * @this DilateSectorsJob
   * @param {Number} startTime
   */
  function start(startTime) {
    var job = this;

    job.startTime = startTime;
    job.isComplete = false;

    // Set the final positions at the start, and animate everything in "reverse"
    setFinalPositions.call(job);
  }

  /**
   * Updates the animation progress of this DilateSectorsJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this DilateSectorsJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, dx, dy;

    job = this;

    // Calculate progress with an easing function
    // Because the final positions were set at the start, the progress needs to update in "reverse"
    progress = (currentTime - job.startTime) / job.duration;
    progress = 1 - window.hg.util.easingFunctions.easeOutQuint(progress);
    progress = progress < 0 ? 0 : (job.isExpanding ? progress : -progress);

    // Update the offsets for each of the six sectors
    for (i = 0; i < 6; i += 1) {
      dx = job.sectors[i].expandedDisplacement.x * progress;
      dy = job.sectors[i].expandedDisplacement.y * progress;

      job.sectors[i].updateCurrentPosition(dx, dy);
    }

    // Is the job done?
    if (progress === 0) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this DilateSectorsJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this DilateSectorsJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this DilateSectorsJob, and returns the element its original form.
   *
   * @this DilateSectorsJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this DilateSectorsJob
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
   * @param {{x:Number,y:Number}} panDisplacement
   */
  function DilateSectorsJob(grid, tile, onComplete, panDisplacement) {
    var job = this;

    job.grid = grid;
    job.baseTile = grid.expandedTile;
    job.startTime = 0;
    job.isComplete = true;
    job.panDisplacement = panDisplacement;
    job.sectors = grid.sectors;
    job.parentExpansionJob = job.grid.lastExpansionJob;
    job.isExpanding = grid.isPostOpen;

    job.duration = config.duration;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('DilateSectorsJob created: tileIndex=' + job.baseTile.originalIndex);
  }

  DilateSectorsJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.DilateSectorsJob = DilateSectorsJob;

  console.log('DilateSectorsJob module loaded');
})();
