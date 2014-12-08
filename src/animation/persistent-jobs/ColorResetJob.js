/**
 * @typedef {AnimationJob} ColorResetJob
 */

/**
 * This module defines a constructor for ColorResetJob objects.
 *
 * ColorResetJob objects reset tile color values during each animation frame.
 *
 * @module ColorResetJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ColorResetJob as started.
   *
   * @this ColorResetJob
   * @param {Number} startTime
   */
  function start(startTime) {
    var job = this;

    job.startTime = startTime;
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorResetJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorResetJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      job.grid.allTiles[i].currentColor.h = job.grid.allTiles[i].originalColor.h;
      job.grid.allTiles[i].currentColor.s = job.grid.allTiles[i].originalColor.s;
      job.grid.allTiles[i].currentColor.l = job.grid.allTiles[i].originalColor.l;
      job.grid.allTiles[i].imageScreenOpacity = window.hg.TilePost.config.inactiveScreenOpacity;
    }
  }

  /**
   * Draws the current state of this ColorResetJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorResetJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorResetJob, and returns the element its original form.
   *
   * @this ColorResetJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  /**
   * @this ColorResetJob
   */
  function refresh() {
    var job = this;

    init.call(job);
  }

  /**
   * @this ColorResetJob
   */
  function init() {
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function ColorResetJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.refresh = refresh;
    job.init = init;

    job.init();

    console.log('ColorResetJob created');
  }

  ColorResetJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.ColorResetJob = ColorResetJob;

  console.log('ColorResetJob module loaded');
})();
