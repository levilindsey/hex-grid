'use strict';

/**
 * This module defines a singleton that handles the communication between the dat.GUI controller
 * and the hex-grid parameters.
 *
 * @module parameters
 */
(function () {

  var parameters = {},
      config = {};

  config.datGuiWidth = 300;

  // ---  --- //

  parameters.config = config;
  parameters.initDatGui = initDatGui;
  parameters.grid = null;

  window.app = window.app || {};
  app.parameters = parameters;

  // ---  --- //

  /**
   * Sets up the dat.GUI controller.
   *
   * @param {Grid} grid
   */
  function initDatGui(grid) {
    var gui, miscellaneousFolder, animationsFolder, oneTimeFolder, persistentFolder;

    parameters.grid = grid;

    gui = new dat.GUI();
    gui.width = config.datGuiWidth;

    // --- Miscellaneous grid properties --- //

    miscellaneousFolder = gui.addFolder('Misc');
    miscellaneousFolder.open();// TODO: remove me

    initAnnotationsFolder(miscellaneousFolder);
    initGridFolder(miscellaneousFolder);
    initInputFolder(miscellaneousFolder);
    initTileFolder(miscellaneousFolder);

    // --- Animation properties --- //

    animationsFolder = gui.addFolder('Animations');
    animationsFolder.open();// TODO: remove me

    oneTimeFolder = animationsFolder.addFolder('One Time');
    oneTimeFolder.open();// TODO: remove me

    initLinesRadiateAnimationFolder(oneTimeFolder);
    initRandomLineAnimationFolder(oneTimeFolder);
    initHighlightHoverAnimationFolder(oneTimeFolder);
    initHighlightRadiateAnimationFolder(oneTimeFolder);

    persistentFolder = animationsFolder.addFolder('Persistent');

    initColorShiftAnimationFolder(persistentFolder);
    initColorWaveAnimationFolder(persistentFolder);
    initDisplacementWaveAnimationFolder(persistentFolder);

    // TODO: add an additional control to completely hide the dat.GUI controls
  }

  /**
   * Sets up the grid folder within the dat.GUI controller.
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

          parameters.grid.updateBackgroundColor();
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
   * Sets up the annotations folder within the dat.GUI controller.
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
   * Sets up the input folder within the dat.GUI controller.
   */
  function initInputFolder(parentFolder) {
    var inputFolder;

    inputFolder = parentFolder.addFolder('Input');
    inputFolder.open();// TODO: remove me

    inputFolder.add(window.hg.Input.config, 'contentTileClickAnimation',
        Object.keys(window.hg.Input.config.possibleClickAnimations));
    inputFolder.add(window.hg.Input.config, 'emptyTileClickAnimation',
        Object.keys(window.hg.Input.config.possibleClickAnimations));
  }

  /**
   * Sets up the tile folder within the dat.GUI controller.
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

  /**
   * Sets up the lines-radiate-animation folder within the dat.GUI controller.
   */
  function initLinesRadiateAnimationFolder(parentFolder) {
    var linesRadiateAnimationFolder, data;

    linesRadiateAnimationFolder = parentFolder.addFolder('Radiating Lines');

    data = {
      'triggerLinesRadiate': window.hg.controller.oneTimeJobs.linesRadiate.createRandom.bind(
          window.hg.controller, parameters.grid)
    };

    linesRadiateAnimationFolder.add(data, 'triggerLinesRadiate');

    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'duration', 100, 20000);
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'lineWidth', 1, 100);
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'lineLength', 10, 60000);
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'lineSidePeriod', 5, 500);
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'startSaturation', 0, 100);
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'startLightness', 0, 100);
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'startOpacity', 0, 1);
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'endSaturation', 0, 100);
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'endLightness', 0, 100);
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'endOpacity', 0, 1);
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'sameDirectionProb', 0, 1);

    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'isBlurOn');
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'blurStdDeviation', 0, 80);

    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    linesRadiateAnimationFolder.add(window.hg.LinesRadiateJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    function toggleRecurrence() {
      window.hg.controller.oneTimeJobs.linesRadiate.toggleRecurrence(
          parameters.grid,
          window.hg.LinesRadiateJob.config.isRecurring,
          window.hg.LinesRadiateJob.config.avgDelay,
          window.hg.LinesRadiateJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the random-line-animation folder within the dat.GUI controller.
   */
  function initRandomLineAnimationFolder(parentFolder) {
    var randomLineAnimationFolder, data;

    randomLineAnimationFolder = parentFolder.addFolder('Random Lines');

    data = {
      'triggerLine': window.hg.controller.oneTimeJobs.line.createRandom.bind(
          window.hg.controller, parameters.grid)
    };

    randomLineAnimationFolder.add(data, 'triggerLine');

    randomLineAnimationFolder.add(window.hg.LineJob.config, 'duration', 100, 20000);
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'lineWidth', 1, 100);
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'lineLength', 10, 60000);
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'lineSidePeriod', 5, 500);
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'startSaturation', 0, 100);
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'startLightness', 0, 100);
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'startOpacity', 0, 1);
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'endSaturation', 0, 100);
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'endLightness', 0, 100);
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'endOpacity', 0, 1);
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'sameDirectionProb', 0, 1);

    randomLineAnimationFolder.add(window.hg.LineJob.config, 'isBlurOn');
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'blurStdDeviation', 0, 80);

    randomLineAnimationFolder.add(window.hg.LineJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    randomLineAnimationFolder.add(window.hg.LineJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    function toggleRecurrence() {
      window.hg.controller.oneTimeJobs.line.toggleRecurrence(
          parameters.grid,
          window.hg.LineJob.config.isRecurring,
          window.hg.LineJob.config.avgDelay,
          window.hg.LineJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the shimmer-radiate-animation folder within the dat.GUI controller.
   */
  function initHighlightRadiateAnimationFolder(parentFolder) {
    var highlightRadiateAnimationFolder, data, colors;

    colors = [];
    colors.deltaColor = window.hg.util.hslToHsv({
      h: window.hg.HighlightRadiateJob.config.deltaHue,
      s: window.hg.HighlightRadiateJob.config.deltaSaturation * 0.01,
      l: window.hg.HighlightRadiateJob.config.deltaLightness * 0.01
    });

    highlightRadiateAnimationFolder = parentFolder.addFolder('Radiating Highlight');

    data = {
      'triggerHighlightRadiate':
          window.hg.controller.oneTimeJobs.highlightRadiate.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    highlightRadiateAnimationFolder.add(data, 'triggerHighlightRadiate');

    highlightRadiateAnimationFolder.add(window.hg.HighlightRadiateJob.config, 'shimmerSpeed', 0.1, 10);
    highlightRadiateAnimationFolder.add(window.hg.HighlightRadiateJob.config, 'shimmerWaveWidth', 1, 2000);
    highlightRadiateAnimationFolder.add(window.hg.HighlightRadiateJob.config, 'duration', 10, 10000);
    highlightRadiateAnimationFolder.addColor(colors, 'deltaColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.deltaColor);

          window.hg.HighlightRadiateJob.config.deltaHue = color.h;
          window.hg.HighlightRadiateJob.config.deltaSaturation = color.s * 100;
          window.hg.HighlightRadiateJob.config.deltaLightness = color.l * 100;
        });
    highlightRadiateAnimationFolder.add(window.hg.HighlightRadiateJob.config, 'opacity', 0, 1);

    highlightRadiateAnimationFolder.add(window.hg.HighlightRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    highlightRadiateAnimationFolder.add(window.hg.HighlightRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    highlightRadiateAnimationFolder
        .add(window.hg.HighlightRadiateJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    function toggleRecurrence() {
      window.hg.controller.oneTimeJobs.highlightRadiate.toggleRecurrence(
          parameters.grid,
          window.hg.HighlightRadiateJob.config.isRecurring,
          window.hg.HighlightRadiateJob.config.avgDelay,
          window.hg.HighlightRadiateJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the shimmer-hover-animation folder within the dat.GUI controller.
   */
  function initHighlightHoverAnimationFolder(parentFolder) {
    var highlightHoverAnimationFolder, data, colors;

    colors = [];
    colors.deltaColor = window.hg.util.hslToHsv({
      h: window.hg.HighlightHoverJob.config.deltaHue,
      s: window.hg.HighlightHoverJob.config.deltaSaturation * 0.01,
      l: window.hg.HighlightHoverJob.config.deltaLightness * 0.01
    });

    highlightHoverAnimationFolder = parentFolder.addFolder('Hover Highlight');

    data = {
      'triggerHighlightHover': window.hg.controller.oneTimeJobs.highlightHover.createRandom.bind(
          window.hg.controller, parameters.grid)
    };

    highlightHoverAnimationFolder.add(data, 'triggerHighlightHover');

    highlightHoverAnimationFolder.add(window.hg.HighlightHoverJob.config, 'duration', 10, 10000);
    highlightHoverAnimationFolder.addColor(colors, 'deltaColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.deltaColor);

          window.hg.HighlightHoverJob.config.deltaHue = color.h;
          window.hg.HighlightHoverJob.config.deltaSaturation = color.s * 100;
          window.hg.HighlightHoverJob.config.deltaLightness = color.l * 100;
        });
    highlightHoverAnimationFolder.add(window.hg.HighlightHoverJob.config, 'opacity', 0, 1);

    highlightHoverAnimationFolder.add(window.hg.HighlightHoverJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    highlightHoverAnimationFolder.add(window.hg.HighlightHoverJob.config, 'avgDelay', 10, 2000)
        .onChange(toggleRecurrence);
    highlightHoverAnimationFolder.add(window.hg.HighlightHoverJob.config, 'delayDeviationRange', 0, 2000)
        .onChange(toggleRecurrence);

    function toggleRecurrence() {
      window.hg.controller.oneTimeJobs.highlightHover.toggleRecurrence(
          parameters.grid,
          window.hg.HighlightHoverJob.config.isRecurring,
          window.hg.HighlightHoverJob.config.avgDelay,
          window.hg.HighlightHoverJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the color shift animation folder within the dat.GUI controller.
   */
  function initColorShiftAnimationFolder(parentFolder) {
    var colorWaveAnimationFolder;

    colorWaveAnimationFolder = parentFolder.addFolder('Color Shift');
//    colorWaveAnimationFolder.open();// TODO: remove me

    // TODO:
  }

  /**
   * Sets up the color wave animation folder within the dat.GUI controller.
   */
  function initColorWaveAnimationFolder(parentFolder) {
    var colorWaveAnimationFolder = parentFolder.addFolder('Color Wave');

    colorWaveAnimationFolder.add(window.hg.ColorWaveJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          window.hg.ColorWaveJob.config.halfPeriod = value / 2;
        });
    colorWaveAnimationFolder.add(window.hg.ColorWaveJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          window.hg.controller.persistentJobs.colorWave.restart(parameters.grid);
        });
    colorWaveAnimationFolder.add(window.hg.ColorWaveJob.config, 'originX', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.colorWave.restart(parameters.grid);
        });
    colorWaveAnimationFolder.add(window.hg.ColorWaveJob.config, 'originY', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.colorWave.restart(parameters.grid);
        });
    colorWaveAnimationFolder.add(window.hg.ColorWaveJob.config, 'deltaHue', 0, 360);
    colorWaveAnimationFolder.add(window.hg.ColorWaveJob.config, 'deltaSaturation', 0, 100);
    colorWaveAnimationFolder.add(window.hg.ColorWaveJob.config, 'deltaLightness', 0, 100);
    colorWaveAnimationFolder.add(window.hg.ColorWaveJob.config, 'opacity', 0, 1);
  }

  /**
   * Sets up the displacement wave animation folder within the dat.GUI controller.
   */
  function initDisplacementWaveAnimationFolder(parentFolder) {
    var displacementWaveAnimationFolder;

    displacementWaveAnimationFolder = parentFolder.addFolder('Displacement Wave');

    displacementWaveAnimationFolder.add(window.hg.DisplacementWaveJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          window.hg.DisplacementWaveJob.config.halfPeriod = value / 2;
        });
    displacementWaveAnimationFolder.add(window.hg.DisplacementWaveJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          window.hg.controller.persistentJobs.displacementWave.restart(parameters.grid);
        });
    displacementWaveAnimationFolder.add(window.hg.DisplacementWaveJob.config, 'originX', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.displacementWave.restart(parameters.grid);
        });
    displacementWaveAnimationFolder.add(window.hg.DisplacementWaveJob.config, 'originY', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.displacementWave.restart(parameters.grid);
        });
    displacementWaveAnimationFolder.add(window.hg.DisplacementWaveJob.config, 'tileDeltaX', -300, 300);
    displacementWaveAnimationFolder.add(window.hg.DisplacementWaveJob.config, 'tileDeltaY', -300, 300);
  }

  console.log('parameters module loaded');
})();
