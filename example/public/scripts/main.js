'use strict';

/**
 * This static module drives the app.
 *
 * @module main
 */
(function () {

  var gridId;

  /**
   * This is the event handler for the completion of the DOM loading. This creates the HexGrid
   * within the body element.
   */
  function initHexGrid() {
    var hexGridContainer, tileData;

    console.log('onDocumentLoad');

    window.removeEventListener('load', initHexGrid);

    hexGridContainer = document.getElementById('hex-grid-area');

    setTimeout(function () {
      tileData = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]; // TODO: fetch this from the server

      gridId = hg.controller.createNewHexGrid(hexGridContainer, tileData, false);

      initDatGui();
    }, 500);
  }

  function initDatGui() {
    var gui, hexGridFolder, hexGridAnnotationsFolder, hexInputFolder, hexTileFolder,
        animationsFolder, linesRadiateAnimationFolder, randomLineAnimationFolder,
        shimmerRadiateAnimationFolder, waveAnimationFolder;

    gui = new dat.GUI();

    // --- Miscellaneous grid properties --- //

    hexGridFolder = gui.addFolder('Grid');
//    hexGridFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });

    hexGridAnnotationsFolder = gui.addFolder('Annotations');
//    hexGridAnnotationsFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });

    hexInputFolder = gui.addFolder('Input');
//    hexInputFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });

    hexTileFolder = gui.addFolder('Tiles');
//    hexTileFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });

    // --- Animation properties --- //

    animationsFolder = gui.addFolder('Animations');

    linesRadiateAnimationFolder = animationsFolder.addFolder('Radiating Lines');
//    linesRadiateAnimationFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });

    randomLineAnimationFolder = animationsFolder.addFolder('Random Lines');
//    randomLineAnimationFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });

    shimmerRadiateAnimationFolder = animationsFolder.addFolder('Radiating Shimmer');
//    shimmerRadiateAnimationFolder.add(parameters, '').onChange(function (value) {
//      // TODO:
//    });

    waveAnimationFolder = animationsFolder.addFolder('Wave');
    waveAnimationFolder.add(hg.WaveAnimationJob.config, 'period');
    waveAnimationFolder.add(hg.WaveAnimationJob.config, 'wavelength')
        .onChange(function () {
          hg.controller.restartWaveAnimation(gridId);
        });
    waveAnimationFolder.add(hg.WaveAnimationJob.config, 'tileDeltaX');
    waveAnimationFolder.add(hg.WaveAnimationJob.config, 'tileDeltaY');

    // TODO: add an additional control to completely hide the dat.GUI controls
  }

  if (!window.app) window.app = {};

  console.log('index module loaded');

  window.addEventListener('load', initHexGrid, false);
})();
