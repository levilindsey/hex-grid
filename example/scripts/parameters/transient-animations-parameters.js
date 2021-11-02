'use strict';

/**
 * This module defines a singleton that handles the contents of folders within the dat.GUI menu that represent
 * transient animation parameters.
 *
 * @module transient-animation-parameters
 */
(function () {

  var config = {};

  config.folders = [
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
    }
  ];

  // ---  --- //

  var transientParams = {};

  transientParams.init = init;
  transientParams.config = config;

  window.app = window.app || {};
  app.transientParams = transientParams;

  // ---  --- //

  function init(grid) {
    transientParams.grid = grid;
  }

  function createOpenClosePostItems(folder) {
    var data = {
      'triggerOpenPost': window.hg.controller.transientJobs.OpenPostJob.createRandom.bind(
          window.hg.controller, transientParams.grid),
      'triggerClosePost': window.hg.controller.transientJobs.ClosePostJob.createRandom.bind(
              window.hg.controller, transientParams.grid, false),
      'triggerTogglePost': function () {
        if (transientParams.grid.isPostOpen) {
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
              window.hg.controller, transientParams.grid)
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
          transientParams.grid,
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
          window.hg.controller, transientParams.grid)
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
          transientParams.grid,
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
              window.hg.controller, transientParams.grid)
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
          transientParams.grid,
          window.hg.HighlightRadiateJob.config.isRecurring,
          window.hg.HighlightRadiateJob.config.avgDelay,
          window.hg.HighlightRadiateJob.config.delayDeviationRange);
    }
  }

  function createIntraTileRadiateItems(folder) {
    var data = {
      'triggerIntraTileRadiate':
          window.hg.controller.transientJobs.IntraTileRadiateJob.createRandom.bind(
              window.hg.controller, transientParams.grid)
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
          transientParams.grid,
          window.hg.IntraTileRadiateJob.config.isRecurring,
          window.hg.IntraTileRadiateJob.config.avgDelay,
          window.hg.IntraTileRadiateJob.config.delayDeviationRange);
    }
  }

  function createRandomLinesItems(folder) {
    var data = {
      'triggerLine': window.hg.controller.transientJobs.LineJob.createRandom.bind(
          window.hg.controller, transientParams.grid)
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
          transientParams.grid,
          window.hg.LineJob.config.isRecurring,
          window.hg.LineJob.config.avgDelay,
          window.hg.LineJob.config.delayDeviationRange);
    }
  }

  function createRadiatingLinesItems(folder) {
    var data = {
      'triggerLinesRadiate': window.hg.controller.transientJobs.LinesRadiateJob.createRandom.bind(
          window.hg.controller, transientParams.grid)
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
          transientParams.grid,
          window.hg.LinesRadiateJob.config.isRecurring,
          window.hg.LinesRadiateJob.config.avgDelay,
          window.hg.LinesRadiateJob.config.delayDeviationRange);
    }
  }

  function createPanItems(folder) {
    var data = {
      'triggerPan':
          window.hg.controller.transientJobs.PanJob.createRandom.bind(
              window.hg.controller, transientParams.grid)
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
          transientParams.grid,
          window.hg.PanJob.config.isRecurring,
          window.hg.PanJob.config.avgDelay,
          window.hg.PanJob.config.delayDeviationRange);
    }
  }

  function createSpreadItems(folder) {
    var data = {
      'triggerSpread':
          window.hg.controller.transientJobs.SpreadJob.createRandom.bind(
              window.hg.controller, transientParams.grid)
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
          transientParams.grid,
          window.hg.SpreadJob.config.isRecurring,
          window.hg.SpreadJob.config.avgDelay,
          window.hg.SpreadJob.config.delayDeviationRange);
    }
  }

  function createTileBorderItems(folder) {
    var data = {
      'triggerTileBorder': window.hg.controller.transientJobs.TileBorderJob.createRandom.bind(
              window.hg.controller, transientParams.grid)
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
          transientParams.grid,
          window.hg.TileBorderJob.config.isRecurring,
          window.hg.TileBorderJob.config.avgDelay,
          window.hg.TileBorderJob.config.delayDeviationRange);
    }
  }

  console.log('transient-animation-parameters module loaded');
})();
