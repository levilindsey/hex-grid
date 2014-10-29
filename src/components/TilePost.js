/**
 * This module defines a constructor for TilePost objects.
 *
 * TilePost objects handle the actual textual contents of the Tile objects.
 *
 * @module TilePost
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config;

  config = {};

  config.activeScreenOpacity = 0.0;
  config.inactiveScreenOpacity = 0.8;

  config.fontSize = 18;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  /**
   * @this TilePost
   */
  function createElements() {
    var tilePost = this;

    var patternId = 'hg-pattern-' + tilePost.tile.postData.id;

    var screenColorString = 'hsl(' + window.hg.Grid.config.backgroundHue + ',' +
        window.hg.Grid.config.backgroundSaturation + '%,' + window.hg.Grid.config.backgroundLightness + '%)';

    var outerSideLength = window.hg.Grid.config.tileOuterRadius * 2;

    var textTop = -config.fontSize * (1.5 + 0.65 * (tilePost.tile.postData.titleShort.split('\n').length - 1));

    // --- Create the elements, add them to the DOM, save them in this TilePost --- //

    var backgroundPattern = document.createElementNS(window.hg.util.svgNamespace, 'pattern');
    var backgroundImage = document.createElementNS(window.hg.util.svgNamespace, 'image');
    var backgroundImageScreen = document.createElementNS(window.hg.util.svgNamespace, 'rect');
    var title = document.createElement('h2');

    tilePost.tile.grid.svgDefs.appendChild(backgroundPattern);
    backgroundPattern.appendChild(backgroundImage);
    backgroundPattern.appendChild(backgroundImageScreen);
    tilePost.tile.grid.parent.appendChild(title);

    tilePost.elements = [];
    tilePost.elements.backgroundPattern = backgroundPattern;
    tilePost.elements.backgroundImage = backgroundImage;
    tilePost.elements.backgroundImageScreen = backgroundImageScreen;
    tilePost.elements.title = title;

    // --- Set the parameters of the elements --- //

    backgroundPattern.setAttribute('id', patternId);
    backgroundPattern.setAttribute('patternContentUnits', 'objectBoundingBox');
    backgroundPattern.setAttribute('width', '1');
    backgroundPattern.setAttribute('height', '1');

    backgroundImage.setAttributeNS(window.hg.util.xlinkNamespace, 'xlink:href', tilePost.tile.postData.thumbnailSrc);
    backgroundImage.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    backgroundImage.setAttribute('width', '1');
    backgroundImage.setAttribute('height', '1');

    backgroundImageScreen.setAttribute('width', '1');
    backgroundImageScreen.setAttribute('height', '1');
    backgroundImageScreen.setAttribute('fill', screenColorString);

    tilePost.tile.element.setAttribute('fill', 'url(#' + patternId + ')');

    title.innerHTML = tilePost.tile.postData.titleShort;
    title.setAttribute('data-hg-tile-title', 'data-hg-tile-title');
    title.style.position = 'absolute';
    title.style.left = -outerSideLength / 2 + 'px';
    title.style.top = textTop + 'px';
    title.style.width = outerSideLength + 'px';
    title.style.height = outerSideLength + 'px';
    title.style.fontSize = config.fontSize + 'px';
    title.style.fontFamily = 'Georgia, sans-serif';
    title.style.textAlign = 'center';
    title.style.whiteSpace = 'pre-wrap';
    title.style.color = '#F4F4F4';
    title.style.pointerEvents = 'none';
    title.style.zIndex = '2000';

    updatePosition.call(tilePost, tilePost.tile.particle.px, tilePost.tile.particle.py);
    updateScreenOpacity.call(tilePost, config.inactiveScreenOpacity);

    // TODO: for the canvas version: http://stackoverflow.com/a/4961439/489568
  }

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * @this TilePost
   * @param {Number} x
   * @param {Number} y
   */
  function updatePosition(x, y) {
    var tilePost = this;
    window.hg.util.applyTransform(tilePost.elements.title, 'translate(' + x + 'px,' + y + 'px)');
  }

  /**
   * @this TilePost
   * @param {String} opacity
   */
  function updateScreenOpacity(opacity) {
    var tilePost = this;
    tilePost.elements.backgroundImageScreen.setAttribute('opacity', opacity);
  }

  /**
   * @this TilePost
   */
  function destroy() {
    var tilePost = this;

    tilePost.svg.removeChild(tilePost.elements.container);
    tilePost.svgDefs.removeChild(tilePost.elements.backgroundPattern);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Tile} tile
   */
  function TilePost(tile) {
    var tilePost = this;

    tilePost.tile = tile;
    tilePost.elements = null;

    tilePost.updatePosition = updatePosition;
    tilePost.updateScreenOpacity = updateScreenOpacity;
    tilePost.destroy = destroy;

    createElements.call(tilePost);
  }

  TilePost.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.TilePost = TilePost;

  console.log('TilePost module loaded');
})();
