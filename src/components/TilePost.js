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

// TODO:

// TODO: tilePost.element.setAttribute('hg-post-tilePost', 'hg-post-tilePost'); to any tilePost that contains a TilePost (and remove it when destroying the post)
// TODO: post.element.style.pointerEvents = 'none';

  var config;

  config = {};

  config.activeScreenOpacity = '0.0';
  config.inactiveScreenOpacity = '0.9';

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

    // --- Create the elements, add them to the DOM, save them in this TilePost --- //

    var backgroundPattern = document.createElementNS(window.hg.util.svgNamespace, 'pattern');
    var backgroundImage = document.createElementNS(window.hg.util.svgNamespace, 'image');
    var backgroundImageScreen = document.createElementNS(window.hg.util.svgNamespace, 'rect');
    var title = stringToTSpans(tilePost.tile.postData.titleShort);

    tilePost.tile.grid.svgDefs.appendChild(backgroundPattern);
    backgroundPattern.appendChild(backgroundImage);
    backgroundPattern.appendChild(backgroundImageScreen);
    tilePost.tile.grid.svg.appendChild(title);

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

    title.setAttribute('font-family', 'Georgia, sans-serif');
    title.setAttribute('font-size', '18px');
    title.setAttribute('fill', '#F4F4F4');
    title.setAttribute('x', '0');
    title.setAttribute('width', '' + window.hg.Grid.config.tileInnerRadius * 2);
    title.setAttribute('height', '' + window.hg.Grid.config.tileInnerRadius * 2);
    title.setAttribute('hg-tile-title', 'hg-tile-title');
    title.style.cursor = 'pointer';

    updatePosition.call(tilePost, tilePost.tile.particle.px, tilePost.tile.particle.py);
    updateScreenOpacity.call(tilePost, config.inactiveScreenOpacity);

    // TODO: for the canvas version: http://stackoverflow.com/a/4961439/489568

    // ---  --- //

    /**
     * Tokenizes the given string using the newline character as the delimiter, and creates a tspan
     * element for each token. Returns a text element with the new tspan elements as children.
     *
     * @param {String} str
     * @returns {HTMLElement}
     */
    function stringToTSpans(str) {
      var i, count, tspan;

      var text = document.createElementNS(window.hg.util.svgNamespace, 'text');
      var tokens = str.split('\n');
      var initialDy = -0.25 - (tokens.length - 2) * 0.6;

      tspan = document.createElementNS(window.hg.util.svgNamespace, 'tspan');
      text.appendChild(tspan);

      tspan.textContent = tokens[0];
      tspan.setAttribute('x', '0');
      tspan.setAttribute('dy', initialDy + 'em');
      tspan.setAttribute('text-anchor', 'middle');

      for (i = 1, count = tokens.length; i < count; i += 1) {
        tspan = document.createElementNS(window.hg.util.svgNamespace, 'tspan');
        text.appendChild(tspan);

        tspan.textContent = tokens[i];
        tspan.setAttribute('x', '0');
        tspan.setAttribute('dy', '1.2em');
        tspan.setAttribute('text-anchor', 'middle');
      }

      return text;
    }
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
    tilePost.elements.title.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
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
