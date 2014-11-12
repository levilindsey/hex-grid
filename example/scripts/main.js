'use strict';

/**
 * This module defines a singleton that drives the app.
 *
 * @module main
 */
(function () {

  var main = {};

  main.appRootPath = '/example';
  main.metadataUrl = main.appRootPath + '/dist/data.min.json';
  main.dataRequestState = 'request-not-sent';
  main.combinedMetadata = {};
  main.collectionMetadata = {};
  main.postData = [];
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

    fetchData(updateTileData);
  }

  function fetchData(callback) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', onLoad, false);
    xhr.addEventListener('error', onError, false);
    xhr.addEventListener('abort', onAbort, false);

    console.log('Sending request to ' + main.metadataUrl);

    xhr.open('GET', main.metadataUrl, true);
    xhr.send();

    main.dataRequestState = 'waiting-for-response';

    // ---  --- //

    function onLoad() {
      console.log('Response status=' + xhr.status + ' (' + xhr.statusText + ')');
      //console.log('Response body=' + xhr.response);

      main.dataRequestState = 'received-response';

      try {
        main.combinedMetadata = JSON.parse(xhr.response);
        main.collectionMetadata = main.combinedMetadata.collectionMetadata;
        main.postData = main.combinedMetadata.posts;
        updatePostsSrcUrls();
        callback();
      } catch (error) {
        main.postData = [];
        console.warn('Unable to parse response body as JSON: ' + xhr.response);
      }
    }

    function onError() {
      console.error('An error occurred while transferring the data');

      main.dataRequestState = 'error-with-request';
    }

    function onAbort() {
      console.error('The transfer has been cancelled by the user');

      main.dataRequestState = 'error-with-request';
    }
  }

  function updateTileData() {
    var hexGridContainer = document.getElementById('hex-grid-area');

    main.grid = window.hg.controller.createNewHexGrid(hexGridContainer, main.postData, false);

    app.parameters.initDatGui(main.grid);
  }

  function updatePostsSrcUrls() {
    main.postData.forEach(updatePostSrcUrls);

    // ---  --- //

    function updatePostSrcUrls(postDatum) {
      var postBaseUrl = main.collectionMetadata.baseUrl + '/' + postDatum.id + '/';

      postDatum.images.forEach(updateSrcImageMetadata);

      postDatum.thumbnailSrc = postBaseUrl + main.collectionMetadata.thumbnailName;
      postDatum.logoSrc = postBaseUrl + main.combinedMetadata.logoName;

      // ---  --- //

      function updateSrcImageMetadata(imageMetadatum) {
        imageMetadatum.src = postBaseUrl + imageMetadatum.fileName;
      }
    }
  }

  console.log('main module loaded');
})();
