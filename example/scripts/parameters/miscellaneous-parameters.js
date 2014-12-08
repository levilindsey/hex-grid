'use strict';

/**
 * This module defines a singleton that handles the contents of folders within the dat.GUI menu that represent
 * miscellaneous parameters.
 *
 * @module miscellaneous-parameters
 */
(function () {

  var config = {};

  config.folders = [
    {
      name: 'Main',
      isOpen: true,
      createItems: createMainItems,
      children: [
        {
          name: 'Pre-Set Configurations',
          isOpen: true,
          createItems: createPreSetConfigurationsItems,
          children: [
          ]
        },
        {
          name: 'Filter Posts',
          isOpen: true,
          createItems: createFilterPostsItems,
          children: [
          ]
        }
      ]
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
    }
  ];

  // ---  --- //

  var miscParams = {};

  miscParams.init = init;
  miscParams.config = config;

  window.app = window.app || {};
  app.miscParams = miscParams;

  // ---  --- //

  function init(grid) {
    miscParams.grid = grid;
  }

  function createMainItems(folder) {
    var data = {
      'Go Home': window.app.parameters.goHome,
      'Hide Menu': window.app.parameters.hideMenu
    };

    folder.add(data, 'Go Home');
    folder.add(data, 'Hide Menu');
  }

  function createPreSetConfigurationsItems(parentFolder) {
    var data = {
      'default': window.app.parameters.updateToPreSetConfigs.bind(window.app.parameters, 'default'),
      'stormy': window.app.parameters.updateToPreSetConfigs.bind(window.app.parameters, 'stormy'),
      'honey-comb': window.app.parameters.updateToPreSetConfigs.bind(window.app.parameters, 'honey-comb'),
      'crazy-flux': window.app.parameters.updateToPreSetConfigs.bind(window.app.parameters, 'crazy-flux')
    };

    parentFolder.add(data, 'default');
    parentFolder.add(data, 'stormy');
    parentFolder.add(data, 'honey-comb');
    parentFolder.add(data, 'crazy-flux');
  }

  function createFilterPostsItems(parentFolder) {
    var data = {
      'work': filterPosts.bind(window.app.parameters, 'work'),
      'research': filterPosts.bind(window.app.parameters, 'research'),
      'side-projects': filterPosts.bind(window.app.parameters, 'side-project')
    };

    parentFolder.add(data, 'work');
    parentFolder.add(data, 'research');
    parentFolder.add(data, 'side-projects');
    window.app.parameters.categoriesFolder = parentFolder.addFolder('All Categories');

    // ---  --- //

    function filterPosts(category) {
      window.app.parameters.categoryData[category].menuItem.setValue(true);
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

    folder.add(miscParams.grid, 'isVertical')
        .onChange(function () {
          window.hg.controller.resetGrid(miscParams.grid);
        });
    folder.add(window.hg.Grid.config, 'tileOuterRadius', 10, 400)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          window.hg.controller.resetGrid(miscParams.grid);
        });
    folder.add(window.hg.Grid.config, 'tileGap', -50, 100)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          window.hg.controller.resetGrid(miscParams.grid);
        });
    folder.addColor(colors, 'backgroundColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.backgroundColor);

          window.hg.Grid.config.backgroundHue = color.h;
          window.hg.Grid.config.backgroundSaturation = color.s * 100;
          window.hg.Grid.config.backgroundLightness = color.l * 100;

          miscParams.grid.setBackgroundColor();
        });
    folder.addColor(colors, 'tileColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.tileColor);

          window.hg.Grid.config.tileHue = color.h;
          window.hg.Grid.config.tileSaturation = color.s * 100;
          window.hg.Grid.config.tileLightness = color.l * 100;

          miscParams.grid.updateTileColor();
          if (window.hg.Annotations.config.annotations['contentTiles'].enabled) {
            miscParams.grid.annotations.toggleAnnotationEnabled('contentTiles', true);
          }
        });
    folder.add(window.hg.Grid.config, 'firstRowYOffset', -100, 100)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          window.hg.controller.resetGrid(miscParams.grid);
        });
    folder.add(window.hg.Grid.config, 'contentStartingRowIndex', 0, 4).step(1)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          miscParams.grid.computeContentIndices();
          window.hg.controller.resetGrid(miscParams.grid);
        });
    folder.add(window.hg.Grid.config, 'targetContentAreaWidth', 500, 1500)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          miscParams.grid.computeContentIndices();
          window.hg.controller.resetGrid(miscParams.grid);
        });
    folder.add(window.hg.Grid.config, 'contentDensity', 0.1, 1.0)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          miscParams.grid.computeContentIndices();
          window.hg.controller.resetGrid(miscParams.grid);
        });
  }

  function createAnnotationsItems(folder) {
    var key, data;

    for (key in window.hg.Annotations.config.annotations) {
      data = {};
      data[key] = window.hg.Annotations.config.annotations[key].enabled;

      folder.add(data, key).onChange(function (value) {
        miscParams.grid.annotations.toggleAnnotationEnabled(this.property, value);
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
          miscParams.grid.updateTileMass(value);
        });
  }

  console.log('miscellaneous-parameters module loaded');
})();
