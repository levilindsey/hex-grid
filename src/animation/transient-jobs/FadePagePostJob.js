/**
 * @typedef {AnimationJob} FadePagePostJob
 */

/**
 * This module defines a constructor for FadePagePostJob objects.
 *
 * @module FadePagePostJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  config.quickFadeDurationRatio = 0.5;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this FadePagePostJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('FadePagePostJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.pagePost.draw();

    job.isComplete = true;
    job.onComplete();

    if (!job.isFadingIn) {
      // Don't reset some state if another expansion job started after this one did
      if (job.parentExpansionJob === job.grid.lastExpansionJob) {
        job.grid.destroyPagePost();
      } else {
        job.pagePost.destroy();
      }
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this FadePagePostJob as started.
   *
   * @this FadePagePostJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    if (job.isFadingIn) {
      job.pagePost = job.grid.createPagePost(job.baseTile);
    }
  }

  /**
   * Updates the animation progress of this FadePagePostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this FadePagePostJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function updateFadeIn(currentTime, deltaTime) {
    var job, progress, quickFadeProgress;

    job = this;

    // Calculate progress with an easing function
    progress = (currentTime - job.startTime) / job.duration;
    progress = window.hg.util.easingFunctions.easeOutQuint(progress);
    progress = progress > 1 ? 1 : progress;

    // The TilePost fades out faster than the PagePost fades in
    quickFadeProgress = progress / config.quickFadeDurationRatio;
    quickFadeProgress = 1 - (quickFadeProgress > 1 ? 1 : quickFadeProgress);

    // Update the opacity of the center Tile
    job.baseTile.element.style.opacity = quickFadeProgress;
    job.baseTile.tilePost.elements.title.style.opacity = quickFadeProgress;

    // Update the opacity of the PagePost
    job.pagePost.opacity = progress;

    // Is the job done?
    if (progress === 1) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Updates the animation progress of this FadePagePostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this FadePagePostJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function updateFadeOut(currentTime, deltaTime) {
    var job, progress, quickFadeProgress;

    job = this;

    // Calculate progress with an easing function
    progress = (currentTime - job.startTime) / job.duration;
    progress = window.hg.util.easingFunctions.easeOutQuint(progress);
    progress = progress > 1 ? 1 : progress;

    // The PagePost fades out faster than the TilePost fades in
    quickFadeProgress = progress / config.quickFadeDurationRatio;
    quickFadeProgress = quickFadeProgress > 1 ? 1 : quickFadeProgress;

    // Update the opacity of the center Tile
    job.baseTile.element.style.opacity = progress;
    job.baseTile.tilePost.elements.title.style.opacity = progress;

    // Update the opacity of the PagePost
    job.pagePost.opacity = 1 - quickFadeProgress;

    // Is the job done?
    if (progress === 1) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this FadePagePostJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this FadePagePostJob
   */
  function draw() {
    var job = this;

    job.pagePost.draw();
  }

  /**
   * Stops this FadePagePostJob, and returns the element its original form.
   *
   * @this FadePagePostJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this FadePagePostJob
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
  function FadePagePostJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.baseTile = grid.expandedTile;
    job.startTime = 0;
    job.isComplete = true;
    job.pagePost = grid.pagePost
    job.parentExpansionJob = job.grid.lastExpansionJob;
    job.isFadingIn = grid.isPostOpen;

    job.duration = config.duration;

    job.start = start;
    job.update = job.isFadingIn ? updateFadeIn : updateFadeOut;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('FadePagePostJob created: tileIndex=' + job.baseTile.originalIndex +
        ', isFadingIn=' + job.isFadingIn);
  }

  FadePagePostJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.FadePagePostJob = FadePagePostJob;

  console.log('FadePagePostJob module loaded');
})();
