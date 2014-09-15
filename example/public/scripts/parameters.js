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

  parameters.config = config;

  if (!window.app) window.app = {};
  app.parameters = parameters;

  parameters.initDatGui = initDatGui;

  /**
   * Sets up the dat.GUI controller.
   */
  function initDatGui() {
    var gui, miscellaneousFolder, animationsFolder;

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
//    animationsFolder.open();// TODO: remove me

    initLinesRadiateAnimationFolder(animationsFolder);
    initRandomLineAnimationFolder(animationsFolder);
    initHighlightRadiateAnimationFolder(animationsFolder);
    initColorShiftAnimationFolder(animationsFolder);
    initColorWaveAnimationFolder(animationsFolder);
    initDisplacementWaveAnimationFolder(animationsFolder);

    // TODO: add an additional control to completely hide the dat.GUI controls
  }

  /**
   * Sets up the grid folder within the dat.GUI controller.
   */
  function initGridFolder(parentFolder) {
    var gridFolder, colors;

    gridFolder = parentFolder.addFolder('Grid');

    colors = {};
    colors.backgroundColor = hg.util.hslToHsv({
      h: hg.Grid.config.backgroundHue,
      s: hg.Grid.config.backgroundSaturation * 0.01,
      l: hg.Grid.config.backgroundLightness * 0.01
    });
    colors.tileColor = hg.util.hslToHsv({
      h: hg.Grid.config.tileHue,
      s: hg.Grid.config.tileSaturation * 0.01,
      l: hg.Grid.config.tileLightness * 0.01
    });

    gridFolder.add(hg.controller.grids[app.main.gridId], 'isVertical')
        .onChange(function () {
          hg.controller.resize();
        });
    gridFolder.add(hg.Grid.config, 'tileOuterRadius', 10, 400)
        .onChange(function () {
          hg.Grid.config.computeDependentValues();
          hg.controller.resize();
        });
    gridFolder.add(hg.Grid.config, 'tileGap', -50, 100)
        .onChange(function () {
          hg.Grid.config.computeDependentValues();
          hg.controller.resize();
        });
    gridFolder.addColor(colors, 'backgroundColor')
        .onChange(function () {
          var color = hg.util.hsvToHsl(colors.backgroundColor);

          hg.Grid.config.backgroundHue = color.h;
          hg.Grid.config.backgroundSaturation = color.s * 100;
          hg.Grid.config.backgroundLightness = color.l * 100;

          hg.controller.grids[app.main.gridId].updateBackgroundColor();
        });
    gridFolder.addColor(colors, 'tileColor')
        .onChange(function () {
          var color = hg.util.hsvToHsl(colors.tileColor);

          hg.Grid.config.tileHue = color.h;
          hg.Grid.config.tileSaturation = color.s * 100;
          hg.Grid.config.tileLightness = color.l * 100;

          hg.controller.grids[app.main.gridId].updateTileColor();
          if (hg.Annotations.config.annotations['contentTiles'].enabled) {
            hg.controller.grids[app.main.gridId].annotations.toggleAnnotationEnabled('contentTiles', true);
          }
        });
    gridFolder.add(hg.Grid.config, 'firstRowYOffset', -100, 100)
        .onChange(function () {
          hg.Grid.config.computeDependentValues();
          hg.controller.resize();
        });
    gridFolder.add(hg.Grid.config, 'contentStartingRowIndex', 0, 4).step(1)
        .onChange(function () {
          hg.Grid.config.computeDependentValues();
          hg.controller.grids[app.main.gridId].computeContentIndices();
          hg.controller.resize();
        });
    gridFolder.add(hg.Grid.config, 'targetContentAreaWidth', 500, 1500)
        .onChange(function () {
          hg.Grid.config.computeDependentValues();
          hg.controller.grids[app.main.gridId].computeContentIndices();
          hg.controller.resize();
        });
    gridFolder.add(hg.Grid.config, 'contentDensity', 0.1, 1.0)
        .onChange(function () {
          hg.Grid.config.computeDependentValues();
          hg.controller.grids[app.main.gridId].computeContentIndices();
          hg.controller.resize();
        });
  }

  /**
   * Sets up the annotations folder within the dat.GUI controller.
   */
  function initAnnotationsFolder(parentFolder) {
    var annotationsFolder, key, data;

    annotationsFolder = parentFolder.addFolder('Annotations');

    for (key in hg.Annotations.config.annotations) {
      data = {};
      data[key] = hg.Annotations.config.annotations[key].enabled;

      annotationsFolder.add(data, key).onChange(function (value) {
        hg.controller.grids[app.main.gridId].annotations.toggleAnnotationEnabled(this.property, value);
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

//    inputFolder.add(hg.Input.config, '').onChange(function (value) {
//      // TODO:
//    });
  }

  /**
   * Sets up the tile folder within the dat.GUI controller.
   */
  function initTileFolder(parentFolder) {
    var tileFolder;

    tileFolder = parentFolder.addFolder('Tiles');

    tileFolder.add(hg.Tile.config, 'dragCoeff', 0.000001, 0.1);
    tileFolder.add(hg.Tile.config, 'neighborSpringCoeff', 0.000001, 0.0001);
    tileFolder.add(hg.Tile.config, 'neighborDampingCoeff', 0.000001, 0.009999);
    tileFolder.add(hg.Tile.config, 'innerAnchorSpringCoeff', 0.000001, 0.0001);
    tileFolder.add(hg.Tile.config, 'innerAnchorDampingCoeff', 0.000001, 0.009999);
    tileFolder.add(hg.Tile.config, 'borderAnchorSpringCoeff', 0.000001, 0.0001);
    tileFolder.add(hg.Tile.config, 'borderAnchorDampingCoeff', 0.000001, 0.009999);
    tileFolder.add(hg.Tile.config, 'forceSuppressionLowerThreshold', 0.000001, 0.009999);
    tileFolder.add(hg.Tile.config, 'velocitySuppressionLowerThreshold', 0.000001, 0.009999);
    tileFolder.add(hg.Grid.config, 'tileMass', 0.1, 10)
        .onChange(function (value) {
          hg.controller.grids[app.main.gridId].updateTileMass(value);
        });
  }

  /**
   * Sets up the lines-radiate-animation folder within the dat.GUI controller.
   */
  function initLinesRadiateAnimationFolder(parentFolder) {
    var linesRadiateAnimationFolder, data;

    linesRadiateAnimationFolder = parentFolder.addFolder('Radiating Lines');

    data = {
      'triggerLinesRadiate': createRandomLinesRadiateAnimation
    };

    linesRadiateAnimationFolder.add(data, 'triggerLinesRadiate');

    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'duration', 100, 20000);
    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'lineWidth', 1, 100);
    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'lineLength', 10, 60000);
    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'lineSidePeriod', 5, 500);
    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'startSaturation', 0, 100);
    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'startLightness', 0, 100);
    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'startOpacity', 0, 1);
    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'endSaturation', 0, 100);
    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'endLightness', 0, 100);
    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'endOpacity', 0, 1);
    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'sameDirectionProb', 0, 1);

    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'isBlurOn');
    linesRadiateAnimationFolder.add(hg.LinesRadiateJob.config, 'blurStdDeviation', 0, 80);

    function createRandomLinesRadiateAnimation() {
      var tileIndex = parseInt(Math.random() * hg.controller.grids[app.main.gridId].tiles.length);
      hg.controller.createLinesRadiateAnimation(app.main.gridId, tileIndex);
    }
  }

  /**
   * Sets up the random-line-animation folder within the dat.GUI controller.
   */
  function initRandomLineAnimationFolder(parentFolder) {
    var randomLineAnimationFolder, data;

    randomLineAnimationFolder = parentFolder.addFolder('Random Lines');

    data = {
      'triggerLine': createRandomLineAnimation
    };

    randomLineAnimationFolder.add(data, 'triggerLine');

    randomLineAnimationFolder.add(hg.LineJob.config, 'duration', 100, 20000);
    randomLineAnimationFolder.add(hg.LineJob.config, 'lineWidth', 1, 100);
    randomLineAnimationFolder.add(hg.LineJob.config, 'lineLength', 10, 60000);
    randomLineAnimationFolder.add(hg.LineJob.config, 'lineSidePeriod', 5, 500);
    randomLineAnimationFolder.add(hg.LineJob.config, 'startSaturation', 0, 100);
    randomLineAnimationFolder.add(hg.LineJob.config, 'startLightness', 0, 100);
    randomLineAnimationFolder.add(hg.LineJob.config, 'startOpacity', 0, 1);
    randomLineAnimationFolder.add(hg.LineJob.config, 'endSaturation', 0, 100);
    randomLineAnimationFolder.add(hg.LineJob.config, 'endLightness', 0, 100);
    randomLineAnimationFolder.add(hg.LineJob.config, 'endOpacity', 0, 1);
    randomLineAnimationFolder.add(hg.LineJob.config, 'sameDirectionProb', 0, 1);

    randomLineAnimationFolder.add(hg.LineJob.config, 'isBlurOn');
    randomLineAnimationFolder.add(hg.LineJob.config, 'blurStdDeviation', 0, 80);

    function createRandomLineAnimation() {
      hg.controller.createRandomLineAnimation(app.main.gridId);
    }
  }

  /**
   * Sets up the shimmer-radiate-animation folder within the dat.GUI controller.
   */
  function initHighlightRadiateAnimationFolder(parentFolder) {
    var shimmerRadiateAnimationFolder, data, colors;

    colors = [];
    colors.deltaColor = hg.util.hslToHsv({
      h: hg.HighlightRadiateJob.config.deltaHue,
      s: hg.HighlightRadiateJob.config.deltaSaturation * 0.01,
      l: hg.HighlightRadiateJob.config.deltaLightness * 0.01
    });

    shimmerRadiateAnimationFolder = parentFolder.addFolder('Radiating Highlight');

    data = {
      'triggerHighlightRadiate': createRandomHighlightRadiateAnimation
    };

    shimmerRadiateAnimationFolder.add(data, 'triggerHighlightRadiate');

    shimmerRadiateAnimationFolder.add(hg.HighlightRadiateJob.config, 'shimmerSpeed', 0.1, 10);
    shimmerRadiateAnimationFolder.add(hg.HighlightRadiateJob.config, 'shimmerWaveWidth', 1, 2000);
    shimmerRadiateAnimationFolder.add(hg.HighlightRadiateJob.config, 'duration', 10, 10000);
    shimmerRadiateAnimationFolder.addColor(colors, 'deltaColor')
        .onChange(function () {
          var color = hg.util.hsvToHsl(colors.deltaColor);

          hg.HighlightRadiateJob.config.deltaHue = color.h;
          hg.HighlightRadiateJob.config.deltaSaturation = color.s * 100;
          hg.HighlightRadiateJob.config.deltaLightness = color.l * 100;
        });
    shimmerRadiateAnimationFolder.add(hg.HighlightRadiateJob.config, 'opacity', 0, 1);

    function createRandomHighlightRadiateAnimation() {
      var tileIndex = parseInt(Math.random() * hg.controller.grids[app.main.gridId].tiles.length);
      hg.controller.createHighlightRadiateAnimation(app.main.gridId, tileIndex);
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

    colorWaveAnimationFolder.add(hg.ColorWaveJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          hg.ColorWaveJob.config.halfPeriod = value / 2;
        });
    colorWaveAnimationFolder.add(hg.ColorWaveJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          hg.controller.restartColorWaveAnimation(app.main.gridId);
        });
    colorWaveAnimationFolder.add(hg.ColorWaveJob.config, 'originX', -500, 3000)
        .onChange(function () {
          hg.controller.restartColorWaveAnimation(app.main.gridId);
        });
    colorWaveAnimationFolder.add(hg.ColorWaveJob.config, 'originY', -500, 3000)
        .onChange(function () {
          hg.controller.restartColorWaveAnimation(app.main.gridId);
        });
    colorWaveAnimationFolder.add(hg.ColorWaveJob.config, 'deltaHue', 0, 360);
    colorWaveAnimationFolder.add(hg.ColorWaveJob.config, 'deltaSaturation', 0, 100);
    colorWaveAnimationFolder.add(hg.ColorWaveJob.config, 'deltaLightness', 0, 100);
    colorWaveAnimationFolder.add(hg.ColorWaveJob.config, 'opacity', 0, 1);
  }

  /**
   * Sets up the displacement wave animation folder within the dat.GUI controller.
   */
  function initDisplacementWaveAnimationFolder(parentFolder) {
    var displacementWaveAnimationFolder;

    displacementWaveAnimationFolder = parentFolder.addFolder('Displacement Wave');

    displacementWaveAnimationFolder.add(hg.DisplacementWaveJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          hg.DisplacementWaveJob.config.halfPeriod = value / 2;
        });
    displacementWaveAnimationFolder.add(hg.DisplacementWaveJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          hg.controller.restartDisplacementWaveAnimation(app.main.gridId);
        });
    displacementWaveAnimationFolder.add(hg.DisplacementWaveJob.config, 'originX', -500, 3000)
        .onChange(function () {
          hg.controller.restartDisplacementWaveAnimation(app.main.gridId);
        });
    displacementWaveAnimationFolder.add(hg.DisplacementWaveJob.config, 'originY', -500, 3000)
        .onChange(function () {
          hg.controller.restartDisplacementWaveAnimation(app.main.gridId);
        });
    displacementWaveAnimationFolder.add(hg.DisplacementWaveJob.config, 'tileDeltaX', -300, 300);
    displacementWaveAnimationFolder.add(hg.DisplacementWaveJob.config, 'tileDeltaY', -300, 300);
  }

  console.log('parameters module loaded');
})();
