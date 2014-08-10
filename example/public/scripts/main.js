'use strict';

/**
 * This module defines a singleton that drives the app.
 *
 * @module main
 */
(function () {

  var main = {};

  if (!window.app) window.app = {};
  app.main = main;

  main.gridId = Number.NaN;

  window.addEventListener('load', initHexGrid, false);

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

      main.gridId = hg.controller.createNewHexGrid(hexGridContainer, tileData, false);

      app.parameters.initDatGui();
    }, 500);
  }

  console.log('main module loaded');
})();
