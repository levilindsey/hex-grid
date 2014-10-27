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
      start: restartPersistentJob.bind(controller, 'colorShift')
    },
    colorWave: {
      constructorName: 'ColorWaveJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'colorWave'),
      start: restartPersistentJob.bind(controller, 'colorWave')
    },
    displacementWave: {
      constructorName: 'DisplacementWaveJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'displacementWave'),
      start: restartPersistentJob.bind(controller, 'displacementWave')
    },

    // --- For internal use --- //

    colorReset: {
      constructorName: 'ColorResetJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'colorReset'),
      start: restartPersistentJob.bind(controller, 'colorReset')
    },
    displacementReset: {
      constructorName: 'DisplacementResetJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'displacementReset'),
      start: restartPersistentJob.bind(controller, 'displacementReset')
    }
  };

  controller.transientJobs = {
    openPost: {
      constructorName: 'OpenPostJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'openPost'),
      createRandom: openRandomPost,
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'openPost'),
      canRunWithOpenGrid: false
    },
    closePost: {
      constructorName: 'ClosePostJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'closePost'),
      createRandom: closePost,
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'closePost'),
      canRunWithOpenGrid: true
    },
    displacementRadiate: {
      constructorName: 'DisplacementRadiateJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'displacementRadiate'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'displacementRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'displacementRadiate'),
      canRunWithOpenGrid: true
    },
    highlightHover: {
      constructorName: 'HighlightHoverJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'highlightHover'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'highlightHover'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'highlightHover'),
      canRunWithOpenGrid: true
    },
    highlightRadiate: {
      constructorName: 'HighlightRadiateJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'highlightRadiate'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'highlightRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'highlightRadiate'),
      canRunWithOpenGrid: true
    },
    intraTileRadiate: {
      constructorName: 'IntraTileRadiateJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'intraTileRadiate'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'intraTileRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'intraTileRadiate'),
      canRunWithOpenGrid: true
    },
    line: {
      constructorName: 'LineJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, randomLineCreator, 'line'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'line'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'line'),
      canRunWithOpenGrid: false
    },
    linesRadiate: {
      constructorName: 'LinesRadiateJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, linesRadiateCreator, 'linesRadiate'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'linesRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'linesRadiate'),
      canRunWithOpenGrid: false
    },
    pan: {
      constructorName: 'PanJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'pan'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'pan'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'pan'),
      canRunWithOpenGrid: true
    },
    spread: {
      constructorName: 'SpreadJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'spread'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'spread'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'spread'),
      canRunWithOpenGrid: true
    },
    tileBorder: {
      constructorName: 'TileBorderJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'tileBorder'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'tileBorder'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'tileBorder'),
      canRunWithOpenGrid: true
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
    Object.keys(controller.transientJobs).forEach(function (key) {
      var config = window.hg[controller.transientJobs[key].constructorName].config;

      if (config.isRecurring) {
        controller.transientJobs[key].toggleRecurrence(grid, true, config.avgDelay,
            config.delayDeviationRange);
      }
    });
  }

  /**
   * @param {String} jobId
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   * @param {*} [extraArg]
   * @returns {AnimationJob}
   */
  function generalTransientJobCreator(jobId, grid, tile, onComplete, extraArg) {
    return new window.hg[controller.transientJobs[jobId].constructorName](grid, tile, onComplete,
        extraArg);
  }

  /**
   * @param {?Function} creator
   * @param {Array.<AnimationJob>} jobId
   * @param {Grid} grid
   * @param {?Tile} tile
   * @param {*} [extraArg]
   */
  function createTransientJob(creator, jobId, grid, tile, extraArg) {
    var job;

    if (!grid.isPostOpen || controller.transientJobs[jobId].canRunWithOpenGrid) {
      creator = creator || generalTransientJobCreator.bind(controller, jobId);

      // Create the job with whatever custom logic is needed for this particular type of job
      job = creator(grid, tile, onComplete, extraArg);

      // Store a reference to this job within the controller
      controller.transientJobs[jobId].jobs[grid.index].push(job);
      window.hg.animator.startJob(job);
    } else {
      console.log('Cannot create a ' + controller.transientJobs[jobId].constructorName +
          ' while the Grid is expanded');
    }

    // ---  --- //

    function onComplete() {
      // Destroy both references to this now-complete job
      controller.transientJobs[jobId].jobs[grid.index].splice(
          controller.transientJobs[jobId].jobs[grid.index].indexOf(job), 1);
    }
  }

  /**
   * @param {String} jobId
   * @param {Grid} grid
   */
  function createTransientJobWithARandomTile(jobId, grid) {
    controller.transientJobs[jobId].create(grid, getRandomOriginalTile(grid));
  }

  /**
   * Toggles whether an AnimationJob is automatically repeated.
   *
   * @param {String} jobId
   * @param {Grid} grid
   * @param {Boolean} isRecurring
   * @param {Number} avgDelay
   * @param {Number} delayDeviationRange
   */
  function toggleJobRecurrence(jobId, grid, isRecurring, avgDelay, delayDeviationRange) {
    var minDelay, maxDelay, actualDelayRange, jobTimeouts;

    jobTimeouts = controller.transientJobs[jobId].timeouts;

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
      controller.transientJobs[jobId].createRandom(grid);
      jobTimeouts[grid.index] = setTimeout(recur, delay);
    }
  }

  /**
   * @param {String} jobId
   * @param {Grid} grid
   */
  function createPersistentJob(jobId, grid) {
    var jobDefinition, job;

    jobDefinition = controller.persistentJobs[jobId];

    job = new window.hg[jobDefinition.constructorName](grid);
    jobDefinition.jobs[grid.index].push(job);
    jobDefinition.start(grid, jobDefinition.jobs[grid.index].length - 1);
  }

  /**
   * @param {String} jobId
   * @param {Grid} grid
   * @param {Number} [jobIndex] If not given, ALL persistent jobs (of this bound type) will be
   * restarted for the given grid.
   */
  function restartPersistentJob(jobId, grid, jobIndex) {
    if (typeof jobIndex !== 'undefined') {
      window.hg.animator.startJob(controller.persistentJobs[jobId].jobs[grid.index][jobIndex]);
    } else {
      controller.persistentJobs[jobId].jobs[grid.index].forEach(window.hg.animator.startJob);
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
  function getRandomOriginalTile(grid) {
    var tileIndex = parseInt(Math.random() * grid.originalTiles.length);
    return grid.originalTiles[tileIndex];
  }

  /**
   * @param {Grid} grid
   * @returns {Tile}
   */
  function getRandomContentTile(grid) {
    var contentIndex = parseInt(Math.random() * grid.contentTiles.length);
    return grid.contentTiles[contentIndex];
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
      controller.transientJobs.line.jobs[grid.index].push(lineJob);
    });

    return job;

    // ---  --- //

    function onAllLinesComplete() {
      // Destroy the references to the individual child lines
      job.lineJobs.forEach(function (lineJob) {
        controller.transientJobs.line.jobs[grid.index].splice(
            controller.transientJobs.line.jobs[grid.index].indexOf(lineJob), 1);
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
      controller.transientJobs.openPost.create(grid, getRandomContentTile(grid));
    }
  }

  /**
   * @param {Grid} grid
   * @returns {Window.hg.LinesRadiateJob}
   */
  function closePost(grid) {
    // If a post is open, close it; otherwise, do nothing
    if (grid.isPostOpen) {
      controller.transientJobs.closePost.create(grid, grid.expandedTile);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Creates a Grid object and registers it with the animator.
   *
   * @param {HTMLElement} parent
   * @param {Array.<Object>} tileData
   * @param {Boolean} isVertical
   * @returns {Window.hg.Grid}
   */
  function createNewHexGrid(parent, tileData, isVertical) {
    var grid, index, annotations, input;

    index = internal.grids.length;

    initializeJobArraysForGrid(index);

    grid = new window.hg.Grid(index, parent, tileData, isVertical);
    internal.grids.push(grid);

    annotations = grid.annotations;
    internal.annotations.push(annotations);

    input = new window.hg.Input(grid);
    internal.inputs.push(input);

    window.hg.animator.startJob(grid);

    controller.persistentJobs.colorReset.create(grid);
    controller.persistentJobs.displacementReset.create(grid);

    window.hg.animator.startJob(annotations);

    controller.persistentJobs.colorShift.create(grid);
    controller.persistentJobs.colorWave.create(grid);
    controller.persistentJobs.displacementWave.create(grid);

    startRecurringAnimations(grid);

    return grid;

    // ---  --- //

    function initializeJobArraysForGrid(index) {
      Object.keys(controller.persistentJobs).forEach(function (key) {
        controller.persistentJobs[key].jobs[index] = [];
      });

      Object.keys(controller.transientJobs).forEach(function (key) {
        controller.transientJobs[key].jobs[index] = [];
      });
    }
  }

  /**
   * @param {Grid} grid
   */
  function resetGrid(grid) {
    var expandedTile;
    var expandedPostId = grid.isPostOpen ? grid.expandedTile.postData.id : null;

    window.hg.animator.cancelAll();

    grid.resize();

    resetPersistentJobs(grid);

    expandedTile = getTileFromPostId(grid, expandedPostId);
    controller.transientJobs.openPost.create(grid, expandedTile);

    // ---  --- //

    function getTileFromPostId(grid, postId) {
      var i, count;

      for (i = 0, count = grid.originalTiles.length; i < count; i += 1) {
        if (grid.originalTiles[i].holdsContent && grid.originalTiles[i].postData.id === postId) {
          return grid.originalTiles[i];
        }
      }

      return null;
    }
  }

  /**
   * @param {Grid} grid
   */
  function resetPersistentJobs(grid) {
    window.hg.animator.startJob(grid);

    controller.persistentJobs.colorReset.start(grid);
    controller.persistentJobs.displacementReset.start(grid);

    window.hg.animator.startJob(internal.annotations[grid.index]);

    controller.persistentJobs.colorShift.start(grid);
    controller.persistentJobs.colorWave.start(grid);
    controller.persistentJobs.displacementWave.start(grid);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  controller.config = config;

  controller.createNewHexGrid = createNewHexGrid;
  controller.resetGrid = resetGrid;
  controller.resetPersistentJobs = resetPersistentJobs;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.controller = controller;

  window.addEventListener('resize', resize, false);

  console.log('controller module loaded');
})();
