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
    ColorShiftJob: {
      constructorName: 'ColorShiftJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'ColorShiftJob'),
      start: restartPersistentJob.bind(controller, 'ColorShiftJob'),
      cancel: cancelPersistentJob.bind(controller, 'ColorShiftJob')
    },
    ColorWaveJob: {
      constructorName: 'ColorWaveJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'ColorWaveJob'),
      start: restartPersistentJob.bind(controller, 'ColorWaveJob'),
      cancel: cancelPersistentJob.bind(controller, 'ColorWaveJob')
    },
    DisplacementWaveJob: {
      constructorName: 'DisplacementWaveJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'DisplacementWaveJob'),
      start: restartPersistentJob.bind(controller, 'DisplacementWaveJob'),
      cancel: cancelPersistentJob.bind(controller, 'DisplacementWaveJob')
    },

    // --- For internal use --- //

    ColorResetJob: {
      constructorName: 'ColorResetJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'ColorResetJob'),
      start: restartPersistentJob.bind(controller, 'ColorResetJob'),
      cancel: cancelPersistentJob.bind(controller, 'ColorResetJob')
    },
    DisplacementResetJob: {
      constructorName: 'DisplacementResetJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'DisplacementResetJob'),
      start: restartPersistentJob.bind(controller, 'DisplacementResetJob'),
      cancel: cancelPersistentJob.bind(controller, 'DisplacementResetJob')
    }
  };

  controller.transientJobs = {
    OpenPostJob: {
      constructorName: 'OpenPostJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'OpenPostJob'),
      createRandom: openRandomPost,
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'OpenPostJob'),
      canRunWithOpenGrid: false
    },
    ClosePostJob: {
      constructorName: 'ClosePostJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'ClosePostJob'),
      createRandom: closePost,
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'ClosePostJob'),
      canRunWithOpenGrid: true
    },
    CarouselImageSlideJob: {
      constructorName: 'CarouselImageSlideJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'CarouselImageSlideJob'),
      createRandom: null,
      toggleRecurrence: null,
      canRunWithOpenGrid: true
    },
    DilateSectorsJob: {
      constructorName: 'DilateSectorsJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'DilateSectorsJob'),
      createRandom: null,
      toggleRecurrence: null,
      canRunWithOpenGrid: true
    },
    FadePostJob: {
      constructorName: 'FadePostJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'FadePostJob'),
      createRandom: null,
      toggleRecurrence: null,
      canRunWithOpenGrid: true
    },
    DisplacementRadiateJob: {
      constructorName: 'DisplacementRadiateJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'DisplacementRadiateJob'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'DisplacementRadiateJob'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'DisplacementRadiateJob'),
      canRunWithOpenGrid: true
    },
    HighlightHoverJob: {
      constructorName: 'HighlightHoverJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'HighlightHoverJob'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'HighlightHoverJob'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'HighlightHoverJob'),
      canRunWithOpenGrid: true
    },
    HighlightRadiateJob: {
      constructorName: 'HighlightRadiateJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'HighlightRadiateJob'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'HighlightRadiateJob'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'HighlightRadiateJob'),
      canRunWithOpenGrid: true
    },
    IntraTileRadiateJob: {
      constructorName: 'IntraTileRadiateJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'IntraTileRadiateJob'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'IntraTileRadiateJob'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'IntraTileRadiateJob'),
      canRunWithOpenGrid: true
    },
    LineJob: {
      constructorName: 'LineJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, randomLineCreator, 'LineJob'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'LineJob'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'LineJob'),
      canRunWithOpenGrid: false
    },
    LinesRadiateJob: {
      constructorName: 'LinesRadiateJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, linesRadiateCreator, 'LinesRadiateJob'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'LinesRadiateJob'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'LinesRadiateJob'),
      canRunWithOpenGrid: false
    },
    PanJob: {
      constructorName: 'PanJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'PanJob'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'PanJob'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'PanJob'),
      canRunWithOpenGrid: true
    },
    SpreadJob: {
      constructorName: 'SpreadJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'SpreadJob'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'SpreadJob'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'SpreadJob'),
      canRunWithOpenGrid: true
    },
    TileBorderJob: {
      constructorName: 'TileBorderJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'TileBorderJob'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'TileBorderJob'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'TileBorderJob'),
      canRunWithOpenGrid: true
    }
  };

  internal.grids = [];
  internal.inputs = [];
  internal.annotations = [];
  internal.postData = [];
  internal.performanceCheckJob = true;

  config.isLowPerformanceBrowser = false;
  config.isSafariBrowser = false;

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
   * @returns {?AnimationJob}
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

      return job;
    } else {
      console.log('Cannot create a ' + controller.transientJobs[jobId].constructorName +
          ' while the Grid is expanded');

      return null;
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
   * @returns {?AnimationJob}
   */
  function createTransientJobWithARandomTile(jobId, grid) {
    return controller.transientJobs[jobId].create(grid, getRandomOriginalTile(grid));
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
   * @param {String} jobId
   * @param {Grid} grid
   * @param {Number} [jobIndex] If not given, ALL persistent jobs (of this bound type) will be
   * cancelled for the given grid.
   */
  function cancelPersistentJob(jobId, grid, jobIndex) {
    if (typeof jobIndex !== 'undefined') {
      controller.persistentJobs[jobId].jobs[grid.index][jobIndex].cancel();
    } else {
      controller.persistentJobs[jobId].jobs[grid.index].forEach(function (job) {
        job.cancel();
      });
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
      controller.transientJobs.LineJob.jobs[grid.index].push(lineJob);
    });

    return job;

    // ---  --- //

    function onAllLinesComplete() {
      // Destroy the references to the individual child lines
      job.lineJobs.forEach(function (lineJob) {
        controller.transientJobs.LineJob.jobs[grid.index].splice(
            controller.transientJobs.LineJob.jobs[grid.index].indexOf(lineJob), 1);
      });

      onComplete();
    }
  }

  // --- One-time-job random creation functions --- //

  /**
   * @param {Grid} grid
   * @returns {?Window.hg.OpenPostJob}
   */
  function openRandomPost(grid) {
    // If no post is open, pick a random content tile, and open the post; otherwise, do nothing
    if (!grid.isPostOpen) {
      return controller.transientJobs.OpenPostJob.create(grid, getRandomContentTile(grid));
    } else {
      return null;
    }
  }

  /**
   * @param {Grid} grid
   * @returns {?Window.hg.ClosePostJob}
   */
  function closePost(grid) {
    // If a post is open, close it; otherwise, do nothing
    if (grid.isPostOpen) {
      return controller.transientJobs.ClosePostJob.create(grid, grid.expandedTile);
    } else {
      return null;
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

    controller.persistentJobs.ColorResetJob.create(grid);
    controller.persistentJobs.DisplacementResetJob.create(grid);

    window.hg.animator.startJob(annotations);

    controller.persistentJobs.ColorShiftJob.create(grid);
    controller.persistentJobs.ColorWaveJob.create(grid);
    controller.persistentJobs.DisplacementWaveJob.create(grid);

    startRecurringAnimations(grid);

    handleSafariBrowser(grid);

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

    if (expandedPostId) {
      expandedTile = getTileFromPostId(grid, expandedPostId);
      controller.transientJobs.OpenPostJob.create(grid, expandedTile);
    }

    if (internal.performanceCheckJob) {
      runPerformanceCheck();
    }

    handleSafariBrowser(grid);

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

    controller.persistentJobs.ColorResetJob.start(grid);
    controller.persistentJobs.DisplacementResetJob.start(grid);

    window.hg.animator.startJob(internal.annotations[grid.index]);

    // Don't run these persistent animations on low-performance browsers
    if (!config.isLowPerformanceBrowser) {
      controller.persistentJobs.ColorShiftJob.start(grid);
      controller.persistentJobs.ColorWaveJob.start(grid);
      controller.persistentJobs.DisplacementWaveJob.start(grid);
    }
  }

  /**
   * @param {Grid} grid
   */
  function stopPersistentJobsForLowPerformanceBrowser(grid) {
    controller.persistentJobs.ColorShiftJob.cancel(grid);
    controller.persistentJobs.ColorWaveJob.cancel(grid);
    controller.persistentJobs.DisplacementWaveJob.cancel(grid);
  }

  /**
   * @param {Grid} grid
   * @param {Array.<PostData>} postData
   */
  function setGridPostData(grid, postData) {
    internal.postData[grid.index] = postData;

    setGridFilteredPostData(grid, postData);
  }

  /**
   * @param {Grid} grid
   * @param {String} category A value of 'all' will match all categories.
   */
  function filterGridPostDataByCategory(grid, category) {
    var matches;
    var postData = internal.postData[grid.index];

    if (category !== 'all') {
      matches = postData.filter(function (postDatum) {
        return postDatum.categories.indexOf(category) >= 0;
      });
    } else {
      matches = postData.slice(0);
    }

    setGridFilteredPostData(grid, matches);
  }

  /**
   * @param {Grid} grid
   * @param {Array.<PostData>} postData
   */
  function setGridFilteredPostData(grid, postData) {
    //TODO: check that these resets are correct
    grid.isPostOpen = false;
    grid.pagePost = null;
    grid.isTransitioning = false;
    grid.expandedTile = null;
    grid.sectors = null;
    grid.allNonContentTiles = null;

    grid.postData = postData;

    grid.computeContentIndices();

    resetGrid(grid);
  }

  /**
   * @param {Grid} grid
   */
  function handleSafariBrowser(grid) {
    if (window.hg.util.checkForSafari()) {
      console.info('Adjusting SVG for the Safari browser');

      config.isSafariBrowser = true;

      grid.svg.style.width = grid.parent.offsetWidth + 'px';
      grid.svg.style.height = grid.parent.offsetHeight + 'px';
    }
  }

  function handleLowPerformanceBrowser() {
    window.hg.util.requestAnimationFrame(function () {
      config.isLowPerformanceBrowser = true;

      internal.grids.forEach(stopPersistentJobsForLowPerformanceBrowser);

      resize();

      displayLowPerformanceMessage();
    });

    // ---  --- //

    function displayLowPerformanceMessage() {
      var lowPerformanceMessage = 'Switching to low-performance mode.';

      console.warn(lowPerformanceMessage);

      var messagePanel = document.createElement('div');
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(messagePanel);

      messagePanel.innerHTML = lowPerformanceMessage;
      messagePanel.style.zIndex = 5000;
      messagePanel.style.position = 'absolute';
      messagePanel.style.top = '0';
      messagePanel.style.right = '0';
      messagePanel.style.bottom = '0';
      messagePanel.style.left = '0';
      messagePanel.style.width = '70%';
      messagePanel.style.height = '70%';
      messagePanel.style.margin = 'auto';
      messagePanel.style.padding = '5%';
      messagePanel.style.fontSize = '5em';
      messagePanel.style.fontWeight = 'bold';
      messagePanel.style.opacity = '1';
      messagePanel.style.color = 'white';
      messagePanel.style.backgroundColor = 'rgba(60,0,0,0.6)';
      window.hg.util.setTransition(messagePanel, 'opacity 1s linear 2.5s');

      setTimeout(function () {
        messagePanel.style.opacity = '0';

        setTimeout(function () {
          body.removeChild(messagePanel);
        }, 3500);
      }, 10);
    }
  }

  function runPerformanceCheck() {
    var maxRatioOfMaxDeltaTimeFrames = 0.25;
    var numberOfFramesToCheck = 20;

    var frameCount, maxDeltaTimeFrameCount;

    internal.performanceCheckJob = {
      start: function (startTime) {
        frameCount = 0;
        maxDeltaTimeFrameCount = 0;
        internal.performanceCheckJob.startTime = startTime;
        internal.performanceCheckJob.isComplete = false;
      },
      update: function (currentTime, deltaTime) {
        frameCount++;

        // Does the current frame fail the speed test?
        if (deltaTime >= window.hg.animator.config.deltaTimeUpperThreshold) {
          maxDeltaTimeFrameCount++;
        }

        // Has the performance check finished?
        if (frameCount >= numberOfFramesToCheck) {
          internal.performanceCheckJob.isComplete = true;
          internal.performanceCheckJob = null;

          console.info('--- PERFORMANCE DIAGNOSTICS ---');
          console.info('maxDeltaTimeFrameCount',maxDeltaTimeFrameCount);
          console.info('frameCount',frameCount);
          console.info('-------------------------------');

          // Did the overall performance test fail?
          if (maxDeltaTimeFrameCount / frameCount > maxRatioOfMaxDeltaTimeFrames) {
            handleLowPerformanceBrowser();
          }
        }
      },
      draw: function () {},
      cancel: function () {},
      init: function () {},
      isComplete: true
    };

    // Run this on the next frame so that some of the setup noise from the current early frame is ignored
    window.hg.util.requestAnimationFrame(function () {
      window.hg.animator.startJob(internal.performanceCheckJob);
    });
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  controller.config = config;

  controller.createNewHexGrid = createNewHexGrid;
  controller.resetGrid = resetGrid;
  controller.resetPersistentJobs = resetPersistentJobs;
  controller.setGridPostData = setGridPostData;
  controller.filterGridPostDataByCategory = filterGridPostDataByCategory;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.controller = controller;

  window.addEventListener('resize', resize, false);

  console.log('controller module loaded');
})();
