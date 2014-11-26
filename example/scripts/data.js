'use strict';

/**
 * This module defines a singleton that fetches and parses data for the app.
 *
 * @module data
 */
(function () {

  var config = {};

  config.youtubeVideoBaseUrl = '//www.youtube.com/embed';
  config.youtubeThumbnailBaseUrl = 'http://img.youtube.com/vi';

  config.vimeoVideoBaseUrl = '//player.vimeo.com/video';

  config.appRootPath = '/example';
  config.metadataUrl = config.appRootPath + '/dist/data.min.json';

  var data = {};

  data.config = config;
  data.dataRequestState = 'request-not-sent';
  data.combinedMetadata = {};
  data.collectionMetadata = {};
  data.postData = [];

  data.fetchData = fetchData;

  window.app = window.app || {};
  app.data = data;

  // ---  --- //

  function fetchData(callback) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', onLoad, false);
    xhr.addEventListener('error', onError, false);
    xhr.addEventListener('abort', onAbort, false);

    console.log('Sending request to ' + config.metadataUrl);

    xhr.open('GET', config.metadataUrl, true);
    xhr.send();

    data.dataRequestState = 'waiting-for-response';

    // ---  --- //

    function onLoad() {
      console.log('Response status=' + xhr.status + ' (' + xhr.statusText + ')');
      //console.log('Response body=' + xhr.response);

      data.dataRequestState = 'received-response';

      try {
        data.combinedMetadata = JSON.parse(xhr.response);
      } catch (error) {
        data.combinedMetadata = {};
        data.collectionMetadata = {};
        data.postData = [];
        console.error('Unable to parse response body as JSON: ' + xhr.response);
        return;
      }

      data.collectionMetadata = data.combinedMetadata.collectionMetadata;
      data.postData = data.combinedMetadata.posts;

      updatePostsSrcUrls();

      callback();
    }

    function onError() {
      console.error('An error occurred while transferring the data');

      data.dataRequestState = 'error-with-request';
    }

    function onAbort() {
      console.error('The transfer has been cancelled by the user');

      data.dataRequestState = 'error-with-request';
    }
  }

  function updatePostsSrcUrls() {
    data.postData.forEach(updatePostSrcUrls);

    // ---  --- //

    function updatePostSrcUrls(postDatum) {
      var postBaseUrl = data.collectionMetadata.baseUrl + '/' + postDatum.id + '/';

      postDatum.images.forEach(updateSrcImageMetadata);
      postDatum.videos.forEach(updateSrcVideoMetadata);

      postDatum.thumbnailSrc = postBaseUrl + data.collectionMetadata.thumbnailName;
      postDatum.logoSrc = postBaseUrl + data.collectionMetadata.logoName;

      // ---  --- //

      function updateSrcImageMetadata(imageMetadatum) {
        imageMetadatum.src = postBaseUrl + imageMetadatum.fileName;
      }

      function updateSrcVideoMetadata(videoMetadatum) {
        switch (videoMetadatum.videoHost) {
          case 'youtube':
            videoMetadatum.videoSrc = config.youtubeVideoBaseUrl + '/' + videoMetadatum.id + '?enablejsapi=1';
            videoMetadatum.thumbnailSrc = config.youtubeThumbnailBaseUrl + '/' + videoMetadatum.id + '/default.jpg';
            break;
          case 'vimeo':
            videoMetadatum.videoSrc = config.vimeoVideoBaseUrl + '/' + videoMetadatum.id;
            videoMetadatum.thumbnailSrc = null;
            break;
          default:
            throw new Error('Invalid video host: ' + videoMetadatum.videoHost);
        }
      }
    }
  }

  console.log('data module loaded');
})();
