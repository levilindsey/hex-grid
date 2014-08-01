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
    var body, tileData, grid, waveAnimationJob;

    console.log('onDocumentLoad');

    window.removeEventListener('load', initHexGrid);

    body = document.getElementById('hex-grid-area');

    setTimeout(function () {
      tileData = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]; // TODO: fetch this from the server

      grid = hg.createNewHexGrid(body, tileData, false);

      waveAnimationJob = new hg.WaveAnimationJob(grid);

      hg.animator.startJob(waveAnimationJob);
    }, 500);
  }

  if (!window.app) window.app = {};

  console.log('index module loaded');

  window.addEventListener('load', initHexGrid, false);
})();
