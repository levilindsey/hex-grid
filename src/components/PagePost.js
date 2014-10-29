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

// TODO:

  var config;

  config = {};

  config.fontSize = 16;
  config.titleFontSize = 22;

  // TODO:

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
        (window.hg.OpenPostJob.config.expandedDisplacementTileCount + 2);
    var verticalSideLength = window.hg.Grid.config.longGap *
        ((window.hg.OpenPostJob.config.expandedDisplacementTileCount - 1) * 2 + 1) +
        window.hg.Grid.config.tileOuterRadius *
        (3 * window.hg.OpenPostJob.config.expandedDisplacementTileCount - 1);

    var width, height;

    if (pagePost.tile.grid.isVertical) {
      width = horizontalSideLength;
      height = verticalSideLength;
    } else {
      width = verticalSideLength;
      height = horizontalSideLength;
    }

    var top = pagePost.tile.grid.originalCenter.y - height / 2;
    var left = pagePost.tile.grid.originalCenter.x - width / 2;

    // ---  --- //

    var container = document.createElement('div');
    var title = document.createElement('h1');

    pagePost.tile.grid.parent.appendChild(container);
    container.appendChild(title);

    pagePost.elements = [];
    pagePost.elements.container = container;
    pagePost.elements.title = title;

    title.setAttribute('data-hg-post-container', 'data-hg-post-container');
    title.style.position = 'absolute';
    title.style.left = -left / 2 + 'px';
    title.style.top = top + 'px';
    title.style.width = width + 'px';
    title.style.height = height + 'px';
    title.style.margin = '0px';
    title.style.padding = 20 + 'px';
    title.style.fontSize = config.fontSize + 'px';
    title.style.fontFamily = 'Georgia, sans-serif';
    title.style.color = '#F4F4F4';
    container.style.zIndex = '500';

    title.innerHTML = pagePost.tile.postData.titleLong;
    title.style.fontSize = config.fontSize + 'px';
    title.style.fontFamily = 'Georgia, sans-serif';
    title.style.textAlign = 'center';

    //**;
    // TODO:
    // - the contents of this PagePost should be within normal (non-SVG) DOM elements
    // - these elements should be positioned behind the SVG element
    // - this should fade in (as controlled by the OpenPostJob)

    //id = !isNaN(pagePost.originalIndex) ? pagePost.originalIndex : parseInt(Math.random() * 1000000 + 1000);
    //
    //pagePost.vertexDeltas = computeVertexDeltas(pagePost.outerRadius, pagePost.isVertical);
    //pagePost.vertices = [];
    //updateVertices.call(pagePost, pagePost.currentAnchor.x, pagePost.currentAnchor.y);
    //
    //pagePost.element = document.createElementNS(window.hg.util.svgNamespace, 'polygon');
    //pagePost.svg.appendChild(pagePost.element);
    //
    //pagePost.element.id = 'hg-' + id;
    //pagePost.element.classList.add('hg-pagePost');
    //pagePost.element.style.cursor = 'pointer';
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
  function destroy() {
    var pagePost = this;

    // TODO:
    //pagePost.svg.removeChild(pagePost.element);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Tile} tile
   */
  function PagePost(tile) {
    var pagePost = this;

    pagePost.tile = tile;
    pagePost.elements = null;

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
