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

    var backgroundImage = document.createElementNS(window.hg.util.svgNamespace, 'image');
    var title = document.createElement('h2');

    tilePost.tile.elements.backgroundPattern.removeChild(tilePost.tile.elements.backgroundPanel);
    tilePost.tile.elements.backgroundPanel = null;

    tilePost.tile.elements.backgroundPattern.insertBefore(backgroundImage, tilePost.tile.elements.foregroundScreen);
    tilePost.tile.grid.wrapper.appendChild(title);

    tilePost.elements = {};
    tilePost.elements.backgroundImage = backgroundImage;
    tilePost.elements.title = title;

    // --- Set the parameters of the elements --- //

    backgroundImage.setAttributeNS(window.hg.util.xlinkNamespace, 'xlink:href', tilePost.tile.postData.thumbnailSrc);
    backgroundImage.setAttribute('preserveAspectRatio', 'none');
    backgroundImage.setAttribute('x', imageX);
    backgroundImage.setAttribute('y', imageY);
    backgroundImage.setAttribute('width', imageWidth);
    backgroundImage.setAttribute('height', imageHeight);
    backgroundImage.setAttribute('opacity', '1');
    // TODO: this should have worked, but the aspect ratio was not being maintained; it may have been a browser bug
    //backgroundImage.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    //backgroundImage.setAttribute('width', '1');
    //backgroundImage.setAttribute('height', '1');

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
    title.style.zIndex = '2000';

    draw.call(tilePost);

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
   */
  function draw() {
    var tilePost = this;

    // Have the title change across a wider opacity range than the background screen
    var titleOpacity = 0.5 + (tilePost.tile.foregroundScreenOpacity - 0.5) * 2;
    titleOpacity = titleOpacity > 1 ? 1 : (titleOpacity < 0 ? 0 : titleOpacity);

    window.hg.util.applyTransform(tilePost.elements.title,
        'translate(' + tilePost.tile.particle.px + 'px,' + tilePost.tile.particle.py + 'px)');

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

    tilePost.tile.grid.wrapper.removeChild(tilePost.elements.title);
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

    tilePost.draw = draw;
    tilePost.destroy = destroy;

    createElements.call(tilePost);
  }

  TilePost.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.TilePost = TilePost;

  console.log('TilePost module loaded');
})();
