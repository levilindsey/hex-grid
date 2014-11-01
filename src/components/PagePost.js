/**
 * This module defines a constructor for PagePost objects.
 *
 * PagePost objects handle the actual textual contents of the main, enlarged post area.
 *
 * @module PagePost
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
   * @this PagePost
   */
  function createElements() {
    var pagePost = this;

    var horizontalSideLength = window.hg.Grid.config.tileShortLengthWithGap *
        (window.hg.OpenPostJob.config.expandedDisplacementTileCount + 4.25);
    var verticalSideLength = window.hg.Grid.config.longGap *
        (window.hg.OpenPostJob.config.expandedDisplacementTileCount * 2) +
        window.hg.Grid.config.tileOuterRadius *
        (3 * window.hg.OpenPostJob.config.expandedDisplacementTileCount + 2);

    var horizontalPadding = 1.15 * window.hg.Grid.config.tileShortLengthWithGap;
    var verticalPadding = 2.25 * window.hg.Grid.config.tileOuterRadius;

    var width, height, paddingX, paddingY;

    if (pagePost.tile.grid.isVertical) {
      width = horizontalSideLength;
      height = verticalSideLength;
      paddingX = horizontalPadding;
      paddingY = verticalPadding;
    } else {
      width = verticalSideLength;
      height = horizontalSideLength;
      paddingX = verticalPadding;
      paddingY = horizontalPadding;
    }

    width -= paddingX * 2;
    height -= paddingY * 2;

    pagePost.paddingX = paddingX;
    pagePost.paddingY = paddingY;
    pagePost.halfWidth = width / 2;
    pagePost.halfHeight = height / 2;

    // ---  --- //

    var container = document.createElement('div');
    var title = document.createElement('h1');
    var content = document.createElement('div');

    pagePost.tile.grid.parent.appendChild(container);
    container.appendChild(title);
    container.appendChild(content);

    pagePost.elements = [];
    pagePost.elements.container = container;
    pagePost.elements.title = title;
    pagePost.elements.content = content;

    container.setAttribute('data-hg-post-container', 'data-hg-post-container');
    container.style.position = 'absolute';
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    container.style.margin = '0px';
    container.style.padding = pagePost.paddingY + 'px ' + pagePost.paddingX + 'px';
    container.style.overflow = 'auto';
    container.style.fontSize = config.fontSize + 'px';
    container.style.fontFamily = '"Open Sans", sans-serif';
    container.style.color = '#F4F4F4';
    container.style.zIndex = '500';

    title.innerHTML = pagePost.tile.postData.titleLong;
    title.style.fontSize = config.titleFontSize + 'px';
    title.style.fontFamily = '"Open Sans", sans-serif';
    title.style.textAlign = 'center';

    content.innerHTML = pagePost.tile.postData.content;
    content.style.whiteSpace = 'pre-wrap';

    draw.call(pagePost);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * @this PagePost
   */
  function draw() {
    var pagePost = this;

    pagePost.elements.container.style.left =
        pagePost.center.x - pagePost.halfWidth - pagePost.paddingX + 'px';
    pagePost.elements.container.style.top =
        pagePost.center.y - pagePost.halfHeight - pagePost.paddingY + 'px';

    pagePost.elements.container.style.opacity = pagePost.opacity;
  }

  /**
   * @this PagePost
   */
  function destroy() {
    var pagePost = this;

    pagePost.tile.grid.parent.removeChild(pagePost.elements.container);
    pagePost.elements = null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Tile} tile
   * @param {{x:Number,y:Number}} startCenter
   */
  function PagePost(tile, startCenter) {
    var pagePost = this;

    pagePost.tile = tile;
    pagePost.elements = null;
    pagePost.opacity = 0;
    pagePost.paddingX = Number.NaN;
    pagePost.paddingY = Number.NaN;
    pagePost.halfWidth = Number.NaN;
    pagePost.halfHeight = Number.NaN;
    pagePost.center = {
      x: startCenter.x,
      y: startCenter.y
    };

    pagePost.draw = draw;
    pagePost.destroy = destroy;

    createElements.call(pagePost);

    console.log('PagePost created: postId=' + tile.postData.id +
        ', tileIndex=' + tile.originalIndex);
  }

  PagePost.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.PagePost = PagePost;

  console.log('PagePost module loaded');
})();
