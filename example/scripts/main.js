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

    var hexGridContainer = document.getElementById('hex-grid-area');

    main.grid = window.hg.controller.createNewHexGrid(hexGridContainer, app.data.postData, false);

    app.parameters.initDatGui(main.grid);

    app.data.fetchData(updateTileData);
  }

  function updateTileData() {
    window.hg.controller.setGridPostData(main.grid, app.data.postData);

    app.parameters.updateForNewPostData(app.data.postData);
  }

  console.log('main module loaded');
})();
