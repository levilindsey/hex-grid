'use strict';

/**
 * This module defines a singleton that handles the communication between the dat.GUI controller
 * and the hex-grid parameters.
 *
 * @module parameters
 */
(function () {

  var parameters = {};

  if (!window.app) window.app = {};
  app.parameters = parameters;

  parameters.initDatGui = initDatGui;

  /**
   * Sets up the dat.GUI controller.
   */
  function initDatGui() {
    var gui, miscellaneousFolder, animationsFolder;

    gui = new dat.GUI();

    // --- Miscellaneous grid properties --- //

    miscellaneousFolder = gui.addFolder('Misc');

    initAnnotationsFolder(miscellaneousFolder);
    initGridFolder(miscellaneousFolder);
    initInputFolder(miscellaneousFolder);
    initTileFolder(miscellaneousFolder);

    // --- Animation properties --- //

    animationsFolder = gui.addFolder('Animations');

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
    var hexGridFolder;

    hexGridFolder = parentFolder.addFolder('Grid');

//    hexGridFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });
  }

  /**
  * Sets up the annotations folder within the dat.GUI controller.
   */
  function initAnnotationsFolder(parentFolder) {
    var hexGridAnnotationsFolder, key;

    hexGridAnnotationsFolder = parentFolder.addFolder('Annotations');

    for (key in hg.HexGridAnnotations.config.annotations) {
      parameters = {};
      parameters[key] = hg.HexGridAnnotations.config.annotations[key].enabled;

      hexGridAnnotationsFolder.add(parameters, key).onChange(function (value) {
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

//    hexInputFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });
  }

  /**
  * Sets up the tile folder within the dat.GUI controller.
   */
  function initTileFolder(parentFolder) {
    var hexTileFolder;

    hexTileFolder = parentFolder.addFolder('Tiles');

//    hexTileFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });
  }

  /**
  * Sets up the lines-radiate-animation folder within the dat.GUI controller.
   */
  function initLinesRadiateAnimationFolder(parentFolder) {
    var linesRadiateAnimationFolder;

    linesRadiateAnimationFolder = parentFolder.addFolder('Radiating Lines');

//    linesRadiateAnimationFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });
  }

  /**
  * Sets up the random-line-animation folder within the dat.GUI controller.
   */
  function initRandomLineAnimationFolder(parentFolder) {
    var randomLineAnimationFolder;

    randomLineAnimationFolder = parentFolder.addFolder('Random Lines');

//    randomLineAnimationFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });
  }

  /**
  * Sets up the shimmer-radiate-animation folder within the dat.GUI controller.
   */
  function initShimmerRadiateAnimationFolder(parentFolder) {
    var shimmerRadiateAnimationFolder;

    shimmerRadiateAnimationFolder = parentFolder.addFolder('Radiating Shimmer');

//    shimmerRadiateAnimationFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });
  }

  /**
   * Sets up the wave-animation folder within the dat.GUI controller.
   */
  function initWaveAnimationFolder(parentFolder) {
    var waveAnimationFolder;

    waveAnimationFolder = parentFolder.addFolder('Wave');

    waveAnimationFolder.add(hg.WaveAnimationJob.config, 'period', 1, 10000);
    waveAnimationFolder.add(hg.WaveAnimationJob.config, 'wavelength', 1, 2000)
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
