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
//    miscellaneousFolder.open();

    initAnnotationsFolder(miscellaneousFolder);
    initGridFolder(miscellaneousFolder);
    initInputFolder(miscellaneousFolder);
    initTileFolder(miscellaneousFolder);

    // --- Animation properties --- //

    animationsFolder = gui.addFolder('Animations');
    animationsFolder.open();

    initDisplacementWaveAnimationFolder(animationsFolder);
    initColorWaveAnimationFolder(animationsFolder);
    initLinesRadiateAnimationFolder(animationsFolder);
    initRandomLineAnimationFolder(animationsFolder);
    initShimmerRadiateAnimationFolder(animationsFolder);

    // TODO: add an additional control to completely hide the dat.GUI controls
  }

  /**
   * Sets up the grid folder within the dat.GUI controller.
   */
  function initGridFolder(parentFolder) {
    var hexGridFolder, colors;

    hexGridFolder = parentFolder.addFolder('Grid');

    colors = {};
    colors.backgroundColor = hg.util.hslToHsv({
      h: hg.HexGrid.config.backgroundHue,
      s: hg.HexGrid.config.backgroundSaturation * 0.01,
      l: hg.HexGrid.config.backgroundLightness * 0.01
    });
    colors.tileColor = hg.util.hslToHsv({
      h: hg.HexGrid.config.tileHue,
      s: hg.HexGrid.config.tileSaturation * 0.01,
      l: hg.HexGrid.config.tileLightness * 0.01
    });

    hexGridFolder.add(hg.controller.grids[app.main.gridId], 'isVertical')
        .onChange(function () {
          hg.controller.resize();
        });
    hexGridFolder.add(hg.HexGrid.config, 'tileOuterRadius', 10, 400)
        .onChange(function () {
          hg.HexGrid.config.computeDependentValues();
          hg.controller.resize();
        });
    hexGridFolder.add(hg.HexGrid.config, 'tileGap', -50, 100)
        .onChange(function () {
          hg.HexGrid.config.computeDependentValues();
          hg.controller.resize();
        });
    hexGridFolder.addColor(colors, 'backgroundColor')
        .onChange(function () {
          var color = hg.util.hsvToHsl(colors.backgroundColor);

          hg.HexGrid.config.backgroundHue = color.h;
          hg.HexGrid.config.backgroundSaturation = color.s * 100;
          hg.HexGrid.config.backgroundLightness = color.l * 100;

          hg.controller.grids[app.main.gridId].updateBackgroundColor();
        });
    hexGridFolder.addColor(colors, 'tileColor')
        .onChange(function () {
          var color = hg.util.hsvToHsl(colors.tileColor);

          hg.HexGrid.config.tileHue = color.h;
          hg.HexGrid.config.tileSaturation = color.s * 100;
          hg.HexGrid.config.tileLightness = color.l * 100;

          hg.controller.grids[app.main.gridId].updateTileColor();
          if (hg.HexGridAnnotations.config.annotations['contentTiles'].enabled) {
            hg.controller.grids[app.main.gridId].annotations.toggleAnnotationEnabled('contentTiles', true);
          }
        });
    hexGridFolder.add(hg.HexGrid.config, 'firstRowYOffset', -100, 100)
        .onChange(function () {
          hg.HexGrid.config.computeDependentValues();
          hg.controller.resize();
        });
    hexGridFolder.add(hg.HexGrid.config, 'contentStartingRowIndex', 0, 4).step(1)
        .onChange(function () {
          hg.HexGrid.config.computeDependentValues();
          hg.controller.grids[app.main.gridId].computeContentIndices();
          hg.controller.resize();
        });
    hexGridFolder.add(hg.HexGrid.config, 'targetContentAreaWidth', 500, 1500)
        .onChange(function () {
          hg.HexGrid.config.computeDependentValues();
          hg.controller.grids[app.main.gridId].computeContentIndices();
          hg.controller.resize();
        });
    hexGridFolder.add(hg.HexGrid.config, 'contentDensity', 0.1, 1.0)
        .onChange(function () {
          hg.HexGrid.config.computeDependentValues();
          hg.controller.grids[app.main.gridId].computeContentIndices();
          hg.controller.resize();
        });
  }

  /**
   * Sets up the annotations folder within the dat.GUI controller.
   */
  function initAnnotationsFolder(parentFolder) {
    var hexGridAnnotationsFolder, key, data;

    hexGridAnnotationsFolder = parentFolder.addFolder('Annotations');

    for (key in hg.HexGridAnnotations.config.annotations) {
      data = {};
      data[key] = hg.HexGridAnnotations.config.annotations[key].enabled;

      hexGridAnnotationsFolder.add(data, key).onChange(function (value) {
        hg.controller.grids[app.main.gridId].annotations.toggleAnnotationEnabled(this.property, value);
      });
    }
  }

  /**
   * Sets up the input folder within the dat.GUI controller.
   */
  function initInputFolder(parentFolder) {
    var hexInputFolder;

    hexInputFolder = parentFolder.addFolder('Input');

//    hexInputFolder.add(hg.HexInput.config, '').onChange(function (value) {
//      // TODO:
//    });
  }

  /**
   * Sets up the tile folder within the dat.GUI controller.
   */
  function initTileFolder(parentFolder) {
    var hexTileFolder;

    hexTileFolder = parentFolder.addFolder('Tiles');

    hexTileFolder.add(hg.HexTile.config, 'dragCoeff', 0.000001, 0.999999);
    hexTileFolder.add(hg.HexTile.config, 'neighborSpringCoeff', 0.000001, 0.009999);
    hexTileFolder.add(hg.HexTile.config, 'neighborDampingCoeff', 0.000001, 0.009999);
    hexTileFolder.add(hg.HexTile.config, 'innerAnchorSpringCoeff', 0.000001, 0.009999);
    hexTileFolder.add(hg.HexTile.config, 'innerAnchorDampingCoeff', 0.000001, 0.009999);
    hexTileFolder.add(hg.HexTile.config, 'borderAnchorSpringCoeff', 0.000001, 0.009999);
    hexTileFolder.add(hg.HexTile.config, 'borderAnchorDampingCoeff', 0.000001, 0.009999);
    hexTileFolder.add(hg.HexTile.config, 'forceSuppressionLowerThreshold', 0.000001, 0.009999);
    hexTileFolder.add(hg.HexTile.config, 'velocitySuppressionLowerThreshold', 0.000001, 0.009999);
    hexTileFolder.add(hg.HexGrid.config, 'tileMass', 0.1, 10)
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
    linesRadiateAnimationFolder.open();

    data = {
      'triggerLinesRadiate': createRandomLinesRadiateAnimation
    };

    linesRadiateAnimationFolder.add(data, 'triggerLinesRadiate');

    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'duration', 100, 20000);
    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'lineWidth', 1, 100);
    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'lineLength', 10, 60000);
    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'lineSidePeriod', 5, 500);
    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'startSaturation', 0, 100);
    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'startLightness', 0, 100);
    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'startOpacity', 0, 1);
    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'endSaturation', 0, 100);
    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'endLightness', 0, 100);
    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'endOpacity', 0, 1);
    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'sameDirectionProb', 0, 1);

    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'isBlurOn');
    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, 'blurStdDeviation', 0, 80);

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

    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'duration', 100, 20000);
    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'lineWidth', 1, 100);
    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'lineLength', 10, 60000);
    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'lineSidePeriod', 5, 500);
    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'startSaturation', 0, 100);
    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'startLightness', 0, 100);
    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'startOpacity', 0, 1);
    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'endSaturation', 0, 100);
    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'endLightness', 0, 100);
    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'endOpacity', 0, 1);
    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'sameDirectionProb', 0, 1);

    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'isBlurOn');
    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'blurStdDeviation', 0, 80);

    function createRandomLineAnimation() {
      hg.controller.createRandomLineAnimation(app.main.gridId);
    }
  }

  /**
   * Sets up the shimmer-radiate-animation folder within the dat.GUI controller.
   */
  function initShimmerRadiateAnimationFolder(parentFolder) {
    var shimmerRadiateAnimationFolder, data, colors;

    colors = [];
    colors.startColor = hg.util.hslToHsv({
      h: hg.ShimmerRadiateAnimationJob.config.startHue,
      s: hg.ShimmerRadiateAnimationJob.config.startSaturation * 0.01,
      l: hg.ShimmerRadiateAnimationJob.config.startLightness * 0.01
    });
    colors.endColor = hg.util.hslToHsv({
      h: hg.ShimmerRadiateAnimationJob.config.endHue,
      s: hg.ShimmerRadiateAnimationJob.config.endSaturation * 0.01,
      l: hg.ShimmerRadiateAnimationJob.config.endLightness * 0.01
    });

    shimmerRadiateAnimationFolder = parentFolder.addFolder('Radiating Shimmer');

    data = {
      'triggerShimmerRadiate': createRandomShimmerRadiateAnimation
    };

    shimmerRadiateAnimationFolder.add(data, 'triggerShimmerRadiate');

    shimmerRadiateAnimationFolder.add(hg.ShimmerRadiateAnimationJob.config, 'shimmerSpeed', 1, 2000);
    shimmerRadiateAnimationFolder.add(hg.ShimmerRadiateAnimationJob.config, 'shimmerWaveWidth', 1, 2000);
    shimmerRadiateAnimationFolder.add(hg.ShimmerRadiateAnimationJob.config, 'duration', 10, 10000);
    shimmerRadiateAnimationFolder.addColor(colors, 'startColor')
        .onChange(function () {
          var color = hg.util.hsvToHsl(colors.startColor);

          hg.ShimmerRadiateAnimationJob.config.startHue = color.h;
          hg.ShimmerRadiateAnimationJob.config.startSaturation = color.s * 100;
          hg.ShimmerRadiateAnimationJob.config.startLightness = color.l * 100;
        });
    shimmerRadiateAnimationFolder.add(hg.ShimmerRadiateAnimationJob.config, 'startOpacity', 0, 1);
    shimmerRadiateAnimationFolder.addColor(colors, 'endColor')
        .onChange(function () {
          var color = hg.util.hsvToHsl(colors.endColor);

          hg.ShimmerRadiateAnimationJob.config.endHue = color.h;
          hg.ShimmerRadiateAnimationJob.config.endSaturation = color.s * 100;
          hg.ShimmerRadiateAnimationJob.config.endLightness = color.l * 100;
        });
    shimmerRadiateAnimationFolder.add(hg.ShimmerRadiateAnimationJob.config, 'endOpacity', 0, 1);

    function createRandomShimmerRadiateAnimation() {
      var tileIndex = parseInt(Math.random() * hg.controller.grids[app.main.gridId].tiles.length);
      hg.controller.createShimmerRadiateAnimation(app.main.gridId, tileIndex);
    }
  }

  /**
   * Sets up the displacement wave animation folder within the dat.GUI controller.
   */
  function initDisplacementWaveAnimationFolder(parentFolder) {
    var displacementWaveAnimationFolder;

    displacementWaveAnimationFolder = parentFolder.addFolder('Displacement Wave');

    displacementWaveAnimationFolder.add(hg.DisplacementWaveAnimationJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          hg.DisplacementWaveAnimationJob.config.halfPeriod = value / 2;
        });
    displacementWaveAnimationFolder.add(hg.DisplacementWaveAnimationJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          hg.controller.restartDisplacementWaveAnimation(app.main.gridId);
        });
    displacementWaveAnimationFolder.add(hg.DisplacementWaveAnimationJob.config, 'originX', -500, 3000)
        .onChange(function () {
          hg.controller.restartDisplacementWaveAnimation(app.main.gridId);
        });
    displacementWaveAnimationFolder.add(hg.DisplacementWaveAnimationJob.config, 'originY', -500, 3000)
        .onChange(function () {
          hg.controller.restartDisplacementWaveAnimation(app.main.gridId);
        });
    displacementWaveAnimationFolder.add(hg.DisplacementWaveAnimationJob.config, 'tileDeltaX', -300, 300);
    displacementWaveAnimationFolder.add(hg.DisplacementWaveAnimationJob.config, 'tileDeltaY', -300, 300);
  }

  /**
   * Sets up the color wave animation folder within the dat.GUI controller.
   */
  function initColorWaveAnimationFolder(parentFolder) {
    var colorWaveAnimationFolder, colors;

    colors = [];
    colors.deltaColor = hg.util.hslToHsv({
      h: hg.ColorWaveAnimationJob.config.deltaHue,
      s: hg.ColorWaveAnimationJob.config.deltaSaturation * 0.01,
      l: hg.ColorWaveAnimationJob.config.deltaLightness * 0.01
    });

    colorWaveAnimationFolder = parentFolder.addFolder('Color Wave');

    colorWaveAnimationFolder.add(hg.ColorWaveAnimationJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          hg.ColorWaveAnimationJob.config.halfPeriod = value / 2;
        });
    colorWaveAnimationFolder.add(hg.ColorWaveAnimationJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          hg.controller.restartColorWaveAnimation(app.main.gridId);
        });
    colorWaveAnimationFolder.add(hg.ColorWaveAnimationJob.config, 'originX', -500, 3000)
        .onChange(function () {
          hg.controller.restartColorWaveAnimation(app.main.gridId);
        });
    colorWaveAnimationFolder.add(hg.ColorWaveAnimationJob.config, 'originY', -500, 3000)
        .onChange(function () {
          hg.controller.restartColorWaveAnimation(app.main.gridId);
        });
    colorWaveAnimationFolder.add(hg.ColorWaveAnimationJob.config, 'deltaHue', 0, 360);
    colorWaveAnimationFolder.add(hg.ColorWaveAnimationJob.config, 'deltaSaturation', 0, 100);
    colorWaveAnimationFolder.add(hg.ColorWaveAnimationJob.config, 'deltaLightness', 0, 100);
    colorWaveAnimationFolder.add(hg.ColorWaveAnimationJob.config, 'opacity', 0, 1);
  }

  console.log('parameters module loaded');
})();
