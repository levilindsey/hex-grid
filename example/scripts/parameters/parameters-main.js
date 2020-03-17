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
  parameters.recordOpenChildFolders = recordOpenChildFolders;
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

    window.app.parameters.updateToPreSetConfigs.call(window.app.parameters,
        window.app.miscParams.config.preSetConfigs[window.app.miscParams.config.defaultPreSet]);

    var debouncedResize = window.hg.util.debounce(resize, 300);
    window.addEventListener('resize', debouncedResize, false);
  }

  function resize() {
    // Close the menu automatically on smaller screens
    setTimeout(function () {
      if (window.hg.controller.isSmallScreen) {
        parameters.gui.close();
      }
    }, 10);
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
    window.app.parameters.recordOpenChildFolders(window.app.miscParams.config.folders);
    window.app.parameters.recordOpenChildFolders(window.app.transientParams.config.folders);
    window.app.parameters.recordOpenChildFolders(window.app.persistentParams.config.folders);
  }

  function recordOpenChildFolders(childFolderConfigs) {
    childFolderConfigs.forEach(function (folderConfig) {
      if (typeof folderConfig !== 'function') {
        folderConfig.isOpen = !folderConfig.folder.closed;

        // Recurse
        if (folderConfig.children) {
          recordOpenChildFolders(folderConfig.children);
        }
      }
    });
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
      parameters.categoryData['all']['all'] = true;

      // Add an item for showing each individual category
      parameters.allCategories.forEach(function (category) {
        addCategoryItem(parameters.categoryData, category, parameters.categoriesFolder);
      });

      // ---  --- //

      function addCategoryItem(categoryData, label, folder) {
        categoryData[label] = {};
        categoryData[label][label] = false;
        categoryData[label].menuItem = folder.add(categoryData[label], label)
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

  var categoryStackSize = 0;

  function filterPosts(category) {
    categoryStackSize++;

    // Only filter when the checkbox is checked
    if (parameters.categoryData[category][category]) {
      // Make sure all other category filters are off (manual radio button logic)
      Object.keys(parameters.categoryData).forEach(function (key) {
        // Only turn off the other filters that are turned on
        if (parameters.categoryData[key][key] && key !== category) {
          parameters.categoryData[key].menuItem.setValue(false);
        }
      });

      window.hg.controller.filterGridPostDataByCategory(parameters.grid, category);
    } else if (categoryStackSize === 1) {
      // If unchecking a textbox, turn on the 'all' filter
      parameters.categoryData['all'].menuItem.setValue(true);
    }

    categoryStackSize--;
  }

  function goHome() {
    console.log('Go Home clicked');
    window.location.href = '/';
  }

  function hideMenu() {
    console.log('Hide Menu clicked');
    document.querySelector('body > .dg').style.display = 'none';
  }

  function updateToPreSetConfigs(preSetConfig) {
    console.log('Updating to pre-set configuration', preSetConfig);

    recordOpenFolders();
    resetAllConfigValues();
    setPreSetConfigValues(preSetConfig);

    parameters.grid.annotations.refresh();
    window.hg.Grid.config.computeDependentValues();
    window.hg.controller.resetGrid(parameters.grid);
    parameters.grid.setBackgroundColor();
    parameters.grid.resize();

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

  function setPreSetConfigValues(preSetConfig) {
    Object.keys(preSetConfig).forEach(function (moduleName) {
      // Set all of the special parameters for this new pre-set configuration
      Object.keys(preSetConfig[moduleName]).forEach(function (key) {
        setModuleToMatchPreSet(window.hg[moduleName].config, preSetConfig[moduleName], key);
      });

      // Update the recurrence of any transient job
      if (window.hg.controller.transientJobs[moduleName] &&
          window.hg.controller.transientJobs[moduleName].toggleRecurrence) {
        window.hg.controller.transientJobs[moduleName].toggleRecurrence(
          parameters.grid,
          window.hg[moduleName].config.isRecurring,
          window.hg[moduleName].config.avgDelay,
          window.hg[moduleName].config.delayDeviationRange);
      }
    });

    // ---  --- //

    function setModuleToMatchPreSet(moduleConfig, preSetConfig, key) {
      // Recurse on nested objects in the configuration
      if (typeof preSetConfig[key] === 'object') {
        Object.keys(preSetConfig[key]).forEach(function (childKey) {
          setModuleToMatchPreSet(moduleConfig[key], preSetConfig[key], childKey);
        });
      } else {
        moduleConfig[key] = preSetConfig[key];
      }
    }
  }

  function refreshDatGui() {
    parameters.gui.destroy();
    createDatGui();
  }

  console.log('parameters module loaded');
})();
