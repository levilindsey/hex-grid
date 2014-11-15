/**
* This module defines a constructor for Carousel objects.
*
* Carousel objects display the images and videos for a post.
*
* @module Carousel
*/
(function () {

  // TODO: also update the tilepost drawing to utilize the reset job

  // TODO: make sure the tilepost job is getting destroyed properly on resize (text is hanging around...)

  // TODO: add left/right buttons; add click handlers for thumbnails

  // TODO: thumbnail screens: animate fading the screens (use CSS transitions? then only remove screen opacity when the last slide job completes?)

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config;

  config = {};

  config.fontSize = 18;
  config.titleFontSize = 24;
  config.thumbnailHeight = 80;

  config.thumbnailScreenOpacity = 0.6;
  config.backgroundColorString = '#222222';

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
    carousel.totalHeight = carousel.mainMediaHeight + config.thumbnailHeight;

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
   */
  function createElements() {
    var carousel = this;

    var container = document.createElement('div');
    var mainMediaRibbon = document.createElement('div');
    var thumbnailsRibbon = document.createElement('div');

    carousel.parent.appendChild(container);
    container.appendChild(mainMediaRibbon);
    container.appendChild(thumbnailsRibbon);

    carousel.elements = {};
    carousel.elements.container = container;
    carousel.elements.mainMediaRibbon = mainMediaRibbon;
    carousel.elements.thumbnailsRibbon = thumbnailsRibbon;
    carousel.elements.mainMedia = [];
    carousel.elements.thumbnails = [];
    carousel.elements.thumbnailScreens = [];

    container.style.overflow = 'hidden';
    container.style.width = carousel.width + 'px';
    container.style.height = carousel.totalHeight + 'px';

    mainMediaRibbon.style.position = 'relative';
    mainMediaRibbon.style.width = carousel.width * carousel.mediaMetadata.length + 'px';
    mainMediaRibbon.style.height = carousel.mainMediaHeight + 'px';
    mainMediaRibbon.style.backgroundColor = config.backgroundColorString;

    thumbnailsRibbon.style.position = 'relative';
    thumbnailsRibbon.style.width = config.thumbnailWidth * carousel.mediaMetadata.length + 'px';
    thumbnailsRibbon.style.height = config.thumbnailHeight + 'px';
    thumbnailsRibbon.style.left = carousel.thumbnailRibbonStartPosition + 'px';
    thumbnailsRibbon.style.backgroundColor = config.backgroundColorString;

    carousel.mediaMetadata.forEach(addMedium);

    // The Carousel should display differently when it contains zero or one item
    if (carousel.mediaMetadata.length === 0) {
      container.style.display = 'none';
    } else if (carousel.mediaMetadata.length === 1) {
      thumbnailsRibbon.style.display = 'none';
      // TODO: also hide the left and right buttons
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

      mainMediaElement.style.width = carousel.width + 'px';
      mainMediaElement.style.height = carousel.mainMediaHeight + 'px';
      mainMediaElement.style.float = 'left';

      thumbnailElement = document.createElement('div');
      thumbnailElement.style.backgroundImage = 'url(' + thumbnailSrc + ')';
      thumbnailElement.style.backgroundSize = 'contain';
      thumbnailElement.style.backgroundRepeat = 'no-repeat';
      thumbnailElement.style.backgroundPosition = '50% 50%';
      thumbnailElement.style.width = config.thumbnailWidth + 'px';
      thumbnailElement.style.height = config.thumbnailHeight + 'px';
      thumbnailElement.style.float = 'left';

      thumbnailScreenElement = document.createElement('div');
      thumbnailScreenElement.style.backgroundColor = '#222222';
      thumbnailScreenElement.style.opacity = config.thumbnailScreenOpacity;
      thumbnailScreenElement.style.width = '100%';
      thumbnailScreenElement.style.height = '100%';
      thumbnailScreenElement.style.cursor = 'pointer';
      thumbnailScreenElement.addEventListener('click', goToIndex.bind(carousel, index), false);

      carousel.elements.mainMedia.push(mainMediaElement);
      carousel.elements.thumbnails.push(thumbnailElement);
      carousel.elements.thumbnailScreens.push(thumbnailScreenElement);

      mainMediaRibbon.appendChild(mainMediaElement);
      thumbnailsRibbon.appendChild(thumbnailElement);
      thumbnailElement.appendChild(thumbnailScreenElement);
    }
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
   */
  function Carousel(grid, parent, images, videos) {
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

    carousel.draw = draw;
    carousel.destroy = destroy;

    createMediaMetadataArray.call(carousel, images, videos);
    calculateDimensions.call(carousel);
    createElements.call(carousel);

    console.log('Carousel created');
  }

  Carousel.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Carousel = Carousel;

  console.log('Carousel module loaded');
})();
