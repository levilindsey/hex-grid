/**
* This module defines a constructor for Carousel objects.
*
* Carousel objects display the images and videos for a post.
*
* @module Carousel
*/
(function () {

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config;

  config = {};

  config.thumbnailHeight = 80;
  config.thumbnailRibbonPadding = 3;
  config.prevNextButtonPadding = 10;
  config.prevNextButtonHeight = 41;
  config.prevNextButtonWidth = 24;

  // ---  --- //

  config.aspectRatio = 16 / 9;

  config.vimeoMetadataBaseUrl = 'http://vimeo.com/api/v2/video';

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.thumbnailWidth = config.thumbnailHeight * config.aspectRatio;
  };

  config.computeDependentValues();

  function addChevronDefinition() {
    var body = document.querySelector('body');
    var svg = document.createElementNS(window.hg.util.svgNamespace, 'svg');
    var symbol = document.createElementNS(window.hg.util.svgNamespace, 'symbol');
    var chevron = document.createElementNS(window.hg.util.svgNamespace, 'path');

    body.appendChild(svg);
    svg.appendChild(symbol);
    symbol.appendChild(chevron);

    svg.style.display = 'none';
    symbol.setAttribute('id', 'chevron-left');
    symbol.setAttribute('viewBox', '0 0 247.88 428.75');
    chevron.setAttribute('d', 'M149.03125,428.29625,0.54125,214.36625,149.03125,0.44725l97.959,0.000001-148.49,213.92,148.49,213.92z');
  }

  addChevronDefinition();

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {PagePost} pagePost
   * @param {HTMLElement} parent
   * @param {Array.<String>} images
   * @param {Array.<String>} videos
   * @param {Boolean} [waitToLoadMedia=false]
   */
  function Carousel(grid, pagePost, parent, images, videos, waitToLoadMedia) {
    var carousel = this;

    carousel.grid = grid;
    carousel.pagePost = pagePost;
    carousel.parent = parent;
    carousel.elements = null;
    carousel.currentIndex = 0;
    carousel.previousIndex = 0;
    carousel.mediaMetadata = null;
    carousel.currentIndexPositionRatio = 0;

    carousel.loadMedia = loadMedia;
    carousel.onSlideFinished = onSlideFinished;
    carousel.draw = draw;
    carousel.destroy = destroy;

    createMediaMetadataArray.call(carousel, images, videos);
    createElements.call(carousel, waitToLoadMedia);

    console.log('Carousel created');
  }

  Carousel.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Carousel = Carousel;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this Carousel
   * @param {Array.<String>} images
   * @param {Array.<String>} videos
   */
  function createMediaMetadataArray(images, videos) {
    var carousel = this;

    carousel.mediaMetadata = videos.concat(images).map(function (medium) {
      medium.isVideo = !!medium.videoHost;
      return medium;
    });
  }

  /**
   * @this Carousel
   * @param {Boolean} [waitToLoadMedia=false]
   */
  function createElements(waitToLoadMedia) {
    var carousel = this;

    var container = document.createElement('div');
    var slidersContainer = document.createElement('div');
    var mainMediaRibbon = document.createElement('div');
    var thumbnailsRibbon = document.createElement('div');
    var buttonsContainer = document.createElement('div');
    var captionsPanel = document.createElement('div');
    var captionsText = document.createElement('p');
    var previousButtonPanel = document.createElement('div');
    var previousButtonSvg = document.createElementNS(window.hg.util.svgNamespace, 'svg');
    var previousButtonUse = document.createElementNS(window.hg.util.svgNamespace, 'use');
    var nextButtonPanel = document.createElement('div');
    var nextButtonSvg = document.createElementNS(window.hg.util.svgNamespace, 'svg');
    var nextButtonUse = document.createElementNS(window.hg.util.svgNamespace, 'use');

    carousel.parent.appendChild(container);
    container.appendChild(slidersContainer);
    slidersContainer.appendChild(mainMediaRibbon);
    slidersContainer.appendChild(thumbnailsRibbon);
    slidersContainer.appendChild(buttonsContainer);
    buttonsContainer.appendChild(previousButtonPanel);
    previousButtonPanel.appendChild(previousButtonSvg);
    previousButtonSvg.appendChild(previousButtonUse);
    buttonsContainer.appendChild(nextButtonPanel);
    nextButtonPanel.appendChild(nextButtonSvg);
    nextButtonSvg.appendChild(nextButtonUse);
    container.appendChild(captionsPanel);
    captionsPanel.appendChild(captionsText);

    carousel.elements = {};
    carousel.elements.container = container;
    carousel.elements.slidersContainer = slidersContainer;
    carousel.elements.mainMediaRibbon = mainMediaRibbon;
    carousel.elements.thumbnailsRibbon = thumbnailsRibbon;
    carousel.elements.buttonsContainer = buttonsContainer;
    carousel.elements.captionsPanel = captionsPanel;
    carousel.elements.captionsText = captionsText;
    carousel.elements.previousButtonPanel = previousButtonPanel;
    carousel.elements.previousButtonSvg = previousButtonSvg;
    carousel.elements.previousButtonUse = previousButtonUse;
    carousel.elements.nextButtonPanel = nextButtonPanel;
    carousel.elements.nextButtonSvg = nextButtonSvg;
    carousel.elements.nextButtonUse = nextButtonUse;
    carousel.elements.mainMedia = [];
    carousel.elements.thumbnails = [];
    carousel.elements.thumbnailScreens = [];

    container.setAttribute('data-hg-carousel-container', 'data-hg-carousel-container');

    slidersContainer.setAttribute('data-hg-carousel-sliders-container',
      'data-hg-carousel-sliders-container');
    slidersContainer.style.position = 'relative';
    slidersContainer.style.overflow = 'hidden';
    slidersContainer.style.width = '100%';
    window.hg.util.setUserSelectNone(container);

    mainMediaRibbon.style.position = 'relative';
    mainMediaRibbon.style.width = '100%';
    mainMediaRibbon.style.height = '0';
    mainMediaRibbon.style.padding = '56.25% 0 0 0';

    thumbnailsRibbon.style.position = 'relative';
    thumbnailsRibbon.style.width = config.thumbnailWidth * carousel.mediaMetadata.length + 'px';
    thumbnailsRibbon.style.height = config.thumbnailHeight + 'px';
    thumbnailsRibbon.style.left = 'calc(50% - ' + config.thumbnailWidth / 2 + 'px)';
    thumbnailsRibbon.style.paddingTop = config.thumbnailRibbonPadding + 'px';

    buttonsContainer.style.position = 'absolute';
    buttonsContainer.style.top = '0';
    buttonsContainer.style.width = '100%';
    buttonsContainer.style.height = '0';
    buttonsContainer.style.padding = '56.25% 0 0 0';

    previousButtonPanel.setAttribute('data-hg-carousel-button', 'data-hg-carousel-button');
    previousButtonPanel.style.position = 'absolute';
    previousButtonPanel.style.top = '0';
    previousButtonPanel.style.left = '0';
    previousButtonPanel.style.width = 'calc(33.33% - ' + config.prevNextButtonPadding + 'px)';
    previousButtonPanel.style.height = '100%';
    previousButtonPanel.style.cursor = 'pointer';
    previousButtonPanel.addEventListener('click', goToPrevious.bind(carousel), false);

    previousButtonSvg.style.position = 'absolute';
    previousButtonSvg.style.top = '0';
    previousButtonSvg.style.bottom = '0';
    previousButtonSvg.style.left = '0';
    previousButtonSvg.style.margin = 'auto';
    previousButtonSvg.style.height = config.prevNextButtonHeight + 'px';
    previousButtonSvg.style.width = config.prevNextButtonWidth + 'px';
    previousButtonSvg.style.paddingLeft = config.prevNextButtonPadding + 'px';

    previousButtonUse.setAttributeNS(window.hg.util.xlinkNamespace, 'xlink:href', '#chevron-left');

    nextButtonPanel.setAttribute('data-hg-carousel-button', 'data-hg-carousel-button');
    nextButtonPanel.style.position = 'absolute';
    nextButtonPanel.style.top = '0';
    nextButtonPanel.style.right = '0';
    nextButtonPanel.style.width = 'calc(66.67% - ' + config.prevNextButtonPadding + 'px)';
    nextButtonPanel.style.height = '100%';
    nextButtonPanel.style.cursor = 'pointer';
    nextButtonPanel.addEventListener('click', goToNext.bind(carousel), false);

    window.hg.util.setTransform(nextButtonSvg, 'scaleX(-1)');
    nextButtonSvg.style.position = 'absolute';
    nextButtonSvg.style.top = '0';
    nextButtonSvg.style.bottom = '0';
    nextButtonSvg.style.right = '0';
    nextButtonSvg.style.margin = 'auto';
    nextButtonSvg.style.height = config.prevNextButtonHeight + 'px';
    nextButtonSvg.style.width = config.prevNextButtonWidth + 'px';
    nextButtonSvg.style.paddingLeft = config.prevNextButtonPadding + 'px';

    nextButtonUse.setAttributeNS(window.hg.util.xlinkNamespace, 'xlink:href', '#chevron-left');

    captionsPanel.setAttribute('data-hg-captions-panel', 'data-hg-captions-panel');

    captionsText.style.margin = '0';
    captionsText.style.padding = '0';
    carousel.elements.captionsPanel.setAttribute('data-hg-selected', 'data-hg-selected');

    if (!waitToLoadMedia) {
      loadMedia.call(carousel);
    }

    // The Carousel should display differently when it contains zero or one item
    if (carousel.mediaMetadata.length === 0) {
      container.style.display = 'none';
      captionsPanel.style.display = 'none';
    } else {
      // Show the caption for the first media item
      captionsText.innerHTML = carousel.mediaMetadata[0].description;

      if (carousel.mediaMetadata.length === 1) {
        thumbnailsRibbon.style.display = 'none';
      }
    }

    setPrevNextButtonVisibility.call(carousel);
  }

  /**
   * @this Carousel
   */
  function setPrevNextButtonVisibility() {
    var prevVisibility, nextVisibility, panelVisibility;
    var carousel = this;

    // We don't want the prev/next buttons blocking any video controls
    if (!carousel.mediaMetadata.length ||
        carousel.mediaMetadata[carousel.currentIndex].isVideo) {
      prevVisibility = 'hidden';
      nextVisibility = 'hidden';
      panelVisibility = 'hidden';
    } else {
      prevVisibility = carousel.currentIndex > 0 ? 'visible' : 'hidden';
      nextVisibility = carousel.currentIndex < carousel.mediaMetadata.length - 1 ?
        'visible' : 'hidden';
      panelVisibility = 'visible';
    }

    carousel.elements.previousButtonPanel.style.visibility = prevVisibility;
    carousel.elements.nextButtonPanel.style.visibility = nextVisibility;
    carousel.elements.buttonsContainer.style.visibility = panelVisibility;
  }

  /**
   * @this Carousel
   */
  function goToPrevious() {
    var nextIndex;
    var carousel = this;

    if (carousel.currentIndex > 0) {
      nextIndex = (carousel.currentIndex + carousel.mediaMetadata.length - 1) %
        carousel.mediaMetadata.length;
      goToIndex.call(carousel, nextIndex);
    } else {
      console.warn('Carousel cannot go to previous. Already at first medium.');
    }
  }

  /**
   * @this Carousel
   */
  function goToNext() {
    var nextIndex;
    var carousel = this;

    if (carousel.currentIndex < carousel.mediaMetadata.length - 1) {
      nextIndex = (carousel.currentIndex + 1) % carousel.mediaMetadata.length;
      goToIndex.call(carousel, nextIndex);
    } else {
      console.warn('Carousel cannot go to next. Already at last medium.');
    }
  }

  /**
   * @this Carousel
   * @param {Number} nextIndex
   */
  function goToIndex(nextIndex) {
    var carousel = this;

    carousel.previousIndex = carousel.currentIndex;
    carousel.currentIndex = nextIndex;

    window.hg.controller.transientJobs.CarouselImageSlideJob.create(carousel.grid, null, carousel);

    // Pause any playing video
    if (carousel.mediaMetadata[carousel.previousIndex].isVideo) {
      switch (carousel.mediaMetadata[carousel.previousIndex].videoHost) {
        case 'youtube':
          carousel.elements.mainMedia[carousel.previousIndex].querySelector('iframe').contentWindow
            .postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          break;
        case 'vimeo':
          carousel.elements.mainMedia[carousel.previousIndex].querySelector('iframe').contentWindow
            .postMessage('{"method": "pause", "value": ""}', '*');
          break;
        default:
          throw new Error('Invalid video host: ' +
            carousel.mediaMetadata[carousel.previousIndex].videoHost);
      }
    }

    // Hide the caption text
    carousel.elements.captionsPanel.removeAttribute('data-hg-selected');

    // Mark the old thumbnail as un-selected
    carousel.elements.thumbnails[carousel.previousIndex].removeAttribute('data-hg-selected');

    // Mark the current thumbnail as selected
    carousel.elements.thumbnails[carousel.currentIndex].setAttribute('data-hg-selected',
      'data-hg-selected');

    setPrevNextButtonVisibility.call(carousel);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * @this Carousel
   */
  function loadMedia() {
    var carousel = this;

    if (carousel.elements.mainMedia.length === 0) {
      carousel.mediaMetadata.forEach(addMedium);
    }

    if (carousel.mediaMetadata.length > 0) {
      // Mark the first thumbnail as selected
      carousel.elements.thumbnails[0].setAttribute('data-hg-selected', 'data-hg-selected');
    }

    // ---  --- //

    function addMedium(mediumMetadatum, index) {
      var mainMediaElement, iframeElement, thumbnailElement, thumbnailScreenElement, thumbnailSrc;

      if (mediumMetadatum.isVideo) {
        iframeElement = document.createElement('iframe');
        iframeElement.setAttribute('src', mediumMetadatum.videoSrc);
        iframeElement.setAttribute('allowfullscreen', 'allowfullscreen');
        iframeElement.setAttribute('frameborder', '0');
        iframeElement.style.position = 'absolute';
        iframeElement.style.top = '0';
        iframeElement.style.width = '100%';
        iframeElement.style.height = '100%';

        mainMediaElement = document.createElement('div');
        mainMediaElement.appendChild(iframeElement);

        switch (mediumMetadatum.videoHost) {
          case 'youtube':
            thumbnailSrc = mediumMetadatum.thumbnailSrc;
            break;
          case 'vimeo':
            thumbnailSrc = '';
            fetchVimeoThumbnail(mediumMetadatum, index);
            break;
          default:
            throw new Error('Invalid video host: ' + mediumMetadatum.videoHost);
        }
      } else {
        mainMediaElement = document.createElement('div');
        mainMediaElement.style.backgroundImage = 'url(' + mediumMetadatum.src + ')';
        mainMediaElement.style.backgroundSize = 'contain';
        mainMediaElement.style.backgroundRepeat = 'no-repeat';
        mainMediaElement.style.backgroundPosition = '50% 50%';

        thumbnailSrc = mediumMetadatum.src;
      }

      mainMediaElement.setAttribute('data-hg-carousel-main-media',
        'data-hg-carousel-main-media');
      mainMediaElement.style.position = 'absolute';
      mainMediaElement.style.top = '0';
      mainMediaElement.style.left = index * 100 + '%';
      mainMediaElement.style.width = '100%';
      mainMediaElement.style.height = '0';
      mainMediaElement.style.padding = '56.25% 0 0 0';

      thumbnailElement = document.createElement('div');
      thumbnailElement.setAttribute('data-hg-carousel-thumbnail',
        'data-hg-carousel-thumbnail');
      thumbnailElement.style.backgroundImage = 'url(' + thumbnailSrc + ')';
      thumbnailElement.style.backgroundSize = 'contain';
      thumbnailElement.style.backgroundRepeat = 'no-repeat';
      thumbnailElement.style.backgroundPosition = '50% 50%';
      thumbnailElement.style.width = config.thumbnailWidth + 'px';
      thumbnailElement.style.height = config.thumbnailHeight + 'px';
      thumbnailElement.style.styleFloat = 'left';
      thumbnailElement.style.cssFloat = 'left';

      thumbnailScreenElement = document.createElement('div');
      thumbnailScreenElement.setAttribute('data-hg-carousel-thumbnail-screen',
        'data-hg-carousel-thumbnail-screen');
      thumbnailScreenElement.style.width = '100%';
      thumbnailScreenElement.style.height = '100%';
      thumbnailScreenElement.style.cursor = 'pointer';
      thumbnailScreenElement.addEventListener('click', goToIndex.bind(carousel, index), false);

      carousel.elements.mainMedia.push(mainMediaElement);
      carousel.elements.thumbnails.push(thumbnailElement);
      carousel.elements.thumbnailScreens.push(thumbnailScreenElement);

      carousel.elements.mainMediaRibbon.appendChild(mainMediaElement);
      carousel.elements.thumbnailsRibbon.appendChild(thumbnailElement);
      thumbnailElement.appendChild(thumbnailScreenElement);

      // ---  --- //

      function fetchVimeoThumbnail(mediumMetadatum, index) {
        var url = config.vimeoMetadataBaseUrl + '/' + mediumMetadatum.id + '.json';
        var xhr = new XMLHttpRequest();

        xhr.addEventListener('load', onLoad, false);
        xhr.addEventListener('error', onError, false);
        xhr.addEventListener('abort', onAbort, false);

        console.log('Sending request for Vimeo metadata to ' + url);

        xhr.open('GET', url, true);
        xhr.send();

        // ---  --- //

        function onLoad() {
          var responseData;

          console.log('Vimeo metadata response status=' + xhr.status +
            ' (' + xhr.statusText + ')');

          try {
            responseData = JSON.parse(xhr.response);
          } catch (error) {
            console.error('Unable to parse Vimeo metadata response body as JSON: ' + xhr.response);
            return;
          }

          mediumMetadatum.thumbnailSrc = responseData[0].thumbnail_large;

          carousel.elements.thumbnails[index].style.backgroundImage =
            'url(' + mediumMetadatum.thumbnailSrc + ')';
        }

        function onError() {
          console.error('An error occurred while loading the Vimeo thumbnail');
        }

        function onAbort() {
          console.error('The Vimeo thumbnail load has been cancelled by the user');
        }
      }
    }
  }

  /**
   * @this Carousel
   */
  function onSlideFinished() {
    var carousel = this;

    // Show the caption for the current media item
    carousel.elements.captionsText.innerHTML =
      carousel.mediaMetadata[carousel.currentIndex].description;
    carousel.elements.captionsPanel.setAttribute('data-hg-selected', 'data-hg-selected');
  }

  /**
   * @this Carousel
   */
  function draw() {
    var carousel = this;

    carousel.elements.mainMediaRibbon.style.left = -carousel.currentIndexPositionRatio * 100 + '%';
    carousel.elements.thumbnailsRibbon.style.left = 'calc(50% - ' + (config.thumbnailWidth / 2 +
      carousel.currentIndexPositionRatio * config.thumbnailWidth) + 'px';
  }

  /**
   * @this Carousel
   */
  function destroy() {
    var carousel = this;

    carousel.parent.removeChild(carousel.elements.container);
    carousel.elements.container = null;
  }

  console.log('Carousel module loaded');
})();
