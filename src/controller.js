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
    displacementRadiate: {
      constructorName: 'DisplacementRadiateJob',
      jobs: [],
      timeouts: [],
      create: createOneTimeJob.bind(controller, null, 'displacementRadiate'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'displacementRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'displacementRadiate')
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
    pan: {
      constructorName: 'PanJob',
      jobs: [],
      timeouts: [],
      create: createOneTimeJob.bind(controller, null, 'pan'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'pan'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'pan')
    },
    spread: {
      constructorName: 'SpreadJob',
      jobs: [],
      timeouts: [],
      create: createOneTimeJob.bind(controller, null, 'spread'),
      createRandom: createOneTimeJobWithARandomTile.bind(controller, 'spread'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'spread')
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
   * @param {Window.hg.Grid} grid
   */
  function startRecurringAnimations(grid) {
    Object.keys(controller.oneTimeJobs).forEach(function (key) {
      var config = window.hg[controller.oneTimeJobs[key].constructorName].config;

      if (config.isRecurring) {
        controller.oneTimeJobs[key].toggleRecurrence(grid, true, config.avgDelay,
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
   * @param {Grid} grid
   * @param {?Tile} tile
   */
  function createOneTimeJob(creator, jobId, grid, tile) {
    var job;

    creator = creator || generalOneTimeJobCreator.bind(controller, jobId);

    // Create the job with whatever custom logic is needed for this particular type of job
    job = creator(grid, tile, onComplete);

    // Store a reference to this job within the controller
    controller.oneTimeJobs[jobId].jobs[grid.index].push(job);
    window.hg.animator.startJob(job);

    // ---  --- //

    function onComplete() {
      // Destroy both references to this now-complete job
      controller.oneTimeJobs[jobId].jobs[grid.index].splice(
          controller.oneTimeJobs[jobId].jobs[grid.index].indexOf(job), 1);
    }
  }

  /**
   * @param {string} jobId
   * @param {Grid} grid
   */
  function createOneTimeJobWithARandomTile(jobId, grid) {
    controller.oneTimeJobs[jobId].create(grid, getRandomTile(grid));
  }

  /**
   * Toggles whether an AnimationJob is automatically repeated.
   *
   * @param {string} jobId
   * @param {Grid} grid
   * @param {boolean} isRecurring
   * @param {number} avgDelay
   * @param {number} delayDeviationRange
   */
  function toggleJobRecurrence(jobId, grid, isRecurring, avgDelay, delayDeviationRange) {
    var minDelay, maxDelay, actualDelayRange, jobTimeouts;

    jobTimeouts = controller.oneTimeJobs[jobId].timeouts;

    // Compute the delay deviation range
    minDelay = avgDelay - delayDeviationRange * 0.5;
    minDelay = minDelay > 0 ? minDelay : 1;
    maxDelay = avgDelay + delayDeviationRange * 0.5;
    actualDelayRange = maxDelay - minDelay;

    // Stop any pre-existing recurrence
    if (jobTimeouts[grid.index]) {
      clearTimeout(jobTimeouts[grid.index]);
      jobTimeouts[grid.index] = null;
    }

    // Should we start the recurrence?
    if (isRecurring) {
      jobTimeouts[grid.index] = setTimeout(recur, avgDelay);
    }

    // ---  --- //

    /**
     * Creates a new occurrence of the AnimationJob and starts a new timeout to repeat this.
     */
    function recur() {
      var delay = Math.random() * actualDelayRange + minDelay;
      controller.oneTimeJobs[jobId].createRandom(grid);
      jobTimeouts[grid.index] = setTimeout(recur, delay);
    }
  }

  /**
   * @param {string} jobId
   * @param {Grid} grid
   */
  function createPersistentJob(jobId, grid) {
    var jobDefinition, job;

    jobDefinition = controller.persistentJobs[jobId];

    job = new window.hg[jobDefinition.constructorName](grid);
    jobDefinition.jobs[grid.index].push(job);
    jobDefinition.restart(grid, jobDefinition.jobs[grid.index].length - 1);
  }

  /**
   * @param {string} jobId
   * @param {Grid} grid
   * @param {number} [jobIndex] If not given, ALL persistent jobs (of this bound type) will be
   * restarted for the given grid.
   */
  function restartPersistentJob(jobId, grid, jobIndex) {
    if (typeof jobIndex !== 'undefined') {
      restartPersistentJobHelper(controller.persistentJobs[jobId].jobs[grid.index][jobIndex]);
    } else {
      controller.persistentJobs[jobId].jobs[grid.index].forEach(restartPersistentJobHelper);
    }

    // ---  --- //

    function restartPersistentJobHelper(job) {
      if (!job.isComplete) {
        window.hg.animator.cancelJob(job);
      }

      job.init();
      window.hg.animator.startJob(job);
    }
  }

  /**
   * Resizes all of the hex-grid components.
   */
  function resize() {
    internal.grids.forEach(resetGrid);
  }

  /**
   * @param {Grid} grid
   * @returns {Tile}
   */
  function getRandomTile(grid) {
    var tileIndex = parseInt(Math.random() * grid.tiles.length);
    return grid.tiles[tileIndex];
  }

  /**
   * @param {Grid} grid
   * @returns {Tile}
   */
  function getRandomContentTile(grid) {
    var contentIndex = parseInt(Math.random() * grid.actualContentInnerIndices.length);
    return grid.tiles[grid.actualContentInnerIndices[contentIndex]];
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
    var job = new window.hg.LinesRadiateJob(grid, tile, onAllLinesComplete);

    // Also store references to each of the individual child lines
    job.lineJobs.forEach(function (lineJob) {
      controller.oneTimeJobs.line.jobs[grid.index].push(lineJob);
    });

    return job;

    // ---  --- //

    function onAllLinesComplete() {
      // Destroy the references to the individual child lines
      job.lineJobs.forEach(function (lineJob) {
        controller.oneTimeJobs.line.jobs[grid.index].splice(
            controller.oneTimeJobs.line.jobs[grid.index].indexOf(lineJob), 1);
      });

      onComplete();
    }
  }

  // --- One-time-job random creation functions --- //

  /**
   * @param {Grid} grid
   * @returns {Window.hg.LinesRadiateJob}
   */
  function openRandomPost(grid) {
    // If no post is open, pick a random content tile, and open the post; otherwise, do nothing
    if (!grid.isPostOpen) {
      controller.oneTimeJobs.closePost.create(grid, getRandomContentTile(grid));
    }
  }

  /**
   * @param {Grid} grid
   * @returns {Window.hg.LinesRadiateJob}
   */
  function closePost(grid) {
    // If a post is open, close it; otherwise, do nothing
    if (grid.isPostOpen) {
      controller.oneTimeJobs.closePost.create(grid, grid.expandedTile);
    }
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

    initializeJobArraysForGrid(index);

    grid = new window.hg.Grid(index, parent, tileData, isVertical);
    internal.grids.push(grid);
    window.hg.animator.startJob(grid);

    controller.persistentJobs.colorReset.create(grid);
    controller.persistentJobs.displacementReset.create(grid);

    controller.persistentJobs.colorShift.create(grid);
    controller.persistentJobs.colorWave.create(grid);
    controller.persistentJobs.displacementWave.create(grid);

    annotations = grid.annotations;
    window.hg.animator.startJob(annotations);
    internal.annotations.push(annotations);

    input = new window.hg.Input(grid);
    internal.inputs.push(input);

    startRecurringAnimations(grid);

    return grid;

    // ---  --- //

    function initializeJobArraysForGrid(index) {
      Object.keys(controller.persistentJobs).forEach(function (key) {
        controller.persistentJobs[key].jobs[index] = [];
      });

      Object.keys(controller.oneTimeJobs).forEach(function (key) {
        controller.oneTimeJobs[key].jobs[index] = [];
      });
    }
  }

  /**
   * @param {Grid} grid
   */
  function resetGrid(grid) {
    window.hg.animator.cancelAll();

    grid.resize();

    controller.persistentJobs.colorReset.restart(grid);
    controller.persistentJobs.displacementReset.restart(grid);

    controller.persistentJobs.colorShift.restart(grid);
    controller.persistentJobs.colorWave.restart(grid);
    controller.persistentJobs.displacementWave.restart(grid);

    window.hg.animator.startJob(grid);
    window.hg.animator.startJob(internal.annotations[grid.index]);
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
