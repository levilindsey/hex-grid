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

  config.defaultPreSet = 'raven-scale';

  config.preSetConfigs = {};

  config.preSetConfigs['raven-scale'] = {
    Grid: {
      tileOuterRadius: 80,
      tileGap: 4,
      backgroundHue: 265,
      backgroundSaturation: 24,
      backgroundLightness: 5,
      tileHue: 270,
      tileSaturation: 0,
      tileLightness: 7
    },
    TilePost: {
      inactiveScreenOpacity: 0.8,
      inactiveScreenHue: 265,
      inactiveScreenSaturation: 1,
      inactiveScreenLightness: 4
    },
    LineJob: {
      lineWidth: 4,
      startSaturation: 0,
      startLightness: 100,
      startOpacity: 0.3,
      endSaturation: 0,
      endLightness: 80,
      endOpacity: 0,
      sameDirectionProb: 0.6
    },
    HighlightRadiateJob: {
      deltaSaturation: 30,
      deltaLightness: 20,
    },
    HighlightHoverJob: {
      // deltaSaturation: 30,
      deltaLightness: 20,
    },
    ColorWaveJob: {
      deltaSaturation: 30,
      wavelength: 2000,
      period: 1500,
      originY: 2000
    },
    DisplacementWaveJob: {
      period: 1000000,
      tileDeltaX: 0,
      tileDeltaY: 0
    },
    OpenPostJob: {
      expandedDisplacementTileCount: 3,
      fadePostDurationOffset: 300
    },
    ClosePostJob: {
      duration: 200
    }
  };
  config.preSetConfigs['stormy-sea'] = {
    LineJob: {
      isRecurring: true
    }
  };
  config.preSetConfigs['color-worms'] = {
    Grid: {
      tileOuterRadius: 50,
      tileHue: 39,
      tileSaturation: 49,
      tileLightness: 12
    },
    Tile: {
      dragCoeff: 0.02,
      neighborSpringCoeff: 0.000004,
      innerAnchorSpringCoeff: 0.00002,
      borderAnchorSpringCoeff: 0.00002
    },
    LineJob: {
      isRecurring: true,
      lineWidth: 12,
      lineLength: 400,
      duration: 70000,
      lineSidePeriod: 1000,
      startSaturation: 100,
      startLightness: 60,
      startOpacity: 0.8,
      endSaturation: 100,
      endLightness: 60,
      endOpacity: 0,
      sameDirectionProb: 0.75,
      avgDelay: 2000,
      delayDeviationRange: 200
    },
    LinesRadiateJob: {
      lineWidth: 7,
      lineLength: 250,
      duration: 30000,
      lineSidePeriod: 120,
      startSaturation: 100,
      startLightness: 60,
      startOpacity: 0.8,
      endSaturation: 100,
      endLightness: 60,
      endOpacity: 0,
      sameDirectionProb: 0.75
    },
    DisplacementWaveJob: {
      period: 1000000,
      tileDeltaX: 0,
      tileDeltaY: 0
    },
    ColorWaveJob: {
      period: 1000000,
      deltaLightness: 0
    },
    Input: {
      contentTileClickAnimation: 'None',
      emptyTileClickAnimation: 'Radiate Lines'
    },
    OpenPostJob: {
      expandedDisplacementTileCount: 4
    }
  };
  config.preSetConfigs['crazy-flux'] = {
    Grid: {
      tileOuterRadius: 60,
      tileGap: 40,
      tileHue: 24,
      tileSaturation: 75,
      tileLightness: 50
    },
    LineJob: {
      isRecurring: true
    },
    Input: {
      contentTileClickAnimation: 'None',
      emptyTileClickAnimation: 'Radiate Lines'
    },
    DisplacementWaveJob: {
      period: 1400,
      tileDeltaX: 140,
      tileDeltaY: -120,
      originX: 2000,
      originY: 1800
    }
  };
  config.preSetConfigs['wire-frame'] = {
    LineJob: {
      isRecurring: true
    },
    Annotations: {
      annotations: {
        tileNeighborConnections: {
          enabled: true
        },
        tileAnchorCenters: {
          enabled: true
        },
        transparentTiles: {
          enabled: true
        },
        lineAnimationGapPoints: {
          enabled: true
        },
        lineAnimationCornerData: {
          enabled: true
        },
        sectorAnchorCenters: {
          enabled: true
        }
      }
    },
    Input: {
      contentTileClickAnimation: 'None',
      emptyTileClickAnimation: 'Radiate Lines'
    },
    DisplacementWaveJob: {
      originX: 1600,
      originY: 1800
    },
    Tile: {
      dragCoeff: 0.013,
      neighborSpringCoeff: 0.000002,
      innerAnchorSpringCoeff: 0.00001,
      borderAnchorSpringCoeff: 0.00002
    }
  };

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
    var data = {};

    Object.keys(config.preSetConfigs).forEach(addPreSetConfig);

    // ---  --- //

    function addPreSetConfig(preSetName) {
      data[preSetName] = window.app.parameters.updateToPreSetConfigs.bind(window.app.parameters,
        config.preSetConfigs[preSetName]);
      parentFolder.add(data, preSetName);
    }
  }

  function createFilterPostsItems(parentFolder) {
    var data = {
      'all': filterPosts.bind(window.app.parameters, 'all'),
      'work': filterPosts.bind(window.app.parameters, 'work'),
      'research': filterPosts.bind(window.app.parameters, 'research'),
      'side-projects': filterPosts.bind(window.app.parameters, 'side-project')
    };

    parentFolder.add(data, 'all');
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
