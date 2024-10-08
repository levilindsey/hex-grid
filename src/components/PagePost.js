/**
 * This module defines a constructor for PagePost objects.
 *
 * PagePost objects handle the actual textual contents of the main, enlarged post area.
 *
 * @module PagePost
 */
(function () {

  // TODO: also update the tilepost drawing to utilize the reset job

  // TODO: refactor PagePost, TilePost, and Carousel code

  // TODO: sort post items by date

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config;

  config = {};

  config.urlLabels = {
    'homepage': 'Homepage',
    'published': 'Published at',
    'demo': 'Demo',
    'npm': 'NPM registry',
    'bower': 'Bower registry',
    'codepen': 'CodePen',
    'github': 'Source code',
    'googleCode': 'Source code',
    'githubProfile': 'GitHub',
    'linkedin': 'LinkedIn',
    'twitter': 'Twitter',
    'facebook': 'Facebook',
    'googlePlus': 'Google+',
    'reverbNation': 'Reverb Nation',
    'resume': 'Resume',
    'youtube': 'YouTube',
    'soundcloud': 'SoundCloud',
    'itchio': 'itch.io',
    'ludum-dare': 'Ludum Dare',
    'global-game-jam': 'Global Game Jam',
    'gmtk': 'GMTK game jam',
    'devlog': 'Devlog',
    'snoring-cat': 'Snoring Cat LLC',
    'chrome-web-store': 'Chrome Web Store',
    'play-store': 'Google Play Store',
    'app-store': 'Apple App Store',
    'godot-asset-library': 'Godot Asset Library',
  };

  config.monthLabels = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
  };

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  function addCloseDefinition() {
    var body = document.querySelector('body');
    var svg = document.createElementNS(window.hg.util.svgNamespace, 'svg');
    var symbol = document.createElementNS(window.hg.util.svgNamespace, 'symbol');
    var close = document.createElementNS(window.hg.util.svgNamespace, 'path');

    body.appendChild(svg);
    svg.appendChild(symbol);
    symbol.appendChild(close);

    svg.style.display = 'none';
    symbol.setAttribute('id', 'close');
    symbol.setAttribute('width', '40');
    symbol.setAttribute('height', '40');
    symbol.setAttribute('viewBox', '0 0 12.9 9.1');
    close.setAttribute('d', 'M1.8-1.9 0-0.1 4.6 4.6 0 9.2l1.8 1.8 4.6-4.6 4.6 4.6 1.8-1.8-4.6-4.6 4.6-4.6-1.8-1.8-4.6 4.6z');
    window.hg.util.addClass(close, 'close-path');
  }

  addCloseDefinition();

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
    pagePost.innerWrapperPaddingFromCss = Number.NaN;
    pagePost.center = {
      x: startCenter.x,
      y: startCenter.y
    };

    pagePost.loadCarouselMedia = loadCarouselMedia;
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

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this PagePost
   */
  function createElements() {
    var pagePost = this;

    var converter = new showdown.Converter();
    converter.setFlavor('github');

    var horizontalSideLength = window.hg.Grid.config.tileShortLengthWithGap *
        (window.hg.OpenPostJob.config.expandedDisplacementTileCount + 4.25);
    var verticalSideLength = window.hg.Grid.config.longGap *
        (window.hg.OpenPostJob.config.expandedDisplacementTileCount * 2) +
        window.hg.Grid.config.tileOuterRadius *
        (3 * window.hg.OpenPostJob.config.expandedDisplacementTileCount + 2);

    // Adjust post dimensions for smaller openings
    switch (window.hg.OpenPostJob.config.expandedDisplacementTileCount) {
      case 2:
        verticalSideLength += window.hg.Grid.config.tileOuterRadius;
        break;
      case 1:
        verticalSideLength += window.hg.Grid.config.tileOuterRadius * 3;
        horizontalSideLength -= window.hg.Grid.config.tileShortLengthWithGap;
        break;
      case 0:
        verticalSideLength += window.hg.Grid.config.tileOuterRadius * 4;
        horizontalSideLength -= window.hg.Grid.config.tileShortLengthWithGap;
        break;
      default:
        break;
    }

    var horizontalPadding = 1.4 * window.hg.Grid.config.tileShortLengthWithGap;
    var verticalPadding = 2.65 * window.hg.Grid.config.tileOuterRadius;

    var width, height, paddingX, paddingY, gradientColor1String,
      gradientColor2String, innerWrapperPaddingFromCss, innerWrapperVerticalPadding;

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

    paddingY += 32;

    width -= paddingX * 2;
    height -= paddingY * 2;

    // Mobile responsiveness.
    var closeButtonTop = NaN;
    if (height + paddingY * 2 > window.innerHeight) {
      paddingY = 100;
      height = window.innerHeight - paddingY * 2;
      closeButtonTop = 68;
    }
    if (window.hg.util.isSmallScreen()) {
      width = window.innerWidth;
      paddingX = 0;
    }

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
    var closeButton = document.createElement('a');
    var logo = document.createElement('div');
    var date = document.createElement('div');
    var location = document.createElement('div');
    var jobTitle = document.createElement('div');
    var urls = document.createElement('div');
    var categories = document.createElement('div');
    var topGradient = document.createElement('div');
    var bottomGradient = document.createElement('div');

    pagePost.tile.grid.parent.appendChild(container);
    container.appendChild(outerWrapper);
    outerWrapper.appendChild(innerWrapper);
    innerWrapper.appendChild(closeButton);
    innerWrapper.appendChild(logo);
    innerWrapper.appendChild(date);
    innerWrapper.appendChild(location);
    innerWrapper.appendChild(jobTitle);
    innerWrapper.appendChild(title);
    innerWrapper.appendChild(urls);
    innerWrapper.appendChild(content);
    innerWrapper.appendChild(categories);
    container.appendChild(topGradient);
    container.appendChild(bottomGradient);

    pagePost.elements = [];
    pagePost.elements.outerWrapper = outerWrapper;
    pagePost.elements.container = container;
    pagePost.elements.title = title;
    pagePost.elements.content = content;
    pagePost.elements.closeButton = closeButton;
    pagePost.elements.logo = logo;
    pagePost.elements.date = date;
    pagePost.elements.urls = urls;
    pagePost.elements.categories = categories;

    container.setAttribute('data-hg-post-container', 'data-hg-post-container');
    container.style.position = 'absolute';
    container.style.width = width + paddingX + 'px';
    container.style.height = height + paddingY * 2 + 'px';
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.overflow = 'hidden';
    container.style.zIndex = window.hg.controller.isSafariBrowser ? '1500' : '500';

    outerWrapper.setAttribute('data-hg-post-outer-wrapper', 'data-hg-post-outer-wrapper');
    outerWrapper.style.width = width + 'px';
    outerWrapper.style.height = height + paddingY * 2 + 'px';
    outerWrapper.style.margin = '0';
    outerWrapper.style.padding = '0 0 0 ' + paddingX + 'px';
    outerWrapper.style.overflow = 'auto';
    outerWrapper.style.webkitOverflowScrolling = 'touch';// This is important for scrolling on mobile devices

    innerWrapper.setAttribute('data-hg-post-inner-wrapper', 'data-hg-post-inner-wrapper');
    innerWrapperPaddingFromCss =
      parseInt(window.getComputedStyle(innerWrapper, null).getPropertyValue('padding-top'));
    innerWrapperVerticalPadding = innerWrapperPaddingFromCss + paddingY;
    innerWrapper.style.padding =
      innerWrapperVerticalPadding + 'px ' + innerWrapperPaddingFromCss + 'px ' +
      innerWrapperVerticalPadding + 'px ' + innerWrapperPaddingFromCss + 'px';
    innerWrapper.style.minHeight = height - innerWrapperPaddingFromCss * 2 + 'px';
    innerWrapper.style.overflowX = 'hidden';

    pagePost.innerWrapperPaddingFromCss = innerWrapperPaddingFromCss;

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

    content.setAttribute('data-hg-post-content', 'data-hg-post-content');
    content.innerHTML = converter.makeHtml(pagePost.tile.postData.content);

    closeButton.setAttribute('data-hg-post-close', 'data-hg-post-close');
    closeButton.setAttribute('href', '#');
    if (closeButtonTop) {
      closeButton.style.top = closeButtonTop + 'px';
    }
    closeButton.addEventListener('click', function () {
      // Close any open post
      var grid = pagePost.tile.grid;
      if (grid.isPostOpen) {
        window.hg.controller.transientJobs.ClosePostJob.create(grid, grid.expandedTile, false);
      }
    }, false);

    var closeButtonSvg = document.createElementNS(window.hg.util.svgNamespace, 'svg');
    var closeButtonUse = document.createElementNS(window.hg.util.svgNamespace, 'use');

    closeButton.appendChild(closeButtonSvg);
    closeButtonSvg.appendChild(closeButtonUse);

    closeButtonSvg.setAttribute('width', '40');
    closeButtonSvg.setAttribute('height', '40');
    closeButtonUse.setAttributeNS(window.hg.util.xlinkNamespace, 'xlink:href', '#close');

    logo.setAttribute('data-hg-post-logo', 'data-hg-post-logo');
    logo.style.backgroundImage = 'url(' + pagePost.tile.postData.logoSrc + ')';

    date.setAttribute('data-hg-post-date', 'data-hg-post-date');
    addDate.call(pagePost);

    location.setAttribute('data-hg-post-location', 'data-hg-post-location');
    location.innerHTML = pagePost.tile.postData.location;

    jobTitle.setAttribute('data-hg-post-job-title', 'data-hg-post-job-title');
    jobTitle.innerHTML = pagePost.tile.postData.jobTitle;

    urls.setAttribute('data-hg-post-urls', 'data-hg-post-urls');
    addUrls.call(pagePost);

    categories.setAttribute('data-hg-post-categories', 'data-hg-post-categories');
    addCategories.call(pagePost);

    // Create the Carousel and insert it before the post's main contents
    pagePost.carousel = new window.hg.Carousel(pagePost.tile.grid, pagePost, innerWrapper,
      pagePost.tile.postData.images, pagePost.tile.postData.videos, true);
    innerWrapper.removeChild(pagePost.carousel.elements.container);
    innerWrapper.insertBefore(pagePost.carousel.elements.container, urls);

    setTimeout(function () {
      // If the post ID in the URL hash matches the text of a header in the post content, then the
      // browser will automatically scroll downward to the header, which we want to prevent.
      if (pagePost.elements.outerWrapper) {
        pagePost.elements.outerWrapper.scrollTo(0, 0);
      }
    }, 10);

    draw.call(pagePost);
  }

  /**
   * @this PagePost
   */
  function addDate() {
    var pagePost = this;
    var dateElement = pagePost.elements.date;
    var dateValue = pagePost.tile.postData.date;

    // Date values can be given as a single string or as an object with a start and end property
    if (typeof dateValue === 'object') {
      dateElement.innerHTML = parseDateString(dateValue.start) + ' &ndash; ' + parseDateString(dateValue.end);
    } else {
      dateElement.innerHTML = parseDateString(dateValue);
    }

    // Hide the date panel if no date was given
    if (!pagePost.tile.postData.date) {
      dateElement.style.display = 'none';
    }

    // ---  --- //

    function parseDateString(dateString) {
      var dateParts;

      if (dateString.toLowerCase() === 'present') {
        return dateString;
      } else {
        dateParts = dateString.split('/');

        switch (dateParts.length) {
          case 1:
            return dateParts[0];
          case 2:
            return config.monthLabels[dateParts[0]] + ' ' + dateParts[1];
          case 3:
            return config.monthLabels[dateParts[0]] + ' ' + dateParts[1] + ', ' + dateParts[2];
          default:
            throw new Error('Invalid date string format: ' + dateString);
        }
      }
    }
  }

  /**
   * @this PagePost
   */
  function addUrls() {
    var pagePost = this;
    var urlsElement = pagePost.elements.urls;
    var urlKeys = Object.keys(pagePost.tile.postData.urls);

    urlKeys.forEach(function (key) {
      addUrl(key, pagePost.tile.postData.urls[key]);
    });

    // Hide the URLs panel if no URLs were given
    if (!urlKeys.length) {
      urlsElement.style.display = 'none';
    }

    // ---  --- //

    function addUrl(key, url) {
      var label, cleanedUrl, paragraphElement, linkElement;

      // Remove the protocol from the URL to make it more human-readable
      cleanedUrl = url.replace(/^.*:\/\//, '');

      label = config.urlLabels[key];

      if (!label) {
        console.warn('Unknown URL type: ' + key);
        label = key;
      }

      // --- Create the elements --- //

      paragraphElement = document.createElement('p');
      linkElement = document.createElement('a');

      paragraphElement.innerHTML = label + ': ';
      paragraphElement.style.overflow = 'hidden';
      paragraphElement.style.whiteSpace = 'nowrap';
      paragraphElement.style.textOverflow = 'ellipsis';

      linkElement.innerHTML = cleanedUrl;
      linkElement.setAttribute('href', url);

      paragraphElement.appendChild(linkElement);
      urlsElement.appendChild(paragraphElement);
    }
  }

  /**
   * @this PagePost
   */
  function addCategories() {
    var pagePost = this;
    var categoriesElement = pagePost.elements.categories;

    pagePost.tile.postData.categories.forEach(addCategoryCard);

    // Hide the categories panel if no categories were given
    if (!pagePost.tile.postData.categories.length) {
      categoriesElement.style.display = 'none';
    }

    // ---  --- //

    function addCategoryCard(category) {
      var categoryCard = document.createElement('span');
      categoriesElement.appendChild(categoryCard);

      categoryCard.setAttribute('data-hg-post-category-card', 'data-hg-post-category-card');
      categoryCard.style.display = 'inline-block';
      categoryCard.innerHTML = category;
    }
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

  console.log('PagePost module loaded');
})();
