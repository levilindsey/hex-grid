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
      config = {},
      internal = {};

  controller.persistentJobs = {
    colorShift: {
      collection: [],
      create: createColorShiftAnimation,
      restart: restartColorShiftAnimation
    },
    colorWave: {
      collection: [],
      create: createColorWaveAnimation,
      restart: restartColorWaveAnimation
    },
    displacementWave: {
      collection: [],
      create: createDisplacementWaveAnimation,
      restart: restartDisplacementWaveAnimation
    }
  };

  // TODO: refactor this to instead be dynamically generated according to a simpler object (which wouldn't require reduntantly including the jobId throughout each job's definition)?
  controller.oneTimeJobs = {
    openPost: {
      constructorName: 'OpenPostJob',
      collection: [],
      timeouts: [],
      create: createOneTimeAnimation.bind(controller, null, 'openPost'),
      createRandom: openRandomPost,
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'openPost')
    },
    closePost: {
      constructorName: 'ClosePostJob',
      collection: [],
      timeouts: [],
      create: createOneTimeAnimation.bind(controller, null, 'closePost'),
      createRandom: closePost,
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'closePost')
    },
    displacementPulse: {
      constructorName: 'DisplacementPulseJob',
      collection: [],
      timeouts: [],
      create: createOneTimeAnimation.bind(controller, null, 'displacementPulse'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'displacementPulse'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'displacementPulse')
    },
    highlightHover: {
      constructorName: 'HighlightHoverJob',
      collection: [],
      timeouts: [],
      create: createOneTimeAnimation.bind(controller, null, 'highlightHover'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'highlightHover'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'highlightHover')
    },
    highlightRadiate: {
      constructorName: 'HighlightRadiateJob',
      collection: [],
      timeouts: [],
      create: createOneTimeAnimation.bind(controller, null, 'highlightRadiate'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'highlightRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'highlightRadiate')
    },
    intraTileRadiate: {
      constructorName: 'IntraTileRadiateJob',
      collection: [],
      timeouts: [],
      create: createOneTimeAnimation.bind(controller, null, 'intraTileRadiate'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'intraTileRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'intraTileRadiate')
    },
    line: {
      constructorName: 'LineJob',
      collection: [],
      timeouts: [],
      create: createOneTimeAnimation.bind(controller, randomLineCreator, 'line'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'line'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'line')
    },
    linesRadiate: {
      constructorName: 'LinesRadiateJob',
      collection: [],
      timeouts: [],
      create: createOneTimeAnimation.bind(controller, linesRadiateCreator, 'linesRadiate'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'linesRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'linesRadiate')
    },
    tileBorder: {
      constructorName: 'TileBorderJob',
      collection: [],
      timeouts: [],
      create: createOneTimeAnimation.bind(controller, null, 'tileBorder'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'tileBorder'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'tileBorder')
    }
  };

  internal.grids = [];
  internal.inputs = [];
  internal.annotations = [];
  internal.colorResetJobs = [];
  internal.displacementResetJobs = [];

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Starts repeating any AnimationJobs that are configured to recur.
   *
   * @param {number} gridIndex
   */
  function startRecurringAnimations(gridIndex) {// TODO: refactor this to accept Grid objects rather than IDs
    Object.keys(controller.oneTimeJobs).forEach(function (key) {
      controller.oneTimeJobs[key].toggleRecurrence(
          gridIndex, true,
          window.hg[controller.oneTimeJobs[key].constructorName].config.avgDelay,
          window.hg[controller.oneTimeJobs[key].constructorName].config.delayDeviationRange);
    });
  }

  /**
   * @param {string} jobId
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   * @returns {AnimationJob}
   */
  function generalOneTimeJobCreator(jobId, grid, tile, onComplete) {
    return new window.hg[controller.oneTimeJobs[jobId].constructorName](grid, tile, onComplete);
  }

  /**
   * @param {?Function} creator
   * @param {Array.<AnimationJob>} jobId
   * @param {number} gridIndex
   * @param {?Tile} tile
   */// TODO: refactor this to accept Grid objects rather than IDs
  function createOneTimeAnimation(creator, jobId, gridIndex, tile) {// TODO: rename all occurrences (only within this file?) of jobId to jobId
    var job, grid, gridAnimationsId;

    creator = creator || generalOneTimeJobCreator.bind(controller, jobId);

    grid = internal.grids[gridIndex];

    // Create the job with whatever custom logic is needed for this particular type of job
    job = creator(grid, tile, onComplete);

    // Store a reference to this job within the controller
    controller.oneTimeJobs[jobId].jobs.push(job);
    window.hg.animator.startJob(job);

    // TODO: get rid of this redundant storage on the Grid object; instead, make an easy way for the Annotation object to reference the jobs from the controller
    // Keep a reference to this job within the grid object (this helps the Annotations object
    // reference data from the job if needed)
    gridAnimationsId = jobId + 'Animations';
    grid.animations[gridAnimationsId] = grid.animations[gridAnimationsId] || [];
    grid.animations[gridAnimationsId].push(job);

    // ---  --- //

    function onComplete() {
      // Destroy both references to this now-complete job
      controller.oneTimeJobs[jobId].jobs.splice(
          controller.oneTimeJobs[jobId].jobs.indexOf(job), 1);
      grid.animations[gridAnimationsId].jobs.splice(
          grid.animations[gridAnimationsId].jobs.indexOf(job), 1);
    }
  }

  /**
   * @param {string} jobId
   * @param {number} gridIndex
   */
  function createOneTimeJobWithARandomTile(jobId, gridIndex) {// TODO: refactor this to accept Grid objects rather than IDs
    var tileIndex = parseInt(Math.random() * window.hg.internal.grids[gridIndex].tiles.length);
    var tile = window.hg.internal.grids[gridIndex].tiles[tileIndex];
    controller.oneTimeJobs[jobId].create(gridIndex, tile);
  }

  /**
   * Toggles whether an AnimationJob is automatically repeated.
   *
   * @param {string} jobId
   * @param {number} gridIndex
   * @param {boolean} isRecurring
   * @param {number} avgDelay
   * @param {number} delayDeviationRange
   */
  function toggleJobRecurrence(jobId, gridIndex, isRecurring, avgDelay, delayDeviationRange) {// TODO: refactor this to accept Grid objects rather than IDs
    var minDelay, maxDelay, actualDelayRange, jobTimeouts;

    jobTimeouts = controller.oneTimeJobs[jobId].timeouts;

    // Compute the delay deviation range
    minDelay = avgDelay - delayDeviationRange * 0.5;
    minDelay = minDelay > 0 ? minDelay : 1;
    maxDelay = avgDelay + delayDeviationRange * 0.5;
    actualDelayRange = maxDelay - minDelay;

    // Stop any pre-existing recurrence
    if (jobTimeouts[gridIndex]) {
      clearTimeout(jobTimeouts[gridIndex]);
      jobTimeouts[gridIndex] = null;
    }

    // Should we start the recurrence?
    if (isRecurring) {
      jobTimeouts[gridIndex] = setTimeout(recur, avgDelay);
    }

    // ---  --- //

    /**
     * Creates a new occurrence of the AnimationJob and starts a new timeout to repeat this.
     */
    function recur() {
      var delay = Math.random() * actualDelayRange + minDelay;
      controller.oneTimeJobs[jobId].createRandom(gridIndex);
      jobTimeouts[gridIndex] = setTimeout(recur, delay);
    }
  }

  /**
   * Resizes all of the hex-grid components.
   */
  function resize() {
    internal.grids.forEach(resetGrid);
  }

  // --- Persistent-job creation functions --- //
// TODO: these are redundant
  /**
   * Creates a new ColorResetJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createColorResetAnimation(gridIndex) {// TODO: refactor this to accept Grid objects rather than IDs
    var job = new window.hg.ColorResetJob(internal.grids[gridIndex]);
    internal.colorResetJobs.push(job);
    restartColorResetAnimation(gridIndex);

    internal.grids[gridIndex].animations.colorResetAnimations =
        internal.grids[gridIndex].animations.colorResetAnimations || [];
    internal.grids[gridIndex].animations.colorResetAnimations.push(job);
  }

  /**
   * Creates a new DisplacementResetJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createDisplacementResetAnimation(gridIndex) {
    var job = new window.hg.DisplacementResetJob(internal.grids[gridIndex]);
    internal.displacementResetJobs.push(job);
    restartDisplacementResetAnimation(gridIndex);

    internal.grids[gridIndex].animations.displacementResetAnimations =
        internal.grids[gridIndex].animations.displacementResetAnimations || [];
    internal.grids[gridIndex].animations.displacementResetAnimations.push(job);
  }

  /**
   * Creates a new ColorShiftJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createColorShiftAnimation(gridIndex) {
    var job = new window.hg.ColorShiftJob(internal.grids[gridIndex]);
    controller.persistentJobs.colorShift.jobs.push(job);
    controller.persistentJobs.colorShift.restart(gridIndex);

    internal.grids[gridIndex].animations.colorShiftAnimations =
        internal.grids[gridIndex].animations.colorShiftAnimations || [];
    internal.grids[gridIndex].animations.colorShiftAnimations.push(job);
  }

  /**
   * Creates a new ColorWaveJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createColorWaveAnimation(gridIndex) {
    var job = new window.hg.ColorWaveJob(internal.grids[gridIndex]);
    controller.persistentJobs.colorWave.jobs.push(job);
    controller.persistentJobs.colorWave.restart(gridIndex);

    internal.grids[gridIndex].animations.colorWaveAnimations =
        internal.grids[gridIndex].animations.colorWaveAnimations || [];
    internal.grids[gridIndex].animations.colorWaveAnimations.push(job);
  }

  /**
   * Creates a new DisplacementWaveJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createDisplacementWaveAnimation(gridIndex) {
    var job = new window.hg.DisplacementWaveJob(internal.grids[gridIndex]);
    controller.persistentJobs.displacementWave.jobs.push(job);
    controller.persistentJobs.displacementWave.restart(gridIndex);

    internal.grids[gridIndex].animations.displacementWaveAnimations =
        internal.grids[gridIndex].animations.displacementWaveAnimations || [];
    internal.grids[gridIndex].animations.displacementWaveAnimations.push(job);
  }

  // --- Persistent-job restart functions --- //

  /**
   * Restarts the ColorResetJob at the given index.
   *
   * @param {number} index
   */
  function restartColorResetAnimation(index) {// TODO: refactor this to accept Grid objects rather than IDs
    var job = internal.colorResetJobs[index];

    if (!job.isComplete) {
      window.hg.animator.cancelJob(job);
    }

    job.init();
    window.hg.animator.startJob(job);
  }

  /**
   * Restarts the DisplacementResetJob at the given index.
   *
   * @param {number} index
   */
  function restartDisplacementResetAnimation(index) {
    var job = internal.displacementResetJobs[index];

    if (!job.isComplete) {
      window.hg.animator.cancelJob(job);
    }

    job.init();
    window.hg.animator.startJob(job);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Creates a Grid object and registers it with the animator.
   *
   * @param {HTMLElement} parent
   * @param {Array.<Object>} tileData
   * @param {boolean} isVertical
   * @returns {number} The ID (actually index) of the new Grid.
   */
  function createNewHexGrid(parent, tileData, isVertical) {
    var grid, index, annotations, input;

    index = internal.grids.length;
    grid = new window.hg.Grid(index, parent, tileData, isVertical);
    internal.grids.push(grid);
    window.hg.animator.startJob(grid);

    createColorResetAnimation(index);
    createDisplacementResetAnimation(index);

    controller.persistentJobs.colorShift.create(index);
    controller.persistentJobs.colorWave.create(index);
    controller.persistentJobs.displacementWave.create(index);

    annotations = grid.annotations;
    window.hg.animator.startJob(annotations);
    internal.annotations.push(annotations);

    input = new window.hg.Input(grid);
    internal.inputs.push(input);

    startRecurringAnimations(index);

    return index;
  }

  /**
   * @param {Grid} grid
   */
  function resetGrid(grid) {
    window.hg.animator.cancelAll();

    grid.resize();

    restartColorResetAnimation(grid.index);
    restartDisplacementResetAnimation(grid.index);

    controller.persistentJobs.colorShift.restart(grid.index);
    controller.persistentJobs.colorWave.restart(grid.index);
    controller.persistentJobs.displacementWave.restart(grid.index);

    window.hg.animator.startJob(grid);
    window.hg.animator.startJob(internal.annotations[grid.index]);
  }

  // --- Persistent-job restart functions --- //
// TODO: these are redundant
  /**
   * Restarts the ColorShiftJob at the given index.
   *
   * @param {number} index
   */
  function restartColorShiftAnimation(index) {
    var job = controller.persistentJobs.colorShift.jobs[index];

    if (!job.isComplete) {
      window.hg.animator.cancelJob(job);
    }

    job.init();
    window.hg.animator.startJob(job);
  }

  /**
   * Restarts the ColorWaveJob at the given index.
   *
   * @param {number} index
   */
  function restartColorWaveAnimation(index) {
    var job = controller.persistentJobs.colorWave.jobs[index];

    if (!job.isComplete) {
      window.hg.animator.cancelJob(job);
    }

    job.init();
    window.hg.animator.startJob(job);
  }

  /**
   * Restarts the DisplacementWaveJob at the given index.
   *
   * @param {number} index
   */
  function restartDisplacementWaveAnimation(index) {
    var job = controller.persistentJobs.displacementWave.jobs[index];

    if (!job.isComplete) {
      window.hg.animator.cancelJob(job);
    }

    job.init();
    window.hg.animator.startJob(job);
  }

  // --- One-time-job creation functions --- //

  /**
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   * @returns {Window.hg.LineJob}
   */
  function randomLineCreator(grid, tile, onComplete) {
    return window.hg.LineJob.createRandomLineJob(grid, onComplete);
  }

  /**
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   * @returns {Window.hg.LinesRadiateJob}
   */
  function linesRadiateCreator(grid, tile, onComplete) {
    var job, gridAnimationsId;

    job = new window.hg.LinesRadiateJob(grid, tile, onAllLinesComplete);

    // Also store references to each of the individual child lines
    gridAnimationsId = 'lineAnimations';
    grid.animations[gridAnimationsId] = grid.animations[gridAnimationsId] || [];
    job.lineJobs.forEach(function (lineJob) {
      grid.animations[gridAnimationsId].push(lineJob);
    });

    return job;

    // ---  --- //

    function onAllLinesComplete() {
      // Destroy the references to the individual child lines
      job.lineJobs.forEach(function (lineJob) {
        grid.animations[gridAnimationsId].splice(
            grid.animations[gridAnimationsId].indexOf(lineJob), 1);
      });

      onComplete();
    }
  }

  // --- One-time-job random creation functions --- //

  function openRandomPost() {
    // TODO: if no post is open, pick a random content tile, and open the post; otherwise, do nothing
  }

  function closePost() {
    // TODO: if a post is open, close it; otherwise, do nothing
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  controller.config = config;

  controller.createNewHexGrid = createNewHexGrid;
  controller.resetGrid = resetGrid;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.controller = controller;

  window.addEventListener('resize', resize, false);

  console.log('controller module loaded');
})();
