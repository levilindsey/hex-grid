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

  config.fontSize = 18;
  config.titleFontSize = 24;
  config.thumbnailHeight = 80;

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

    carousel.width = carousel.parent.offsetWidth;
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

    container.style.overflow = 'hidden';
    container.style.width = carousel.width + 'px';
    container.style.height = carousel.mainMediaHeight + 'px';

    mainMediaRibbon.style.position = 'relative';
    mainMediaRibbon.style.height = carousel.mainMediaHeight + 'px';
    mainMediaRibbon.style.width = carousel.width * carousel.mediaMetadata.length + 'px';

    thumbnailsRibbon.style.position = 'relative';
    thumbnailsRibbon.style.height = config.thumbnailHeight + 'px';
    thumbnailsRibbon.style.width = config.thumbnailWidth * carousel.mediaMetadata.length + 'px';
    thumbnailsRibbon.style.left = carousel.thumbnailRibbonStartPosition + 'px';




    // TODO:

    // ---  --- //

    function addMedium(mediumMetadatum) {**;// TODO: call this
      var mainMediaElement, thumbnailElement;

      if (mediumMetadatum.isVideo) {
        mainMediaElement = document.createElement('iframe');
        mainMediaElement.setAttribute('src', mediumMetadatum.videoSrc);
        mainMediaElement.setAttribute('allowfullscreen', 'allowfullscreen');
        mainMediaElement.setAttribute('frameborder', '0');

        thumbnailElement = document.createElement('div');
        thumbnailElement.style.backgroundImage = 'url(' + mediumMetadatum.thumbnailSrc + ')';
        thumbnailElement.style.backgroundSize = 'contain';
        thumbnailElement.style.backgroundRepeat = 'no-repeat';
        thumbnailElement.style.backgroundPosition = '50% 50%';
      } else {
        mainMediaElement = document.createElement('div');
        mainMediaElement.style.backgroundImage = 'url(' + mediumMetadatum.src + ')';
        mainMediaElement.style.backgroundSize = 'contain';
        mainMediaElement.style.backgroundRepeat = 'no-repeat';
        mainMediaElement.style.backgroundPosition = '50% 50%';

        thumbnailElement = document.createElement('div');
        thumbnailElement.style.backgroundImage = 'url(' + mediumMetadatum.src + ')';
        thumbnailElement.style.backgroundSize = 'contain';
        thumbnailElement.style.backgroundRepeat = 'no-repeat';
        thumbnailElement.style.backgroundPosition = '50% 50%';
      }

      mainMediaElement.style.width = carousel.width + 'px';
      mainMediaElement.style.height = carousel.mainMediaHeight + 'px';

      thumbnailElement.style.width = config.thumbnailWidth + 'px';
      thumbnailElement.style.height = config.thumbnailHeight + 'px';

      **;// TODO: add to container
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
  function goToPrevious() {
  **;// TODO: re-write these transition functions to account for the new plan: all elements are persistent; just store a current and base x-position for the overall image collection(s?) (i.e., the first image), then update these with multiple concurrent jobs (by setting the final pos at the start again)
    // TODO: instead, use a progress/percent/ratio value, so that we do not need to store both the thumbnail ribbon and main media ribbon positions separately
    var carousel = this;

    carousel.previousIndex = carousel.currentIndex;
    carousel.currentIndex = (carousel.currentIndex + carousel.mediaMetadata.length - 1) %
        carousel.mediaMetadata.length;
    carousel.latestTransitionIsToNext = false;

    createNewMainImage(carousel.latestTransitionIsToNext);

    window.hg.controller.transientJobs.carouselImageSlide.create(carousel.grid, null, carousel);
  }

  /**
   * @this Carousel
   */
  function goToNext() {
    var carousel = this;

    carousel.previousIndex = carousel.currentIndex;
    carousel.currentIndex = (carousel.currentIndex + 1) % carousel.mediaMetadata.length;
    carousel.latestTransitionIsToNext = true;

    createNewMainImage(carousel.latestTransitionIsToNext);

    window.hg.controller.transientJobs.carouselImageSlide.create(carousel.grid, null, carousel);
  }

  /**
   * @this Carousel
   */
  function destroy() {
    var carousel = this;

    **;// TODO: deallocate media data(?) and remove media elements from DOM
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
    carousel.previousIndex = Number.NaN;
    carousel.mediaMetadata = null;
    carousel.width = Number.NaN;
    carousel.mainMediaHeight = Number.NaN;
    carousel.totalHeight = Number.NaN;

    carousel.goToPrevious = goToPrevious;
    carousel.goToNext = goToNext;
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
