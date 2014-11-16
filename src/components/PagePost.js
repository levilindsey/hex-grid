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

  var haveAddedStyles = false;

  var config;

  config = {};

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

    var width, height, paddingX, paddingY, gradientColor1String,
      gradientColor2String, innerWrapperPadding;

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

    gradientColor1String = 'hsl(' +
      window.hg.Grid.config.backgroundHue + ',' +
      window.hg.Grid.config.backgroundSaturation + '%,' +
      window.hg.Grid.config.backgroundLightness + '%)';
    gradientColor2String = 'hsla(' +
      window.hg.Grid.config.backgroundHue + ',' +
      window.hg.Grid.config.backgroundSaturation + '%,' +
      window.hg.Grid.config.backgroundLightness + '%,0)';

    // ---  --- //

    var container = document.createElement('div');
    var outerWrapper = document.createElement('div');
    var innerWrapper = document.createElement('div');
    var title = document.createElement('h1');
    var content = document.createElement('div');
    var topGradient = document.createElement('div');
    var bottomGradient = document.createElement('div');

    pagePost.tile.grid.parent.appendChild(container);
    container.appendChild(outerWrapper);
    outerWrapper.appendChild(innerWrapper);
    innerWrapper.appendChild(title);
    innerWrapper.appendChild(content);
    container.appendChild(topGradient);
    container.appendChild(bottomGradient);

    pagePost.elements = [];
    pagePost.elements.container = container;
    pagePost.elements.title = title;
    pagePost.elements.content = content;

    container.setAttribute('data-hg-post-container', 'data-hg-post-container');
    container.style.position = 'absolute';
    container.style.width = width + paddingX + 'px';
    container.style.height = height + paddingY * 2 + 'px';
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.overflow = 'hidden';
    container.style.zIndex = '500';

    outerWrapper.setAttribute('data-hg-post-outer-wrapper', 'data-hg-post-outer-wrapper');
    outerWrapper.style.width = width + 'px';
    outerWrapper.style.height = height + 'px';
    outerWrapper.style.margin = '0';
    outerWrapper.style.padding = paddingY + 'px 0 ' + paddingY + 'px ' + paddingX + 'px';
    outerWrapper.style.overflow = 'auto';

    innerWrapper.setAttribute('data-hg-post-inner-wrapper', 'data-hg-post-inner-wrapper');
    innerWrapperPadding =
      parseInt(window.getComputedStyle(innerWrapper, null).getPropertyValue('padding-top'));
    innerWrapper.style.minHeight = height - innerWrapperPadding * 2 + 'px';
    innerWrapper.style.overflowX = 'hidden';

    title.setAttribute('data-hg-post-title', 'data-hg-post-title');
    title.innerHTML = pagePost.tile.postData.titleLong;

    topGradient.style.position = 'absolute';
    topGradient.style.top = '0';
    topGradient.style.left = paddingX + 'px';
    topGradient.style.height = paddingY + 'px';
    topGradient.style.width = width + 'px';
    topGradient.style.backgroundColor = '#000000';
    topGradient.style.background =
      'linear-gradient(0,' + gradientColor2String + ',' + gradientColor1String + ' 75%)';
    topGradient.style.pointerEvents = 'none';

    bottomGradient.style.position = 'absolute';
    bottomGradient.style.bottom = '0';
    bottomGradient.style.left = paddingX + 'px';
    bottomGradient.style.height = paddingY + 'px';
    bottomGradient.style.width = width + 'px';
    bottomGradient.style.backgroundColor = '#000000';
    bottomGradient.style.background =
      'linear-gradient(0,' + gradientColor1String + ' 25%,' + gradientColor2String + ')';
    bottomGradient.style.pointerEvents = 'none';

    var converter = new Showdown.converter({extensions: ['github']});
    //var converter = new Showdown.converter();

    content.setAttribute('data-hg-post-content', 'data-hg-post-content');
    content.innerHTML = converter.makeHtml(pagePost.tile.postData.content);

    // Create the Carousel and insert it before the post's main contents
    pagePost.carousel = new window.hg.Carousel(pagePost.tile.grid, innerWrapper,
      pagePost.tile.postData.images, pagePost.tile.postData.videos, true);
    innerWrapper.removeChild(pagePost.carousel.elements.container);
    innerWrapper.insertBefore(pagePost.carousel.elements.container, content);

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
  function loadCarouselMedia() {
    var pagePost = this;

    pagePost.carousel.loadMedia();
  }

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

    pagePost.carousel.draw();
  }

  /**
   * @this PagePost
   */
  function destroy() {
    var pagePost = this;

    pagePost.carousel.destroy();

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
    pagePost.carousel = null;
    pagePost.opacity = 0;
    pagePost.paddingX = Number.NaN;
    pagePost.paddingY = Number.NaN;
    pagePost.halfWidth = Number.NaN;
    pagePost.halfHeight = Number.NaN;
    pagePost.center = {
      x: startCenter.x,
      y: startCenter.y
    };

    pagePost.loadCarouselMedia = loadCarouselMedia;
    pagePost.draw = draw;
    pagePost.destroy = destroy;

    createElements.call(pagePost);

    // Add CSS rules for hover and active states if they have not already been added
    if (!haveAddedStyles) {
      haveAddedStyles = true;
      window.hg.util.addRuleToStyleSheet('[data-hg-post-container] img { max-width: 100%; }');
    }

    console.log('PagePost created: postId=' + tile.postData.id +
        ', tileIndex=' + tile.originalIndex);
  }

  PagePost.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.PagePost = PagePost;

  console.log('PagePost module loaded');
})();
