'use strict';

/**
 * This module defines a singleton that handles the communication between the dat.GUI controller
 * and the hex-grid parameters.
 *
 * @module parameters
 */
(function () {

  var parameters = {},
      config = {},
      originalHgConfigs = {};

  config.datGuiWidth = 300;

  config.preSetConfigs = {};

  // TODO:
  config.preSetConfigs['default'] = {};
  config.preSetConfigs['stormy'] = {
    **;// TODO: will need to write new logic to copy all of the original config values from each module (and store in here somewhere), so that I can then reset to the defaults after changing things
  };
  config.preSetConfigs['honey-comb'] = {};
  config.preSetConfigs['crazy-flux'] = {};

  // ---  --- //

  parameters.config = config;
  parameters.initDatGui = initDatGui;
  parameters.updateForNewPostData = updateForNewPostData;
  parameters.grid = null;
  parameters.categoriesFolder = null;
  parameters.allCategories = [];
  parameters.categoryData = {};

  window.app = window.app || {};
  app.parameters = parameters;

  // ---  --- //

  /**
   * Sets up the dat.GUI controller.
   *
   * @param {Grid} grid
   */
  function initDatGui(grid) {
    var gui, mainFolder, miscellaneousFolder, animationsFolder, transientFolder, persistentFolder;

    parameters.grid = grid;

    storeOriginalConfigValues();

    gui = new dat.GUI();
    gui.width = config.datGuiWidth;

    // --- Main properties --- //

    mainFolder = gui.addFolder('Main');
    mainFolder.open();

    initMainFolder(mainFolder);

    // --- Miscellaneous grid properties --- //

    miscellaneousFolder = gui.addFolder('Misc');

    initAnnotationsFolder(miscellaneousFolder);
    initGridFolder(miscellaneousFolder);
    initInputFolder(miscellaneousFolder);
    initTileFolder(miscellaneousFolder);

    // --- Animation properties --- //

    animationsFolder = gui.addFolder('Animations');

    // One-time animations

    transientFolder = animationsFolder.addFolder('One Time');

    initOpenClosePostJobFolder(transientFolder);
    initDisplacementRadiateJobFolder(transientFolder);
    initHighlightHoverJobFolder(transientFolder);
    initHighlightRadiateJobFolder(transientFolder);
    initIntraTileRadiateJobFolder(transientFolder);
    initRandomLineJobFolder(transientFolder);
    initLinesRadiateJobFolder(transientFolder);
    initPanJobFolder(transientFolder);
    initSpreadJobFolder(transientFolder);
    initTileBorderJobFolder(transientFolder);

    // Persistent animations

    persistentFolder = animationsFolder.addFolder('Persistent');

    initColorShiftJobFolder(persistentFolder);
    initColorWaveJobFolder(persistentFolder);
    initDisplacementWaveJobFolder(persistentFolder);
  }

  /**
   * @param {Array.<PostData>} postData
   */
  function updateForNewPostData(postData) {
    parameters.allCategories = getAllCategories(postData);
    addCategoryMenuItems();

    // ---  --- //

    function getAllCategories(postData) {
      // Collect a mapping from each category to its number of occurrences
      var categoryMap = postData.reduce(function (map, datum) {
        return datum.categories.reduce(function (map, category) {
          map[category] = map[category] ? map[category] + 1 : 1;
        }, map);
      }, {});

      // Collect an array containing each category, sorted by the number of occurrences of each category (in
      // DESCENDING order)
      var categoryArray = Object.keys(categoryMap)
          .sort(function (category1, category2) {
            return categoryMap[category2] - categoryMap[category1];
          });

      return categoryArray;
    }

    function addCategoryMenuItems() {
      parameters.categoryData = {};

      // Add an item for showing all categories
      addCategoryItem(parameters.categoryData, 'all', parameters.categoriesFolder);

      // Add an item for showing each individual category
      parameters.allCategories.forEach(function (category) {
        parameters.categoryData[category] = false;

        addCategoryItem(parameters.categoryData, category, parameters.categoriesFolder);
      });

      // ---  --- //

      function addCategoryItem(categoryData, label, folder) {**;// TODO: make these be radio buttons instead of checkboxes
        folder.add(categoryData, label)
            .onChange(function () {
              window.hg.controller.filterGridPostDataByCategory(parameters.grid, label);
            });
      }
    }
  }

  function storeOriginalConfigValues() {
    config.originalHgConfigs = window.hg.moduleNames.map(function (moduleName) {
      return window.hg.util.deepCopy(window.hg[moduleName].config);
    });
  }

  // ------------------------------------------------------------------------------------------- //
  // Miscellaneous

  function initMainFolder(parentFolder) {
    var data = {
      'goHome': goHome,
      'hideMenu': hideMenu,
      'default': updateToPreSetConfigs.bind(window.hg.controller, 'default'),
      'stormy': updateToPreSetConfigs.bind(window.hg.controller, 'stormy'),
      'honey-comb': updateToPreSetConfigs.bind(window.hg.controller, 'honey-comb'),
      'crazy-flux': updateToPreSetConfigs.bind(window.hg.controller, 'crazy-flux'),
      'work': filterPosts.bind(window.hg.controller, 'work'),
      'research': filterPosts.bind(window.hg.controller, 'research'),
      'side-projects': filterPosts.bind(window.hg.controller, 'side-project')
    };

    var presetConfigsFolder = parentFolder.addFolder('Pre-Set Configurations');
    presetConfigsFolder.open();
    presetConfigsFolder.add(data, 'default');
    presetConfigsFolder.add(data, 'stormy');
    presetConfigsFolder.add(data, 'honey-comb');
    presetConfigsFolder.add(data, 'crazy-flux');

    var filterPostsFolder = parentFolder.addFolder('Filter Posts');
    filterPostsFolder.open();
    filterPostsFolder.add(data, 'work');
    filterPostsFolder.add(data, 'research');
    filterPostsFolder.add(data, 'side-projects');
    parameters.categoriesFolder = filterPostsFolder.addFolder('Categories');

    parentFolder.add(data, 'Go Home');
    parentFolder.add(data, 'Hide Menu');

    // ---  --- //

    function goHome() {
      console.log('Go Home clicked');
      // TODO:
    }

    function hideMenu() {
      console.log('Hide Menu clicked');
      **;// TODO:
    }

    function updateToPreSetConfigs(configName) {
      // TODO:
      // config.preSetConfigs[configName]
    }

    function filterPosts(category) {
      parameters.categoryData[category] = true;**;// TODO: update for radio buttons...
      window.hg.controller.filterGridPostDataByCategory(parameters.grid, category);
    }
  }

  /**
   * Sets up the folder for Grid parameters within the dat.GUI controller.
   */
  function initGridFolder(parentFolder) {
    var gridFolder, colors;

    gridFolder = parentFolder.addFolder('Grid');

    colors = {};
    colors.backgroundColor = window.hg.util.hslToHsv({
      h: window.hg.Grid.config.backgroundHue,
      s: window.hg.Grid.config.backgroundSaturation * 0.01,
      l: window.hg.Grid.config.backgroundLightness * 0.01
    });
    colors.tileColor = window.hg.util.hslToHsv({
      h: window.hg.Grid.config.tileHue,
      s: window.hg.Grid.config.tileSaturation * 0.01,
      l: window.hg.Grid.config.tileLightness * 0.01
    });

    gridFolder.add(parameters.grid, 'isVertical')
        .onChange(function () {
          window.hg.controller.resetGrid(parameters.grid);
        });
    gridFolder.add(window.hg.Grid.config, 'tileOuterRadius', 10, 400)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          window.hg.controller.resetGrid(parameters.grid);
        });
    gridFolder.add(window.hg.Grid.config, 'tileGap', -50, 100)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          window.hg.controller.resetGrid(parameters.grid);
        });
    gridFolder.addColor(colors, 'backgroundColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.backgroundColor);

          window.hg.Grid.config.backgroundHue = color.h;
          window.hg.Grid.config.backgroundSaturation = color.s * 100;
          window.hg.Grid.config.backgroundLightness = color.l * 100;

          parameters.grid.setBackgroundColor();
        });
    gridFolder.addColor(colors, 'tileColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.tileColor);

          window.hg.Grid.config.tileHue = color.h;
          window.hg.Grid.config.tileSaturation = color.s * 100;
          window.hg.Grid.config.tileLightness = color.l * 100;

          parameters.grid.updateTileColor();
          if (window.hg.Annotations.config.annotations['contentTiles'].enabled) {
            parameters.grid.annotations.toggleAnnotationEnabled('contentTiles', true);
          }
        });
    gridFolder.add(window.hg.Grid.config, 'firstRowYOffset', -100, 100)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          window.hg.controller.resetGrid(parameters.grid);
        });
    gridFolder.add(window.hg.Grid.config, 'contentStartingRowIndex', 0, 4).step(1)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          parameters.grid.computeContentIndices();
          window.hg.controller.resetGrid(parameters.grid);
        });
    gridFolder.add(window.hg.Grid.config, 'targetContentAreaWidth', 500, 1500)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          parameters.grid.computeContentIndices();
          window.hg.controller.resetGrid(parameters.grid);
        });
    gridFolder.add(window.hg.Grid.config, 'contentDensity', 0.1, 1.0)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          parameters.grid.computeContentIndices();
          window.hg.controller.resetGrid(parameters.grid);
        });
  }

  /**
   * Sets up the folder for Annotation parameters within the dat.GUI controller.
   */
  function initAnnotationsFolder(parentFolder) {
    var annotationsFolder, key, data;

    annotationsFolder = parentFolder.addFolder('Annotations');

    for (key in window.hg.Annotations.config.annotations) {
      data = {};
      data[key] = window.hg.Annotations.config.annotations[key].enabled;

      annotationsFolder.add(data, key).onChange(function (value) {
        parameters.grid.annotations.toggleAnnotationEnabled(this.property, value);
      });
    }
  }

  /**
   * Sets up the folder for Input parameters within the dat.GUI controller.
   */
  function initInputFolder(parentFolder) {
    var inputFolder;

    inputFolder = parentFolder.addFolder('Input');

    inputFolder.add(window.hg.Input.config, 'contentTileClickAnimation',
        Object.keys(window.hg.Input.config.possibleClickAnimations));
    inputFolder.add(window.hg.Input.config, 'emptyTileClickAnimation',
        Object.keys(window.hg.Input.config.possibleClickAnimations));
  }

  /**
   * Sets up the folder for Tile parameters within the dat.GUI controller.
   */
  function initTileFolder(parentFolder) {
    var tileFolder;

    tileFolder = parentFolder.addFolder('Tiles');

    tileFolder.add(window.hg.Tile.config, 'dragCoeff', 0.000001, 0.1);
    tileFolder.add(window.hg.Tile.config, 'neighborSpringCoeff', 0.000001, 0.0001);
    tileFolder.add(window.hg.Tile.config, 'neighborDampingCoeff', 0.000001, 0.009999);
    tileFolder.add(window.hg.Tile.config, 'innerAnchorSpringCoeff', 0.000001, 0.0001);
    tileFolder.add(window.hg.Tile.config, 'innerAnchorDampingCoeff', 0.000001, 0.009999);
    tileFolder.add(window.hg.Tile.config, 'borderAnchorSpringCoeff', 0.000001, 0.0001);
    tileFolder.add(window.hg.Tile.config, 'borderAnchorDampingCoeff', 0.000001, 0.009999);
    tileFolder.add(window.hg.Tile.config, 'forceSuppressionLowerThreshold', 0.000001, 0.009999);
    tileFolder.add(window.hg.Tile.config, 'velocitySuppressionLowerThreshold', 0.000001, 0.009999);
    tileFolder.add(window.hg.Grid.config, 'tileMass', 0.1, 10)
        .onChange(function (value) {
          parameters.grid.updateTileMass(value);
        });
  }

  // ------------------------------------------------------------------------------------------- //
  // One-time animations

  /**
   * Sets up the folder for OpenPostJob parameters and the ClosePostJob parameters within the
   * dat.GUI controller.
   */
  function initOpenClosePostJobFolder(parentFolder) {
    var openClosePostJobFolder, data;

    openClosePostJobFolder = parentFolder.addFolder('Open/Close Post');

    data = {
      'triggerOpenPost': window.hg.controller.transientJobs.openPost.createRandom.bind(
          window.hg.controller, parameters.grid),
      'triggerClosePost': window.hg.controller.transientJobs.closePost.createRandom.bind(
              window.hg.controller, parameters.grid),
      'triggerTogglePost': function () {
        if (parameters.grid.isPostOpen) {
          data.triggerClosePost();
        } else {
          data.triggerOpenPost();
        }
      }
    };

    openClosePostJobFolder.add(data, 'triggerTogglePost');

    openClosePostJobFolder.add(window.hg.OpenPostJob.config, 'duration', 10, 10000)
        .name('Open Duration');
    openClosePostJobFolder.add(window.hg.ClosePostJob.config, 'duration', 10, 10000)
        .name('Close Duration');
    openClosePostJobFolder.add(window.hg.OpenPostJob.config, 'expandedDisplacementTileCount', 0, 5)
        .step(1);
  }

  /**
   * Sets up the folder for DisplacementRadiateJob parameters within the dat.GUI controller.
   */
  function initDisplacementRadiateJobFolder(parentFolder) {
    var displacementRadiateJobFolder, data;

    displacementRadiateJobFolder = parentFolder.addFolder('Displacement Radiate');
//    displacementRadiateJobFolder.open();// TODO: remove me

    data = {
      'triggerDisplacement':
          window.hg.controller.transientJobs.displacementRadiate.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    displacementRadiateJobFolder.add(data, 'triggerDisplacement');

    displacementRadiateJobFolder.add(window.hg.DisplacementRadiateJob.config, 'duration', 10, 10000);

    // TODO:

    displacementRadiateJobFolder.add(window.hg.DisplacementRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    displacementRadiateJobFolder.add(window.hg.DisplacementRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    displacementRadiateJobFolder.add(window.hg.DisplacementRadiateJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.displacementRadiate.toggleRecurrence(
          parameters.grid,
          window.hg.DisplacementRadiateJob.config.isRecurring,
          window.hg.DisplacementRadiateJob.config.avgDelay,
          window.hg.DisplacementRadiateJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for HighlightHoverJob parameters within the dat.GUI controller.
   */
  function initHighlightHoverJobFolder(parentFolder) {
    var highlightHoverJobFolder, data, colors;

    colors = [];
    colors.deltaColor = window.hg.util.hslToHsv({
      h: window.hg.HighlightHoverJob.config.deltaHue,
      s: window.hg.HighlightHoverJob.config.deltaSaturation * 0.01,
      l: window.hg.HighlightHoverJob.config.deltaLightness * 0.01
    });

    highlightHoverJobFolder = parentFolder.addFolder('Hover Highlight');

    data = {
      'triggerHighlightHover': window.hg.controller.transientJobs.highlightHover.createRandom.bind(
          window.hg.controller, parameters.grid)
    };

    highlightHoverJobFolder.add(data, 'triggerHighlightHover');

    highlightHoverJobFolder.add(window.hg.HighlightHoverJob.config, 'duration', 10, 10000);
    highlightHoverJobFolder.addColor(colors, 'deltaColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.deltaColor);

          window.hg.HighlightHoverJob.config.deltaHue = color.h;
          window.hg.HighlightHoverJob.config.deltaSaturation = color.s * 100;
          window.hg.HighlightHoverJob.config.deltaLightness = color.l * 100;
        });
    highlightHoverJobFolder.add(window.hg.HighlightHoverJob.config, 'opacity', 0, 1);

    highlightHoverJobFolder.add(window.hg.HighlightHoverJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    highlightHoverJobFolder.add(window.hg.HighlightHoverJob.config, 'avgDelay', 10, 2000)
        .onChange(toggleRecurrence);
    highlightHoverJobFolder.add(window.hg.HighlightHoverJob.config, 'delayDeviationRange', 0, 2000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.highlightHover.toggleRecurrence(
          parameters.grid,
          window.hg.HighlightHoverJob.config.isRecurring,
          window.hg.HighlightHoverJob.config.avgDelay,
          window.hg.HighlightHoverJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for HighlightRadiateJob parameters within the dat.GUI controller.
   */
  function initHighlightRadiateJobFolder(parentFolder) {
    var highlightRadiateJobFolder, data, colors;

    colors = [];
    colors.deltaColor = window.hg.util.hslToHsv({
      h: window.hg.HighlightRadiateJob.config.deltaHue,
      s: window.hg.HighlightRadiateJob.config.deltaSaturation * 0.01,
      l: window.hg.HighlightRadiateJob.config.deltaLightness * 0.01
    });

    highlightRadiateJobFolder = parentFolder.addFolder('Radiating Highlight');

    data = {
      'triggerHighlightRadiate':
          window.hg.controller.transientJobs.highlightRadiate.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    highlightRadiateJobFolder.add(data, 'triggerHighlightRadiate');

    highlightRadiateJobFolder.add(window.hg.HighlightRadiateJob.config, 'shimmerSpeed', 0.1, 10);
    highlightRadiateJobFolder.add(window.hg.HighlightRadiateJob.config, 'shimmerWaveWidth', 1, 2000);
    highlightRadiateJobFolder.add(window.hg.HighlightRadiateJob.config, 'duration', 10, 10000);
    highlightRadiateJobFolder.addColor(colors, 'deltaColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.deltaColor);

          window.hg.HighlightRadiateJob.config.deltaHue = color.h;
          window.hg.HighlightRadiateJob.config.deltaSaturation = color.s * 100;
          window.hg.HighlightRadiateJob.config.deltaLightness = color.l * 100;
        });
    highlightRadiateJobFolder.add(window.hg.HighlightRadiateJob.config, 'opacity', 0, 1);

    highlightRadiateJobFolder.add(window.hg.HighlightRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    highlightRadiateJobFolder.add(window.hg.HighlightRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    highlightRadiateJobFolder
        .add(window.hg.HighlightRadiateJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.highlightRadiate.toggleRecurrence(
          parameters.grid,
          window.hg.HighlightRadiateJob.config.isRecurring,
          window.hg.HighlightRadiateJob.config.avgDelay,
          window.hg.HighlightRadiateJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for IntraTileRadiateJob parameters within the dat.GUI controller.
   */
  function initIntraTileRadiateJobFolder(parentFolder) {
    var intraTileRadiateJobFolder, data;

    intraTileRadiateJobFolder = parentFolder.addFolder('Intra-Tile Radiate');
//    intraTileRadiateJobFolder.open();// TODO: remove me

    data = {
      'triggerIntraTileRadiate':
          window.hg.controller.transientJobs.intraTileRadiate.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    intraTileRadiateJobFolder.add(data, 'triggerIntraTileRadiate');

    intraTileRadiateJobFolder.add(window.hg.IntraTileRadiateJob.config, 'duration', 10, 10000);

    // TODO:

    intraTileRadiateJobFolder.add(window.hg.IntraTileRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    intraTileRadiateJobFolder.add(window.hg.IntraTileRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    intraTileRadiateJobFolder.add(window.hg.IntraTileRadiateJob.config, 'delayDeviationRange',
        0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.intraTileRadiate.toggleRecurrence(
          parameters.grid,
          window.hg.IntraTileRadiateJob.config.isRecurring,
          window.hg.IntraTileRadiateJob.config.avgDelay,
          window.hg.IntraTileRadiateJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for LineJob parameters within the dat.GUI controller.
   */
  function initRandomLineJobFolder(parentFolder) {
    var randomLineJobFolder, data;

    randomLineJobFolder = parentFolder.addFolder('Random Lines');

    data = {
      'triggerLine': window.hg.controller.transientJobs.line.createRandom.bind(
          window.hg.controller, parameters.grid)
    };

    randomLineJobFolder.add(data, 'triggerLine');

    randomLineJobFolder.add(window.hg.LineJob.config, 'duration', 100, 20000);
    randomLineJobFolder.add(window.hg.LineJob.config, 'lineWidth', 1, 100);
    randomLineJobFolder.add(window.hg.LineJob.config, 'lineLength', 10, 60000);
    randomLineJobFolder.add(window.hg.LineJob.config, 'lineSidePeriod', 5, 500);
    randomLineJobFolder.add(window.hg.LineJob.config, 'startSaturation', 0, 100);
    randomLineJobFolder.add(window.hg.LineJob.config, 'startLightness', 0, 100);
    randomLineJobFolder.add(window.hg.LineJob.config, 'startOpacity', 0, 1);
    randomLineJobFolder.add(window.hg.LineJob.config, 'endSaturation', 0, 100);
    randomLineJobFolder.add(window.hg.LineJob.config, 'endLightness', 0, 100);
    randomLineJobFolder.add(window.hg.LineJob.config, 'endOpacity', 0, 1);
    randomLineJobFolder.add(window.hg.LineJob.config, 'sameDirectionProb', 0, 1);

    randomLineJobFolder.add(window.hg.LineJob.config, 'isBlurOn');
    randomLineJobFolder.add(window.hg.LineJob.config, 'blurStdDeviation', 0, 80);

    randomLineJobFolder.add(window.hg.LineJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    randomLineJobFolder.add(window.hg.LineJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    randomLineJobFolder.add(window.hg.LineJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.line.toggleRecurrence(
          parameters.grid,
          window.hg.LineJob.config.isRecurring,
          window.hg.LineJob.config.avgDelay,
          window.hg.LineJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for LinesRadiateJob parameters within the dat.GUI controller.
   */
  function initLinesRadiateJobFolder(parentFolder) {
    var linesRadiateJobFolder, data;

    linesRadiateJobFolder = parentFolder.addFolder('Radiating Lines');

    data = {
      'triggerLinesRadiate': window.hg.controller.transientJobs.linesRadiate.createRandom.bind(
          window.hg.controller, parameters.grid)
    };

    linesRadiateJobFolder.add(data, 'triggerLinesRadiate');

    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'duration', 100, 20000);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'lineWidth', 1, 100);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'lineLength', 10, 60000);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'lineSidePeriod', 5, 500);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'startSaturation', 0, 100);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'startLightness', 0, 100);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'startOpacity', 0, 1);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'endSaturation', 0, 100);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'endLightness', 0, 100);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'endOpacity', 0, 1);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'sameDirectionProb', 0, 1);

    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'isBlurOn');
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'blurStdDeviation', 0, 80);

    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.linesRadiate.toggleRecurrence(
          parameters.grid,
          window.hg.LinesRadiateJob.config.isRecurring,
          window.hg.LinesRadiateJob.config.avgDelay,
          window.hg.LinesRadiateJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for PanJob parameters within the dat.GUI controller.
   */
  function initPanJobFolder(parentFolder) {
    var panJobFolder, data;

    panJobFolder = parentFolder.addFolder('Pan');

    data = {
      'triggerPan':
          window.hg.controller.transientJobs.pan.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    panJobFolder.add(data, 'triggerPan');

    panJobFolder.add(window.hg.PanJob.config, 'duration', 10, 10000);

    panJobFolder.add(window.hg.PanJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    panJobFolder.add(window.hg.PanJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    panJobFolder.add(window.hg.PanJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.pan.toggleRecurrence(
          parameters.grid,
          window.hg.PanJob.config.isRecurring,
          window.hg.PanJob.config.avgDelay,
          window.hg.PanJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for SpreadJob parameters within the dat.GUI controller.
   */
  function initSpreadJobFolder(parentFolder) {
    var spreadJobFolder, data;

    spreadJobFolder = parentFolder.addFolder('Spread');

    data = {
      'triggerSpread':
          window.hg.controller.transientJobs.spread.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    spreadJobFolder.add(data, 'triggerSpread');

    spreadJobFolder.add(window.hg.SpreadJob.config, 'duration', 10, 10000);

    spreadJobFolder.add(window.hg.SpreadJob.config, 'displacementRatio', 0.01, 1);

    spreadJobFolder.add(window.hg.SpreadJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    spreadJobFolder.add(window.hg.SpreadJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    spreadJobFolder.add(window.hg.SpreadJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.spread.toggleRecurrence(
          parameters.grid,
          window.hg.SpreadJob.config.isRecurring,
          window.hg.SpreadJob.config.avgDelay,
          window.hg.SpreadJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for TileBorderJob parameters within the dat.GUI controller.
   */
  function initTileBorderJobFolder(parentFolder) {
    var tileBorderJobFolder, data;

    tileBorderJobFolder = parentFolder.addFolder('Tile Border');
//    tileBorderJobFolder.open();// TODO: remove me

    data = {
      'triggerTileBorder': window.hg.controller.transientJobs.tileBorder.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    tileBorderJobFolder.add(data, 'triggerTileBorder');

    tileBorderJobFolder.add(window.hg.TileBorderJob.config, 'duration', 10, 10000);

    // TODO:

    tileBorderJobFolder.add(window.hg.TileBorderJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    tileBorderJobFolder.add(window.hg.TileBorderJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    tileBorderJobFolder.add(window.hg.TileBorderJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.tileBorder.toggleRecurrence(
          parameters.grid,
          window.hg.TileBorderJob.config.isRecurring,
          window.hg.TileBorderJob.config.avgDelay,
          window.hg.TileBorderJob.config.delayDeviationRange);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Persistent animations

  /**
   * Sets up the folder for ColorShiftJob parameters within the dat.GUI controller.
   */
  function initColorShiftJobFolder(parentFolder) {
    var colorWaveJobFolder;

    colorWaveJobFolder = parentFolder.addFolder('Color Shift');
//    colorWaveJobFolder.open();// TODO: remove me

    // TODO:
  }

  /**
   * Sets up the folder for ColorWaveJob parameters within the dat.GUI controller.
   */
  function initColorWaveJobFolder(parentFolder) {
    var colorWaveJobFolder = parentFolder.addFolder('Color Wave');

    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          window.hg.ColorWaveJob.config.halfPeriod = value / 2;
        });
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          window.hg.controller.persistentJobs.colorWave.start(parameters.grid);
        });
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'originX', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.colorWave.start(parameters.grid);
        });
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'originY', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.colorWave.start(parameters.grid);
        });
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'deltaHue', 0, 360);
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'deltaSaturation', 0, 100);
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'deltaLightness', 0, 100);
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'opacity', 0, 1);
  }

  /**
   * Sets up the folder for DisplacementWaveJob parameters within the dat.GUI controller.
   */
  function initDisplacementWaveJobFolder(parentFolder) {
    var displacementWaveJobFolder;

    displacementWaveJobFolder = parentFolder.addFolder('Displacement Wave');

    displacementWaveJobFolder.add(window.hg.DisplacementWaveJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          window.hg.DisplacementWaveJob.config.halfPeriod = value / 2;
        });
    displacementWaveJobFolder.add(window.hg.DisplacementWaveJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          window.hg.controller.persistentJobs.displacementWave.start(parameters.grid);
        });
    displacementWaveJobFolder.add(window.hg.DisplacementWaveJob.config, 'originX', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.displacementWave.start(parameters.grid);
        });
    displacementWaveJobFolder.add(window.hg.DisplacementWaveJob.config, 'originY', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.displacementWave.start(parameters.grid);
        });
    displacementWaveJobFolder.add(window.hg.DisplacementWaveJob.config, 'tileDeltaX', -300, 300);
    displacementWaveJobFolder.add(window.hg.DisplacementWaveJob.config, 'tileDeltaY', -300, 300);
  }

  console.log('parameters module loaded');
})();
