'use strict';

/**
 * This module defines a singleton that drives the app.
 *
 * @module main
 */
(function () {

  var main = {};

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
    console.log('onDocumentLoad');

    window.removeEventListener('load', initHexGrid);

    app.data.fetchData(updateTileData);
  }

  function updateTileData() {
    var hexGridContainer = document.getElementById('hex-grid-area');

    main.grid = window.hg.controller.createNewHexGrid(hexGridContainer, app.data.postData, false);

    app.parameters.initDatGui(main.grid);
  }

  console.log('main module loaded');
})();
