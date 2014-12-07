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

  // TODO: implement these different presets
  config.preSetConfigs['default'] = {};
  config.preSetConfigs['stormy'] = {
    Grid: {
      tileOuterRadius: 80,
      tileHue: 230
    }
  };
  config.preSetConfigs['honey-comb'] = {
    Grid: {
      tileOuterRadius: 50,
      tileHue: 54
    },
    LineJob: {
      isRecurring: false
    }
  };
  config.preSetConfigs['crazy-flux'] = {
    Grid: {
      tileOuterRadius: 80,
      tileHue: 24
    }
  };

  config.folders = [
    {
      name: 'Main',
      isOpen: true,
      createItems: createMainItems
    },
    {
      name: 'Grid',
      isOpen: false,
      createItems: createGridItems
    },
    {
      name: 'Annotations',
      isOpen: false,
      createItems: createAnnotationsItems
    },
    {
      name: 'Particle System',
      isOpen: false,
      createItems: createParticleSystemItems
    },
    {
      name: 'Input',
      isOpen: false,
      createItems: createInputItems
    },
    {
      name: 'Animations',
      isOpen: false,
      createItems: null,
      children: [
        {
          name: 'Transient',
          isOpen: false,
          createItems: null,
          children: [
            {
              name: 'Open/Close Post',
              isOpen: false,
              createItems: createOpenClosePostItems
            },
            {
              name: 'Displacement Radiate',
              isOpen: false,
              createItems: createDisplacementRadiateItems
            },
            {
              name: 'Hover Highlight',
              isOpen: false,
              createItems: createHoverHighlightItems
            },
            {
              name: 'Radiating Highlight',
              isOpen: false,
              createItems: createRadiatingHighlightItems
            },
            {
              name: 'Intra-Tile Radiate',
              isOpen: false,
              createItems: createIntraTileRadiateItems
            },
            {
              name: 'Random Lines',
              isOpen: false,
              createItems: createRandomLinesItems
            },
            {
              name: 'Radiating Lines',
              isOpen: false,
              createItems: createRadiatingLinesItems
            },
            {
              name: 'Pan',
              isOpen: false,
              createItems: createPanItems
            },
            {
              name: 'Spread',
              isOpen: false,
              createItems: createSpreadItems
            },
            {
              name: 'Tile Border',
              isOpen: false,
              createItems: createTileBorderItems
            }
          ]
        },
        {
          name: 'Persistent',
          isOpen: false,
          createItems: null,
          children: [
            {
              name: 'Color Shift',
              isOpen: false,
              createItems: createColorShiftItems
            },
            {
              name: 'Color Wave',
              isOpen: false,
              createItems: createColorWaveItems
            },
            {
              name: 'Displacement Wave',
              isOpen: false,
              createItems: createDisplacementWaveItems
            }
          ]
        }
      ]
    }
  ];

  // ---  --- //

  parameters.config = config;
  parameters.initDatGui = initDatGui;
  parameters.updateForNewPostData = updateForNewPostData;
  parameters.grid = null;
  parameters.gui = null;
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
    parameters.grid = grid;

    storeOriginalConfigValues();

    createDatGui();
  }

  function createDatGui() {
    parameters.gui = new dat.GUI();
    parameters.gui.width = config.datGuiWidth;

    window.gui = parameters.gui;

    createFolders();
  }

  function createFolders() {
    createChildFolders(config.folders, parameters.gui);

    // ---  --- //

    function createChildFolders(childFolderConfigs, parentFolder) {
      childFolderConfigs.forEach(function (folderConfig) {
        var folder = parentFolder.addFolder(folderConfig.name);

        folderConfig.folder = folder;

        if (folderConfig.isOpen) {
          folder.open();
        }

        if (folderConfig.createItems) {
          folderConfig.createItems(folder);
        }

        // Recursively create descendent folders
        if (folderConfig.children) {
          createChildFolders(folderConfig.children, folder);
        }
      });
    }
  }

  function recordOpenFolders() {
    recordOpenChildFolders(config.folders);

    // ---  --- //

    function recordOpenChildFolders(childFolderConfigs) {
      childFolderConfigs.forEach(function (folderConfig) {
        folderConfig.isOpen = !folderConfig.folder.closed;

        // Recurse
        if (folderConfig.children) {
          recordOpenChildFolders(folderConfig.children);
        }
      });
    }
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
          return map;
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
      parameters.categoryData['all'] = true;

      // Add an item for showing each individual category
      parameters.allCategories.forEach(function (category) {
        addCategoryItem(parameters.categoryData, category, parameters.categoriesFolder);
      });

      // ---  --- //

      function addCategoryItem(categoryData, label, folder) {
        parameters.categoryData[label] = false;
        folder.add(categoryData, label)
            .onChange(function () {
              filterPosts(label);
            });
      }
    }
  }

  function storeOriginalConfigValues() {
    // Each module/file in the hex-grid project stores a reference to its constructor or singleton in the global hg
    // namespace
    originalHgConfigs = Object.keys(window.hg).reduce(function (configs, key) {
      if (window.hg[key].config) {
        configs[key] = window.hg.util.deepCopy(window.hg[key].config);
      }
      return configs;
    }, {});
  }

  function filterPosts(category) {
    // Make sure all other category filters are off (manual radio button logic)
    Object.keys(parameters.categoryData).forEach(function (key) {
      parameters.categoryData[key] = false;
    });
    parameters.categoryData[category] = true;

    window.hg.controller.filterGridPostDataByCategory(parameters.grid, category);
  }

  // ------------------------------------------------------------------------------------------- //
  // Miscellaneous

  function createMainItems(folder) {
    var data = {
      'Go Home': goHome,
      'Hide Menu': hideMenu,
      'default': updateToPreSetConfigs.bind(window.hg.controller, 'default'),
      'stormy': updateToPreSetConfigs.bind(window.hg.controller, 'stormy'),
      'honey-comb': updateToPreSetConfigs.bind(window.hg.controller, 'honey-comb'),
      'crazy-flux': updateToPreSetConfigs.bind(window.hg.controller, 'crazy-flux'),
      'work': filterPosts.bind(window.hg.controller, 'work'),
      'research': filterPosts.bind(window.hg.controller, 'research'),
      'side-projects': filterPosts.bind(window.hg.controller, 'side-project')
    };

    var presetConfigsFolder = folder.addFolder('Pre-Set Configurations');
    presetConfigsFolder.open();
    presetConfigsFolder.add(data, 'default');
    presetConfigsFolder.add(data, 'stormy');
    presetConfigsFolder.add(data, 'honey-comb');
    presetConfigsFolder.add(data, 'crazy-flux');

    var filterPostsFolder = folder.addFolder('Filter Posts');
    filterPostsFolder.open();
    filterPostsFolder.add(data, 'work');
    filterPostsFolder.add(data, 'research');
    filterPostsFolder.add(data, 'side-projects');
    parameters.categoriesFolder = filterPostsFolder.addFolder('Categories');

    folder.add(data, 'Go Home');
    folder.add(data, 'Hide Menu');

    // ---  --- //

    function goHome() {
      console.log('Go Home clicked');
      window.location.href = '/';
    }

    function hideMenu() {
      console.log('Hide Menu clicked');
      document.querySelector('body > .dg').style.display = 'none';
    }

    function updateToPreSetConfigs(configName) {
      console.log('Updating to pre-set configuration', configName);

      recordOpenFolders();
      resetAllConfigValues();
      setPreSetConfigValues();

      window.hg.Grid.config.computeDependentValues();
      window.hg.controller.resetGrid(parameters.grid);
      parameters.grid.annotations.refresh();

      updateDatGui();

      // ---  --- //

      function resetAllConfigValues() {
        // Reset each module's configuration parameters back to their default values
        Object.keys(window.hg).forEach(function (moduleName) {
          if (window.hg[moduleName].config) {
            Object.keys(originalHgConfigs[moduleName]).forEach(function (parameterName) {
              window.hg[moduleName].config[parameterName] =
                window.hg.util.deepCopy(originalHgConfigs[moduleName][parameterName]);
            });
          }
        });
      }

      function setPreSetConfigValues() {
        Object.keys(config.preSetConfigs[configName]).forEach(function (moduleName) {
          // Set all of the special parameters for this new pre-set configuration
          Object.keys(config.preSetConfigs[configName][moduleName]).forEach(function (key) {
            window.hg[moduleName].config[key] = config.preSetConfigs[configName][moduleName][key];
          });

          // Update the recurrence of any transient job
          if (window.hg.controller.transientJobs[moduleName]) {
            window.hg.controller.transientJobs[moduleName].toggleRecurrence(
              parameters.grid,
              window.hg[moduleName].config.isRecurring,
              window.hg[moduleName].config.avgDelay,
              window.hg[moduleName].config.delayDeviationRange);
          }
        });
      }

      function updateDatGui() {
        parameters.gui.destroy();
        createDatGui();
      }
    }
  }

  function createGridItems(folder) {
    var colors = {};
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

    folder.add(parameters.grid, 'isVertical')
        .onChange(function () {
          window.hg.controller.resetGrid(parameters.grid);
        });
    folder.add(window.hg.Grid.config, 'tileOuterRadius', 10, 400)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          window.hg.controller.resetGrid(parameters.grid);
        });
    folder.add(window.hg.Grid.config, 'tileGap', -50, 100)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          window.hg.controller.resetGrid(parameters.grid);
        });
    folder.addColor(colors, 'backgroundColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.backgroundColor);

          window.hg.Grid.config.backgroundHue = color.h;
          window.hg.Grid.config.backgroundSaturation = color.s * 100;
          window.hg.Grid.config.backgroundLightness = color.l * 100;

          parameters.grid.setBackgroundColor();
        });
    folder.addColor(colors, 'tileColor')
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
    folder.add(window.hg.Grid.config, 'firstRowYOffset', -100, 100)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          window.hg.controller.resetGrid(parameters.grid);
        });
    folder.add(window.hg.Grid.config, 'contentStartingRowIndex', 0, 4).step(1)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          parameters.grid.computeContentIndices();
          window.hg.controller.resetGrid(parameters.grid);
        });
    folder.add(window.hg.Grid.config, 'targetContentAreaWidth', 500, 1500)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          parameters.grid.computeContentIndices();
          window.hg.controller.resetGrid(parameters.grid);
        });
    folder.add(window.hg.Grid.config, 'contentDensity', 0.1, 1.0)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          parameters.grid.computeContentIndices();
          window.hg.controller.resetGrid(parameters.grid);
        });
  }

  function createAnnotationsItems(folder) {
    var key, data;

    for (key in window.hg.Annotations.config.annotations) {
      data = {};
      data[key] = window.hg.Annotations.config.annotations[key].enabled;

      folder.add(data, key).onChange(function (value) {
        parameters.grid.annotations.toggleAnnotationEnabled(this.property, value);
      });
    }
  }

  function createInputItems(folder) {
    folder.add(window.hg.Input.config, 'contentTileClickAnimation',
        Object.keys(window.hg.Input.config.possibleClickAnimations));
    folder.add(window.hg.Input.config, 'emptyTileClickAnimation',
        Object.keys(window.hg.Input.config.possibleClickAnimations));
  }

  function createParticleSystemItems(folder) {
    folder.add(window.hg.Tile.config, 'dragCoeff', 0.000001, 0.1);
    folder.add(window.hg.Tile.config, 'neighborSpringCoeff', 0.000001, 0.0001);
    folder.add(window.hg.Tile.config, 'neighborDampingCoeff', 0.000001, 0.009999);
    folder.add(window.hg.Tile.config, 'innerAnchorSpringCoeff', 0.000001, 0.0001);
    folder.add(window.hg.Tile.config, 'innerAnchorDampingCoeff', 0.000001, 0.009999);
    folder.add(window.hg.Tile.config, 'borderAnchorSpringCoeff', 0.000001, 0.0001);
    folder.add(window.hg.Tile.config, 'borderAnchorDampingCoeff', 0.000001, 0.009999);
    folder.add(window.hg.Tile.config, 'forceSuppressionLowerThreshold', 0.000001, 0.009999);
    folder.add(window.hg.Tile.config, 'velocitySuppressionLowerThreshold', 0.000001, 0.009999);
    folder.add(window.hg.Grid.config, 'tileMass', 0.1, 10)
        .onChange(function (value) {
          parameters.grid.updateTileMass(value);
        });
  }

  // ------------------------------------------------------------------------------------------- //
  // Transient animations

  function createOpenClosePostItems(folder) {
    var data = {
      'triggerOpenPost': window.hg.controller.transientJobs.OpenPostJob.createRandom.bind(
          window.hg.controller, parameters.grid),
      'triggerClosePost': window.hg.controller.transientJobs.ClosePostJob.createRandom.bind(
              window.hg.controller, parameters.grid),
      'triggerTogglePost': function () {
        if (parameters.grid.isPostOpen) {
          data.triggerClosePost();
        } else {
          data.triggerOpenPost();
        }
      }
    };

    folder.add(data, 'triggerTogglePost');

    folder.add(window.hg.OpenPostJob.config, 'duration', 10, 10000)
        .name('Open Duration');
    folder.add(window.hg.ClosePostJob.config, 'duration', 10, 10000)
        .name('Close Duration');
    folder.add(window.hg.OpenPostJob.config, 'expandedDisplacementTileCount', 0, 5)
        .step(1);
  }

  function createDisplacementRadiateItems(folder) {
    var data = {
      'triggerDisplacement':
          window.hg.controller.transientJobs.DisplacementRadiateJob.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    folder.add(data, 'triggerDisplacement');

    folder.add(window.hg.DisplacementRadiateJob.config, 'duration', 10, 10000);

    // TODO:

    folder.add(window.hg.DisplacementRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    folder.add(window.hg.DisplacementRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    folder.add(window.hg.DisplacementRadiateJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.DisplacementRadiateJob.toggleRecurrence(
          parameters.grid,
          window.hg.DisplacementRadiateJob.config.isRecurring,
          window.hg.DisplacementRadiateJob.config.avgDelay,
          window.hg.DisplacementRadiateJob.config.delayDeviationRange);
    }
  }

  function createHoverHighlightItems(folder) {
    var data, colors;

    colors = [];
    colors.deltaColor = window.hg.util.hslToHsv({
      h: window.hg.HighlightHoverJob.config.deltaHue,
      s: window.hg.HighlightHoverJob.config.deltaSaturation * 0.01,
      l: window.hg.HighlightHoverJob.config.deltaLightness * 0.01
    });

    data = {
      'triggerHighlightHover': window.hg.controller.transientJobs.HighlightHoverJob.createRandom.bind(
          window.hg.controller, parameters.grid)
    };

    folder.add(data, 'triggerHighlightHover');

    folder.add(window.hg.HighlightHoverJob.config, 'duration', 10, 10000);
    folder.addColor(colors, 'deltaColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.deltaColor);

          window.hg.HighlightHoverJob.config.deltaHue = color.h;
          window.hg.HighlightHoverJob.config.deltaSaturation = color.s * 100;
          window.hg.HighlightHoverJob.config.deltaLightness = color.l * 100;
        });
    folder.add(window.hg.HighlightHoverJob.config, 'opacity', 0, 1);

    folder.add(window.hg.HighlightHoverJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    folder.add(window.hg.HighlightHoverJob.config, 'avgDelay', 10, 2000)
        .onChange(toggleRecurrence);
    folder.add(window.hg.HighlightHoverJob.config, 'delayDeviationRange', 0, 2000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.HighlightHoverJob.toggleRecurrence(
          parameters.grid,
          window.hg.HighlightHoverJob.config.isRecurring,
          window.hg.HighlightHoverJob.config.avgDelay,
          window.hg.HighlightHoverJob.config.delayDeviationRange);
    }
  }

  function createRadiatingHighlightItems(folder) {
    var data, colors;

    colors = [];
    colors.deltaColor = window.hg.util.hslToHsv({
      h: window.hg.HighlightRadiateJob.config.deltaHue,
      s: window.hg.HighlightRadiateJob.config.deltaSaturation * 0.01,
      l: window.hg.HighlightRadiateJob.config.deltaLightness * 0.01
    });

    data = {
      'triggerHighlightRadiate':
          window.hg.controller.transientJobs.HighlightRadiateJob.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    folder.add(data, 'triggerHighlightRadiate');

    folder.add(window.hg.HighlightRadiateJob.config, 'shimmerSpeed', 0.1, 10);
    folder.add(window.hg.HighlightRadiateJob.config, 'shimmerWaveWidth', 1, 2000);
    folder.add(window.hg.HighlightRadiateJob.config, 'duration', 10, 10000);
    folder.addColor(colors, 'deltaColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.deltaColor);

          window.hg.HighlightRadiateJob.config.deltaHue = color.h;
          window.hg.HighlightRadiateJob.config.deltaSaturation = color.s * 100;
          window.hg.HighlightRadiateJob.config.deltaLightness = color.l * 100;
        });
    folder.add(window.hg.HighlightRadiateJob.config, 'opacity', 0, 1);

    folder.add(window.hg.HighlightRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    folder.add(window.hg.HighlightRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    folder
        .add(window.hg.HighlightRadiateJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.HighlightRadiateJob.toggleRecurrence(
          parameters.grid,
          window.hg.HighlightRadiateJob.config.isRecurring,
          window.hg.HighlightRadiateJob.config.avgDelay,
          window.hg.HighlightRadiateJob.config.delayDeviationRange);
    }
  }

  function createIntraTileRadiateItems(folder) {
    var data = {
      'triggerIntraTileRadiate':
          window.hg.controller.transientJobs.IntraTileRadiateJob.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    folder.add(data, 'triggerIntraTileRadiate');

    folder.add(window.hg.IntraTileRadiateJob.config, 'duration', 10, 10000);

    // TODO:

    folder.add(window.hg.IntraTileRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    folder.add(window.hg.IntraTileRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    folder.add(window.hg.IntraTileRadiateJob.config, 'delayDeviationRange',
        0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.IntraTileRadiateJob.toggleRecurrence(
          parameters.grid,
          window.hg.IntraTileRadiateJob.config.isRecurring,
          window.hg.IntraTileRadiateJob.config.avgDelay,
          window.hg.IntraTileRadiateJob.config.delayDeviationRange);
    }
  }

  function createRandomLinesItems(folder) {
    var data = {
      'triggerLine': window.hg.controller.transientJobs.LineJob.createRandom.bind(
          window.hg.controller, parameters.grid)
    };

    folder.add(data, 'triggerLine');

    folder.add(window.hg.LineJob.config, 'duration', 100, 20000);
    folder.add(window.hg.LineJob.config, 'lineWidth', 1, 100);
    folder.add(window.hg.LineJob.config, 'lineLength', 10, 60000);
    folder.add(window.hg.LineJob.config, 'lineSidePeriod', 5, 500);
    folder.add(window.hg.LineJob.config, 'startSaturation', 0, 100);
    folder.add(window.hg.LineJob.config, 'startLightness', 0, 100);
    folder.add(window.hg.LineJob.config, 'startOpacity', 0, 1);
    folder.add(window.hg.LineJob.config, 'endSaturation', 0, 100);
    folder.add(window.hg.LineJob.config, 'endLightness', 0, 100);
    folder.add(window.hg.LineJob.config, 'endOpacity', 0, 1);
    folder.add(window.hg.LineJob.config, 'sameDirectionProb', 0, 1);

    folder.add(window.hg.LineJob.config, 'isBlurOn');
    folder.add(window.hg.LineJob.config, 'blurStdDeviation', 0, 80);

    folder.add(window.hg.LineJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    folder.add(window.hg.LineJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    folder.add(window.hg.LineJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.LineJob.toggleRecurrence(
          parameters.grid,
          window.hg.LineJob.config.isRecurring,
          window.hg.LineJob.config.avgDelay,
          window.hg.LineJob.config.delayDeviationRange);
    }
  }

  function createRadiatingLinesItems(folder) {
    var data = {
      'triggerLinesRadiate': window.hg.controller.transientJobs.LinesRadiateJob.createRandom.bind(
          window.hg.controller, parameters.grid)
    };

    folder.add(data, 'triggerLinesRadiate');

    folder.add(window.hg.LinesRadiateJob.config, 'duration', 100, 20000);
    folder.add(window.hg.LinesRadiateJob.config, 'lineWidth', 1, 100);
    folder.add(window.hg.LinesRadiateJob.config, 'lineLength', 10, 60000);
    folder.add(window.hg.LinesRadiateJob.config, 'lineSidePeriod', 5, 500);
    folder.add(window.hg.LinesRadiateJob.config, 'startSaturation', 0, 100);
    folder.add(window.hg.LinesRadiateJob.config, 'startLightness', 0, 100);
    folder.add(window.hg.LinesRadiateJob.config, 'startOpacity', 0, 1);
    folder.add(window.hg.LinesRadiateJob.config, 'endSaturation', 0, 100);
    folder.add(window.hg.LinesRadiateJob.config, 'endLightness', 0, 100);
    folder.add(window.hg.LinesRadiateJob.config, 'endOpacity', 0, 1);
    folder.add(window.hg.LinesRadiateJob.config, 'sameDirectionProb', 0, 1);

    folder.add(window.hg.LinesRadiateJob.config, 'isBlurOn');
    folder.add(window.hg.LinesRadiateJob.config, 'blurStdDeviation', 0, 80);

    folder.add(window.hg.LinesRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    folder.add(window.hg.LinesRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    folder.add(window.hg.LinesRadiateJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.LinesRadiateJob.toggleRecurrence(
          parameters.grid,
          window.hg.LinesRadiateJob.config.isRecurring,
          window.hg.LinesRadiateJob.config.avgDelay,
          window.hg.LinesRadiateJob.config.delayDeviationRange);
    }
  }

  function createPanItems(folder) {
    var data = {
      'triggerPan':
          window.hg.controller.transientJobs.PanJob.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    folder.add(data, 'triggerPan');

    folder.add(window.hg.PanJob.config, 'duration', 10, 10000);

    folder.add(window.hg.PanJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    folder.add(window.hg.PanJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    folder.add(window.hg.PanJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.PanJob.toggleRecurrence(
          parameters.grid,
          window.hg.PanJob.config.isRecurring,
          window.hg.PanJob.config.avgDelay,
          window.hg.PanJob.config.delayDeviationRange);
    }
  }

  function createSpreadItems(folder) {
    var data = {
      'triggerSpread':
          window.hg.controller.transientJobs.SpreadJob.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    folder.add(data, 'triggerSpread');

    folder.add(window.hg.SpreadJob.config, 'duration', 10, 10000);

    folder.add(window.hg.SpreadJob.config, 'displacementRatio', 0.01, 1);

    folder.add(window.hg.SpreadJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    folder.add(window.hg.SpreadJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    folder.add(window.hg.SpreadJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.SpreadJob.toggleRecurrence(
          parameters.grid,
          window.hg.SpreadJob.config.isRecurring,
          window.hg.SpreadJob.config.avgDelay,
          window.hg.SpreadJob.config.delayDeviationRange);
    }
  }

  function createTileBorderItems(folder) {
    var data = {
      'triggerTileBorder': window.hg.controller.transientJobs.TileBorderJob.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    folder.add(data, 'triggerTileBorder');

    folder.add(window.hg.TileBorderJob.config, 'duration', 10, 10000);

    // TODO:

    folder.add(window.hg.TileBorderJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    folder.add(window.hg.TileBorderJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    folder.add(window.hg.TileBorderJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.TileBorderJob.toggleRecurrence(
          parameters.grid,
          window.hg.TileBorderJob.config.isRecurring,
          window.hg.TileBorderJob.config.avgDelay,
          window.hg.TileBorderJob.config.delayDeviationRange);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Persistent animations

  function createColorShiftItems(folder) {
    // TODO:
  }

  function createColorWaveItems(folder) {
    folder.add(window.hg.ColorWaveJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          window.hg.ColorWaveJob.config.halfPeriod = value / 2;
        });
    folder.add(window.hg.ColorWaveJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          window.hg.controller.persistentJobs.ColorWaveJob.start(parameters.grid);
        });
    folder.add(window.hg.ColorWaveJob.config, 'originX', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.ColorWaveJob.start(parameters.grid);
        });
    folder.add(window.hg.ColorWaveJob.config, 'originY', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.ColorWaveJob.start(parameters.grid);
        });
    folder.add(window.hg.ColorWaveJob.config, 'deltaHue', 0, 360);
    folder.add(window.hg.ColorWaveJob.config, 'deltaSaturation', 0, 100);
    folder.add(window.hg.ColorWaveJob.config, 'deltaLightness', 0, 100);
    folder.add(window.hg.ColorWaveJob.config, 'opacity', 0, 1);
  }

  function createDisplacementWaveItems(folder) {
    folder.add(window.hg.DisplacementWaveJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          window.hg.DisplacementWaveJob.config.halfPeriod = value / 2;
        });
    folder.add(window.hg.DisplacementWaveJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          window.hg.controller.persistentJobs.DisplacementWaveJob.start(parameters.grid);
        });
    folder.add(window.hg.DisplacementWaveJob.config, 'originX', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.DisplacementWaveJob.start(parameters.grid);
        });
    folder.add(window.hg.DisplacementWaveJob.config, 'originY', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.DisplacementWaveJob.start(parameters.grid);
        });
    folder.add(window.hg.DisplacementWaveJob.config, 'tileDeltaX', -300, 300);
    folder.add(window.hg.DisplacementWaveJob.config, 'tileDeltaY', -300, 300);
  }

  console.log('parameters module loaded');
})();
