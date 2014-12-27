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

    tilePost.draw = draw;
    tilePost.destroy = destroy;

    createElements.call(tilePost);
  }

  TilePost.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.TilePost = TilePost;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this TilePost
   */
  function createElements() {
    var tilePost = this;

    var patternId = 'hg-pattern-' + tilePost.tile.postData.id;

    var screenColorString = 'hsl(' + window.hg.Grid.config.backgroundHue + ',' +
      window.hg.Grid.config.backgroundSaturation + '%,' + window.hg.Grid.config.backgroundLightness + '%)';

    var outerSideLength = window.hg.Grid.config.tileOuterRadius * 2;

    var textTop = -config.fontSize * (1.5 + 0.53 * (tilePost.tile.postData.titleShort.split('\n').length - 1));

    var longRadiusRatio = 1;
    var shortRadiusRatio = window.hg.Grid.config.tileOuterRadius / window.hg.Grid.config.tileInnerRadius;
    var offsetDistance = (1 - shortRadiusRatio) / 2;

    var imageWidth, imageHeight, imageX, imageY;
    if (tilePost.tile.grid.isVertical) {
      imageWidth = shortRadiusRatio;
      imageHeight = longRadiusRatio;
      imageX = offsetDistance;
      imageY = '0';
    } else {
      imageWidth = longRadiusRatio;
      imageHeight = shortRadiusRatio;
      imageX = '0';
      imageY = offsetDistance;
    }

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
    backgroundImage.setAttribute('preserveAspectRatio', 'none');
    backgroundImage.setAttribute('x', imageX);
    backgroundImage.setAttribute('y', imageY);
    backgroundImage.setAttribute('width', imageWidth);
    backgroundImage.setAttribute('height', imageHeight);
    // TODO: this should have worked, but the aspect ratio was NOT being maintained; it may have been a browser bug
    //backgroundImage.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    //backgroundImage.setAttribute('width', '1');
    //backgroundImage.setAttribute('height', '1');

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
    title.style.textAlign = 'center';
    title.style.whiteSpace = 'pre-wrap';
    title.style.pointerEvents = 'none';
    title.style.zIndex = '1200';

    tilePost.tile.imageScreenOpacity = config.inactiveScreenOpacity;
    draw.call(tilePost);

    // TODO: for the canvas version: http://stackoverflow.com/a/4961439/489568
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * @this TilePost
   */
  function draw() {
    var tilePost = this;

    // Keep hovered tiles highlighted
    var backgroundImageScreenOpacity = tilePost.tile.isHighlighted ?
        window.hg.TilePost.config.activeScreenOpacity : tilePost.tile.imageScreenOpacity;

    // Have the title change across a wider opacity range than the background screen
    var titleOpacity = 0.5 + (backgroundImageScreenOpacity - 0.5) * 2;
    titleOpacity = titleOpacity > 1 ? 1 : (titleOpacity < 0 ? 0 : titleOpacity);

    window.hg.util.applyTransform(tilePost.elements.title,
        'translate(' + tilePost.tile.particle.px + 'px,' + tilePost.tile.particle.py + 'px)');
    tilePost.elements.backgroundImageScreen.setAttribute('opacity', backgroundImageScreenOpacity);

    // Only set the title opacity for collapsed tiles
    if (tilePost.tile.grid.expandedTile !== tilePost.tile) {
      tilePost.elements.title.style.opacity = titleOpacity;
    }
  }

  /**
   * @this TilePost
   */
  function destroy() {
    var tilePost = this;

    tilePost.tile.grid.parent.removeChild(tilePost.elements.title);
    tilePost.tile.grid.svgDefs.removeChild(tilePost.elements.backgroundPattern);
  }

  console.log('TilePost module loaded');
})();
