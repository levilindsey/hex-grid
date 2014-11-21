/**
 * @typedef {AnimationJob} FadePostJob
 */

/**
 * This module defines a constructor for FadePostJob objects.
 *
 * @module FadePostJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  config.quick1FadeDurationRatio = 0.7;
  config.quick2FadeDurationRatio = 0.3;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this FadePostJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('FadePostJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;
    job.onComplete();

    if (!job.isFadingIn) {
      // Don't reset some state if another expansion job started after this one did
      if (job.parentExpansionJob === job.grid.lastExpansionJob) {
        job.grid.destroyPagePost();

        job.baseTile.originalVertexDeltas = null;
        job.baseTile.expandedVertexDeltas = null;
      } else {
        job.pagePost.destroy();
      }

      job.baseTile.show();
    } else {
      // Don't reset some state if another expansion job started after this one did
      if (job.parentExpansionJob === job.grid.lastExpansionJob) {
        job.baseTile.hide();
      }
    }

    job.baseTile.element.style.pointerEvents = 'auto';
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * @param {Array.<Number>} currentVertexDeltas
   * @param {Array.<Number>} oldVertexDeltas
   * @param {Array.<Number>} newVertexDeltas
   * @param {Number} progress
   */
  function interpolateVertexDeltas(currentVertexDeltas, oldVertexDeltas, newVertexDeltas,
                                   progress) {
    var i, count;

    for (i = 0, count = currentVertexDeltas.length; i < count; i += 1) {
      currentVertexDeltas[i] =
          oldVertexDeltas[i] + (newVertexDeltas[i] - oldVertexDeltas[i]) * progress;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this FadePostJob as started.
   *
   * @this FadePostJob
   */
  function start() {
    var expandedTileOuterRadius;
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    job.pagePostStartPosition = {};
    job.pagePostDisplacement = {};

    job.baseTile.show();

    if (job.isFadingIn) {
      job.pagePostStartPosition.x = job.baseTile.particle.px;
      job.pagePostStartPosition.y = job.baseTile.particle.py;
      job.pagePostDisplacement.x = job.grid.originalCenter.x - job.pagePostStartPosition.x;
      job.pagePostDisplacement.y = job.grid.originalCenter.y - job.pagePostStartPosition.y;

      job.pagePost = job.grid.createPagePost(job.baseTile, job.pagePostStartPosition);

      expandedTileOuterRadius = window.hg.OpenPostJob.config.expandedDisplacementTileCount *
          window.hg.Grid.config.tileShortLengthWithGap;

      job.baseTile.originalVertexDeltas = job.baseTile.currentVertexDeltas.slice(0);
      job.baseTile.expandedVertexDeltas =
          window.hg.Tile.computeVertexDeltas(expandedTileOuterRadius, job.grid.isVertical);
    } else {
      job.pagePostStartPosition.x = job.grid.originalCenter.x;
      job.pagePostStartPosition.y = job.grid.originalCenter.y;
      job.pagePostDisplacement.x = job.pagePostStartPosition.x - job.grid.currentCenter.x;
      job.pagePostDisplacement.y = job.pagePostStartPosition.y - job.grid.currentCenter.y;
    }

    job.baseTile.element.style.pointerEvents = 'none';
  }

  /**
   * Updates the animation progress of this FadePostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this FadePostJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function updateFadeIn(currentTime, deltaTime) {
    var job, progress, uneasedProgress, quick1FadeProgress, quick2FadeProgress;

    job = this;

    // Calculate progress with an easing function
    progress = (currentTime - job.startTime) / job.duration;
    uneasedProgress = progress;
    progress = window.hg.util.easingFunctions.easeOutCubic(progress);
    progress = progress > 1 ? 1 : progress;

    // Some parts of the animation should happen at different speeds
    quick1FadeProgress = progress / config.quick1FadeDurationRatio;
    quick1FadeProgress = (quick1FadeProgress > 1 ? 1 : quick1FadeProgress);
    quick2FadeProgress = progress / config.quick2FadeDurationRatio;
    quick2FadeProgress = (quick2FadeProgress > 1 ? 1 : quick2FadeProgress);

    // Update the opacity of the center Tile
    job.baseTile.element.style.opacity = 1 - quick1FadeProgress;
    job.baseTile.tilePost.elements.title.style.opacity = 1 - quick2FadeProgress;

    // Update the opacity of the PagePost
    job.pagePost.opacity = uneasedProgress;

    // Update the position of the PagePost
    job.pagePost.center.x = job.pagePostStartPosition.x +
        job.pagePostDisplacement.x * progress;
    job.pagePost.center.y = job.pagePostStartPosition.y +
        job.pagePostDisplacement.y * progress;

    interpolateVertexDeltas(job.baseTile.currentVertexDeltas, job.baseTile.originalVertexDeltas,
        job.baseTile.expandedVertexDeltas, quick1FadeProgress);

    // Is the job done?
    if (progress === 1) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Updates the animation progress of this FadePostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this FadePostJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function updateFadeOut(currentTime, deltaTime) {
    var job, progress, quick1FadeProgress;

    job = this;

    // Calculate progress with an easing function
    progress = (currentTime - job.startTime) / job.duration;
    progress = window.hg.util.easingFunctions.easeOutQuint(progress);
    progress = progress > 1 ? 1 : progress;

    // Some parts of the animation should happen at different speeds
    quick1FadeProgress = progress / config.quick1FadeDurationRatio;
    quick1FadeProgress = (quick1FadeProgress > 1 ? 1 : quick1FadeProgress);

    // Update the opacity of the center Tile
    job.baseTile.element.style.opacity = progress;
    job.baseTile.tilePost.elements.title.style.opacity = progress;

    // Update the opacity of the PagePost
    job.pagePost.opacity = 1 - quick1FadeProgress;

    // Update the position of the PagePost
    job.pagePost.center.x = job.pagePostStartPosition.x +
        job.pagePostDisplacement.x * progress;
    job.pagePost.center.y = job.pagePostStartPosition.y +
        job.pagePostDisplacement.y * progress;

    interpolateVertexDeltas(job.baseTile.currentVertexDeltas, job.baseTile.expandedVertexDeltas,
        job.baseTile.originalVertexDeltas, quick1FadeProgress);

    // Is the job done?
    if (progress === 1) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this FadePostJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this FadePostJob
   */
  function draw() {
    var job = this;

    job.pagePost.draw();
  }

  /**
   * Stops this FadePostJob, and returns the element its original form.
   *
   * @this FadePostJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this FadePostJob
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
  function FadePostJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.baseTile = grid.expandedTile;
    job.startTime = 0;
    job.isComplete = true;
    job.pagePost = grid.pagePost;
    job.parentExpansionJob = job.grid.lastExpansionJob;
    job.isFadingIn = grid.isPostOpen;
    job.pagePostStartPosition = null;
    job.pagePostDisplacement = null;

    job.duration = config.duration;

    job.start = start;
    job.update = job.isFadingIn ? updateFadeIn : updateFadeOut;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('FadePostJob created: tileIndex=' + job.baseTile.originalIndex +
        ', isFadingIn=' + job.isFadingIn);
  }

  FadePostJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.FadePostJob = FadePostJob;

  console.log('FadePostJob module loaded');
})();
