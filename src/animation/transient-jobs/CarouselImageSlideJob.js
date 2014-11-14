/**
 * @typedef {AnimationJob} CarouselImageSlideJob
 */

/**
 * This module defines a constructor for CarouselImageSlideJob objects.
 *
 * @module CarouselImageSlideJob
 */
(function () {**;// TODO: Implement this file
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 300;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this CarouselImageSlideJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('CarouselImageSlideJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.pagePost.draw();

    job.isComplete = true;
    job.onComplete();

    // TODO
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this CarouselImageSlideJob as started.
   *
   * @this CarouselImageSlideJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO
  }

  /**
   * Updates the animation progress of this CarouselImageSlideJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this CarouselImageSlideJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress;

    job = this;

    // Calculate progress with an easing function
    progress = (currentTime - job.startTime) / job.duration;
    progress = window.hg.util.easingFunctions.easeOutQuint(progress);
    progress = progress > 1 ? 1 : progress;

    // TODO

    // Is the job done?
    if (progress === 1) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this CarouselImageSlideJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this CarouselImageSlideJob
   */
  function draw() {
    var job = this;

    // TODO
  }

  /**
   * Stops this CarouselImageSlideJob, and returns the element its original form.
   *
   * @this CarouselImageSlideJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this CarouselImageSlideJob
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
   * @param {Carousel} carousel
   */
  function CarouselImageSlideJob(grid, tile, onComplete, carousel) {
    var job = this;

    job.grid = grid;
    job.baseTile = grid.expandedTile;
    job.startTime = 0;
    job.isComplete = true;
    job.carousel = carousel;
    job.isASlideToNext = carousel.latestTransitionIsToNext;

    job.duration = config.duration;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('CarouselImageSlideJob created: isASlideToNext=' + job.isASlideToNext);
  }

  CarouselImageSlideJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.CarouselImageSlideJob = CarouselImageSlideJob;

  console.log('CarouselImageSlideJob module loaded');
})();
