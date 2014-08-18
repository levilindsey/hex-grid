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

    createWaveAnimation(index);

    return index;
  }

  /**
   * Creates a new WaveAnimationJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createWaveAnimation(gridIndex) {
    var job = new hg.WaveAnimationJob(controller.grids[gridIndex]);
    controller.waveAnimationJobs.push(job);
    restartWaveAnimation(gridIndex);

    controller.grids[gridIndex].animations.waveAnimations =
        controller.grids[gridIndex].animations.waveAnimations || [];
    controller.grids[gridIndex].animations.waveAnimations.push(job);
  }

  /**
   * Restarts the WaveAnimationJob at the given index.
   *
   * @param {number} index
   */
  function restartWaveAnimation(index) {
    var job = controller.waveAnimationJobs[index];

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

    job = new hg.LinesRadiateAnimationJob(grid, grid.tiles[tileIndex], onComplete);
    controller.linesRadiateAnimationJobs.push(job);
    hg.animator.startJob(job);

    grid.animations.lineAnimations = grid.animations.lineAnimations || [];

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
    var job = hg.LineAnimationJob.createRandomLineAnimationJob(controller.grids[gridIndex],
        onComplete);
    controller.randomLineAnimationJobs.push(job);
    hg.animator.startJob(job);

    controller.grids[gridIndex].animations.lineAnimations =
        controller.grids[gridIndex].animations.lineAnimations || [];
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
    var job, grid;

    grid = controller.grids[gridIndex];

    job = new hg.ShimmerRadiateAnimationJob(grid, grid.tiles[tileIndex], onComplete);
    controller.shimmerRadiateAnimationJobs.push(job);
    hg.animator.startJob(job);

    controller.grids[gridIndex].animations.shimmerAnimations =
        controller.grids[gridIndex].animations.shimmerAnimations || [];
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
      hg.animator.startJob(grid);
      restartWaveAnimation(index);
    });
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  controller.grids = [];
  controller.waveAnimationJobs = [];
  controller.linesRadiateAnimationJobs = [];
  controller.randomLineAnimationJobs = [];
  controller.shimmerRadiateAnimationJobs = [];

  controller.config = config;

  controller.createNewHexGrid = createNewHexGrid;
  controller.restartWaveAnimation = restartWaveAnimation;
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
