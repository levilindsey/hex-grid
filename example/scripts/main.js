'use strict';

/**
 * This module defines a singleton that drives the app.
 *
 * @module main
 */
(function () {

  var main = {};

  main.appRootPath = '/example';
  main.grid = null;

  window.app = window.app || {};
  app.main = main;

  window.addEventListener('load', initHexGrid, false);

  // ---  --- //

  /**
   * This is the event handler for the completion of the DOM loading. This creates the Grid
   * within the body element.
   */
  function initHexGrid() {
    var hexGridContainer, tileData;

    console.log('onDocumentLoad');

    window.removeEventListener('load', initHexGrid);

    hexGridContainer = document.getElementById('hex-grid-area');

    setTimeout(function () {
      tileData = window.app.testData.createTestData(); // TODO: fetch this from the server

      main.grid = window.hg.controller.createNewHexGrid(hexGridContainer, tileData, false);

      app.parameters.initDatGui(main.grid);
    }, 500);
  }

  console.log('main module loaded');
})();
