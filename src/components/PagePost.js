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
    var tilePost = this;

    var container = document.createElement('div');
    var title = document.createElement('h1');

    tilePost.elements = [];
    tilePost.elements.container = container;
    tilePost.elements.title = title;

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
  }

  PagePost.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.PagePost = PagePost;

  console.log('PagePost module loaded');
})();
