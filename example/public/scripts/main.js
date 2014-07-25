'use strict';

/**
 * This static module drives the app.
 *
 * @module main
 */
(function () {
  /**
   * This is the event handler for the completion of the DOM loading. This creates the HexGrid
   * within the body element.
   */
  function initHexGrid() {
    var body, tileData;

    console.log('onDocumentLoad');

    body = document.getElementsByTagName('body')[0];

    tileData = {}; // TODO: fetch this from the server

    hg.createNewHexGrid(body, tileData);

    window.removeEventListener('load', initHexGrid);
  }

  if (!window.app) window.app = {};

  console.log('index module loaded');

  window.addEventListener('load', initHexGrid, false);
})();
