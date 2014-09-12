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

    initWaveAnimationFolder(animationsFolder);
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
//    linesRadiateAnimationFolder.add(hg.LinesRadiateAnimationJob.config, '').onChange(function (value) {
//      // TODO:
//    });

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

    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'isBlurOn');
    randomLineAnimationFolder.add(hg.LineAnimationJob.config, 'blurStdDeviation', 0, 80);
    randomLineAnimationFolder.add(data, 'triggerLine');
//    randomLineAnimationFolder.add(hg.RandomLinesAnimationJob.config, '').onChange(function (value) {
//      // TODO:
//    });

    function createRandomLineAnimation() {
      hg.controller.createRandomLineAnimation(app.main.gridId);
    }
  }

  /**
   * Sets up the shimmer-radiate-animation folder within the dat.GUI controller.
   */
  function initShimmerRadiateAnimationFolder(parentFolder) {
    var shimmerRadiateAnimationFolder, data;

    shimmerRadiateAnimationFolder = parentFolder.addFolder('Radiating Shimmer');

    data = {
      'triggerShimmerRadiate': createRandomShimmerRadiateAnimation
    };

    shimmerRadiateAnimationFolder.add(data, 'triggerShimmerRadiate');
//    shimmerRadiateAnimationFolder.add(hg.ShimmerRadiateAnimationJob.config, '').onChange(function (value) {
//      // TODO:
//    });

    function createRandomShimmerRadiateAnimation() {
      var tileIndex = parseInt(Math.random() * hg.controller.grids[app.main.gridId].tiles.length);
      hg.controller.createShimmerRadiateAnimation(app.main.gridId, tileIndex);
    }
  }

  /**
   * Sets up the wave-animation folder within the dat.GUI controller.
   */
  function initWaveAnimationFolder(parentFolder) {
    var waveAnimationFolder;

    waveAnimationFolder = parentFolder.addFolder('Wave');

    waveAnimationFolder.add(hg.WaveAnimationJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          hg.WaveAnimationJob.config.halfPeriod = value / 2;
        });
    waveAnimationFolder.add(hg.WaveAnimationJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          hg.controller.restartWaveAnimation(app.main.gridId);
        });
    waveAnimationFolder.add(hg.WaveAnimationJob.config, 'tileDeltaX', -300, 300);
    waveAnimationFolder.add(hg.WaveAnimationJob.config, 'tileDeltaY', -300, 300);
    waveAnimationFolder.add(hg.WaveAnimationJob.config, 'originX', -500, 3000)
        .onChange(function () {
          hg.controller.restartWaveAnimation(app.main.gridId);
        });
    waveAnimationFolder.add(hg.WaveAnimationJob.config, 'originY', -500, 3000)
        .onChange(function () {
          hg.controller.restartWaveAnimation(app.main.gridId);
        });
  }

  console.log('parameters module loaded');
})();
