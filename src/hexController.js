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
    var grid, waveAnimationJob, index;

    grid = new hg.HexGrid(parent, tileData, isVertical);
    controller.grids.push(grid);
    hg.animator.startJob(grid);
    index = controller.grids.length - 1;

    waveAnimationJob = new hg.WaveAnimationJob(grid);
    controller.waveAnimationJobs.push(waveAnimationJob);
    restartWaveAnimation(index);

    return index;
  }

  /**
   * Restarts the WaveAnimationJob at the given index.
   *
   * @param {number} index
   */
  function restartWaveAnimation(index) {
    var waveAnimationJob = hg.controller.waveAnimationJobs[index];

    if (!waveAnimationJob.isComplete) {
      hg.animator.cancelJob(waveAnimationJob);
    }

    waveAnimationJob.init();
    hg.animator.startJob(waveAnimationJob);
  }

  /**
   * Event listener for the window resize event.
   *
   * Resizes all of the hex-grid components.
   */
  function resize() {
    controller.grids.forEach(function (grid, index) {
      grid.resize();
      restartWaveAnimation(index);
    });
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  controller.grids = [];
  controller.waveAnimationJobs = [];

  controller.config = config;

  controller.createNewHexGrid = createNewHexGrid;
  controller.restartWaveAnimation = restartWaveAnimation;
  controller.resize = resize;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.controller = controller;

  window.addEventListener('resize', resize, false);

  console.log('controller module loaded');
})();
