'use strict';

/**
 * This module defines a singleton that helps coordinate the various components of the hex-grid
 * package.
 *
 * The controller singleton handles provides convenient helper functions for creating and running
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
      constructorName: 'ColorShiftJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'colorShift'),
      restart: restartPersistentJob.bind(controller, 'colorShift')
    },
    colorWave: {
      constructorName: 'ColorWaveJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'colorWave'),
      restart: restartPersistentJob.bind(controller, 'colorWave')
    },
    displacementWave: {
      constructorName: 'DisplacementWaveJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'displacementWave'),
      restart: restartPersistentJob.bind(controller, 'displacementWave')
    },

    // --- For internal use --- //

    colorReset: {
      constructorName: 'ColorResetJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'colorReset'),
      restart: restartPersistentJob.bind(controller, 'colorReset')
    },
    displacementReset: {
      constructorName: 'DisplacementResetJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'displacementReset'),
      restart: restartPersistentJob.bind(controller, 'displacementReset')
    }
  };

  // TODO: refactor this to instead be dynamically generated according to a simpler object (which wouldn't require reduntantly including the jobId throughout each job's definition)?
  controller.oneTimeJobs = {
    openPost: {
      constructorName: 'OpenPostJob',
      jobs: [],
      timeouts: [],
      create: createOneTimeJob.bind(controller, null, 'openPost'),
      createRandom: openRandomPost,
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'openPost')
    },
    closePost: {
      constructorName: 'ClosePostJob',
      jobs: [],
      timeouts: [],
      create: createOneTimeJob.bind(controller, null, 'closePost'),
      createRandom: closePost,
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'closePost')
    },
    displacementPulse: {
      constructorName: 'DisplacementPulseJob',
      jobs: [],
      timeouts: [],
      create: createOneTimeJob.bind(controller, null, 'displacementPulse'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'displacementPulse'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'displacementPulse')
    },
    highlightHover: {
      constructorName: 'HighlightHoverJob',
      jobs: [],
      timeouts: [],
      create: createOneTimeJob.bind(controller, null, 'highlightHover'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'highlightHover'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'highlightHover')
    },
    highlightRadiate: {
      constructorName: 'HighlightRadiateJob',
      jobs: [],
      timeouts: [],
      create: createOneTimeJob.bind(controller, null, 'highlightRadiate'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'highlightRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'highlightRadiate')
    },
    intraTileRadiate: {
      constructorName: 'IntraTileRadiateJob',
      jobs: [],
      timeouts: [],
      create: createOneTimeJob.bind(controller, null, 'intraTileRadiate'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'intraTileRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'intraTileRadiate')
    },
    line: {
      constructorName: 'LineJob',
      jobs: [],
      timeouts: [],
      create: createOneTimeJob.bind(controller, randomLineCreator, 'line'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'line'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'line')
    },
    linesRadiate: {
      constructorName: 'LinesRadiateJob',
      jobs: [],
      timeouts: [],
      create: createOneTimeJob.bind(controller, linesRadiateCreator, 'linesRadiate'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'linesRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'linesRadiate')
    },
    tileBorder: {
      constructorName: 'TileBorderJob',
      jobs: [],
      timeouts: [],
      create: createOneTimeJob.bind(controller, null, 'tileBorder'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'tileBorder'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'tileBorder')
    }
  };

  internal.grids = [];
  internal.inputs = [];
  internal.annotations = [];

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Starts repeating any AnimationJobs that are configured to recur.
   *
   * @param {number} gridIndex
   */
  function startRecurringAnimations(gridIndex) {// TODO: refactor this to accept Grid objects rather than IDs
    Object.keys(controller.oneTimeJobs).forEach(function (key) {
      var config = window.hg[controller.oneTimeJobs[key].constructorName].config;

      if (config.isRecurring) {
        controller.oneTimeJobs[key].toggleRecurrence(gridIndex, true, config.avgDelay,
            config.delayDeviationRange);
      }
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
   */
  function createOneTimeJob(creator, jobId, gridIndex, tile) {// TODO: refactor this to accept Grid objects rather than IDs
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
    grid.jobs[gridAnimationsId] = grid.jobs[gridAnimationsId] || [];
    grid.jobs[gridAnimationsId].push(job);

    // ---  --- //

    function onComplete() {
      // Destroy both references to this now-complete job
      controller.oneTimeJobs[jobId].jobs.splice(
          controller.oneTimeJobs[jobId].jobs.indexOf(job), 1);
      grid.jobs[gridAnimationsId].splice(
          grid.jobs[gridAnimationsId].indexOf(job), 1);
    }
  }

  /**
   * @param {string} jobId
   * @param {number} gridIndex
   */
  function createOneTimeJobWithARandomTile(jobId, gridIndex) {// TODO: refactor this to accept Grid objects rather than IDs
    var tileIndex = parseInt(Math.random() * internal.grids[gridIndex].tiles.length);
    var tile = internal.grids[gridIndex].tiles[tileIndex];
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
   * @param {string} jobId
   * @param {number} gridIndex
   */
  function createPersistentJob(jobId, gridIndex) {
    var jobDefinition, job, gridAnimationsId;

    var grid = internal.grids[gridIndex];

    jobDefinition = controller.persistentJobs[jobId];

    job = new window.hg[jobDefinition.constructorName](grid);
    jobDefinition.jobs.push(job);
    jobDefinition.restart(gridIndex);

    gridAnimationsId = jobId + 'Animations';
    grid.jobs[gridAnimationsId] = grid.jobs[gridAnimationsId] || [];
    grid.jobs[gridAnimationsId].push(job);
  }

  /**
   * @param {string} jobId
   * @param {number} gridIndex
   */
  function restartPersistentJob(jobId, gridIndex) {
    var job = controller.persistentJobs[jobId].jobs[gridIndex];

    if (!job.isComplete) {
      window.hg.animator.cancelJob(job);
    }

    job.init();
    window.hg.animator.startJob(job);
  }

  /**
   * Resizes all of the hex-grid components.
   */
  function resize() {
    internal.grids.forEach(resetGrid);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Creates a Grid object and registers it with the animator.
   *
   * @param {HTMLElement} parent
   * @param {Array.<Object>} tileData
   * @param {boolean} isVertical
   * @returns {Window.hg.Grid}
   */
  function createNewHexGrid(parent, tileData, isVertical) {
    var grid, index, annotations, input;

    index = internal.grids.length;
    grid = new window.hg.Grid(index, parent, tileData, isVertical);
    internal.grids.push(grid);
    window.hg.animator.startJob(grid);

    controller.persistentJobs.colorReset.create(index);
    controller.persistentJobs.displacementReset.create(index);

    controller.persistentJobs.colorShift.create(index);
    controller.persistentJobs.colorWave.create(index);
    controller.persistentJobs.displacementWave.create(index);

    annotations = grid.annotations;
    window.hg.animator.startJob(annotations);
    internal.annotations.push(annotations);

    input = new window.hg.Input(grid);
    internal.inputs.push(input);

    startRecurringAnimations(index);

    return grid;
  }

  /**
   * @param {Grid} grid
   */
  function resetGrid(grid) {
    window.hg.animator.cancelAll();

    grid.resize();

    controller.persistentJobs.colorReset.restart(index);
    controller.persistentJobs.displacementReset.restart(index);

    controller.persistentJobs.colorShift.restart(grid.index);
    controller.persistentJobs.colorWave.restart(grid.index);
    controller.persistentJobs.displacementWave.restart(grid.index);

    window.hg.animator.startJob(grid);
    window.hg.animator.startJob(internal.annotations[grid.index]);
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
    grid.jobs[gridAnimationsId] = grid.jobs[gridAnimationsId] || [];
    job.lineJobs.forEach(function (lineJob) {
      grid.jobs[gridAnimationsId].push(lineJob);
    });

    return job;

    // ---  --- //

    function onAllLinesComplete() {
      // Destroy the references to the individual child lines
      job.lineJobs.forEach(function (lineJob) {
        grid.jobs[gridAnimationsId].splice(
            grid.jobs[gridAnimationsId].indexOf(lineJob), 1);
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
