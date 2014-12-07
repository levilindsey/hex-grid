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
    createMiscellaneousFolders,
    {
      name: 'Animations',
      isOpen: false,
      createItems: null,
      children: [
        createTransientAnimationsFolder,
        createPersistentAnimationsFolder
      ]
    }
  ];

  // ---  --- //

  parameters.config = config;
  parameters.initDatGui = initDatGui;
  parameters.updateForNewPostData = updateForNewPostData;
  parameters.goHome = goHome;
  parameters.hideMenu = hideMenu;
  parameters.updateToPreSetConfigs = updateToPreSetConfigs;
  parameters.filterPosts = filterPosts;
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

    window.app.miscParams.init(grid);
    window.app.persistentParams.init(grid);
    window.app.transientParams.init(grid);

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
  }

  function createChildFolders(childFolderConfigs, parentFolder) {
    childFolderConfigs.forEach(function (folderConfig) {
      if (typeof folderConfig === 'function') {
        folderConfig(parentFolder);
      } else {
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
      }
    });
  }

  function createMiscellaneousFolders(parentFolder) {
    createChildFolders(window.app.miscParams.config.folders, parentFolder);
  }

  function createTransientAnimationsFolder(parentFolder) {
    createChildFolders(window.app.transientParams.config.folders, parentFolder);
  }

  function createPersistentAnimationsFolder(parentFolder) {
    createChildFolders(window.app.persistentParams.config.folders, parentFolder);
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
    setPreSetConfigValues(configName);

    window.hg.Grid.config.computeDependentValues();
    window.hg.controller.resetGrid(parameters.grid);
    parameters.grid.annotations.refresh();

    refreshDatGui();
  }

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

  function setPreSetConfigValues(configName) {
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

  function refreshDatGui() {
    parameters.gui.destroy();
    createDatGui();
  }

  console.log('parameters module loaded');
})();
