/**
* This module defines a constructor for Carousel objects.
*
* Carousel objects display the images and videos for a post.
*
* @module Carousel
*/
(function () {

  // TODO: add caption panel below thumbnails; fixed height?; different background...; slightly transparent?

  // TODO: thumbnail screens: animate fading the screens (use CSS transitions? then only remove screen opacity when the last slide job completes?)

  // TODO: also update the tilepost drawing to utilize the reset job

  // TODO: fade out the PagePost text

  // TODO: make sure the tilepost job is getting destroyed properly on resize (text is hanging around...)

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var haveAddedStyles = false;

  var config;

  config = {};

  config.thumbnailHeight = 80;
  config.thumbnailRibbonPadding = 4;
  config.thumbnailScreenOpacity = 0.6;
  config.prevNextButtonPadding = 10;

  // ---  --- //

  config.aspectRatio = 16 / 9;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.thumbnailWidth = config.thumbnailHeight * config.aspectRatio;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this Carousel
   */
  function calculateDimensions() {
    var carousel = this;

    carousel.width =
      parseInt(window.getComputedStyle(carousel.parent, null).getPropertyValue('width'));
    carousel.mainMediaHeight = carousel.width / config.aspectRatio;
    carousel.totalHeight = carousel.mainMediaHeight + config.thumbnailHeight + config.thumbnailRibbonPadding;

    carousel.thumbnailRibbonStartPosition = (carousel.width - config.thumbnailWidth) / 2;
  }

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
    var mainMediaRibbon = document.createElement('div');
    var thumbnailsRibbon = document.createElement('div');
    var captionsPanel = document.createElement('div');
    var previousButtonPanel = document.createElement('div');
    var nextButtonPanel = document.createElement('div');

    carousel.parent.appendChild(container);
    container.appendChild(mainMediaRibbon);
    container.appendChild(thumbnailsRibbon);
    container.appendChild(captionsPanel);
    container.appendChild(previousButtonPanel);
    container.appendChild(nextButtonPanel);

    carousel.elements = {};
    carousel.elements.container = container;
    carousel.elements.mainMediaRibbon = mainMediaRibbon;
    carousel.elements.thumbnailsRibbon = thumbnailsRibbon;
    carousel.elements.previousButtonPanel = previousButtonPanel;
    carousel.elements.nextButtonPanel = nextButtonPanel;
    carousel.elements.mainMedia = [];
    carousel.elements.thumbnails = [];
    carousel.elements.thumbnailScreens = [];

    container.setAttribute('data-hg-carousel-container', 'data-hg-carousel-container');
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.width = carousel.width + 'px';
    container.style.height = carousel.totalHeight + 'px';
    window.hg.util.setUserSelectNone(container);

    mainMediaRibbon.style.position = 'relative';
    mainMediaRibbon.style.width = carousel.width * carousel.mediaMetadata.length + 'px';
    mainMediaRibbon.style.height = carousel.mainMediaHeight + 'px';

    thumbnailsRibbon.style.position = 'relative';
    thumbnailsRibbon.style.width = config.thumbnailWidth * carousel.mediaMetadata.length + 'px';
    thumbnailsRibbon.style.height = config.thumbnailHeight + 'px';
    thumbnailsRibbon.style.left = carousel.thumbnailRibbonStartPosition + 'px';
    thumbnailsRibbon.style.paddingTop = config.thumbnailRibbonPadding + 'px';

    captionsPanel.setAttribute('data-hg-captions-panel', 'data-hg-captions-panel');

    previousButtonPanel.setAttribute('data-hg-carousel-button', 'data-hg-carousel-button');
    previousButtonPanel.style.position = 'absolute';
    previousButtonPanel.style.top = '0';
    previousButtonPanel.style.left = '0';
    previousButtonPanel.style.width = carousel.width / 3 - config.prevNextButtonPadding + 'px';
    previousButtonPanel.style.height = carousel.mainMediaHeight + 'px';
    previousButtonPanel.style.lineHeight = carousel.mainMediaHeight + 'px';
    previousButtonPanel.style.fontSize = '40px';
    previousButtonPanel.style.verticalAlign = 'middle';
    previousButtonPanel.style.textAlign = 'left';
    previousButtonPanel.style.paddingLeft = config.prevNextButtonPadding + 'px';
    previousButtonPanel.style.cursor = 'pointer';
    previousButtonPanel.innerHTML = '&#10094;';
    previousButtonPanel.addEventListener('click', goToPrevious.bind(carousel), false);

    nextButtonPanel.setAttribute('data-hg-carousel-button', 'data-hg-carousel-button');
    nextButtonPanel.style.position = 'absolute';
    nextButtonPanel.style.top = '0';
    nextButtonPanel.style.right = '0';
    nextButtonPanel.style.width = carousel.width * 2 / 3 - config.prevNextButtonPadding + 'px';
    nextButtonPanel.style.height = carousel.mainMediaHeight + 'px';
    nextButtonPanel.style.lineHeight = carousel.mainMediaHeight + 'px';
    nextButtonPanel.style.fontSize = '40px';
    nextButtonPanel.style.verticalAlign = 'middle';
    nextButtonPanel.style.textAlign = 'right';
    nextButtonPanel.style.paddingRight = config.prevNextButtonPadding + 'px';
    nextButtonPanel.style.cursor = 'pointer';
    nextButtonPanel.innerHTML = '&#10095;';
    nextButtonPanel.addEventListener('click', goToNext.bind(carousel), false);

    if (!waitToLoadMedia) {
      loadMedia.call(carousel);
    }

    // The Carousel should display differently when it contains zero or one item
    if (carousel.mediaMetadata.length === 0) {
      container.style.display = 'none';
    } else if (carousel.mediaMetadata.length === 1) {
      thumbnailsRibbon.style.display = 'none';
      // TODO: also hide the left and right buttons
    }

    setPrevNextButtonVisibility.call(carousel);
  }

  /**
   * @this Carousel
   */
  function setPrevNextButtonVisibility() {
    var prevVisibility, nextVisibility;
    var carousel = this;

    // We don't want the prev/next buttons blocking any video controls
    if (!carousel.mediaMetadata.length ||
        carousel.mediaMetadata[carousel.currentIndex].isVideo) {
      prevVisibility = 'hidden';
      nextVisibility = 'hidden';
    } else {
      prevVisibility = carousel.currentIndex > 0 ? 'visible' : 'hidden';
      nextVisibility = carousel.currentIndex < carousel.mediaMetadata.length - 1 ?
        'visible' : 'hidden';
    }

    carousel.elements.previousButtonPanel.style.visibility = prevVisibility;
    carousel.elements.nextButtonPanel.style.visibility = nextVisibility;
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

    window.hg.controller.transientJobs.carouselImageSlide.create(carousel.grid, null, carousel);

    // Pause any playing video
    if (carousel.mediaMetadata[carousel.previousIndex].isVideo) {
      carousel.elements.mainMedia[carousel.previousIndex].contentWindow
        .postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }

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

    // ---  --- //

    function addMedium(mediumMetadatum, index) {
      var mainMediaElement, thumbnailElement, thumbnailScreenElement, thumbnailSrc;

      if (mediumMetadatum.isVideo) {
        mainMediaElement = document.createElement('iframe');
        mainMediaElement.setAttribute('src', mediumMetadatum.videoSrc);
        mainMediaElement.setAttribute('allowfullscreen', 'allowfullscreen');
        mainMediaElement.setAttribute('frameborder', '0');

        thumbnailSrc = mediumMetadatum.thumbnailSrc;
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
      mainMediaElement.style.width = carousel.width + 'px';
      mainMediaElement.style.height = carousel.mainMediaHeight + 'px';
      mainMediaElement.style.float = 'left';

      thumbnailElement = document.createElement('div');
      thumbnailElement.setAttribute('data-hg-carousel-thumbnail',
        'data-hg-carousel-thumbnail');
      thumbnailElement.style.backgroundImage = 'url(' + thumbnailSrc + ')';
      thumbnailElement.style.backgroundSize = 'contain';
      thumbnailElement.style.backgroundRepeat = 'no-repeat';
      thumbnailElement.style.backgroundPosition = '50% 50%';
      thumbnailElement.style.width = config.thumbnailWidth + 'px';
      thumbnailElement.style.height = config.thumbnailHeight + 'px';
      thumbnailElement.style.float = 'left';

      thumbnailScreenElement = document.createElement('div');
      thumbnailScreenElement.setAttribute('data-hg-carousel-thumbnail-screen',
        'data-hg-carousel-thumbnail-screen');
      thumbnailScreenElement.style.opacity = config.thumbnailScreenOpacity;
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
    }
  }

  /**
   * @this Carousel
   */
  function draw() {
    var carousel = this;

    carousel.elements.mainMediaRibbon.style.left =
      -carousel.currentIndexPositionRatio * carousel.width + 'px';
    carousel.elements.thumbnailsRibbon.style.left = carousel.thumbnailRibbonStartPosition -
      carousel.currentIndexPositionRatio * config.thumbnailWidth + 'px';
  }

  /**
   * @this Carousel
   */
  function destroy() {
    var carousel = this;

    carousel.parent.removeChild(carousel.elements.container);
    carousel.elements.container = null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {HTMLElement} parent
   * @param {Array.<String>} images
   * @param {Array.<String>} videos
   * @param {Boolean} [waitToLoadMedia=false]
   */
  function Carousel(grid, parent, images, videos, waitToLoadMedia) {
    var carousel = this;

    carousel.grid = grid;
    carousel.parent = parent;
    carousel.elements = null;
    carousel.currentIndex = 0;
    carousel.previousIndex = 0;
    carousel.mediaMetadata = null;
    carousel.width = Number.NaN;
    carousel.mainMediaHeight = Number.NaN;
    carousel.totalHeight = Number.NaN;
    carousel.thumbnailRibbonStartPosition = Number.NaN;
    carousel.currentIndexPositionRatio = 0;

    carousel.loadMedia = loadMedia;
    carousel.draw = draw;
    carousel.destroy = destroy;

    createMediaMetadataArray.call(carousel, images, videos);
    calculateDimensions.call(carousel);
    createElements.call(carousel, waitToLoadMedia);

    // Add CSS rules for hover and active states if they have not already been added
    if (!haveAddedStyles) {
      haveAddedStyles = true;
      window.hg.util.addRuleToStyleSheet('[data-hg-carousel-button] { color: #000000; }');
      window.hg.util.addRuleToStyleSheet('[data-hg-carousel-button]:hover { color: #999999; }');
      window.hg.util.addRuleToStyleSheet('[data-hg-carousel-button]:active { color: #ffffff; }');
    }

    console.log('Carousel created');
  }

  Carousel.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Carousel = Carousel;

  console.log('Carousel module loaded');
})();
