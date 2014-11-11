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

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this Carousel
   */
  function createElements() {
    var carousel = this;

    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', );
    iframe.setAttribute('allowfullscreen', 'allowfullscreen');
    iframe.setAttribute('frameborder', '0');
    iframe.style.width = '420px';
    iframe.style.height = '315px';
    .appendChild(iframe);

    // TODO:
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
  function destroy() {
    var carousel = this;

    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   */
  function Carousel() {
    var carousel = this;

    carousel.elements = null;

    carousel.destroy = destroy;

    createElements.call(carousel);

    console.log('Carousel created');
  }

  Carousel.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Carousel = Carousel;

  console.log('Carousel module loaded');
})();
