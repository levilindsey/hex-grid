'use strict';

/**
 * This module defines a singleton that helps coordinate the various components of the hex-grid
 * package.
 *
 * The controller singleton handles provides convenient helper functions for creating and staring
 * grids and animations. It stores these objects and updates them in response to various system
 * events--e.g., window resize.
 *
 * @module controller
 */
(function () {
  var controller = {},
      config = {};

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Creates a HexGrid object and registers it with the animator.
   *
   * @param {HTMLElement} parent
   * @param {Array.<Object>} tileData
   * @param {boolean} isVertical
   * @returns {number} The ID (actually index) of the new HexGrid.
   */
  function createNewHexGrid(parent, tileData, isVertical) {
    var grid, index;

    grid = new hg.HexGrid(parent, tileData, isVertical);
    controller.grids.push(grid);
    hg.animator.startJob(grid);
    index = controller.grids.length - 1;

    createColorResetAnimation(index);
    createColorShiftAnimation(index);
    createColorWaveAnimation(index);
    createDisplacementWaveAnimation(index);

    return index;
  }

  /**
   * Creates a new ColorResetAnimationJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createColorResetAnimation(gridIndex) {
    var job = new hg.ColorResetAnimationJob(controller.grids[gridIndex]);
    controller.colorResetAnimationJobs.push(job);
    restartColorResetAnimation(gridIndex);

    controller.grids[gridIndex].animations.colorResetAnimations =
        controller.grids[gridIndex].animations.colorResetAnimations || [];
    controller.grids[gridIndex].animations.colorResetAnimations.push(job);
  }

  /**
   * Creates a new ColorShiftAnimationJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createColorShiftAnimation(gridIndex) {
    var job = new hg.ColorShiftAnimationJob(controller.grids[gridIndex]);
    controller.colorShiftAnimationJobs.push(job);
    restartColorShiftAnimation(gridIndex);

    controller.grids[gridIndex].animations.colorShiftAnimations =
        controller.grids[gridIndex].animations.colorShiftAnimations || [];
    controller.grids[gridIndex].animations.colorShiftAnimations.push(job);
  }

  /**
   * Creates a new ColorWaveAnimationJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createColorWaveAnimation(gridIndex) {
    var job = new hg.ColorWaveAnimationJob(controller.grids[gridIndex]);
    controller.colorWaveAnimationJobs.push(job);
    restartColorWaveAnimation(gridIndex);

    controller.grids[gridIndex].animations.colorWaveAnimations =
        controller.grids[gridIndex].animations.colorWaveAnimations || [];
    controller.grids[gridIndex].animations.colorWaveAnimations.push(job);
  }

  /**
   * Creates a new DisplacementWaveAnimationJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createDisplacementWaveAnimation(gridIndex) {
    var job = new hg.DisplacementWaveAnimationJob(controller.grids[gridIndex]);
    controller.displacementWaveAnimationJobs.push(job);
    restartDisplacementWaveAnimation(gridIndex);

    controller.grids[gridIndex].animations.displacementWaveAnimations =
        controller.grids[gridIndex].animations.displacementWaveAnimations || [];
    controller.grids[gridIndex].animations.displacementWaveAnimations.push(job);
  }

  /**
   * Restarts the ColorResetAnimationJob at the given index.
   *
   * @param {number} index
   */
  function restartColorResetAnimation(index) {
    var job = controller.colorResetAnimationJobs[index];

    if (!job.isComplete) {
      hg.animator.cancelJob(job);
    }

    job.init();
    hg.animator.startJob(job);
  }

  /**
   * Restarts the ColorShiftAnimationJob at the given index.
   *
   * @param {number} index
   */
  function restartColorShiftAnimation(index) {
    var job = controller.colorShiftAnimationJobs[index];

    if (!job.isComplete) {
      hg.animator.cancelJob(job);
    }

    job.init();
    hg.animator.startJob(job);
  }

  /**
   * Restarts the ColorWaveAnimationJob at the given index.
   *
   * @param {number} index
   */
  function restartColorWaveAnimation(index) {
    var job = controller.colorWaveAnimationJobs[index];

    if (!job.isComplete) {
      hg.animator.cancelJob(job);
    }

    job.init();
    hg.animator.startJob(job);
  }

  /**
   * Restarts the DisplacementWaveAnimationJob at the given index.
   *
   * @param {number} index
   */
  function restartDisplacementWaveAnimation(index) {
    var job = controller.displacementWaveAnimationJobs[index];

    if (!job.isComplete) {
      hg.animator.cancelJob(job);
    }

    job.init();
    hg.animator.startJob(job);
  }

  /**
   * Creates a new LinesRadiateAnimationJob based off the tile at the given index.
   *
   * @param {number} gridIndex
   * @param {number} tileIndex
   */
  function createLinesRadiateAnimation(gridIndex, tileIndex) {
    var job, i, count, grid;

    grid = controller.grids[gridIndex];

    grid.animations.lineAnimations = grid.animations.lineAnimations || [];

    job = new hg.LinesRadiateAnimationJob(grid, grid.tiles[tileIndex], onComplete);
    controller.linesRadiateAnimationJobs.push(job);
    hg.animator.startJob(job);

    for (i = 0, count = job.lineAnimationJobs.length; i < count; i += 1) {
      grid.animations.lineAnimations.push(job.lineAnimationJobs[i]);
    }

    function onComplete(job) {
      controller.grids[gridIndex].animations.lineAnimations.splice(
          controller.grids[gridIndex].animations.lineAnimations.indexOf(job), 1);
    }
  }

  /**
   * Creates a new RandomLIneAnimationJob.
   *
   * @param {number} gridIndex
   */
  function createRandomLineAnimation(gridIndex) {
    var job;

    controller.grids[gridIndex].animations.lineAnimations =
        controller.grids[gridIndex].animations.lineAnimations || [];

    job = hg.LineAnimationJob.createRandomLineAnimationJob(controller.grids[gridIndex],
        onComplete);
    controller.randomLineAnimationJobs.push(job);
    hg.animator.startJob(job);

    controller.grids[gridIndex].animations.lineAnimations.push(job);

    function onComplete() {
      controller.grids[gridIndex].animations.lineAnimations.splice(
          controller.grids[gridIndex].animations.lineAnimations.indexOf(job), 1);
    }
  }

  /**
   * Creates a new ShimmerRadiateAnimationJob based off the tile at the given index.
   *
   * @param {number} gridIndex
   * @param {number} tileIndex
   */
  function createShimmerRadiateAnimation(gridIndex, tileIndex) {
    var job, grid, startPoint;

    grid = controller.grids[gridIndex];

    controller.grids[gridIndex].animations.shimmerAnimations =
        controller.grids[gridIndex].animations.shimmerAnimations || [];

    startPoint = {
      x: grid.tiles[tileIndex].originalCenterX,
      y: grid.tiles[tileIndex].originalCenterY
    };

    job = new hg.ShimmerRadiateAnimationJob(startPoint, grid, onComplete);
    controller.shimmerRadiateAnimationJobs.push(job);
    hg.animator.startJob(job);

    controller.grids[gridIndex].animations.shimmerAnimations.push(job);

    function onComplete() {
      controller.grids[gridIndex].animations.shimmerAnimations.splice(
          controller.grids[gridIndex].animations.shimmerAnimations.indexOf(job), 1);
    }
  }

  /**
   * Event listener for the window resize event.
   *
   * Resizes all of the hex-grid components.
   */
  function resize() {
    controller.grids.forEach(function (grid, index) {
      hg.animator.cancelAll();
      grid.resize();
      restartColorResetAnimation(index);
      restartColorShiftAnimation(index);
      restartColorWaveAnimation(index);
      restartDisplacementWaveAnimation(index);
      hg.animator.startJob(grid);
    });
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  controller.grids = [];
  controller.colorResetAnimationJobs = [];
  controller.colorShiftAnimationJobs = [];
  controller.displacementWaveAnimationJobs = [];
  controller.colorWaveAnimationJobs = [];
  controller.linesRadiateAnimationJobs = [];
  controller.randomLineAnimationJobs = [];
  controller.shimmerRadiateAnimationJobs = [];

  controller.config = config;

  controller.createNewHexGrid = createNewHexGrid;
  controller.restartColorShiftAnimation = restartColorShiftAnimation;
  controller.restartColorWaveAnimation = restartColorWaveAnimation;
  controller.restartDisplacementWaveAnimation = restartDisplacementWaveAnimation;
  controller.createLinesRadiateAnimation = createLinesRadiateAnimation;
  controller.createRandomLineAnimation = createRandomLineAnimation;
  controller.createShimmerRadiateAnimation = createShimmerRadiateAnimation;
  controller.resize = resize;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.controller = controller;

  window.addEventListener('resize', resize, false);

  console.log('controller module loaded');
})();
