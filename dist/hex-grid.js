'use strict';

/**
 * This module defines a singleton that helps coordinate the various components of the hex-grid
 * package.
 *
 * The controller singleton handles provides convenient helper functions for creating and staring
 * grids and animations. It stores these objects and updates them in response to various system
 * events--e.g., window resize.
 *
 * @module controller
 */
(function () {
  var controller = {},
      config = {};

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Creates a Grid object and registers it with the animator.
   *
   * @param {HTMLElement} parent
   * @param {Array.<Object>} tileData
   * @param {boolean} isVertical
   * @returns {number} The ID (actually index) of the new Grid.
   */
  function createNewHexGrid(parent, tileData, isVertical) {
    var grid, index, annotations, input;

    grid = new hg.Grid(parent, tileData, isVertical);
    controller.grids.push(grid);
    hg.animator.startJob(grid);
    index = controller.grids.length - 1;
    grid.index = index;

    createColorResetAnimation(index);
    createColorShiftAnimation(index);
    createColorWaveAnimation(index);
    createDisplacementWaveAnimation(index);

    annotations = grid.annotations;
    hg.animator.startJob(annotations);
    controller.annotations.push(annotations);

    input = new hg.Input(grid);
    controller.inputs.push(input);

    startRecurringAnimations(index);

    return index;
  }

  /**
   * Starts repeating any AnimationJobs that are configured to recur.
   *
   * @param {number} gridIndex
   */
  function startRecurringAnimations(gridIndex) {
    if (hg.HighlightHoverJob.config.isRecurring) {
      controller.toggleHighlightHoverJobRecurrence(
          gridIndex, true,
          hg.HighlightHoverJob.config.avgDelay,
          hg.HighlightHoverJob.config.delayDeviationRange);
    }

    if (hg.HighlightRadiateJob.config.isRecurring) {
      controller.toggleHighlightRadiateJobRecurrence(
          gridIndex, true,
          hg.HighlightRadiateJob.config.avgDelay,
          hg.HighlightRadiateJob.config.delayDeviationRange);
    }

    if (hg.LineJob.config.isRecurring) {
      controller.toggleRandomLineJobRecurrence(
          gridIndex, true,
          hg.LineJob.config.avgDelay,
          hg.LineJob.config.delayDeviationRange);
    }

    if (hg.LinesRadiateJob.config.isRecurring) {
      controller.toggleLinesRadiateJobRecurrence(
          gridIndex, true,
          hg.LinesRadiateJob.config.avgDelay,
          hg.LinesRadiateJob.config.delayDeviationRange);
    }
  }

  /**
   * Creates a new ColorResetJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createColorResetAnimation(gridIndex) {
    var job = new hg.ColorResetJob(controller.grids[gridIndex]);
    controller.colorResetJobs.push(job);
    restartColorResetAnimation(gridIndex);

    controller.grids[gridIndex].animations.colorResetAnimations =
        controller.grids[gridIndex].animations.colorResetAnimations || [];
    controller.grids[gridIndex].animations.colorResetAnimations.push(job);
  }

  /**
   * Creates a new ColorShiftJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createColorShiftAnimation(gridIndex) {
    var job = new hg.ColorShiftJob(controller.grids[gridIndex]);
    controller.colorShiftJobs.push(job);
    restartColorShiftAnimation(gridIndex);

    controller.grids[gridIndex].animations.colorShiftAnimations =
        controller.grids[gridIndex].animations.colorShiftAnimations || [];
    controller.grids[gridIndex].animations.colorShiftAnimations.push(job);
  }

  /**
   * Creates a new ColorWaveJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createColorWaveAnimation(gridIndex) {
    var job = new hg.ColorWaveJob(controller.grids[gridIndex]);
    controller.colorWaveJobs.push(job);
    restartColorWaveAnimation(gridIndex);

    controller.grids[gridIndex].animations.colorWaveAnimations =
        controller.grids[gridIndex].animations.colorWaveAnimations || [];
    controller.grids[gridIndex].animations.colorWaveAnimations.push(job);
  }

  /**
   * Creates a new DisplacementWaveJob with the grid at the given index.
   *
   * @param {number} gridIndex
   */
  function createDisplacementWaveAnimation(gridIndex) {
    var job = new hg.DisplacementWaveJob(controller.grids[gridIndex]);
    controller.displacementWaveJobs.push(job);
    restartDisplacementWaveAnimation(gridIndex);

    controller.grids[gridIndex].animations.displacementWaveAnimations =
        controller.grids[gridIndex].animations.displacementWaveAnimations || [];
    controller.grids[gridIndex].animations.displacementWaveAnimations.push(job);
  }

  /**
   * Restarts the ColorResetJob at the given index.
   *
   * @param {number} index
   */
  function restartColorResetAnimation(index) {
    var job = controller.colorResetJobs[index];

    if (!job.isComplete) {
      hg.animator.cancelJob(job);
    }

    job.init();
    hg.animator.startJob(job);
  }

  /**
   * Restarts the ColorShiftJob at the given index.
   *
   * @param {number} index
   */
  function restartColorShiftAnimation(index) {
    var job = controller.colorShiftJobs[index];

    if (!job.isComplete) {
      hg.animator.cancelJob(job);
    }

    job.init();
    hg.animator.startJob(job);
  }

  /**
   * Restarts the ColorWaveJob at the given index.
   *
   * @param {number} index
   */
  function restartColorWaveAnimation(index) {
    var job = controller.colorWaveJobs[index];

    if (!job.isComplete) {
      hg.animator.cancelJob(job);
    }

    job.init();
    hg.animator.startJob(job);
  }

  /**
   * Restarts the DisplacementWaveJob at the given index.
   *
   * @param {number} index
   */
  function restartDisplacementWaveAnimation(index) {
    var job = controller.displacementWaveJobs[index];

    if (!job.isComplete) {
      hg.animator.cancelJob(job);
    }

    job.init();
    hg.animator.startJob(job);
  }

  /**
   * Expands the Grid to show the post at the given tile index.
   *
   * @param {number} gridIndex
   * @param {Tile} tile
   */
  function openPost(gridIndex, tile) {
    var job, grid;

    grid = controller.grids[gridIndex];

    grid.animations.openPostAnimations = grid.animations.openPostAnimations || [];

    job = new hg.OpenPostJob(grid, tile, onComplete);
    controller.openPostJobs.push(job);
    hg.animator.startJob(job);

    function onComplete(job) {
      controller.grids[gridIndex].animations.openPostAnimations.splice(
          controller.grids[gridIndex].animations.openPostAnimations.indexOf(job), 1);
    }
  }

  /**
   * Creates a new LinesRadiateJob based off the tile at the given index.
   *
   * @param {number} gridIndex
   * @param {Tile} tile
   */
  function createLinesRadiateAnimation(gridIndex, tile) {
    var job, i, count, grid;

    grid = controller.grids[gridIndex];

    grid.animations.lineAnimations = grid.animations.lineAnimations || [];

    job = new hg.LinesRadiateJob(grid, tile, onComplete);
    controller.linesRadiateJobs.push(job);
    hg.animator.startJob(job);

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      grid.animations.lineAnimations.push(job.lineJobs[i]);
    }

    function onComplete(job) {
      controller.grids[gridIndex].animations.lineAnimations.splice(
          controller.grids[gridIndex].animations.lineAnimations.indexOf(job), 1);
    }
  }

  /**
   * Creates a new random LineJob.
   *
   * @param {number} gridIndex
   */
  function createRandomLineAnimation(gridIndex) {
    var job;

    controller.grids[gridIndex].animations.lineAnimations =
        controller.grids[gridIndex].animations.lineAnimations || [];

    job = hg.LineJob.createRandomLineJob(controller.grids[gridIndex],
        onComplete);
    controller.randomLineJobs.push(job);
    hg.animator.startJob(job);

    controller.grids[gridIndex].animations.lineAnimations.push(job);

    function onComplete() {
      controller.grids[gridIndex].animations.lineAnimations.splice(
          controller.grids[gridIndex].animations.lineAnimations.indexOf(job), 1);
    }
  }

  /**
   * Creates a new HighlightHoverJob based off the tile at the given index.
   *
   * @param {number} gridIndex
   * @param {Tile} tile
   */
  function createHighlightHoverAnimation(gridIndex, tile) {
    var job;

    controller.grids[gridIndex].animations.highlightHoverAnimations =
        controller.grids[gridIndex].animations.highlightHoverAnimations || [];

    job = new hg.HighlightHoverJob(tile, onComplete);
    controller.highlightHoverJobs.push(job);
    hg.animator.startJob(job);

    controller.grids[gridIndex].animations.highlightHoverAnimations.push(job);

    function onComplete() {
      controller.grids[gridIndex].animations.highlightHoverAnimations.splice(
          controller.grids[gridIndex].animations.highlightHoverAnimations.indexOf(job), 1);
    }
  }

  /**
   * Creates a new HighlightRadiateJob based off the tile at the given index.
   *
   * @param {number} gridIndex
   * @param {Tile} tile
   */
  function createHighlightRadiateAnimation(gridIndex, tile) {
    var job, grid, startPoint;

    grid = controller.grids[gridIndex];

    controller.grids[gridIndex].animations.highlightRadiateAnimations =
        controller.grids[gridIndex].animations.highlightRadiateAnimations || [];

    startPoint = {
      x: tile.originalCenterX,
      y: tile.originalCenterY
    };

    job = new hg.HighlightRadiateJob(startPoint, grid, onComplete);
    controller.highlightRadiateJobs.push(job);
    hg.animator.startJob(job);

    controller.grids[gridIndex].animations.highlightRadiateAnimations.push(job);

    function onComplete() {
      controller.grids[gridIndex].animations.highlightRadiateAnimations.splice(
          controller.grids[gridIndex].animations.highlightRadiateAnimations.indexOf(job), 1);
    }
  }

  /**
   * Creates a HighlightRadiateJob based off of a random tile.
   *
   * @param {number} gridIndex
   */
  function createRandomHighlightRadiateAnimation(gridIndex) {
    var tileIndex = parseInt(Math.random() * hg.controller.grids[gridIndex].tiles.length);
    createHighlightRadiateAnimation(gridIndex, hg.controller.grids[gridIndex].tiles[tileIndex]);
  }

  /**
   * Creates a HighlightHoverJob based off of a random tile.
   *
   * @param {number} gridIndex
   */
  function createRandomHighlightHoverAnimation(gridIndex) {
    var tileIndex = parseInt(Math.random() * hg.controller.grids[gridIndex].tiles.length);
    createHighlightHoverAnimation(gridIndex, hg.controller.grids[gridIndex].tiles[tileIndex]);
  }

  /**
   * Creates a LinesRadiateJob based off of a random tile.
   *
   * @param {number} gridIndex
   */
  function createRandomLinesRadiateAnimation(gridIndex) {
    var tileIndex = parseInt(Math.random() * hg.controller.grids[gridIndex].tiles.length);
    createLinesRadiateAnimation(gridIndex, hg.controller.grids[gridIndex].tiles[tileIndex]);
  }

  /**
   * Toggles whether an AnimationJob is automatically repeated.
   *
   * @param {Function} jobCreator
   * @param {Array.<number>} jobTimeouts
   * @param {number} gridIndex
   * @param {boolean} isRecurring
   * @param {number} avgDelay
   * @param {number} delayDeviationRange
   */
  function toggleJobRecurrence(jobCreator, jobTimeouts, gridIndex, isRecurring, avgDelay,
                               delayDeviationRange) {
    var minDelay, maxDelay, actualDelayRange;

    // Compute the delay deviation range
    minDelay = avgDelay - delayDeviationRange * 0.5;
    minDelay = minDelay > 0 ? minDelay : 1;
    maxDelay = avgDelay + delayDeviationRange * 0.5;
    actualDelayRange = maxDelay - minDelay;

    // Stop any pre-existing recurrence
    if (jobTimeouts[gridIndex]) {
      clearTimeout(jobTimeouts[gridIndex]);
      jobTimeouts[gridIndex] = null;
    }

    // Should we start the recurrence?
    if (isRecurring) {
      jobTimeouts[gridIndex] = setTimeout(recur, avgDelay);
    }

    /**
     * Creates a new occurrence of the AnimationJob and starts a new timeout to repeat this.
     */
    function recur() {
      var delay = Math.random() * actualDelayRange + minDelay;
      jobCreator(gridIndex);
      jobTimeouts[gridIndex] = setTimeout(recur, delay);
    }
  }

  /**
   * Event listener for the window resize event.
   *
   * Resizes all of the hex-grid components.
   */
  function resize() {
    controller.grids.forEach(function (grid, index) {
      hg.animator.cancelAll();
      grid.resize();
      restartColorResetAnimation(index);
      restartColorShiftAnimation(index);
      restartColorWaveAnimation(index);
      restartDisplacementWaveAnimation(index);
      hg.animator.startJob(grid);
      hg.animator.startJob(controller.annotations[index]);
    });
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  controller.grids = [];
  controller.inputs = [];
  controller.annotations = [];
  controller.colorResetJobs = [];
  controller.colorShiftJobs = [];
  controller.displacementWaveJobs = [];
  controller.colorWaveJobs = [];
  controller.openPostJobs = [];
  controller.linesRadiateJobs = [];
  controller.randomLineJobs = [];
  controller.highlightHoverJobs = [];
  controller.highlightRadiateJobs = [];

  controller.highlightHoverRecurrenceTimeouts = [];
  controller.highlightRadiateRecurrenceTimeouts = [];
  controller.linesRadiateRecurrenceTimeouts = [];
  controller.randomLineRecurrenceTimeouts = [];

  controller.config = config;

  controller.createNewHexGrid = createNewHexGrid;
  controller.restartColorShiftAnimation = restartColorShiftAnimation;
  controller.restartColorWaveAnimation = restartColorWaveAnimation;
  controller.restartDisplacementWaveAnimation = restartDisplacementWaveAnimation;
  controller.openPost = openPost;
  controller.createLinesRadiateAnimation = createLinesRadiateAnimation;
  controller.createRandomLineAnimation = createRandomLineAnimation;
  controller.createHighlightHoverAnimation = createHighlightHoverAnimation;
  controller.createHighlightRadiateAnimation = createHighlightRadiateAnimation;
  controller.createRandomHighlightRadiateAnimation = createRandomHighlightRadiateAnimation;
  controller.createRandomHighlightHoverAnimation = createRandomHighlightHoverAnimation;
  controller.createRandomLinesRadiateAnimation = createRandomLinesRadiateAnimation;

  controller.toggleHighlightHoverJobRecurrence =
      toggleJobRecurrence.bind(controller, createRandomHighlightHoverAnimation,
          controller.highlightHoverRecurrenceTimeouts);
  controller.toggleHighlightRadiateJobRecurrence =
      toggleJobRecurrence.bind(controller, createRandomHighlightRadiateAnimation,
          controller.highlightRadiateRecurrenceTimeouts);
  controller.toggleLinesRadiateJobRecurrence =
      toggleJobRecurrence.bind(controller, createRandomLinesRadiateAnimation,
          controller.linesRadiateRecurrenceTimeouts);
  controller.toggleRandomLineJobRecurrence =
      toggleJobRecurrence.bind(controller, createRandomLineAnimation,
          controller.randomLineRecurrenceTimeouts);
  controller.resize = resize;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.controller = controller;

  window.addEventListener('resize', resize, false);

  console.log('controller module loaded');
})();

'use strict';

/**
 * This module defines a collection of static general utility functions.
 *
 * @module util
 */
(function () {
  /**
   * Adds an event listener for each of the given events to each of the given elements.
   *
   * @param {Array.<HTMLElement>} elements The elements to add event listeners to.
   * @param {Array.<String>} events The event listeners to add to the elements.
   * @param {Function} callback The single callback for handling the events.
   */
  function listenToMultipleForMultiple(elements, events, callback) {
    elements.forEach(function (element) {
      events.forEach(function (event) {
        util.listen(element, event, callback);
      });
    });
  }

  /**
   * Creates a DOM element with the given tag name, appends it to the given parent element, and
   * gives it the given id and classes.
   *
   * @param {String} tagName The tag name to give the new element.
   * @param {HTMLElement} [parent] The parent element to append the new element to.
   * @param {String} [id] The id to give the new element.
   * @param {Array.<String>} [classes] The classes to give the new element.
   * @returns {HTMLElement} The new element.
   */
  function createElement(tagName, parent, id, classes) {
    var element = document.createElement(tagName);
    if (parent) {
      parent.appendChild(element);
    }
    if (id) {
      element.id = id;
    }
    if (classes) {
      classes.forEach(function (className) {
        addClass(element, className)
      });
    }
    return element;
  }

  /**
   * Determines whether the given element contains the given class.
   *
   * @param {HTMLElement} element The element to check.
   * @param {String} className The class to check for.
   * @returns {Boolean} True if the element does contain the class.
   */
  function containsClass(element, className) {
    var startIndex, indexAfterEnd;
    startIndex = element.className.indexOf(className);
    if (startIndex >= 0) {
      if (startIndex === 0 || element.className[startIndex - 1] === ' ') {
        indexAfterEnd = startIndex + className.length;
        if (indexAfterEnd === element.className.length ||
            element.className[indexAfterEnd] === ' ') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Toggles whether the given element has the given class. If the enabled argument is given, then
   * the inclusion of the class will be forced. That is, if enabled=true, then this will ensure the
   * element has the class; if enabled=false, then this will ensure the element does NOT have the
   * class; if enabled=undefined, then this will simply toggle whether the element has the class.
   *
   * @param {HTMLElement} element The element to add the class to or remove the class from.
   * @param {String} className The class to add or remove.
   * @param {Boolean} [enabled] If given, then the inclusion of the class will be forced.
   */
  function toggleClass(element, className, enabled) {
    if (typeof enabled === 'undefined') {
      if (containsClass(element, className)) {
        removeClass(element, className);
      } else {
        addClass(element, className);
      }
    } else if (enabled) {
      addClass(element, className);
    } else {
      removeClass(element, className);
    }
  }

  /**
   * Gets the coordinates of the element relative to the top-left corner of the page.
   *
   * @param {HTMLElement} element The element to get the coordinates of.
   * @returns {{x: Number, y: Number}} The coordinates of the element relative to the top-left
   * corner of the page.
   */
  function getPageOffset(element) {
    var x = 0, y = 0;
    while (element) {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    }
    x -= util.getScrollLeft();
    y -= util.getScrollTop();
    return { x: x, y: y };
  }

  /**
   * Gets the dimensions of the viewport.
   *
   * @returns {{w: Number, h: Number}} The dimensions of the viewport.
   */
  function getViewportSize() {
    var w, h;
    if (typeof window.innerWidth !== 'undefined') {
      // Good browsers
      w = window.innerWidth;
      h = window.innerHeight;
    } else if (typeof document.documentElement !== 'undefined' &&
        typeof document.documentElement.clientWidth !== 'undefined' &&
        document.documentElement.clientWidth !== 0) {
      // IE6 in standards compliant mode
      w = document.documentElement.clientWidth;
      h = document.documentElement.clientHeight;
    } else {
      // Older versions of IE
      w = document.getElementsByTagName('body')[0].clientWidth;
      h = document.getElementsByTagName('body')[0].clientHeight;
    }
    return { w: w, h: h };
  }

  /**
   * Removes the given child element from the given parent element if the child does indeed belong
   * to the parent.
   *
   * @param {HTMLElement} parent The parent to remove the child from.
   * @param {HTMLElement} child The child to remove.
   * @returns {Boolean} True if the child did indeed belong to the parent.
   */
  function removeChildIfPresent(parent, child) {
    if (child && child.parentNode === parent) {
      parent.removeChild(child);
      return true;
    }
    return false
  }

  /**
   * Adds the given class to the given element.
   *
   * @param {HTMLElement} element The element to add the class to.
   * @param {String} className The class to add.
   */
  function addClass(element, className) {
    element.className += ' ' + className;
  }

  /**
   * Removes the given class from the given element.
   *
   * @param {HTMLElement} element The element to remove the class from.
   * @param {String} className The class to remove.
   */
  function removeClass(element, className) {
    element.className = element.className.split(' ').filter(function (value) {
      return value !== className;
    }).join(' ');
  }

  /**
   * Removes all classes from the given element.
   *
   * @param {HTMLElement} element The element to remove all classes from.
   */
  function clearClasses(element) {
    element.className = '';
  }

  /**
   * Calculates the width that the DOM would give to a div with the given text. The given tag
   * name, parent, id, and classes allow the width to be affected by various CSS rules.
   *
   * @param {String} text The text to determine the width of.
   * @param {String} tagName The tag name this text would supposedly have.
   * @param {HTMLElement} [parent] The parent this text would supposedly be a child of; defaults
   * to the document body.
   * @param {String} [id] The id this text would supposedly have.
   * @param {Array.<String>} [classes] The classes this text would supposedly have.
   * @returns {Number} The width of the text under these conditions.
   */
  function getTextWidth(text, tagName, parent, id, classes) {
    var tmpElement, width;
    parent = parent || document.getElementsByTagName('body')[0];
    tmpElement = util.createElement(tagName, null, id, classes);
    tmpElement.style.position = 'absolute';
    tmpElement.style.visibility = 'hidden';
    tmpElement.style.whiteSpace = 'nowrap';
    parent.appendChild(tmpElement);
    tmpElement.innerHTML = text;
    width = tmpElement.clientWidth;
    parent.removeChild(tmpElement);
    return width;
  }

  /**
   * Encodes and concatenates the given URL parameters into a single query string.
   *
   * @param {Object} rawParams An object whose properties represent the URL query string
   * parameters.
   * @return {String} The query string.
   */
  function encodeQueryString(rawParams) {
    var parameter, encodedParams;
    encodedParams = [];
    for (parameter in rawParams) {
      if (rawParams.hasOwnProperty(parameter)) {
        encodedParams.push(encodeURIComponent(parameter) + '=' +
            encodeURIComponent(rawParams[parameter]));
      }
    }
    return '?' + encodedParams.join('&');
  }

  /**
   * Retrieves the value corresponding to the given name from the given query string.
   *
   * (borrowed from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript)
   *
   * @param {String} queryString The query string containing the parameter.
   * @param {String} name The (non-encoded) name of the parameter value to retrieve.
   * @returns {string} The query string parameter value, or null if the parameter was not found.
   */
  function getQueryStringParameterValue(queryString, name) {
    var regex, results;
    name = encodeURIComponent(name);
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    regex = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i');
    results = regex.exec(queryString);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  /**
   * Sets the CSS transition duration style of the given element.
   *
   * @param {HTMLElement} element The element.
   * @param {Number} value The duration.
   */
  function setTransitionDurationSeconds(element, value) {
    element.style.transitionDuration = value + 's';
    element.style.WebkitTransitionDuration = value + 's';
    element.style.MozTransitionDuration = value + 's';
    element.style.msTransitionDuration = value + 's';
    element.style.OTransitionDuration = value + 's';
  }

  /**
   * Sets the CSS transition delay style of the given element.
   *
   * @param {HTMLElement} element The element.
   * @param {Number} value The delay.
   */
  function setTransitionDelaySeconds(element, value) {
    element.style.transitionDelay = value + 's';
    element.style.WebkitTransitionDelay = value + 's';
    element.style.MozTransitionDelay = value + 's';
    element.style.msTransitionDelay = value + 's';
    element.style.OTransitionDelay = value + 's';
  }

  /**
   * Removes any children elements from the given parent that have the given class.
   *
   * @param {HTMLElement} parent The parent to remove children from.
   * @param {String} className The class to match.
   */
  function removeChildrenWithClass(parent, className) {
    var matchingChildren, i, count;

    matchingChildren = parent.querySelectorAll('.' + className);

    for (i = 0, count = matchingChildren.length; i < count; i++) {
      parent.removeChild(matchingChildren[i]);
    }
  }

  /**
   * Sets the CSS transition-timing-function style of the given element with the given cubic-
   * bezier points.
   *
   * @param {HTMLElement} element The element.
   * @param {{p1x: Number, p1y: Number, p2x: Number, p2y: Number}} bezierPts The cubic-bezier
   * points to use for this timing function.
   */
  function setTransitionCubicBezierTimingFunction(element, bezierPts) {
    var value = 'cubic-bezier(' + bezierPts.p1x + ',' + bezierPts.p1y + ',' + bezierPts.p2x + ',' +
        bezierPts.p2y + ')';
    element.style.transitionTimingFunction = value;
    element.style.WebkitTransitionTimingFunction = value;
    element.style.MozTransitionTimingFunction = value;
    element.style.msTransitionTimingFunction = value;
    element.style.OTransitionTimingFunction = value;
  }

  // A collection of different types of easing functions.
  var easingFunctions = {
    linear: function (t) {
      return t;
    },
    easeInQuad: function (t) {
      return t * t;
    },
    easeOutQuad: function (t) {
      return t * (2 - t);
    },
    easeInOutQuad: function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function (t) {
      return t * t * t;
    },
    easeOutCubic: function (t) {
      return 1 + --t * t * t;
    },
    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: function (t) {
      return t * t * t * t;
    },
    easeOutQuart: function (t) {
      return 1 - --t * t * t * t;
    },
    easeInOutQuart: function (t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint: function (t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function (t) {
      return 1 + --t * t * t * t * t;
    },
    easeInOutQuint: function (t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  // A collection of the inverses of different types of easing functions.
  var inverseEasingFunctions = {
    linear: function (t) {
      return t;
    },
    easeInQuad: function (t) {
      return Math.sqrt(t);
    },
    easeOutQuad: function (t) {
      return 1 - Math.sqrt(1 - t);
    },
    easeInOutQuad: function (t) {
      return t < 0.5 ? Math.sqrt(t * 0.5) : 1 - 0.70710678 * Math.sqrt(1 - t);
    }
  };

  /**
   * A cross-browser compatible requestAnimationFrame. From
   * https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
   *
   * @type {Function}
   */
  var requestAnimationFrame =
      (window.requestAnimationFrame || // the standard
      window.webkitRequestAnimationFrame || // chrome/safari
      window.mozRequestAnimationFrame || // firefox
      window.oRequestAnimationFrame || // opera
      window.msRequestAnimationFrame || // ie
      function (callback) { // default
        window.setTimeout(callback, 16); // 60fps
      }).bind(window);

  /**
   * Calculates the x and y coordinates represented by the given Bezier curve at the given
   * percentage.
   *
   * @param {number} percent Expressed as a number between 0 and 1.
   * @param {Array.<{x: number, y: number}>} controlPoints
   * @returns {{x: number, y: number}}
   */
  function getXYFromPercentWithBezier(percent, controlPoints) {
    var x, y, oneMinusPercent, tmp1, tmp2, tmp3, tmp4;

    oneMinusPercent = 1 - percent;
    tmp1 = oneMinusPercent * oneMinusPercent * oneMinusPercent;
    tmp2 = 3 * percent * oneMinusPercent * oneMinusPercent;
    tmp3 = 3 * percent * percent * oneMinusPercent;
    tmp4 = percent * percent * percent;

    x = controlPoints[0].x * tmp1 +
        controlPoints[1].x * tmp2 +
        controlPoints[2].x * tmp3 +
        controlPoints[3].x * tmp4;
    y = controlPoints[0].y * tmp1 +
        controlPoints[1].y * tmp2 +
        controlPoints[2].y * tmp3 +
        controlPoints[3].y * tmp4;

    return {x: x, y: y};
  }

  /**
   * Applies the given transform to the given element as a CSS style in a cross-browser compatible
   * manner.
   *
   * @param {HTMLElement} element
   * @param {string} transform
   */
  function applyTransform(element, transform) {
    element.style.webkitTransform = transform;
    element.style.MozTransform = transform;
    element.style.msTransform = transform;
    element.style.OTransform = transform;
    element.style.transform = transform;
  }

  /**
   * Returns a copy of the given array with its contents re-arranged in a random order.
   *
   * The original array is left in its original order.
   *
   * @param {Array} array
   * @returns {Array}
   */
  function shuffle(array) {
    var i, j, count, temp;

    for (i = 0, count = array.length; i < count; i += 1) {
      j = parseInt(Math.random() * count);
      temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }

    return array;
  }

  /**
   * Return true if the given point would be located within the given polyline if its two ends
   * were connected.
   *
   * If the given boolean is true, then the given polyline is interpreted as being a polygon--i.e.
   * the first and last points are equivalent.
   *
   * This is an implementation of the even-odd rule algorithm.
   *
   * @param {number} pointX
   * @param {number} pointY
   * @param {Array.<number>} coordinates
   * @param {boolean} isClosed
   */
  function isPointInsidePolyline(pointX, pointY, coordinates, isClosed) {
    var pointIsInside, i, count, p1X, p1Y, p2X, p2Y, previousX, previousY, currentX, currentY;

    pointIsInside = false;

    if (isClosed) {
      // There is no area within a straight line
      if (coordinates.length < 6) {
        return pointIsInside;
      }

      previousX = coordinates[coordinates.length - 4];
      previousY = coordinates[coordinates.length - 3];
    } else {
      // There is no area within a straight line
      if (coordinates.length < 4) {
        return pointIsInside;
      }

      previousX = coordinates[coordinates.length - 2];
      previousY = coordinates[coordinates.length - 1];
    }

    for (i = 0, count = coordinates.length - 2; i < count; i += 2) {
      currentX = coordinates[i];
      currentY = coordinates[i + 1];

      if (currentX > previousX) {
        p1X = previousX;
        p1Y = previousY;
        p2X = currentX;
        p2Y = currentY;
      } else {
        p1X = currentX;
        p1Y = currentY;
        p2X = previousX;
        p2Y = previousY;
      }

      if ((currentX < pointX) === (pointX <= previousX) &&
          (pointY - p1Y) * (p2X - p1X) < (p2Y - p1Y) * (pointX - p1X)) {
        pointIsInside = !pointIsInside;
      }

      previousX = currentX;
      previousY = currentY;
    }

    return pointIsInside;
  }

  /**
   * Performs a shallow copy of the given object.
   *
   * @param {Object} object
   * @returns {Object}
   */
  function shallowCopy(object) {
    var key, cloneObject;

    cloneObject = {};

    for (key in object) {
      cloneObject[key] = object[key];
    }

    return cloneObject;
  }

  /**
   * Converts the given HSL color values to HSV color values.
   *
   * @param {{h:number,s:number,l:number}} hsl
   * @returns {{h:number,s:number,v:number}}
   */
  function hslToHsv(hsl) {
    var temp = hsl.s * (hsl.l < 0.5 ? hsl.l : 1 - hsl.l);
    return {
      h: hsl.h,
      s: 2 * temp / (hsl.l + temp),
      v: hsl.l + temp
    };
  }

  /**
   * Converts the given HSV color values to HSL color values.
   *
   * @param {{h:number,s:number,v:number}} hsv
   * @returns {{h:number,s:number,l:number}}
   */
  function hsvToHsl(hsv) {
    var temp = (2 - hsv.s) * hsv.v;
    return {
      h: hsv.h,
      s: hsv.s * hsv.v / (temp < 1 ? temp : 2.00000001 - temp),
      l: temp * 0.5
    };
  }

  /**
   * Checks the given element and all of its ancestors, and returns the first that contains the
   * given class.
   *
   * @param {?HTMLElement} element
   * @param {string} className
   * @returns {?HTMLElement}
   */
  function findClassInSelfOrAncestors(element, className) {
    while (element) {
      if (element.classList.contains(className)) {
        return element;
      }
    }

    return null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module

  /**
   * Exposes the static util functions.
   *
   * @global
   */
  var util = {
    listenToMultipleForMultiple: listenToMultipleForMultiple,
    createElement: createElement,
    containsClass: containsClass,
    toggleClass: toggleClass,
    getPageOffset: getPageOffset,
    getViewportSize: getViewportSize,
    removeChildIfPresent: removeChildIfPresent,
    addClass: addClass,
    removeClass: removeClass,
    clearClasses: clearClasses,
    getTextWidth: getTextWidth,
    encodeQueryString: encodeQueryString,
    getQueryStringParameterValue: getQueryStringParameterValue,
    setTransitionDurationSeconds: setTransitionDurationSeconds,
    setTransitionDelaySeconds: setTransitionDelaySeconds,
    removeChildrenWithClass: removeChildrenWithClass,
    setTransitionCubicBezierTimingFunction: setTransitionCubicBezierTimingFunction,
    easingFunctions: easingFunctions,
    inverseEasingFunctions: inverseEasingFunctions,
    requestAnimationFrame: requestAnimationFrame,
    getXYFromPercentWithBezier: getXYFromPercentWithBezier,
    applyTransform: applyTransform,
    shuffle: shuffle,
    isPointInsidePolyline: isPointInsidePolyline,
    shallowCopy: shallowCopy,
    hsvToHsl: hsvToHsl,
    hslToHsv: hslToHsv,
    findClassInSelfOrAncestors: findClassInSelfOrAncestors,
    svgNamespace: 'http://www.w3.org/2000/svg'
  };

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.util = util;

  console.log('util module loaded');
})();

'use strict';

/**
 * This module defines a singleton for animating things.
 *
 * The animator singleton handles the animation loop for the application and updates all
 * registered AnimationJobs during each animation frame.
 *
 * @module animator
 */
(function () {
  /**
   * @typedef {{start: Function, update: Function(number, number), draw: Function, cancel: Function, isComplete: boolean}} AnimationJob
   */

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var animator = {};
  var config = {};

  config.deltaTimeUpperThreshold = 200;

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * This is the animation loop that drives all of the animation.
   */
  function animationLoop() {
    var currentTime, deltaTime;

    currentTime = Date.now();
    deltaTime = currentTime - animator.previousTime;
    deltaTime = deltaTime > config.deltaTimeUpperThreshold ?
        config.deltaTimeUpperThreshold : deltaTime;
    animator.isLooping = true;

    if (!animator.isPaused) {
      updateJobs(currentTime, deltaTime);
      drawJobs();
      hg.util.requestAnimationFrame(animationLoop);
    } else {
      animator.isLooping = false;
    }

    animator.previousTime = currentTime;
  }

  /**
   * Updates all of the active AnimationJobs.
   *
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function updateJobs(currentTime, deltaTime) {
    var i, count;

    for (i = 0, count = animator.jobs.length; i < count; i += 1) {
      animator.jobs[i].update(currentTime, deltaTime);

      // Remove jobs from the list after they are complete
      if (animator.jobs[i].isComplete) {
        removeJob(animator.jobs[i], i);
        i--;
        count--;
      }
    }
  }

  /**
   * Removes the given job from the collection of active, animating jobs.
   *
   * @param {AnimationJob} job
   * @param {number} [index]
   */
  function removeJob(job, index) {
    var count;

    if (typeof index === 'number') {
      animator.jobs.splice(index, 1);
    } else {
      for (index = 0, count = animator.jobs.length; index < count; index += 1) {
        if (animator.jobs[index] === job) {
          animator.jobs.splice(index, 1);
          break;
        }
      }
    }

    // Stop the animation loop when there are no more jobs to animate
    if (animator.jobs.length === 0) {
      animator.isPaused = true;
    }
  }

  /**
   * Draws all of the active AnimationJobs.
   */
  function drawJobs() {
    var i, count;

    for (i = 0, count = animator.jobs.length; i < count; i += 1) {
      animator.jobs[i].draw();
    }
  }

  /**
   * Starts the animation loop if it is not already running
   */
  function startAnimationLoop() {
    animator.isPaused = false;
    if (!animator.isLooping) {
      animator.previousTime = Date.now();
      animationLoop();
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Starts the given AnimationJob.
   *
   * @param {AnimationJob} job
   */
  function startJob(job) {
//    console.log('Job starting: ' + job.constructor.name);

    job.start();
    animator.jobs.push(job);

    startAnimationLoop();
  }

  /**
   * Cancels the given AnimationJob.
   *
   * @param {AnimationJob} job
   */
  function cancelJob(job) {
    console.log('Job cancelling: ' + job.constructor.name);

    job.cancel();
    removeJob(job);
  }

  /**
   * Cancels all running AnimationJobs.
   */
  function cancelAll() {
    while (animator.jobs.length) {
      cancelJob(animator.jobs[0]);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  animator.jobs = [];
  animator.previousTime = Date.now();
  animator.isLooping = false;
  animator.isPaused = true;
  animator.startJob = startJob;
  animator.cancelJob = cancelJob;
  animator.cancelAll = cancelAll;

  animator.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.animator = animator;

  console.log('animator module loaded');
})();

'use strict';

/**
 * @typedef {AnimationJob} Annotations
 */

/**
 * This module defines a constructor for Annotations objects.
 *
 * Annotations objects creates and modifies visual representations of various aspects of a
 * Grid. This can be very useful for testing purposes.
 *
 * @module Annotations
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.forceLineLengthMultiplier = 4000;
  config.velocityLineLengthMultiplier = 300;

  config.contentTileHue = 187;
  config.contentTileSaturation = 50;
  config.contentTileLightness = 30;

  config.borderTileHue = 267;
  config.borderTileSaturation = 0;
  config.borderTileLightness = 30;

  config.cornerTileHue = 267;
  config.cornerTileSaturation = 50;
  config.cornerTileLightness = 30;

  config.annotations = {
    'contentTiles': {
      enabled: false,
      create: fillContentTiles,
      destroy: unfillContentTiles,
      update: function () {/* Do nothing */}
    },
    'borderTiles': {
      enabled: false,
      create: fillBorderTiles,
      destroy: unfillBorderTiles,
      update: function () {/* Do nothing */}
    },
    'cornerTiles': {
      enabled: false,
      create: fillCornerTiles,
      destroy: unfillCornerTiles,
      update: function () {/* Do nothing */}
    },
    'transparentTiles': {
      enabled: false,
      create: makeTilesTransparent,
      destroy: makeTilesVisible,
      update: function () {/* Do nothing */}
    },
    'tileAnchorCenters': {
      enabled: false,
      create: createTileAnchorCenters,
      destroy: destroyTileAnchorCenters,
      update: updateTileAnchorCenters
    },
    'tileParticleCenters': {
      enabled: false,
      create: createTileParticleCenters,
      destroy: destroyTileParticleCenters,
      update: updateTileParticleCenters
    },
    'tileDisplacementColors': {
      enabled: false,
      create: createTileDisplacementColors,
      destroy: destroyTileDisplacementColors,
      update: updateTileDisplacementColors
    },
    'tileInnerRadii': {
      enabled: false,
      create: createTileInnerRadii,
      destroy: destroyTileInnerRadii,
      update: updateTileInnerRadii
    },
    'tileOuterRadii': {
      enabled: false,
      create: createTileOuterRadii,
      destroy: destroyTileOuterRadii,
      update: updateTileOuterRadii
    },
    'tileIndices': {
      enabled: true,
      create: createTileIndices,
      destroy: destroyTileIndices,
      update: updateTileIndices
    },
    'tileForces': {
      enabled: false,
      create: createTileForces,
      destroy: destroyTileForces,
      update: updateTileForces
    },
    'tileVelocities': {
      enabled: false,
      create: createTileVelocities,
      destroy: destroyTileVelocities,
      update: updateTileVelocities
    },
    'tileNeighborConnections': {
      enabled: true,
      create: createTileNeighborConnections,
      destroy: destroyTileNeighborConnections,
      update: updateTileNeighborConnections
    },
    'contentAreaGuidelines': {
      enabled: false,
      create: drawContentAreaGuideLines,
      destroy: removeContentAreaGuideLines,
      update:  function () {/* Do nothing */}
    },
    'lineAnimationGapPoints': {
      enabled: false,
      create: function () {/* Do nothing */},
      destroy: destroyLineAnimationGapPoints,
      update:  updateLineAnimationGapPoints
    },
    'lineAnimationCornerData': {
      enabled: false,
      create: function () {/* Do nothing */},
      destroy: destroyLineAnimationCornerConfigurations,
      update:  updateLineAnimationCornerConfigurations
    },
    'sectorColors': {
      enabled: true,
      create: createSectorColors,
      destroy: destroySectorColors,
      update: function () {/* Do nothing */}
    }
  };

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // --------------------------------------------------- //
  // Annotation creation functions

  /**
   * Draws content tiles with a different color.
   *
   * @this Annotations
   */
  function fillContentTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      if (annotations.grid.tiles[i].holdsContent) {
        annotations.grid.tiles[i].setColor(config.contentTileHue, config.contentTileSaturation,
            config.contentTileLightness);
      }
    }
  }

  /**
   * Draws border tiles with a different color.
   *
   * @this Annotations
   */
  function fillBorderTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.borderTiles.length; i < count; i += 1) {
      annotations.grid.borderTiles[i].setColor(config.borderTileHue, config.borderTileSaturation,
          config.borderTileLightness);
    }
  }

  /**
   * Draws corner tiles with a different color.
   *
   * @this Annotations
   */
  function fillCornerTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.borderTiles.length; i < count; i += 1) {
      if (annotations.grid.borderTiles[i].isCornerTile) {
        annotations.grid.borderTiles[i].setColor(config.cornerTileHue,
            config.cornerTileSaturation, config.cornerTileLightness);
      }
    }
  }

  /**
   * Draws all of the tiles as transparent.
   *
   * @this Annotations
   */
  function makeTilesTransparent() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.grid.tiles[i].element.setAttribute('opacity', '0');
    }
  }

  /**
   * Draws vertical guidelines along the left and right sides of the main content area.
   *
   * @this Annotations
   */
  function drawContentAreaGuideLines() {
    var annotations, line;

    annotations = this;
    annotations.contentAreaGuideLines = [];

    line = document.createElementNS(hg.util.svgNamespace, 'line');
    annotations.grid.svg.appendChild(line);
    annotations.contentAreaGuideLines[0] = line;

    line.setAttribute('x1', annotations.grid.contentAreaLeft);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', annotations.grid.contentAreaLeft);
    line.setAttribute('y2', annotations.grid.height);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');

    line = document.createElementNS(hg.util.svgNamespace, 'line');
    annotations.grid.svg.appendChild(line);
    annotations.contentAreaGuideLines[1] = line;

    line.setAttribute('x1', annotations.grid.contentAreaRight);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', annotations.grid.contentAreaRight);
    line.setAttribute('y2', annotations.grid.height);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');
  }

  /**
   * Creates a dot at the center of each tile at its current position.
   *
   * @this Annotations
   */
  function createTileParticleCenters() {
    var annotations, i, count;

    annotations = this;
    annotations.tileParticleCenters = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileParticleCenters[i] = document.createElementNS(hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileParticleCenters[i]);

      annotations.tileParticleCenters[i].setAttribute('r', '4');
      annotations.tileParticleCenters[i].setAttribute('fill', 'gray');
    }
  }

  /**
   * Creates a dot at the center of each tile at its anchor position.
   *
   * @this Annotations
   */
  function createTileAnchorCenters() {
    var annotations, i, count;

    annotations = this;
    annotations.tileAnchorLines = [];
    annotations.tileAnchorCenters = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileAnchorLines[i] = document.createElementNS(hg.util.svgNamespace, 'line');
      annotations.grid.svg.appendChild(annotations.tileAnchorLines[i]);

      annotations.tileAnchorLines[i].setAttribute('stroke', '#666666');
      annotations.tileAnchorLines[i].setAttribute('stroke-width', '2');

      annotations.tileAnchorCenters[i] = document.createElementNS(hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileAnchorCenters[i]);

      annotations.tileAnchorCenters[i].setAttribute('r', '4');
      annotations.tileAnchorCenters[i].setAttribute('fill', '#888888');
    }
  }

  /**
   * Creates a circle over each tile at its anchor position, which will be used to show colors
   * that indicate its displacement from its original position.
   *
   * @this Annotations
   */
  function createTileDisplacementColors() {
    var annotations, i, count;

    annotations = this;
    annotations.tileDisplacementCircles = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileDisplacementCircles[i] = document.createElementNS(hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileDisplacementCircles[i]);

      annotations.tileDisplacementCircles[i].setAttribute('r', '80');
      annotations.tileDisplacementCircles[i].setAttribute('opacity', '0.4');
      annotations.tileDisplacementCircles[i].setAttribute('fill', 'white');
    }
  }

  /**
   * Creates the inner radius of each tile.
   *
   * @this Annotations
   */
  function createTileInnerRadii() {
    var annotations, i, count;

    annotations = this;
    annotations.tileInnerRadii = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileInnerRadii[i] = document.createElementNS(hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileInnerRadii[i]);

      annotations.tileInnerRadii[i].setAttribute('stroke', 'blue');
      annotations.tileInnerRadii[i].setAttribute('stroke-width', '1');
      annotations.tileInnerRadii[i].setAttribute('fill', 'transparent');
    }
  }

  /**
   * Creates the outer radius of each tile.
   *
   * @this Annotations
   */
  function createTileOuterRadii() {
    var annotations, i, count;

    annotations = this;
    annotations.tileOuterRadii = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileOuterRadii[i] = document.createElementNS(hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileOuterRadii[i]);

      annotations.tileOuterRadii[i].setAttribute('stroke', 'green');
      annotations.tileOuterRadii[i].setAttribute('stroke-width', '1');
      annotations.tileOuterRadii[i].setAttribute('fill', 'transparent');
    }
  }

  /**
   * Creates lines connecting each tile to each of its neighborStates.
   *
   * @this Annotations
   */
  function createTileNeighborConnections() {
    var annotations, i, j, iCount, jCount, tile, neighborStates, neighbor;

    annotations = this;
    annotations.neighborLines = [];

    for (i = 0, iCount = annotations.grid.tiles.length; i < iCount; i += 1) {
      tile = annotations.grid.tiles[i];
      neighborStates = tile.getNeighborStates();
      annotations.neighborLines[i] = [];

      for (j = 0, jCount = neighborStates.length; j < jCount; j += 1) {
        neighbor = neighborStates[j];

        if (neighbor) {
          annotations.neighborLines[i][j] = document.createElementNS(hg.util.svgNamespace, 'line');
          annotations.grid.svg.appendChild(annotations.neighborLines[i][j]);

          annotations.neighborLines[i][j].setAttribute('stroke', 'purple');
          annotations.neighborLines[i][j].setAttribute('stroke-width', '1');
        }
      }
    }
  }

  /**
   * Creates lines representing the cumulative force acting on each tile.
   *
   * @this Annotations
   */
  function createTileForces() {
    var annotations, i, count;

    annotations = this;
    annotations.forceLines = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.forceLines[i] = document.createElementNS(hg.util.svgNamespace, 'line');
      annotations.grid.svg.appendChild(annotations.forceLines[i]);

      annotations.forceLines[i].setAttribute('stroke', 'orange');
      annotations.forceLines[i].setAttribute('stroke-width', '2');
    }
  }

  /**
   * Creates lines representing the velocity of each tile.
   *
   * @this Annotations
   */
  function createTileVelocities() {
    var annotations, i, count;

    annotations = this;
    annotations.velocityLines = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.velocityLines[i] = document.createElementNS(hg.util.svgNamespace, 'line');
      annotations.grid.svg.appendChild(annotations.velocityLines[i]);

      annotations.velocityLines[i].setAttribute('stroke', 'red');
      annotations.velocityLines[i].setAttribute('stroke-width', '2');
    }
  }

  /**
   * Creates the index of each tile.
   *
   * @this Annotations
   */
  function createTileIndices() {
    var annotations, i, count;

    annotations = this;
    annotations.indexTexts = [];

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.indexTexts[i] = document.createElementNS(hg.util.svgNamespace, 'text');
      annotations.indexTexts[i].innerHTML =
          !isNaN(annotations.grid.tiles[i].index) ? annotations.grid.tiles[i].index : '?';
      annotations.grid.svg.appendChild(annotations.indexTexts[i]);

      annotations.indexTexts[i].setAttribute('font-size', '16');
      annotations.indexTexts[i].setAttribute('fill', 'black');
      annotations.indexTexts[i].setAttribute('pointer-events', 'none');
    }
  }

  /**
   * Draws the tiles of each Sector with a different color.
   *
   * @this Annotations
   */
  function createSectorColors() {
    var annotations, i, iCount, j, jCount, sector, sectorHue;

    annotations = this;

    if (annotations.grid.sectors) {
      for (i = 0, iCount = annotations.grid.sectors.length; i < iCount; i += 1) {

        sector = annotations.grid.sectors[i];
        sectorHue = 60 * i;

        for (j = 0, jCount = sector.tiles.length; j < jCount; j += 1) {

          sector.tiles[j].setColor(sectorHue, hg.Grid.config.tileSaturation,
              hg.Grid.config.tileLightness);
        }
      }
    }
  }

  // --------------------------------------------------- //
  // Annotation destruction functions

  /**
   * Draws content tiles with a different color.
   *
   * @this Annotations
   */
  function unfillContentTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      if (annotations.grid.tiles[i].holdsContent) {
        annotations.grid.tiles[i].setColor(hg.Grid.config.tileHue,
            hg.Grid.config.tileSaturation, hg.Grid.config.tileLightness);
      }
    }
  }

  /**
   * Draws border tiles with a different color.
   *
   * @this Annotations
   */
  function unfillBorderTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.borderTiles.length; i < count; i += 1) {
      annotations.grid.borderTiles[i].setColor(hg.Grid.config.tileHue,
          hg.Grid.config.tileSaturation, hg.Grid.config.tileLightness);
    }
  }

  /**
   * Draws corner tiles with a different color.
   *
   * @this Annotations
   */
  function unfillCornerTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.borderTiles.length; i < count; i += 1) {
      if (annotations.grid.borderTiles[i].isCornerTile) {
        annotations.grid.borderTiles[i].setColor(hg.Grid.config.tileHue,
            hg.Grid.config.tileSaturation, hg.Grid.config.tileLightness);
      }
    }
  }

  /**
   * Draws all of the tiles as transparent.
   *
   * @this Annotations
   */
  function makeTilesVisible() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.grid.tiles[i].element.setAttribute('opacity', '1');
    }
  }

  /**
   * Draws vertical guidelines along the left and right sides of the main content area.
   *
   * @this Annotations
   */
  function removeContentAreaGuideLines() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.contentAreaGuideLines.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.contentAreaGuideLines[i]);
    }

    annotations.contentAreaGuideLines = [];
  }

  /**
   * Destroys a dot at the center of each tile at its current position.
   *
   * @this Annotations
   */
  function destroyTileParticleCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileParticleCenters.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileParticleCenters[i]);
    }

    annotations.tileParticleCenters = [];
  }

  /**
   * Destroys a dot at the center of each tile at its anchor position.
   *
   * @this Annotations
   */
  function destroyTileAnchorCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileAnchorLines.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileAnchorLines[i]);
      annotations.grid.svg.removeChild(annotations.tileAnchorCenters[i]);
    }

    annotations.tileAnchorLines = [];
    annotations.tileAnchorCenters = [];
  }

  /**
   * Destroys a circle over each tile at its anchor position, which will be used to show colors
   * that indicate its displacement from its original position.
   *
   * @this Annotations
   */
  function destroyTileDisplacementColors() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileDisplacementCircles.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileDisplacementCircles[i]);
    }

    annotations.tileDisplacementCircles = [];
  }

  /**
   * Destroys the inner radius of each tile.
   *
   * @this Annotations
   */
  function destroyTileInnerRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileInnerRadii.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileInnerRadii[i]);
    }

    annotations.tileInnerRadii = [];
  }

  /**
   * Destroys the outer radius of each tile.
   *
   * @this Annotations
   */
  function destroyTileOuterRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileOuterRadii.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileOuterRadii[i]);
    }

    annotations.tileOuterRadii = [];
  }

  /**
   * Destroys lines connecting each tile to each of its neighborStates.
   *
   * @this Annotations
   */
  function destroyTileNeighborConnections() {
    var annotations, i, j, iCount, jCount;

    annotations = this;

    for (i = 0, iCount = annotations.neighborLines.length; i < iCount; i += 1) {
      for (j = 0, jCount = annotations.neighborLines[i].length; j < jCount; j += 1) {
        if (annotations.neighborLines[i][j]) {
          annotations.grid.svg.removeChild(annotations.neighborLines[i][j]);
        }
      }
    }

    annotations.neighborLines = [];
  }

  /**
   * Destroys lines representing the cumulative force acting on each tile.
   *
   * @this Annotations
   */
  function destroyTileForces() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.forceLines.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.forceLines[i]);
    }

    annotations.forceLines = [];
  }

  /**
   * Destroys lines representing the velocity of each tile.
   *
   * @this Annotations
   */
  function destroyTileVelocities() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.velocityLines.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.velocityLines[i]);
    }

    annotations.velocityLines = [];
  }

  /**
   * Destroys the index of each tile.
   *
   * @this Annotations
   */
  function destroyTileIndices() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.indexTexts.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.indexTexts[i]);
    }

    annotations.indexTexts = [];
  }

  /**
   * Destroys the dots at the positions of each corner gap point of each line animation.
   *
   * @this Annotations
   */
  function destroyLineAnimationGapPoints() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.lineAnimationGapDots.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationGapDots[i]);
    }

    annotations.lineAnimationGapDots = [];
  }

  /**
   * Destroys annotations describing the corner configurations of each line animation.
   *
   * @this Annotations
   */
  function destroyLineAnimationCornerConfigurations() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.lineAnimationSelfCornerDots.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationSelfCornerDots[i]);
    }

    for (i = 0, count = annotations.lineAnimationLowerNeighborCornerDots.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationLowerNeighborCornerDots[i]);
    }

    for (i = 0, count = annotations.lineAnimationUpperNeighborCornerDots.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationUpperNeighborCornerDots[i]);
    }

    annotations.lineAnimationSelfCornerDots = [];
    annotations.lineAnimationLowerNeighborCornerDots = [];
    annotations.lineAnimationUpperNeighborCornerDots = [];
  }

  /**
   * Draws the tiles of each Sector with a different color.
   *
   * @this Annotations
   */
  function destroySectorColors() {
    var annotations, i, iCount, j, jCount, sector, sectorHue;

    annotations = this;

    if (annotations.grid.sectors) {
      for (i = 0, iCount = annotations.grid.sectors.length; i < iCount; i += 1) {

        sector = annotations.grid.sectors[i];
        sectorHue = 60 * i;

        for (j = 0, jCount = sector.tiles.length; j < jCount; j += 1) {

          sector.tiles[j].setColor(sectorHue, hg.Grid.config.tileSaturation,
              hg.Grid.config.tileLightness);
        }
      }

      // Reset any other tile-color annotations
      ['contentTiles', 'borderTiles', 'cornerTiles'].forEach(function (key) {
        if (annotations.annotations[key].enabled) {
          annotations.annotations[key].create.call(annotations);
        }
      });
    }
  }

  // --------------------------------------------------- //
  // Annotation updating functions

  /**
   * Updates a dot at the center of each tile at its current position.
   *
   * @this Annotations
   */
  function updateTileParticleCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileParticleCenters[i].setAttribute('cx', annotations.grid.tiles[i].particle.px);
      annotations.tileParticleCenters[i].setAttribute('cy', annotations.grid.tiles[i].particle.py);
    }
  }

  /**
   * Updates a dot at the center of each tile at its anchor position.
   *
   * @this Annotations
   */
  function updateTileAnchorCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileAnchorLines[i].setAttribute('x1', annotations.grid.tiles[i].particle.px);
      annotations.tileAnchorLines[i].setAttribute('y1', annotations.grid.tiles[i].particle.py);
      annotations.tileAnchorLines[i].setAttribute('x2', annotations.grid.tiles[i].centerX);
      annotations.tileAnchorLines[i].setAttribute('y2', annotations.grid.tiles[i].centerY);
      annotations.tileAnchorCenters[i].setAttribute('cx', annotations.grid.tiles[i].centerX);
      annotations.tileAnchorCenters[i].setAttribute('cy', annotations.grid.tiles[i].centerY);
    }
  }

  /**
   * Updates the color of a circle over each tile at its anchor position according to its
   * displacement from its original position.
   *
   * @this Annotations
   */
  function updateTileDisplacementColors() {
    var annotations, i, count, deltaX, deltaY, angle, distance, colorString;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      deltaX = annotations.grid.tiles[i].particle.px - annotations.grid.tiles[i].originalCenterX;
      deltaY = annotations.grid.tiles[i].particle.py - annotations.grid.tiles[i].originalCenterY;

      angle = Math.atan2(deltaX, deltaY) * 180 / Math.PI;
      distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      colorString = 'hsl(' + angle + ',' +
          distance / hg.DisplacementWaveJob.config.displacementAmplitude * 100 + '%,80%)';

      annotations.tileDisplacementCircles[i].setAttribute('fill', colorString);
      annotations.tileDisplacementCircles[i]
          .setAttribute('cx', annotations.grid.tiles[i].particle.px);
      annotations.tileDisplacementCircles[i]
          .setAttribute('cy', annotations.grid.tiles[i].particle.py);
    }
  }

  /**
   * Updates the inner radius of each tile.
   *
   * @this Annotations
   */
  function updateTileInnerRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileInnerRadii[i].setAttribute('cx', annotations.grid.tiles[i].particle.px);
      annotations.tileInnerRadii[i].setAttribute('cy', annotations.grid.tiles[i].particle.py);
      annotations.tileInnerRadii[i].setAttribute('r', annotations.grid.tiles[i].outerRadius * hg.Grid.config.sqrtThreeOverTwo);
    }
  }

  /**
   * Updates the outer radius of each tile.
   *
   * @this Annotations
   */
  function updateTileOuterRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.tileOuterRadii[i].setAttribute('cx', annotations.grid.tiles[i].particle.px);
      annotations.tileOuterRadii[i].setAttribute('cy', annotations.grid.tiles[i].particle.py);
      annotations.tileOuterRadii[i].setAttribute('r', annotations.grid.tiles[i].outerRadius);
    }
  }

  /**
   * Updates lines connecting each tile to each of its neighborStates.
   *
   * @this Annotations
   */
  function updateTileNeighborConnections() {
    var annotations, i, j, iCount, jCount, tile, neighborStates, neighbor;

    annotations = this;

    for (i = 0, iCount = annotations.grid.tiles.length; i < iCount; i += 1) {
      tile = annotations.grid.tiles[i];
      neighborStates = tile.getNeighborStates();

      for (j = 0, jCount = neighborStates.length; j < jCount; j += 1) {
        neighbor = neighborStates[j];

        if (neighbor) {
          annotations.neighborLines[i][j].setAttribute('x1', tile.particle.px);
          annotations.neighborLines[i][j].setAttribute('y1', tile.particle.py);
          annotations.neighborLines[i][j].setAttribute('x2', neighbor.tile.particle.px);
          annotations.neighborLines[i][j].setAttribute('y2', neighbor.tile.particle.py);
        }
      }
    }
  }

  /**
   * Updates lines representing the cumulative force acting on each tile.
   *
   * @this Annotations
   */
  function updateTileForces() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.forceLines[i].setAttribute('x1', annotations.grid.tiles[i].particle.px);
      annotations.forceLines[i].setAttribute('y1', annotations.grid.tiles[i].particle.py);
      annotations.forceLines[i].setAttribute('x2', annotations.grid.tiles[i].particle.px + annotations.grid.tiles[i].particle.fx * config.forceLineLengthMultiplier);
      annotations.forceLines[i].setAttribute('y2', annotations.grid.tiles[i].particle.py + annotations.grid.tiles[i].particle.fy * config.forceLineLengthMultiplier);
    }
  }

  /**
   * Updates lines representing the velocity of each tile.
   *
   * @this Annotations
   */
  function updateTileVelocities() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.velocityLines[i].setAttribute('x1', annotations.grid.tiles[i].particle.px);
      annotations.velocityLines[i].setAttribute('y1', annotations.grid.tiles[i].particle.py);
      annotations.velocityLines[i].setAttribute('x2', annotations.grid.tiles[i].particle.px + annotations.grid.tiles[i].particle.vx * config.velocityLineLengthMultiplier);
      annotations.velocityLines[i].setAttribute('y2', annotations.grid.tiles[i].particle.py + annotations.grid.tiles[i].particle.vy * config.velocityLineLengthMultiplier);
    }
  }

  /**
   * Updates the index of each tile.
   *
   * @this Annotations
   */
  function updateTileIndices() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.tiles.length; i < count; i += 1) {
      annotations.indexTexts[i].setAttribute('x', annotations.grid.tiles[i].particle.px - 10);
      annotations.indexTexts[i].setAttribute('y', annotations.grid.tiles[i].particle.py + 6);
    }
  }

  /**
   * Draws a dot at the position of each corner gap point of each line animation.
   *
   * @this Annotations
   */
  function updateLineAnimationGapPoints() {
    var annotations, i, iCount, j, jCount, k, line;

    annotations = this;

    destroyLineAnimationGapPoints.call(annotations);
    annotations.lineAnimationGapDots = [];

    if (annotations.grid.animations.lineAnimations) {
      for (k = 0, i = 0, iCount = annotations.grid.animations.lineAnimations.length; i < iCount;
           i += 1) {
        line = annotations.grid.animations.lineAnimations[i];

        for (j = 0, jCount = line.gapPoints.length; j < jCount; j += 1, k += 1) {
          annotations.lineAnimationGapDots[k] =
              document.createElementNS(hg.util.svgNamespace, 'circle');
          annotations.lineAnimationGapDots[k].setAttribute('cx', line.gapPoints[j].x);
          annotations.lineAnimationGapDots[k].setAttribute('cy', line.gapPoints[j].y);
          annotations.lineAnimationGapDots[k].setAttribute('r', '4');
          annotations.lineAnimationGapDots[k].setAttribute('fill', 'white');
          annotations.grid.svg.appendChild(annotations.lineAnimationGapDots[k]);
        }
      }
    }
  }

  /**
   * Draws some annotations describing the corner configurations of each line animation.
   *
   * @this Annotations
   */
  function updateLineAnimationCornerConfigurations() {
    var annotations, i, iCount, j, jCount, line, pos, dot;

    annotations = this;

    destroyLineAnimationCornerConfigurations.call(annotations);
    annotations.lineAnimationSelfCornerDots = [];
    annotations.lineAnimationLowerNeighborCornerDots = [];
    annotations.lineAnimationUpperNeighborCornerDots = [];

    if (annotations.grid.animations.lineAnimations) {
      for (i = 0, iCount = annotations.grid.animations.lineAnimations.length; i < iCount; i += 1) {
        line = annotations.grid.animations.lineAnimations[i];

        for (j = 0, jCount = line.corners.length; j < jCount; j += 1) {
          // Self corner: red dot
          pos = getCornerPosition(line.tiles[j], line.corners[j]);
          dot = document.createElementNS(hg.util.svgNamespace, 'circle');
          dot.setAttribute('cx', pos.x);
          dot.setAttribute('cy', pos.y);
          dot.setAttribute('r', '3');
          dot.setAttribute('fill', '#ffaaaa');
          annotations.grid.svg.appendChild(dot);
          annotations.lineAnimationSelfCornerDots.push(dot);

          // Lower neighbor corner: green dot
          if (line.lowerNeighbors[j]) {
            pos = getCornerPosition(line.lowerNeighbors[j].tile, line.lowerNeighborCorners[j]);
            dot = document.createElementNS(hg.util.svgNamespace, 'circle');
            dot.setAttribute('cx', pos.x);
            dot.setAttribute('cy', pos.y);
            dot.setAttribute('r', '3');
            dot.setAttribute('fill', '#aaffaa');
            annotations.grid.svg.appendChild(dot);
            annotations.lineAnimationLowerNeighborCornerDots.push(dot);
          }

          // Upper neighbor corner: blue dot
          if (line.upperNeighbors[j]) {
            pos = getCornerPosition(line.upperNeighbors[j].tile, line.upperNeighborCorners[j]);
            dot = document.createElementNS(hg.util.svgNamespace, 'circle');
            dot.setAttribute('cx', pos.x);
            dot.setAttribute('cy', pos.y);
            dot.setAttribute('r', '3');
            dot.setAttribute('fill', '#aaaaff');
            annotations.grid.svg.appendChild(dot);
            annotations.lineAnimationUpperNeighborCornerDots.push(dot);
          }
        }
      }
    }

    function getCornerPosition(tile, corner) {
      return {
        x: tile.vertices[corner * 2],
        y: tile.vertices[corner * 2 + 1]
      };
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Toggles whether the given annotation is enabled.
   *
   * @this Annotations
   * @param {string} annotation
   * @param {boolean} enabled
   * @throws {Error}
   */
  function toggleAnnotationEnabled(annotation, enabled) {
    var annotations;

    annotations = this;

    annotations.annotations[annotation].enabled = enabled;

    if (enabled) {
      annotations.annotations[annotation].create.call(annotations);
    } else {
      annotations.annotations[annotation].destroy.call(annotations);
    }
  }

  /**
   * Computes spatial parameters of the tile annotations and creates SVG elements to represent
   * these annotations.
   *
   * @this Annotations
   */
  function createAnnotations() {
    var annotations, key;

    annotations = this;

    for (key in annotations.annotations) {
      if (annotations.annotations[key].enabled) {
        annotations.annotations[key].create.call(annotations);
      }
    }
  }

  /**
   * Destroys the SVG elements used to represent grid annotations.
   *
   * @this Annotations
   */
  function destroyAnnotations() {
    var annotations, key;

    annotations = this;

    for (key in annotations.annotations) {
      annotations.annotations[key].destroy.call(annotations);
    }
  }

  /**
   * Updates the annotation states to reflect whether the grid is currently expanded.
   *
   * @this Annotations
   * @param {boolean} isExpanded
   */
  function setExpandedAnnotations(isExpanded) {
    var annotations;

    annotations = this;

    if (annotations.annotations.tileNeighborConnections.enabled) {
      destroyTileNeighborConnections.call(annotations);
      createTileNeighborConnections.call(annotations);
    }

    if (isExpanded && annotations.annotations.sectorColors.enabled) {
      destroySectorColors.call(annotations);
      createSectorColors.call(annotations);
    } else {
      destroySectorColors.call(annotations);
    }
  }

  /**
   * Sets this AnimationJob as started.
   *
   * @this Annotations
   */
  function start() {
    var grid = this;

    grid.isComplete = false;
  }

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * @this Annotations
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var annotations, key;

    annotations = this;

    for (key in annotations.annotations) {
      if (annotations.annotations[key].enabled) {
        annotations.annotations[key].update.call(annotations);
      }
    }
  }

  /**
   * Draws the current state of this AnimationJob.
   *
   * @this Annotations
   */
  function draw() {
    // TODO: is there any of the update logic that should instead be handled here?
  }

  /**
   * Stops this AnimationJob, and returns the element to its original form.
   *
   * @this Annotations
   */
  function cancel() {
    var grid = this;

    grid.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @param {Grid} grid
   */
  function Annotations(grid) {
    var annotations = this;

    annotations.grid = grid;
    annotations.startTime = 0;
    annotations.isComplete = false;
    annotations.annotations = hg.util.shallowCopy(config.annotations);

    annotations.contentAreaGuideLines = [];
    annotations.tileParticleCenters = [];
    annotations.tileAnchorLines = [];
    annotations.tileAnchorCenters = [];
    annotations.tileDisplacementCircles = [];
    annotations.tileInnerRadii = [];
    annotations.tileOuterRadii = [];
    annotations.neighborLines = [];
    annotations.forceLines = [];
    annotations.velocityLines = [];
    annotations.indexTexts = [];
    annotations.lineAnimationGapDots = [];
    annotations.lineAnimationSelfCornerDots = [];
    annotations.lineAnimationLowerNeighborCornerDots = [];
    annotations.lineAnimationUpperNeighborCornerDots = [];

    annotations.toggleAnnotationEnabled = toggleAnnotationEnabled;
    annotations.createAnnotations = createAnnotations;
    annotations.destroyAnnotations = destroyAnnotations;
    annotations.setExpandedAnnotations = setExpandedAnnotations;

    annotations.start = start;
    annotations.update = update;
    annotations.draw = draw;
    annotations.cancel = cancel;
  }

  Annotations.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.Annotations = Annotations;

  console.log('Annotations module loaded');
})();

'use strict';

/**
 * @typedef {AnimationJob} Grid
 */

/**
 * This module defines a constructor for Grid objects.
 *
 * Grid objects define a collection of hexagonal tiles that animate and display dynamic,
 * textual content.
 *
 * @module Grid
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // TODO:
  // - update the tile radius and the targetContentAreaWidth with the screen width
  //   - we should always have the same number of content tiles in a given row

  // TODO:
  // - give tiles references to their next DOM sibling
  //   - this will be important for maintaining correct z-indices when removing/adding

  var config = {};

  config.targetContentAreaWidth = 800;
  config.backgroundHue = 327;
  config.backgroundSaturation = 20;
  config.backgroundLightness = 10;
  config.tileHue = 230;//147;
  config.tileSaturation = 50;
  config.tileLightness = 30;
  config.tileOuterRadius = 80;
  config.tileGap = 12;
  config.contentStartingRowIndex = 2;
  config.firstRowYOffset = config.tileOuterRadius * -0.8;
  config.contentDensity = 0.6;
  config.tileMass = 1;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.sqrtThreeOverTwo = Math.sqrt(3) / 2;
    config.twoOverSqrtThree = 2 / Math.sqrt(3);

    config.tileInnerRadius = config.tileOuterRadius * config.sqrtThreeOverTwo;

    config.tileShortLengthWithGap = config.tileInnerRadius * 2 + config.tileGap;
    config.tileLongLengthWithGap =
        config.tileOuterRadius * 2 + config.tileGap * config.twoOverSqrtThree;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Computes various parameters of the grid. These include:
   *
   * - row count
   * - number of tiles in even and odd rows
   * - the vertical and horizontal displacement between neighbor tiles
   * - the horizontal positions of the first tiles in even and odd rows
   *
   * @this Grid
   */
  function computeGridParameters() {
    var grid, parentHalfWidth, parentHeight, innerContentCount, rowIndex, i, count,
        emptyRowsContentTileCount, minInnerTileCount;

    grid = this;

    parentHalfWidth = grid.parent.clientWidth * 0.5;
    parentHeight = grid.parent.clientHeight;

    grid.centerX = parentHalfWidth;
    grid.centerY = parentHeight * 0.5;

    grid.actualContentAreaWidth = grid.parent.clientWidth < config.targetContentAreaWidth ?
        grid.parent.clientWidth : config.targetContentAreaWidth;

    if (grid.isVertical) {
      grid.rowDeltaY = config.tileOuterRadius * 1.5 + config.tileGap * config.sqrtThreeOverTwo;
      grid.tileDeltaX = config.tileShortLengthWithGap;

      grid.oddRowTileCount = Math.ceil((parentHalfWidth - (config.tileInnerRadius + config.tileGap)) / config.tileShortLengthWithGap) * 2 + 1;
      grid.evenRowTileCount = Math.ceil((parentHalfWidth - (config.tileShortLengthWithGap + config.tileGap * 0.5)) / config.tileShortLengthWithGap) * 2 + 2;

      grid.oddRowXOffset = parentHalfWidth - config.tileShortLengthWithGap * (grid.oddRowTileCount - 1) / 2;

      grid.rowCount = Math.ceil((parentHeight - (config.firstRowYOffset + config.tileOuterRadius * 2 + config.tileGap * Math.sqrt(3))) / grid.rowDeltaY) + 2;
    } else {
      grid.rowDeltaY = config.tileInnerRadius + config.tileGap * 0.5;
      grid.tileDeltaX = config.tileOuterRadius * 3 + config.tileGap * Math.sqrt(3);

      grid.oddRowTileCount = Math.ceil((parentHalfWidth - (grid.tileDeltaX - config.tileOuterRadius)) / grid.tileDeltaX) * 2 + 1;
      grid.evenRowTileCount = Math.ceil((parentHalfWidth - (grid.tileDeltaX + (config.tileGap * config.sqrtThreeOverTwo) + config.tileOuterRadius * 0.5)) / grid.tileDeltaX) * 2 + 2;

      grid.oddRowXOffset = parentHalfWidth - grid.tileDeltaX * (grid.oddRowTileCount - 1) / 2;

      grid.rowCount = Math.ceil((parentHeight - (config.firstRowYOffset + config.tileInnerRadius * 3 + config.tileGap * 2)) / grid.rowDeltaY) + 4;
    }

    grid.evenRowXOffset = grid.oddRowXOffset +
        (grid.evenRowTileCount > grid.oddRowTileCount ? -1 : 1) * grid.tileDeltaX * 0.5;

    // --- Row inner content information --- //

    grid.contentAreaLeft = parentHalfWidth - grid.actualContentAreaWidth * 0.5;
    grid.contentAreaRight = grid.contentAreaLeft + grid.actualContentAreaWidth;

    if (grid.isVertical) {
      grid.oddRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.oddRowXOffset - config.tileInnerRadius)) / grid.tileDeltaX);
      grid.evenRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.evenRowXOffset - config.tileInnerRadius)) / grid.tileDeltaX);
    } else {
      grid.oddRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.oddRowXOffset - config.tileOuterRadius)) / grid.tileDeltaX);
      grid.evenRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.evenRowXOffset - config.tileOuterRadius)) / grid.tileDeltaX);
    }

    grid.oddRowContentTileCount = grid.oddRowTileCount - grid.oddRowContentStartIndex * 2;
    grid.evenRowContentTileCount = grid.evenRowTileCount - grid.evenRowContentStartIndex * 2;

    grid.oddRowContentEndIndex = grid.oddRowContentStartIndex + grid.oddRowContentTileCount - 1;
    grid.evenRowContentEndIndex = grid.evenRowContentStartIndex + grid.evenRowContentTileCount - 1;

    // Update the content inner indices to account for empty rows at the start of the grid
    grid.actualContentInnerIndices = [];
    emptyRowsContentTileCount = Math.ceil(config.contentStartingRowIndex / 2) * grid.oddRowContentTileCount +
        Math.floor(config.contentStartingRowIndex / 2) * grid.evenRowContentTileCount;
    for (i = 0, count = grid.originalContentInnerIndices.length; i < count; i += 1) {
      grid.actualContentInnerIndices[i] = grid.originalContentInnerIndices[i] + emptyRowsContentTileCount;
    }

    grid.innerIndexOfLastContentTile = grid.actualContentInnerIndices[grid.actualContentInnerIndices.length - 1];

    // Add empty rows at the end of the grid
    minInnerTileCount = emptyRowsContentTileCount + grid.innerIndexOfLastContentTile + 1;
    innerContentCount = 0;
    rowIndex = 0;

    while (minInnerTileCount > innerContentCount) {
      innerContentCount += rowIndex % 2 === 0 ?
          grid.oddRowContentTileCount : grid.evenRowContentTileCount;
      rowIndex += 1;
    }
    grid.rowCount = rowIndex > grid.rowCount ? rowIndex : grid.rowCount;

    grid.height = (grid.rowCount - 2) * grid.rowDeltaY;
  }

  /**
   * Calculates the tile indices within the content area column that will represent tiles with
   * content.
   *
   * @this Grid
   */
  function computeContentIndices() {
    var grid, i, j, count, tilesRepresentation;

    grid = this;

    // Use 1s to represent the tiles that hold data
    tilesRepresentation = [];
    count = grid.postData.length;
    for (i = 0; i < count; i += 1) {
      tilesRepresentation[i] = 1;
    }

    // Use 0s to represent the empty tiles
    count = (1 / config.contentDensity) * grid.postData.length;
    for (i = grid.postData.length; i < count; i += 1) {
      tilesRepresentation[i] = 0;
    }

    tilesRepresentation = hg.util.shuffle(tilesRepresentation);

    // Record the resulting indices of the elements representing tile content
    grid.originalContentInnerIndices = [];
    for (i = 0, j = 0, count = tilesRepresentation.length; i < count; i += 1) {
      if (tilesRepresentation[i]) {
        grid.originalContentInnerIndices[j++] = i;
      }
    }
  }

  /**
   * Creates the SVG element for the grid.
   *
   * @this Grid
   */
  function createSvg() {
    var grid;

    grid = this;

    grid.svg = document.createElementNS(hg.util.svgNamespace, 'svg');
    grid.parent.appendChild(grid.svg);

    grid.svg.style.display = 'block';
    grid.svg.style.position = 'relative';
    grid.svg.style.width = '100%';
    grid.svg.style.zIndex = '2147483647';
    grid.svg.classList.add('hg-svg');

    updateBackgroundColor.call(grid);

    grid.svgDefs = document.createElementNS(hg.util.svgNamespace, 'defs');
    grid.svg.appendChild(grid.svgDefs);
  }

  /**
   * Creates the tile elements for the grid.
   *
   * @this Grid
   */
  function createTiles() {
    var grid, tileIndex, rowIndex, rowCount, columnIndex, columnCount, centerX, centerY,
        isMarginTile, isBorderTile, isCornerTile, isOddRow, contentAreaIndex, postDataIndex,
        defaultNeighborDeltaIndices, tilesNeighborDeltaIndices, oddRowIsLarger, isLargerRow;

    grid = this;

    grid.tiles = [];
    grid.borderTiles = [];
    tileIndex = 0;
    contentAreaIndex = 0;
    postDataIndex = 0;
    centerY = config.firstRowYOffset;
    rowCount = grid.rowCount;
    tilesNeighborDeltaIndices = [];

    defaultNeighborDeltaIndices = getDefaultNeighborDeltaIndices.call(grid);
    oddRowIsLarger = grid.oddRowTileCount > grid.evenRowTileCount;

    for (rowIndex = 0; rowIndex < rowCount; rowIndex += 1, centerY += grid.rowDeltaY) {
      isOddRow = rowIndex % 2 === 0;
      isLargerRow = oddRowIsLarger && isOddRow || !oddRowIsLarger && !isOddRow;

      if (isOddRow) {
        centerX = grid.oddRowXOffset;
        columnCount = grid.oddRowTileCount;
      } else {
        centerX = grid.evenRowXOffset;
        columnCount = grid.evenRowTileCount;
      }

      for (columnIndex = 0; columnIndex < columnCount;
           tileIndex += 1, columnIndex += 1, centerX += grid.tileDeltaX) {
        isMarginTile = isOddRow ?
            columnIndex < grid.oddRowContentStartIndex ||
                columnIndex > grid.oddRowContentEndIndex :
            columnIndex < grid.evenRowContentStartIndex ||
                columnIndex > grid.evenRowContentEndIndex;

        isBorderTile = grid.isVertical ?
            (columnIndex === 0 || columnIndex === columnCount - 1 ||
              rowIndex === 0 || rowIndex === rowCount - 1) :
            (rowIndex <= 1 || rowIndex >= rowCount - 2 ||
                isLargerRow && (columnIndex === 0 || columnIndex === columnCount - 1));

        isCornerTile = isBorderTile && (grid.isVertical ?
            ((columnIndex === 0 || columnIndex === columnCount - 1) &&
                (rowIndex === 0 || rowIndex === rowCount - 1)) :
            ((rowIndex <= 1 || rowIndex >= rowCount - 2) &&
                (isLargerRow && (columnIndex === 0 || columnIndex === columnCount - 1))));

        grid.tiles[tileIndex] = new hg.Tile(grid.svg, grid, centerX, centerY,
            config.tileOuterRadius, grid.isVertical, config.tileHue, config.tileSaturation,
            config.tileLightness, null, tileIndex, rowIndex, columnIndex, isMarginTile,
            isBorderTile, isCornerTile, isLargerRow, config.tileMass);

        if (isBorderTile) {
          grid.borderTiles.push(grid.tiles[tileIndex]);
        }

        // Is the current tile within the content column?
        if (!isMarginTile) {
          // Does the current tile get to hold content?
          if (contentAreaIndex === grid.actualContentInnerIndices[postDataIndex]) {
            grid.tiles[tileIndex].setContent(grid.postData[postDataIndex]);
            postDataIndex += 1;
          }
          contentAreaIndex += 1;
        }

        // Determine the neighbor index offsets for the current tile
        tilesNeighborDeltaIndices[tileIndex] = getNeighborDeltaIndices.call(grid, rowIndex, rowCount,
            columnIndex, columnCount, isLargerRow, defaultNeighborDeltaIndices);
      }
    }

    setNeighborTiles.call(grid, tilesNeighborDeltaIndices);
  }

  /**
   * Connects each tile with references to its neighborStates.
   *
   * @this Grid
   * @param {Array.<Array.<number>>} tilesNeighborDeltaIndices
   */
  function setNeighborTiles(tilesNeighborDeltaIndices) {
    var grid, i, j, iCount, jCount, neighborTiles;

    grid = this;

    neighborTiles = [];

    // Give each tile references to each of its neighborStates
    for (i = 0, iCount = grid.tiles.length; i < iCount; i += 1) {
      // Get the neighborStates around the current tile
      for (j = 0, jCount = 6; j < jCount; j += 1) {
        neighborTiles[j] = !isNaN(tilesNeighborDeltaIndices[i][j]) ?
            grid.tiles[i + tilesNeighborDeltaIndices[i][j]] : null;
      }

      grid.tiles[i].setNeighborTiles(neighborTiles);
    }
  }

  /**
   * Get the actual neighbor index offsets for the tile described by the given parameters.
   *
   * NaN is used to represent the tile not having a neighbor on that side.
   *
   * @this Grid
   * @param {number} rowIndex
   * @param {number} rowCount
   * @param {number} columnIndex
   * @param {number} columnCount
   * @param {boolean} isLargerRow
   * @param {Array.<number>} defaultNeighborDeltaIndices
   * @returns {Array.<number>}
   */
  function getNeighborDeltaIndices(rowIndex, rowCount, columnIndex, columnCount, isLargerRow,
                                   defaultNeighborDeltaIndices) {
    var grid, neighborDeltaIndices;

    grid = this;

    neighborDeltaIndices = defaultNeighborDeltaIndices.slice(0);

    // Remove neighbor indices according to the tile's position in the grid
    if (grid.isVertical) {
      // Is this the row with more or fewer tiles?
      if (isLargerRow) {
        // Is this the first column?
        if (columnIndex === 0) {
          neighborDeltaIndices[3] = Number.NaN;
          neighborDeltaIndices[4] = Number.NaN;
          neighborDeltaIndices[5] = Number.NaN;
        }

        // Is this the last column?
        if (columnIndex === columnCount - 1) {
          neighborDeltaIndices[0] = Number.NaN;
          neighborDeltaIndices[1] = Number.NaN;
          neighborDeltaIndices[2] = Number.NaN;
        }
      } else {
        // Is this the first column?
        if (columnIndex === 0) {
          neighborDeltaIndices[4] = Number.NaN;
        }

        // Is this the last column?
        if (columnIndex === columnCount - 1) {
          neighborDeltaIndices[1] = Number.NaN;
        }
      }

      // Is this the first row?
      if (rowIndex === 0) {
        neighborDeltaIndices[0] = Number.NaN;
        neighborDeltaIndices[5] = Number.NaN;
      }

      // Is this the last row?
      if (rowIndex === rowCount - 1) {
        neighborDeltaIndices[2] = Number.NaN;
        neighborDeltaIndices[3] = Number.NaN;
      }
    } else {
      if (isLargerRow) {
        // Is this the first column?
        if (columnIndex === 0) {
          neighborDeltaIndices[4] = Number.NaN;
          neighborDeltaIndices[5] = Number.NaN;
        }

        // Is this the last column?
        if (columnIndex === columnCount - 1) {
          neighborDeltaIndices[1] = Number.NaN;
          neighborDeltaIndices[2] = Number.NaN;
        }
      }

      // Is this the first or second row?
      if (rowIndex ===0) {
        neighborDeltaIndices[0] = Number.NaN;
        neighborDeltaIndices[1] = Number.NaN;
        neighborDeltaIndices[5] = Number.NaN;
      } else if (rowIndex === 1) {
        neighborDeltaIndices[0] = Number.NaN;
      }

      // Is this the last or second-to-last row?
      if (rowIndex === rowCount - 1) {
        neighborDeltaIndices[2] = Number.NaN;
        neighborDeltaIndices[3] = Number.NaN;
        neighborDeltaIndices[4] = Number.NaN;
      } else if (rowIndex === rowCount - 2) {
        neighborDeltaIndices[3] = Number.NaN;
      }
    }

    return neighborDeltaIndices;
  }

  /**
   * Calculates the index offsets of the neighborStates of a tile.
   *
   * @this Grid
   * @returns {Array.<number>}
   */
  function getDefaultNeighborDeltaIndices() {
    var grid, maxColumnCount, neighborDeltaIndices;

    grid = this;
    neighborDeltaIndices = [];
    maxColumnCount = grid.oddRowTileCount > grid.evenRowTileCount ?
        grid.oddRowTileCount : grid.evenRowTileCount;

    // Neighbor delta indices are dependent on current screen dimensions
    if (grid.isVertical) {
      neighborDeltaIndices[0] = -maxColumnCount + 1; // top-right
      neighborDeltaIndices[1] = 1; // right
      neighborDeltaIndices[2] = maxColumnCount; // bottom-right
      neighborDeltaIndices[3] = maxColumnCount - 1; // bottom-left
      neighborDeltaIndices[4] = -1; // left
      neighborDeltaIndices[5] = -maxColumnCount; // top-left
    } else {
      neighborDeltaIndices[0] = -maxColumnCount * 2 + 1; // top
      neighborDeltaIndices[1] = -maxColumnCount + 1; // top-right
      neighborDeltaIndices[2] = maxColumnCount; // bottom-right
      neighborDeltaIndices[3] = maxColumnCount * 2 - 1; // bottom
      neighborDeltaIndices[4] = maxColumnCount - 1; // bottom-left
      neighborDeltaIndices[5] = -maxColumnCount; // top-left
    }

    return neighborDeltaIndices;
  }

  /**
   * Removes all content from the SVG.
   *
   * @this Grid
   */
  function clearSvg() {
    var grid, svg;

    grid = this;
    svg = grid.svg;

    grid.annotations.destroyAnnotations.call(grid.annotations);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    grid.svg.appendChild(grid.svgDefs);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Prints to the console some information about this grid.
   *
   * This is useful for testing purposes.
   */
  function logGridInfo() {
    var grid = this;

    console.log('// --- Grid Info: ------- //');
    console.log('// - Tile count=' + grid.tiles.length);
    console.log('// - Row count=' + grid.rowCount);
    console.log('// - Odd row tile count=' + grid.oddRowTileCount);
    console.log('// - Even row tile count=' + grid.evenRowTileCount);
    console.log('// ------------------------- //');
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Computes spatial parameters of the tiles in this grid.
   *
   * @this Grid
   */
  function resize() {
    var grid;

    grid = this;

    clearSvg.call(grid);
    computeGridParameters.call(grid);
    createTiles.call(grid);

    grid.svg.style.height = grid.height + 'px';

    grid.annotations.createAnnotations();

    logGridInfo.call(grid);
  }

  /**
   * Sets the color of this grid's background.
   *
   * @this Grid
   */
  function updateBackgroundColor() {
    var grid;

    grid = this;

    grid.svg.style.backgroundColor = 'hsl(' + config.backgroundHue + ',' +
        config.backgroundSaturation + '%,' + config.backgroundLightness + '%)';
  }

  /**
   * Sets the color of this grid's tiles.
   *
   * @this Grid
   */
  function updateTileColor() {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      grid.tiles[i].setColor(config.tileHue, config.tileSaturation, config.tileLightness);
    }
  }

  /**
   * Sets the mass of this grid's tiles.
   *
   * @this Grid
   * @param {number} mass
   */
  function updateTileMass(mass) {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      grid.tiles[i].particle.m = mass;
    }
  }

  /**
   * Sets this AnimationJob as started.
   *
   * @this Grid
   */
  function start() {
    var grid = this;

    grid.isComplete = false;
  }

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * @this Grid
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      grid.tiles[i].update(currentTime, deltaTime);
    }
  }

  /**
   * Draws the current state of this AnimationJob.
   *
   * @this Grid
   */
  function draw() {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.tiles.length; i < count; i += 1) {
      grid.tiles[i].draw();
    }
  }

  /**
   * Stops this AnimationJob, and returns the element to its original form.
   *
   * @this Grid
   */
  function cancel() {
    var grid = this;

    // TODO:

    grid.isComplete = true;
  }

  /**
   * Sets the tile that the pointer is currently hovering over.
   *
   * @this Grid
   * @param {Tile} hoveredTile
   */
  function setHoveredTile(hoveredTile) {
    var grid = this;

    if (grid.hoveredTile) {
      grid.hoveredTile.setIsHighlighted(false);
    }

    if (hoveredTile) {
      hoveredTile.setIsHighlighted(true);
    }

    grid.hoveredTile = hoveredTile;
  }

  /**
   * Opens a hole in the grid in order to display the post represented at the given tile index.
   *
   * @this Grid
   * @param {number} tileIndex
   */
  function openPost(tileIndex) {
    var grid;

    grid = this;

    // TODO:
  }

  /**
   * Closes the post that is currently displayed, and closes the hole in the grid that is used to
   * show the post.
   *
   * @this Grid
   * @param {number} tileIndex
   */
  function closePost(tileIndex) {
    var grid;

    grid = this;

    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @global
   * @constructor
   * @param {HTMLElement} parent
   * @param {Array.<Object>} postData
   * @param {boolean} [isVertical]
   */
  function Grid(parent, postData, isVertical) {
    var grid = this;

    grid.parent = parent;
    grid.postData = postData;
    grid.isVertical = isVertical;

    grid.actualContentAreaWidth = config.targetContentAreaWidth;

    grid.isComplete = false;

    grid.svg = null;
    grid.svgDefs = null;
    grid.tiles = [];
    grid.borderTiles = [];
    grid.originalContentInnerIndices = null;
    grid.innerIndexOfLastContentTile = null;
    grid.centerX = Number.NaN;
    grid.centerY = Number.NaN;
    grid.index = Number.NaN;
    grid.isPostOpen = false;
    grid.isTransitioning = false;
    grid.sectors = null;

    grid.animations = {};

    grid.annotations = new hg.Annotations(grid);

    grid.centerX = null;
    grid.centerY = null;
    grid.actualContentAreaWidth = null;
    grid.rowDeltaY = null;
    grid.tileDeltaX = null;
    grid.oddRowTileCount = null;
    grid.evenRowTileCount = null;
    grid.oddRowXOffset = null;
    grid.rowCount = null;
    grid.evenRowXOffset = null;
    grid.contentAreaLeft = null;
    grid.contentAreaRight = null;
    grid.oddRowContentStartIndex = null;
    grid.evenRowContentStartIndex = null;
    grid.oddRowContentTileCount = null;
    grid.evenRowContentTileCount = null;
    grid.oddRowContentEndIndex = null;
    grid.evenRowContentEndIndex = null;
    grid.actualContentInnerIndices = null;
    grid.innerIndexOfLastContentTile = null;
    grid.rowCount = null;
    grid.height = null;

    grid.resize = resize;
    grid.start = start;
    grid.update = update;
    grid.draw = draw;
    grid.cancel = cancel;
    grid.updateBackgroundColor = updateBackgroundColor;
    grid.updateTileColor = updateTileColor;
    grid.updateTileMass = updateTileMass;
    grid.computeContentIndices = computeContentIndices;
    grid.setHoveredTile = setHoveredTile;
    grid.openPost = openPost;
    grid.closePost = closePost;

    createSvg.call(grid);
    computeContentIndices.call(grid);
    resize.call(grid);
  }

  Grid.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.Grid = Grid;

  console.log('Grid module loaded');
})();

'use strict';

/**
 * This module defines a constructor for Input objects.
 *
 * Input objects handle the user-input logic for a Grid.
 *
 * @module Input
 */
(function () {
  var config = {};

  config.clickAnimation = 'Radiate Highlight'; // 'Radiate Highlight'|'Radiate Lines'|'Random Line'|'None'

  config.possibleClickAnimations = {
    'Radiate Highlight': hg.controller.createHighlightRadiateAnimation,
    'Radiate Lines': hg.controller.createLinesRadiateAnimation,
    'Random Line': hg.controller.createRandomLineAnimation,
    'None': function () {}
  };

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Adds event listeners for mouse and touch events for the grid.
   *
   * @this Input
   */
  function addPointerEventListeners() {
    var input;

    input = this;

    document.addEventListener('mouseover', handlePointerOver, false);
    document.addEventListener('mouseout', handlePointerOut, false);
    document.addEventListener('mousemove', handlePointerMove, false);
    document.addEventListener('mousedown', handlePointerDown, false);
    document.addEventListener('mouseup', handlePointerUp, false);
    // TODO: add touch support

    function handlePointerOver(event) {
      var tile;

      if (tile = getTileFromEvent(event)) {

        if (tile.element.classList.contains('hg-post-tile')) {
          // TODO: reset the other tile parameters
        }

        input.grid.setHoveredTile(tile);
      }
    }

    function handlePointerOut(event) {
      var tile;

      if (!event.relatedTarget || event.relatedTarget.nodeName === 'HTML') {
        console.log('The mouse left the viewport');

        input.grid.setHoveredTile(null);
      } else if (tile = getTileFromEvent(event)) {

        if (tile.element.classList.contains('hg-post-tile')) {
          // TODO: reset the other tile parameters
        }

        input.grid.setHoveredTile(null);

        hg.controller.createHighlightHoverAnimation(input.grid.index, tile);

        event.stopPropagation();
      }
    }

    function handlePointerMove(event) {
      if (event.target.classList.contains('hg-post-tile')) {
        // TODO:
      } else if (event.target.classList.contains('hg-tile')) {
        // TODO:
      }
    }

    function handlePointerDown(event) {
      if (event.target.classList.contains('hg-post-tile')) {
        // TODO:
      }
    }

    function handlePointerUp(event) {
      var tile;

      if (tile = getTileFromEvent(event)) {

        if (tile.element.classList.contains('hg-post-tile')) {
          // TODO:
        }

        createClickAnimation(input.grid.index, tile);
      }
    }

    function getTileFromEvent(event) {
      var tileIndex;

      if (event.target.classList.contains('hg-tile')) {
        tileIndex = event.target.id.substr(3);
        return input.grid.tiles[tileIndex];
      } else {
        return null;
      }
    }
  }

  function createClickAnimation(gridIndex, tile) {
//    config.possibleClickAnimations[config.clickAnimation](gridIndex, tile);// TODO:
    hg.controller.openPost(gridIndex, tile);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function Input(grid) {
    var input = this;

    input.grid = grid;

    addPointerEventListeners.call(input);
  }

  Input.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.Input = Input;

  console.log('Input module loaded');
})();

// TODO:

'use strict';

/**
 * This module defines a constructor for Sector objects.
 *
 * Sector objects define a collection of hexagonal tiles that lie within a single sector of the
 * grid--outward from a given tile position.
 *
 * Sectors are one-sixth of the grid.
 *
 * Sectors are used to animate open and close a hole in the grid around a given tile, so that the
 * contents of that tile can be shown in an expanded form.
 *
 * @module Sector
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates major and minor neighbor values and displacement values for the expanded grid
   * configuration.
   *
   * @this Sector
   */
  function setUpExpandedDisplacementValues() {
    var sector, expansionDirectionNeighborIndex, expansionDirectionNeighborDeltaX,
        expansionDirectionNeighborDeltaY;

    sector = this;

    // Compute which directions to iterate through tiles for this sector

    sector.majorNeighborIndex = sector.index;
    sector.minorNeighborIndex = (sector.index + 1) % 6;

    // Compute the axially-aligned distances between adjacent tiles

    sector.majorNeighborDeltaX =
        sector.baseTile.neighborStates[sector.majorNeighborIndex].tile.originalCenterX -
        sector.baseTile.originalCenterX;
    sector.majorNeighborDeltaY =
        sector.baseTile.neighborStates[sector.majorNeighborIndex].tile.originalCenterY -
        sector.baseTile.originalCenterY;
    sector.minorNeighborDeltaX =
        sector.baseTile.neighborStates[sector.minorNeighborIndex].tile.originalCenterX -
        sector.baseTile.originalCenterX;
    sector.minorNeighborDeltaY =
        sector.baseTile.neighborStates[sector.minorNeighborIndex].tile.originalCenterY -
        sector.baseTile.originalCenterY;

    // Compute the axially-aligned displacement values of this sector when the grid is expanded

    expansionDirectionNeighborIndex = (sector.index + 5) % 6;

    expansionDirectionNeighborDeltaX =
        sector.baseTile.neighborStates[expansionDirectionNeighborIndex].tile.originalCenterX -
        sector.baseTile.originalCenterX;
    expansionDirectionNeighborDeltaY =
        sector.baseTile.neighborStates[expansionDirectionNeighborIndex].tile.originalCenterY -
        sector.baseTile.originalCenterY;

    sector.expandedDisplacementX =
        sector.expandedDisplacementTileCount * expansionDirectionNeighborDeltaX;
    sector.expandedDisplacementY =
        sector.expandedDisplacementTileCount * expansionDirectionNeighborDeltaY;
  }

  /**
   * Populates the collection of tiles that lie within this sector. These include both the
   * pre-existing tiles and new tiles that are created.
   *
   * @this Sector
   */
  function setUpTiles() {
    var sector;

    sector = this;

    sector.tilesByIndex = [];
    sector.newTiles = [];
    sector.tiles = [];

    // Get the old and new tiles for this sector, and set up neighbor states for the expanded grid
    // configuration
    collectOldTilesInSector.call(sector);
    collectNewTilesInSector.call(sector);

    // Re-assign temporary neighbor states for tiles in this sector
    initializeExpandedStateInternalTileNeighbors.call(sector);

    // Convert the two-dimensional array to a flat array
    flattenTileCollection.call(sector);
  }

  /**
   * Collects references to the pre-existing tiles that lie within this sector.
   *
   * ASSUMPTION: the baseTile is not a border tile (i.e., it has six neighbors)
   *
   * @this Sector
   */
  function collectOldTilesInSector() {
    var sector;

    sector = this;

    // TODO: this double-pass major-to-minor line-iteration algorithm is NOT guaranteed to collect all of the tiles in the viewport (but it is likely to) (the breaking edge case is when the viewport's aspect ratio is very large or very small)
    // Collect all of the tiles for this sector into a two-dimensional array
    iterateOverTilesInSectorInMajorOrder();
    iterateOverTilesInSectorInMinorOrder();

    // ---  --- //

    function iterateOverTilesInSectorInMajorOrder() {
      var majorTile, currentTile, majorIndex, minorIndex;

      majorIndex = 0;
      majorTile = sector.baseTile.neighborStates[sector.majorNeighborIndex].tile;

      // Iterate over the major indices of the sector (aka, the "rows" of the sector)
      do {
        currentTile = majorTile;
        minorIndex = 0;

        // Set up the inner array for this "row" of the sector
        sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

        // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
        do {
          // Store the current tile in the "row" if it hasn't already been stored
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            addOldTileToSector.call(sector, currentTile, majorIndex, minorIndex);
          }

          minorIndex++;

        } while (currentTile.neighborStates[sector.minorNeighborIndex] &&
            (currentTile = currentTile.neighborStates[sector.minorNeighborIndex].tile));

        majorIndex++;

      } while (majorTile.neighborStates[sector.majorNeighborIndex] &&
          (majorTile = majorTile.neighborStates[sector.majorNeighborIndex].tile));
    }

    function iterateOverTilesInSectorInMinorOrder() {
      var minorTile, currentTile, majorIndex, minorIndex;

      minorIndex = 0;
      minorTile = sector.baseTile.neighborStates[sector.majorNeighborIndex].tile;

      // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
      do {
        currentTile = minorTile;
        majorIndex = 0;

        // Iterate over the major indices of the sector (aka, the "rows" of the sector)
        do {
          // Set up the inner array for this "row" of the sector
          sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

          // Store the current tile in the "column" if it hasn't already been stored
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            addOldTileToSector.call(sector, currentTile, majorIndex, minorIndex);
          }

          majorIndex++;

        } while (currentTile.neighborStates[sector.majorNeighborIndex] &&
            (currentTile = currentTile.neighborStates[sector.majorNeighborIndex].tile));

        minorIndex++;

      } while (minorTile.neighborStates[sector.minorNeighborIndex] &&
          (minorTile = minorTile.neighborStates[sector.minorNeighborIndex].tile));
    }
  }

  /**
   * Creates new tiles that will be shown within this sector.
   *
   * ASSUMPTION: the baseTile is not a border tile (i.e., it has six neighbors)
   *
   * @this Sector
   */
  function collectNewTilesInSector() {
    var sector, boundingBoxHalfX, boundingBoxHalfY, minX, maxX, minY, maxY;

    sector = this;

    // Determine the bounding box of the re-positioned viewport
    boundingBoxHalfX = window.innerWidth / 2 - Math.abs(sector.expandedDisplacementX) + hg.Grid.config.tileShortLengthWithGap;
    boundingBoxHalfY = window.innerHeight / 2 - Math.abs(sector.expandedDisplacementY) + hg.Grid.config.tileShortLengthWithGap;
    minX = sector.baseTile.originalCenterX - boundingBoxHalfX;
    maxX = sector.baseTile.originalCenterX + boundingBoxHalfX;
    minY = sector.baseTile.originalCenterY - boundingBoxHalfY;
    maxY = sector.baseTile.originalCenterY + boundingBoxHalfY;

    // TODO: this double-pass major-to-minor line-iteration algorithm is NOT guaranteed to collect all of the tiles in the viewport (but it is likely to) (the breaking edge case is when the viewport's aspect ratio is very large or very small)
    // Collect all of the tiles for this sector into a two-dimensional array
    iterateOverTilesInSectorInMajorOrder();
    iterateOverTilesInSectorInMinorOrder();

    // ---  --- //

    function iterateOverTilesInSectorInMajorOrder() {
      var startX, startY, centerX, centerY, majorIndex, minorIndex;

      startX = sector.baseTile.originalCenterX + sector.majorNeighborDeltaX;
      startY = sector.baseTile.originalCenterY + sector.majorNeighborDeltaY;

      // Set up the first "column"
      majorIndex = 0;
      minorIndex = 0;
      centerX = startX;
      centerY = startY;

      // Iterate over the major indices of the sector (aka, the "rows" of the sector)
      do {
        // Set up the inner array for this "row" of the sector
        sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

        // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
        do {
          // Create a new tile if one did not already exist for this position
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            createNewTileInSector.call(sector, majorIndex, minorIndex, centerX, centerY);
          }

          // Set up the next "column"
          minorIndex++;
          centerX += sector.minorNeighborDeltaX;
          centerY += sector.minorNeighborDeltaY;

        } while (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY);

        // Set up the next "row"
        majorIndex++;
        minorIndex = 0;
        centerX = startX + majorIndex * sector.majorNeighborDeltaX;
        centerY = startY + majorIndex * sector.majorNeighborDeltaY;

      } while (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY);
    }

    function iterateOverTilesInSectorInMinorOrder() {
      var startX, startY, centerX, centerY, majorIndex, minorIndex;

      startX = sector.baseTile.originalCenterX + sector.majorNeighborDeltaX;
      startY = sector.baseTile.originalCenterY + sector.majorNeighborDeltaY;

      // Set up the first "column"
      majorIndex = 0;
      minorIndex = 0;
      centerX = startX;
      centerY = startY;

      // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
      do {
        // Iterate over the major indices of the sector (aka, the "rows" of the sector)
        do {
          // Set up the inner array for this "row" of the sector
          sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

          // Create a new tile if one did not already exist for this position
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            createNewTileInSector.call(sector, majorIndex, minorIndex, centerX, centerY);
          }

          // Set up the next "row"
          majorIndex++;
          centerX += sector.majorNeighborDeltaX;
          centerY += sector.majorNeighborDeltaY;

        } while (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY);

        // Set up the next "column"
        majorIndex = 0;
        minorIndex++;
        centerX = startX + minorIndex * sector.minorNeighborDeltaX;
        centerY = startY + minorIndex * sector.minorNeighborDeltaY;

      } while (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY);
    }
  }

  /**
   * Adds the given pre-existing tile to this Sector's two-dimensional tile collection.
   *
   * Initializes the tile's expandedState configuration.
   *
   * @this Sector
   * @param {Tile} tile
   * @param {number} majorIndex
   * @param {number} minorIndex
   */
  function addOldTileToSector(tile, majorIndex, minorIndex) {
    var sector = this;
    sector.tilesByIndex[majorIndex][minorIndex] = tile;
    hg.Tile.initializeTileExpandedState(tile, sector, majorIndex, minorIndex);
  }

  /**
   * Adds a new tile to this Sector's two-dimensional tile collection.
   *
   * Initializes the new tile's expandedState configuration.
   *
   * @this Sector
   * @param {number} majorIndex
   * @param {number} minorIndex
   * @param {number} centerX
   * @param {number} centerY
   */
  function createNewTileInSector(majorIndex, minorIndex, centerX, centerY) {
    var sector = this;
    // TODO: some of the later parameters will need to be set in order for some animations to work
    //   - (BUT, the better solution is probably to just disable those animations for the expanded grid)
    var tile = new hg.Tile(sector.grid.svg, sector.grid, centerX, centerY,
        hg.Grid.config.tileOuterRadius, sector.grid.isVertical, hg.Grid.config.tileHue,
        hg.Grid.config.tileSaturation, hg.Grid.config.tileLightness, null, Number.NaN, Number.NaN,
        Number.NaN, true, false, false, false, hg.Grid.config.tileMass);
//      new hg.Tile(grid.svg, grid, centerX, centerY, config.tileOuterRadius,
//          grid.isVertical, config.tileHue, config.tileSaturation, config.tileLightness, null,
//          tileIndex, rowIndex, columnIndex, isMarginTile, isBorderTile, isCornerTile,
//          isLargerRow, config.tileMass);
    addOldTileToSector.call(sector, tile, majorIndex, minorIndex);
    sector.newTiles[sector.newTiles.length] = tile;

    return tile;
  }

  /**
   * Calculates and stores the internal neighbor states for the expanded grid configuration for
   * each tile in this Sector.
   *
   * NOTE: this does not address external neighbor relations for tiles that lie on the outside
   * edge of this sector.
   *
   * @this Sector
   */
  function initializeExpandedStateInternalTileNeighbors() {
    var sector, majorIndex, minorIndex;

    sector = this;

    // Iterate over the major indices of the sector (aka, the "rows" of the sector)
    for (majorIndex = 0; sector.tilesByIndex[majorIndex]; majorIndex += 1) {

      // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
      for (minorIndex in sector.tilesByIndex[majorIndex]) {
        setTileNeighborStates(sector, majorIndex, minorIndex);
      }
    }

    // ---  --- //

    function setTileNeighborStates(sector, majorIndex, minorIndex) {
      var tile, neighborRelationIndex, neighborMajorIndex, neighborMinorIndex;

      tile = sector.tilesByIndex[majorIndex][minorIndex];

      for (neighborRelationIndex = 0; neighborRelationIndex < 6; neighborRelationIndex += 1) {

        // Determine the major and minor indices of the current neighbor
        switch (neighborRelationIndex) {
          case sector.index:
            neighborMajorIndex = majorIndex + 1;
            neighborMinorIndex = minorIndex;
            break;
          case (sector.index + 1) % 6:// TODO: pre-compute these case values
            neighborMajorIndex = majorIndex;
            neighborMinorIndex = minorIndex + 1;
            break;
          case (sector.index + 2) % 6:
            neighborMajorIndex = majorIndex - 1;
            neighborMinorIndex = minorIndex + 1;
            break;
          case (sector.index + 3) % 6:
            neighborMajorIndex = majorIndex - 1;
            neighborMinorIndex = minorIndex;
            break;
          case (sector.index + 4) % 6:
            neighborMajorIndex = majorIndex;
            neighborMinorIndex = minorIndex - 1;
            break;
          case (sector.index + 5) % 6:
            neighborMajorIndex = majorIndex + 1;
            neighborMinorIndex = minorIndex - 1;
            break;
          default:
            throw new Error('Invalid neighborRelationIndex: ' + neighborRelationIndex);
        }

        // Has a tile been created for the neighbor position?
        if (sector.tilesByIndex[neighborMajorIndex] &&
            sector.tilesByIndex[neighborMajorIndex][neighborMinorIndex]) {

          hg.Tile.setTileNeighborState(tile, neighborRelationIndex,
              sector.tilesByIndex[neighborMajorIndex][neighborMinorIndex]);
        } else {
          tile.expandedState.isBorderTile = true;
        }
      }
    }
  }

  /**
   * Converts the two-dimensional sector.tilesByIndex array into the flat sector.tiles array.
   *
   * @this Sector
   */
  function flattenTileCollection() {
    var sector, i, majorIndex, minorIndex;

    sector = this;

    i = 0;
    for (majorIndex in sector.tilesByIndex) {
      for (minorIndex in sector.tilesByIndex[majorIndex]) {
        sector.tiles[i++] = sector.tilesByIndex[majorIndex][minorIndex];
      }
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Calculates and stores the external neighbor states for the expanded grid configuration for
   * each tile in this Sector.
   *
   * @this Sector
   * @param {Array.<Sector>} sectors
   */
  function initializeExpandedStateExternalTileNeighbors(sectors) {

    var sector, edgeTiles, minorIndex, count, lowerNeighborIndex, upperNeighborIndex,
        neighborSector, neighborMajorIndex;

    sector = this;

    edgeTiles = sector.tilesByIndex[0];

    lowerNeighborIndex = (sector.index + 2) % 6;
    upperNeighborIndex = (sector.index + 3) % 6;

    neighborSector = sectors[(sector.index + 1) % 6];

    minorIndex = sector.expandedDisplacementTileCount;
    neighborMajorIndex = 0;

    // --- Handle the first edge tile --- //

    if (edgeTiles[minorIndex]) {
      // The first edge tile with an external neighbor will only have the lower neighbor
      hg.Tile.setTileNeighborState(edgeTiles[minorIndex], lowerNeighborIndex,
          neighborSector.tilesByIndex[neighborMajorIndex][0]);
      edgeTiles[minorIndex].expandedState.isBorderTile = true;
    }

    // --- Handle the middle edge tiles --- //

    for (minorIndex += 1, count = edgeTiles.length - 1; minorIndex < count; minorIndex += 1) {

      // The upper neighbor for the last tile
      hg.Tile.setTileNeighborState(edgeTiles[minorIndex], upperNeighborIndex,
          neighborSector.tilesByIndex[neighborMajorIndex][0]);

      neighborMajorIndex += 1;

      // The lower neighbor for the last tile
      hg.Tile.setTileNeighborState(edgeTiles[minorIndex], lowerNeighborIndex,
          neighborSector.tilesByIndex[neighborMajorIndex][0]);
    }

    // --- Handle the last edge tile --- //

    if (edgeTiles[minorIndex]) {
      // The upper neighbor for the last tile
      hg.Tile.setTileNeighborState(edgeTiles[minorIndex], upperNeighborIndex,
          neighborSector.tilesByIndex[neighborMajorIndex][0]);

      neighborMajorIndex += 1;

      // The last edge tile with an external neighbor might not have the lower neighbor
      if (neighborSector.tilesByIndex[neighborMajorIndex] &&
          neighborSector.tilesByIndex[neighborMajorIndex][0]) {
        hg.Tile.setTileNeighborState(edgeTiles[minorIndex], lowerNeighborIndex,
            neighborSector.tilesByIndex[neighborMajorIndex][0]);
      }
      edgeTiles[minorIndex].expandedState.isBorderTile = true;
    }

    // --- Mark the inner edge tiles as border tiles --- //

    for (minorIndex = 0; minorIndex < sector.expandedDisplacementTileCount; minorIndex += 1) {

      edgeTiles[minorIndex].expandedState.isBorderTile = true;
    }

    // TODO: Mark the outer edge tiles as border tiles?
  }

  /**
   * Frees up memory used by this Sector.
   *
   * @this Sector
   */
  function destroy() {
    var sector, i, count;

    sector = this;

    for (i = 0, count = sector.newTiles.length; i < count; i += 1) {
      sector.newTiles[i].expandedState = null;
      sector.newTiles[i].neighborStates = null;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @global
   * @constructor
   * @param {Grid} grid
   * @param {Tile} baseTile
   * @param {number} sectorIndex
   * @param {number} expandedDisplacementTileCount
   *
   * PRE-CONDITION: the given baseTile is not a border tile (i.e., it has six neighbors)
   * PRE-CONDITION: the grid is in a closed state
   *
   * POST-CONDITION: This sector is NOT guaranteed to collect all of the pre-existing tiles in the
   * sector nor to create all of the needed new tiles in the sector (but it probably will).
   */
  function Sector(grid, baseTile, sectorIndex, expandedDisplacementTileCount) {
    var sector = this;

    sector.grid = grid;
    sector.baseTile = baseTile;
    sector.index = sectorIndex;
    sector.expandedDisplacementTileCount = expandedDisplacementTileCount;
    sector.majorNeighborDeltaX = Number.NaN;
    sector.majorNeighborDeltaY = Number.NaN;
    sector.minorNeighborDeltaX = Number.NaN;
    sector.minorNeighborDeltaY = Number.NaN;
    sector.expandedDisplacementX = Number.NaN;
    sector.expandedDisplacementY = Number.NaN;
    sector.tiles = null;
    sector.tilesByIndex = null;
    sector.newTiles = null;

    sector.initializeExpandedStateExternalTileNeighbors =
        initializeExpandedStateExternalTileNeighbors;
    sector.destroy = destroy;

    setUpExpandedDisplacementValues.call(sector);
    setUpTiles.call(sector);
  }

  Sector.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.Sector = Sector;

  console.log('Sector module loaded');
})();

'use strict';

/**
 * This module defines a constructor for Tile objects.
 *
 * Tile objects handle the particle logic and the hexagon SVG-shape logic for a single
 * hexagonal tile within a Grid.
 *
 * @module Tile
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config;

  config = {};

  // TODO: play with these
  config.dragCoeff = 0.01;

  config.neighborSpringCoeff = 0.00001;
  config.neighborDampingCoeff = 0.001;

  config.innerAnchorSpringCoeff = 0.00004;
  config.innerAnchorDampingCoeff = 0.001;

  config.borderAnchorSpringCoeff = 0.00004;
  config.borderAnchorDampingCoeff = 0.001;

  config.forceSuppressionLowerThreshold = 0.0005;
  config.velocitySuppressionLowerThreshold = 0.0005;
  // TODO: add similar, upper thresholds

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.forceSuppressionThresholdNegative = -config.forceSuppressionLowerThreshold;
    config.velocitySuppressionThresholdNegative = -config.velocitySuppressionLowerThreshold;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the polygon element for this tile.
   *
   * @this Tile
   */
  function createElement() {
    var tile, id;

    tile = this;

    id = !isNaN(tile.index) ? tile.index : parseInt(Math.random() * 1000000 + 1000);

    tile.vertexDeltas = computeVertexDeltas(tile.outerRadius, tile.isVertical);
    tile.vertices = [];
    updateVertices.call(tile, tile.centerX, tile.centerY);

    tile.element = document.createElementNS(hg.util.svgNamespace, 'polygon');
    tile.svg.appendChild(tile.element);

    tile.element.id = 'hg-' + id;
    tile.element.classList.add('hg-tile');
    tile.element.style.cursor = 'pointer';

    // Set the color and vertices
    draw.call(tile);
  }

  /**
   * Creates the particle properties for this tile.
   *
   * @this Tile
   * @param {number} mass
   */
  function createParticle(mass) {
    var tile;

    tile = this;

    tile.particle = {};
    tile.particle.px = tile.centerX;
    tile.particle.py = tile.centerY;
    tile.particle.vx = 0;
    tile.particle.vy = 0;
    tile.particle.fx = 0;
    tile.particle.fy = 0;
    tile.particle.m = mass;
    tile.particle.forceAccumulatorX = 0;
    tile.particle.forceAccumulatorY = 0;
  }

  /**
   * Computes and stores the locations of the vertices of the hexagon for this tile.
   *
   * @this Tile
   * @param {number} centerX
   * @param {number} centerY
   */
  function updateVertices(centerX, centerY) {
    var tile, trigIndex, coordIndex;

    tile = this;

    for (trigIndex = 0, coordIndex = 0; trigIndex < 6; trigIndex += 1) {
      tile.vertices[coordIndex] = centerX + tile.vertexDeltas[coordIndex++];
      tile.vertices[coordIndex] = centerY + tile.vertexDeltas[coordIndex++];
    }
  }

  /**
   * Creates a new TilePost object with this Tile's post data.
   *
   * @this Tile
   */
  function createTilePost() {
    var tile;

    tile = this;

    // TODO: tile.tilePost = new hg.TilePost(tile, tile.postData);
  }

  /**
   * Destroys this Tile's TilePost object.
   *
   * @this Tile
   */
  function destroyTilePost() {
    var tile;

    tile = this;

    // TODO: tile.tilePost.remove();

    tile.tilePost = null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Initializes some static fields that can be pre-computed.
   */
  function initStaticFields() {
    var i, theta, deltaTheta, horizontalStartTheta, verticalStartTheta;

    deltaTheta = Math.PI / 3;
    horizontalStartTheta = -deltaTheta;
    verticalStartTheta = Math.PI / 6 - 2 * deltaTheta;

    config.horizontalSines = [];
    config.horizontalCosines = [];
    for (i = 0, theta = horizontalStartTheta; i < 6; i += 1, theta += deltaTheta) {
      config.horizontalSines[i] = Math.sin(theta);
      config.horizontalCosines[i] = Math.cos(theta);
    }

    config.verticalSines = [];
    config.verticalCosines = [];
    for (i = 0, theta = verticalStartTheta; i < 6; i += 1, theta += deltaTheta) {
      config.verticalSines[i] = Math.sin(theta);
      config.verticalCosines[i] = Math.cos(theta);
    }
  }

  /**
   * Computes the offsets of the vertices from the center of the hexagon.
   *
   * @param {number} radius
   * @param {boolean} isVertical
   * @returns {Array.<number>}
   */
  function computeVertexDeltas(radius, isVertical) {
    var trigIndex, coordIndex, sines, cosines, vertexDeltas;

    // Grab the pre-computed sine and cosine values
    if (isVertical) {
      sines = config.verticalSines;
      cosines = config.verticalCosines;
    } else {
      sines = config.horizontalSines;
      cosines = config.horizontalCosines;
    }

    for (trigIndex = 0, coordIndex = 0, vertexDeltas = [];
        trigIndex < 6;
        trigIndex += 1) {
      vertexDeltas[coordIndex++] = radius * cosines[trigIndex];
      vertexDeltas[coordIndex++] = radius * sines[trigIndex];
    }

    return vertexDeltas;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this tile's content.
   *
   * @this Tile
   * @param {?Object} postData
   */
  function setContent(postData) {
    var tile, usedToHoldContent;

    tile = this;

    usedToHoldContent = tile.holdsContent;

    tile.postData = postData;
    tile.holdsContent = !!postData;

    if (usedToHoldContent) {
      destroyTilePost.call(tile);
      createTilePost.call(tile);
    } else {
      createTilePost.call(tile);
    }
  }

  /**
   * Sets this tile's neighbor tiles.
   *
   * @this Tile
   * @param {Array.<Tile>} neighborTiles
   */
  function setNeighborTiles(neighborTiles) {
    var tile, i, neighborTile;

    tile = this;

    for (i = 0; i < 6; i += 1) {
      neighborTile = neighborTiles[i];

      setTileNeighborState(tile, i, neighborTile);
    }
  }

  /**
   * Sets this tile's color values.
   *
   * @this Tile
   * @param {number} hue
   * @param {number} saturation
   * @param {number} lightness
   */
  function setColor(hue, saturation, lightness) {
    var tile = this;

    if (tile.isHighlighted) {
      hue = hue + hg.HighlightHoverJob.config.deltaHue;
      saturation = saturation + hg.HighlightHoverJob.config.deltaSaturation;
      lightness = lightness + hg.HighlightHoverJob.config.deltaLightness;
    }

    tile.originalHue = hue;
    tile.originalSaturation = saturation;
    tile.originalLightness = lightness;
    
    tile.currentHue = hue;
    tile.currentSaturation = saturation;
    tile.currentLightness = lightness;
  }

  /**
   * Sets whether this tile is highlighted.
   *
   * @this Tile
   * @param {boolean} isHighlighted
   */
  function setIsHighlighted(isHighlighted) {
    var tile, hue, saturation, lightness;

    tile = this;

    if (isHighlighted) {
      if (tile.isHighlighted) {
        // Nothing is changing
        hue = tile.originalHue;
        saturation = tile.originalSaturation;
        lightness = tile.originalLightness;
      } else {
        // Add the highlight
        hue = tile.originalHue + hg.HighlightHoverJob.config.deltaHue * hg.HighlightHoverJob.config.opacity;
        saturation = tile.originalSaturation + hg.HighlightHoverJob.config.deltaSaturation * hg.HighlightHoverJob.config.opacity;
        lightness = tile.originalLightness + hg.HighlightHoverJob.config.deltaLightness * hg.HighlightHoverJob.config.opacity;
      }
    } else {
      if (tile.isHighlighted) {
        // Remove the highlight
        hue = tile.originalHue - hg.HighlightHoverJob.config.deltaHue * hg.HighlightHoverJob.config.opacity;
        saturation = tile.originalSaturation - hg.HighlightHoverJob.config.deltaSaturation * hg.HighlightHoverJob.config.opacity;
        lightness = tile.originalLightness - hg.HighlightHoverJob.config.deltaLightness * hg.HighlightHoverJob.config.opacity;
      } else {
        // Nothing is changing
        hue = tile.originalHue;
        saturation = tile.originalSaturation;
        lightness = tile.originalLightness;
      }
    }

    tile.originalHue = hue;
    tile.originalSaturation = saturation;
    tile.originalLightness = lightness;

    tile.currentHue = hue;
    tile.currentSaturation = saturation;
    tile.currentLightness = lightness;

    tile.isHighlighted = isHighlighted;
  }

  /**
   * Update the state of this tile particle for the current time step.
   *
   * @this Tile
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var tile, i, count, neighborStates, isBorderTile, neighborState, lx, ly, lDotX, lDotY,
        dotProd, length, temp, springForceX, springForceY;

    tile = this;

    if (!tile.particle.isFixed) {

      // Some different properties should be used when the grid is expanded
      if (tile.grid.isPostOpen) {
        neighborStates = tile.expandedState.neighborStates;
        isBorderTile = tile.expandedState.isBorderTile;
      } else {
        neighborStates = tile.neighborStates;
        isBorderTile = tile.isBorderTile;
      }

      // --- Accumulate forces --- //

      // --- Drag force --- //

      tile.particle.forceAccumulatorX += -config.dragCoeff * tile.particle.vx;
      tile.particle.forceAccumulatorY += -config.dragCoeff * tile.particle.vy;

      // --- Spring forces from neighbor tiles --- //

      for (i = 0, count = neighborStates.length; i < count; i += 1) {
        neighborState = neighborStates[i];

        if (neighborState) {
          if (neighborState.springForceX) {
            tile.particle.forceAccumulatorX += neighborState.springForceX;
            tile.particle.forceAccumulatorY += neighborState.springForceY;

            neighborState.springForceX = 0;
            neighborState.springForceY = 0;
          } else {
            lx = neighborState.tile.particle.px - tile.particle.px;
            ly = neighborState.tile.particle.py - tile.particle.py;
            lDotX = neighborState.tile.particle.vx - tile.particle.vx;
            lDotY = neighborState.tile.particle.vy - tile.particle.vy;
            dotProd = lx * lDotX + ly * lDotY;
            length = Math.sqrt(lx * lx + ly * ly);

            temp = (config.neighborSpringCoeff * (length - neighborState.restLength) +
                config.neighborDampingCoeff * dotProd / length) / length;
            springForceX = lx * temp;
            springForceY = ly * temp;

            tile.particle.forceAccumulatorX += springForceX;
            tile.particle.forceAccumulatorY += springForceY;

            neighborState.neighborsRelationshipObj.springForceX = -springForceX;
            neighborState.neighborsRelationshipObj.springForceY = -springForceY;
          }
        }
      }

      // --- Spring forces from anchor point --- //

      lx = tile.centerX - tile.particle.px;
      ly = tile.centerY - tile.particle.py;
      length = Math.sqrt(lx * lx + ly * ly);

      if (length > 0) {
        lDotX = -tile.particle.vx;
        lDotY = -tile.particle.vy;
        dotProd = lx * lDotX + ly * lDotY;

        if (isBorderTile) {
          temp = (config.borderAnchorSpringCoeff * length + config.borderAnchorDampingCoeff *
              dotProd / length) / length;
        } else {
          temp = (config.innerAnchorSpringCoeff * length + config.innerAnchorDampingCoeff *
              dotProd / length) / length;
        }

        springForceX = lx * temp;
        springForceY = ly * temp;

        tile.particle.forceAccumulatorX += springForceX;
        tile.particle.forceAccumulatorY += springForceY;
      }

      // --- Update particle state --- //

      tile.particle.fx = tile.particle.forceAccumulatorX / tile.particle.m * deltaTime;
      tile.particle.fy = tile.particle.forceAccumulatorY / tile.particle.m * deltaTime;
      tile.particle.px += tile.particle.vx * deltaTime;
      tile.particle.py += tile.particle.vy * deltaTime;
      tile.particle.vx += tile.particle.fx;
      tile.particle.vy += tile.particle.fy;

      ////////////////////////////////////////////////////////////////////////////////////
      // TODO: remove me!
      var ap = tile.particle,
          apx = ap.px,
          apy = ap.py,
          avx = ap.vx,
          avy = ap.vy,
          afx = ap.fx,
          afy = ap.fy,
          afAccx = ap.forceAccumulatorX,
          afAccy = ap.forceAccumulatorY;
      if (tile.index === 0) {
        //console.log('tile 0!');
      }
      if (isNaN(tile.particle.px)) {
        console.log('tile.particle.px=' + tile.particle.px);
      }
      if (isNaN(tile.particle.py)) {
        console.log('tile.particle.py=' + tile.particle.py);
      }
      if (isNaN(tile.particle.vx)) {
        console.log('tile.particle.vx=' + tile.particle.vx);
      }
      if (isNaN(tile.particle.vy)) {
        console.log('tile.particle.vy=' + tile.particle.vy);
      }
      if (isNaN(tile.particle.fx)) {
        console.log('tile.particle.fx=' + tile.particle.fx);
      }
      if (isNaN(tile.particle.fy)) {
        console.log('tile.particle.fy=' + tile.particle.fy);
      }
      // TODO: remove me!
      ////////////////////////////////////////////////////////////////////////////////////

      // Kill all velocities and forces below a threshold
      tile.particle.fx = tile.particle.fx < config.forceSuppressionLowerThreshold &&
          tile.particle.fx > config.forceSuppressionThresholdNegative ?
          0 : tile.particle.fx;
      tile.particle.fy = tile.particle.fy < config.forceSuppressionLowerThreshold &&
          tile.particle.fy > config.forceSuppressionThresholdNegative ?
          0 : tile.particle.fy;
      tile.particle.vx = tile.particle.vx < config.velocitySuppressionLowerThreshold &&
          tile.particle.vx > config.velocitySuppressionThresholdNegative ?
          0 : tile.particle.vx;
      tile.particle.vy = tile.particle.vy < config.velocitySuppressionLowerThreshold &&
          tile.particle.vy > config.velocitySuppressionThresholdNegative ?
          0 : tile.particle.vy;

      // Reset force accumulator for next time step
      tile.particle.forceAccumulatorX = 0;
      tile.particle.forceAccumulatorY = 0;

      // Compute new vertex locations
      updateVertices.call(tile, tile.particle.px, tile.particle.py);
    }
  }

  /**
   * Update the SVG attributes for this tile to match its current particle state.
   *
   * @this Tile
   */
  function draw() {
    var tile, i, pointsString, colorString;

    tile = this;

    // --- Set the position of the TilePost --- //

    // TODO: tile.tilePost.element.top; tile.tilePost.element.left

    // --- Set the vertices --- //

    for (i = 0, pointsString = ''; i < 12;) {
      pointsString += tile.vertices[i++] + ',' + tile.vertices[i++] + ' ';
    }

    tile.element.setAttribute('points', pointsString);

    // --- Set the color --- //

    colorString = 'hsl(' + tile.currentHue + ',' +
        tile.currentSaturation + '%,' +
        tile.currentLightness + '%)';
    tile.element.setAttribute('fill', colorString);
  }

  /**
   * Adds the given force, which will take effect during the next call to update.
   *
   * @this Tile
   * @param {number} fx
   * @param {number} fy
   */
  function applyExternalForce(fx, fy) {
    var tile;

    tile = this;

    tile.particle.forceAccumulatorX += fx;
    tile.particle.forceAccumulatorY += fy;
  }

  /**
   * Fixes the position of this tile to the given coordinates.
   *
   * @this Tile
   * @param {number} px
   * @param {number} py
   */
  function fixPosition(px, py) {
    var tile;

    tile = this;

    tile.particle.isFixed = true;
    tile.particle.px = px;
    tile.particle.py = py;
  }

  /**
   * @returns {Object}
   */
  function getNeighborStates() {
    var tile = this;
    return tile.grid.isPostOpen ? tile.expandedState.neighborStates : tile.neighborStates;
  }

  /**
   * @returns {boolean}
   */
  function getIsBorderTile() {
    var tile = this;
    return tile.grid.isPostOpen ? tile.expandedState.isBorderTile : tile.isBorderTile;
  }

  /**
   * @param {boolean} isBorderTile
   */
  function setIsBorderTile(isBorderTile) {
    var tile = this;

    if (tile.grid.isPostOpen) {
      tile.expandedState.isBorderTile = isBorderTile;
    } else {
      tile.isBorderTile = isBorderTile;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Creates the neighbor-tile state for the given tile according to the given neighbor tile. Also
   * sets the reciprocal state for the neighbor tile.
   *
   * @param {Tile} tile
   * @param {number} neighborRelationIndex
   * @param {?Tile} neighborTile
   */
  function setTileNeighborState(tile, neighborRelationIndex, neighborTile) {
    var deltaX, deltaY, distance, neighborStates, neighborNeighborStates,
        neighborNeighborRelationIndex;

    neighborStates = tile.getNeighborStates();

    if (neighborTile) {
      // Determine the distance between these tiles
      deltaX = tile.centerX - neighborTile.centerX;
      deltaY = tile.centerY - neighborTile.centerY;
      distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Initialize the neighbor relation data from this tile to its neighbor
      initializeTileNeighborRelationData(neighborStates, neighborRelationIndex, neighborTile,
          distance);

      // -- Give the neighbor tile a reference to this tile --- //

      neighborNeighborStates = neighborTile.getNeighborStates();

      neighborNeighborRelationIndex = (neighborRelationIndex + 3) % 6;

      // Initialize the neighbor relation data from the neighbor to this tile
      initializeTileNeighborRelationData(neighborNeighborStates, neighborNeighborRelationIndex,
          tile, distance);

      // Share references to each other's neighbor relation objects
      neighborStates[neighborRelationIndex].neighborsRelationshipObj =
          neighborNeighborStates[neighborNeighborRelationIndex];
      neighborNeighborStates[neighborNeighborRelationIndex].neighborsRelationshipObj =
          neighborStates[neighborRelationIndex];
    } else {
      neighborStates[neighborRelationIndex] = null;
    }

    // ---  --- //

    function initializeTileNeighborRelationData(neighborStates, neighborRelationIndex, neighborTile,
                                                distance) {
      neighborStates[neighborRelationIndex] = neighborStates[neighborRelationIndex] || {
        tile: neighborTile,
        restLength: distance,
        neighborsRelationshipObj: null,
        springForceX: 0,
        springForceY: 0
      };
    }
  }

  /**
   * @param {Tile} tile
   * @param {Sector} sector
   * @param {number} majorIndex
   * @param {number} minorIndex
   */
  function initializeTileExpandedState(tile, sector, majorIndex, minorIndex) {
    tile.expandedState = {
      sector: sector,
      sectorMajorIndex: majorIndex,
      sectorMinorIndex: minorIndex,
      neighborStates: [],
      isBorderTile: false
    };
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} svg
   * @param {Grid} grid
   * @param {number} centerX
   * @param {number} centerY
   * @param {number} outerRadius
   * @param {boolean} isVertical
   * @param {number} hue
   * @param {number} saturation
   * @param {number} lightness
   * @param {?Object} postData
   * @param {number} tileIndex
   * @param {number} rowIndex
   * @param {number} columnIndex
   * @param {boolean} isMarginTile
   * @param {boolean} isBorderTile
   * @param {boolean} isCornerTile
   * @param {boolean} isInLargerRow
   * @param {number} mass
   */
  function Tile(svg, grid, centerX, centerY, outerRadius, isVertical, hue, saturation, lightness,
                   postData, tileIndex, rowIndex, columnIndex, isMarginTile, isBorderTile,
                   isCornerTile, isInLargerRow, mass) {
    var tile = this;

    tile.svg = svg;
    tile.grid = grid;
    tile.element = null;
    tile.centerX = centerX;
    tile.centerY = centerY;
    tile.originalCenterX = centerX;
    tile.originalCenterY = centerY;
    tile.outerRadius = outerRadius;
    tile.isVertical = isVertical;

    tile.originalHue = hue;
    tile.originalSaturation = saturation;
    tile.originalLightness = lightness;
    tile.currentHue = hue;
    tile.currentSaturation = saturation;
    tile.currentLightness = lightness;

    tile.postData = postData;
    tile.holdsContent = !!postData;
    tile.tilePost = null;
    tile.index = tileIndex;
    tile.rowIndex = rowIndex;
    tile.columnIndex = columnIndex;
    tile.isMarginTile = isMarginTile;
    tile.isBorderTile = isBorderTile;
    tile.isCornerTile = isCornerTile;
    tile.isInLargerRow = isInLargerRow;

    tile.expandedState = null;

    tile.isHighlighted = false;

    tile.neighborStates = [];
    tile.vertices = null;
    tile.vertexDeltas = null;
    tile.particle = null;

    tile.setContent = setContent;
    tile.setNeighborTiles = setNeighborTiles;
    tile.setColor = setColor;
    tile.setIsHighlighted = setIsHighlighted;
    tile.update = update;
    tile.draw = draw;
    tile.applyExternalForce = applyExternalForce;
    tile.fixPosition = fixPosition;
    tile.getNeighborStates = getNeighborStates;
    tile.getIsBorderTile = getIsBorderTile;
    tile.setIsBorderTile = setIsBorderTile;

    createElement.call(tile);
    createParticle.call(tile, mass);

    if (tile.holdsContent) {
      createTilePost.call(tile);
    }
  }

  Tile.setTileNeighborState = setTileNeighborState;
  Tile.initializeTileExpandedState = initializeTileExpandedState;
  Tile.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.Tile = Tile;

  initStaticFields();

  console.log('Tile module loaded');
})();

// TODO: 

// TODO: tile.element.classList.add('hg-post-tile') to any tile that contains a TilePost (and remove it when destroying the post)
// TODO: post.element.style.pointerEvents = 'none';

'use strict';

/**
 * @typedef {AnimationJob} ClosePostJob
 */

/**
 * This module defines a constructor for ClosePostJob objects.
 *
 * @module ClosePostJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   */
  function checkForComplete() {
    var job = this;

    // TODO:
//    if (???) {
//      console.log('ClosePostJob completed');
//
//      job.isComplete = true;
//      job.onComplete(true);
//    }
  }

  /**
   * @this ClosePostJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('ClosePostJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ClosePostJob as started.
   *
   * @this ClosePostJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO:
  }

  /**
   * Updates the animation progress of this ClosePostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ClosePostJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    // TODO:

    checkForComplete.call(job);
  }

  /**
   * Draws the current state of this ClosePostJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ClosePostJob
   */
  function draw() {
    var job = this;

    // TODO:
  }

  /**
   * Stops this ClosePostJob, and returns the element its original form.
   *
   * @this ClosePostJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Function} onComplete
   */
  function ClosePostJob(grid, onComplete) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;

    console.log('ClosePostJob created');
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.ClosePostJob = ClosePostJob;

  console.log('ClosePostJob module loaded');
})();

'use strict';

/**
 * @typedef {AnimationJob} HighlightHoverJob
 */

/**
 * This module defines a constructor for HighlightHoverJob objects.
 *
 * @module HighlightHoverJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  config.deltaHue = 0;
  config.deltaSaturation = 0;
  config.deltaLightness = 50;

  config.opacity = 0.5;

  config.isRecurring = false;
  config.avgDelay = 30;
  config.delayDeviationRange = 20;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this HighlightHoverJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

//    console.log('HighlightHoverJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the color of the given tile according to the given durationRatio.
   *
   * @param {Tile} tile
   * @param {number} oneMinusDurationRatio Specifies how far this animation is through its overall
   * duration.
   */
  function updateTile(tile, oneMinusDurationRatio) {
    var opacity = config.opacity * oneMinusDurationRatio;

    tile.currentHue = tile.currentHue + config.deltaHue * opacity;
    tile.currentSaturation = tile.currentSaturation + config.deltaSaturation * opacity;
    tile.currentLightness = tile.currentLightness + config.deltaLightness * opacity;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this HighlightHoverJob as started.
   *
   * @this HighlightHoverJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this HighlightHoverJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this HighlightHoverJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, oneMinusDurationRatio;

    job = this;

    if (currentTime > job.startTime + config.duration) {
      handleComplete.call(job, false);
    } else {
      oneMinusDurationRatio = 1 - (currentTime - job.startTime) / config.duration;

      updateTile(job.tile, oneMinusDurationRatio);
    }
  }

  /**
   * Draws the current state of this HighlightHoverJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this HighlightHoverJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this HighlightHoverJob, and returns the element its original form.
   *
   * @this HighlightHoverJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Tile} tile
   * @param {Function} onComplete
   */
  function HighlightHoverJob(tile, onComplete) {
    var job = this;

    job.tile = tile;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;

//    console.log('HighlightHoverJob created');
  }

  HighlightHoverJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.HighlightHoverJob = HighlightHoverJob;

  console.log('HighlightHoverJob module loaded');
})();

'use strict';

/**
 * @typedef {AnimationJob} HighlightRadiateJob
 */

/**
 * This module defines a constructor for HighlightRadiateJob objects.
 *
 * @module HighlightRadiateJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.shimmerSpeed = 3; // pixels / millisecond
  config.shimmerWaveWidth = 500;
  config.duration = 500;

  config.deltaHue = 0;
  config.deltaSaturation = 0;
  config.deltaLightness = 50;

  config.opacity = 0.5;

  config.isRecurring = false;
  config.avgDelay = 4000;
  config.delayDeviationRange = 3800;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates the distance from each tile in the grid to the starting point of this
   * HighlightRadiateJob.
   *
   * This cheats by only calculating the distance to the tiles' original center. This allows us to
   * not need to re-calculate tile distances during each time step.
   *
   * @this HighlightRadiateJob
   */
  function calculateTileDistances() {
    var job, i, count, deltaX, deltaY, distanceOffset;

    job = this;

    distanceOffset = -hg.Grid.config.tileShortLengthWithGap;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      deltaX = job.grid.tiles[i].originalCenterX - job.startPoint.x;
      deltaY = job.grid.tiles[i].originalCenterY - job.startPoint.y;
      job.tileDistances[i] = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + distanceOffset;
    }
  }

  /**
   * @this HighlightRadiateJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('HighlightRadiateJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the color of the given tile according to the given waveWidthRatio and durationRatio.
   *
   * @param {Tile} tile
   * @param {number} waveWidthRatio Specifies the tile's relative distance to the min and max
   * shimmer distances.
   * @param {number} oneMinusDurationRatio Specifies how far this animation is through its overall
   * duration.
   */
  function updateTile(tile, waveWidthRatio, oneMinusDurationRatio) {
    var opacity = config.opacity * oneMinusDurationRatio;

    tile.currentHue = tile.currentHue + config.deltaHue * waveWidthRatio * opacity;
    tile.currentSaturation =
        tile.currentSaturation + config.deltaSaturation * waveWidthRatio * opacity;
    tile.currentLightness =
        tile.currentLightness + config.deltaLightness * waveWidthRatio * opacity;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this HighlightRadiateJob as started.
   *
   * @this HighlightRadiateJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this HighlightRadiateJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this HighlightRadiateJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, currentMaxDistance, currentMinDistance, i, count, distance, waveWidthRatio,
        oneMinusDurationRatio, animatedSomeTile;

    job = this;

    if (currentTime > job.startTime + config.duration) {
      handleComplete.call(job, false);
    } else {
      oneMinusDurationRatio = 1 - (currentTime - job.startTime) / config.duration;

      currentMaxDistance = config.shimmerSpeed * (currentTime - job.startTime);
      currentMinDistance = currentMaxDistance - config.shimmerWaveWidth;

      animatedSomeTile = false;

      for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
        distance = job.tileDistances[i];

        if (distance > currentMinDistance && distance < currentMaxDistance) {
          waveWidthRatio = (distance - currentMinDistance) / config.shimmerWaveWidth;

          updateTile(job.grid.tiles[i], waveWidthRatio, oneMinusDurationRatio);

          animatedSomeTile = true;
        }
      }

      if (!animatedSomeTile) {
        handleComplete.call(job, false);
      }
    }
  }

  /**
   * Draws the current state of this HighlightRadiateJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this HighlightRadiateJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this HighlightRadiateJob, and returns the element its original form.
   *
   * @this HighlightRadiateJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {{x:number,y:number}} startPoint
   * @param {Grid} grid
   * @param {Function} [onComplete]
   */
  function HighlightRadiateJob(startPoint, grid, onComplete) {
    var job = this;

    job.grid = grid;
    job.startPoint = startPoint;
    job.tileDistances = [];
    job.startTime = 0;
    job.isComplete = false;

    job.onComplete = onComplete || function () {};

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;

    calculateTileDistances.call(job);

    console.log('HighlightRadiateJob created');
  }

  HighlightRadiateJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.HighlightRadiateJob = HighlightRadiateJob;

  console.log('HighlightRadiateJob module loaded');
})();

'use strict';

/**
 * @typedef {AnimationJob} LineJob
 */

/**
 * This module defines a constructor for LineJob objects.
 *
 * @module LineJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 2000;
  config.lineWidth = 28;
  config.lineLength = 60000;
  config.lineSidePeriod = 5; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 100;
  config.startOpacity = 0.6;

  config.endSaturation = 100;
  config.endLightness = 60;
  config.endOpacity = 0;

  config.sameDirectionProb = 0.8;

  config.blurStdDeviation = 2;
  config.isBlurOn = false;

  config.isRecurring = true;
  config.avgDelay = 2200;
  config.delayDeviationRange = 2100;

  // ---  --- //

  config.NEIGHBOR = 0;
  config.LOWER_SELF = 1;
  config.UPPER_SELF = 2;

  config.oppositeDirectionProb = 0;
  config.epsilon = 0.00001;

  config.haveDefinedLineBlur = false;
  config.filterId = 'random-line-filter';

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.distantSidewaysDirectionProb = (1 - config.sameDirectionProb) / 2;
    config.closeSidewaysDirectionProb = (1 - config.oppositeDirectionProb) / 2;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates an SVG definition that is used for blurring the lines of LineJobs.
   *
   * @this LineJob
   */
  function defineLineBlur() {
    var job, filter, feGaussianBlur;

    job = this;

    // Create the elements

    filter = document.createElementNS(hg.util.svgNamespace, 'filter');
    job.grid.svgDefs.appendChild(filter);

    feGaussianBlur = document.createElementNS(hg.util.svgNamespace, 'feGaussianBlur');
    filter.appendChild(feGaussianBlur);

    // Define the blur

    filter.setAttribute('id', config.filterId);
    filter.setAttribute('x', '-10%');
    filter.setAttribute('y', '-10%');
    filter.setAttribute('width', '120%');
    filter.setAttribute('height', '120%');

    feGaussianBlur.setAttribute('in', 'SourceGraphic');
    feGaussianBlur.setAttribute('result', 'blurOut');

    job.filter = filter;
    job.feGaussianBlur = feGaussianBlur;
  }

  /**
   * Creates the start and end hue for the line of this animation.
   *
   * @this LineJob
   */
  function createHues() {
    var job;

    job = this;

    job.startHue = Math.random() * 360;
    job.endHue = Math.random() * 360;
  }

  /**
   * Creates the polyline SVG element that is used to render this animation.
   *
   * @this LineJob
   */
  function createPolyline() {
    var job;

    job = this;

    job.polyline = document.createElementNS(hg.util.svgNamespace, 'polyline');
    job.grid.svg.insertBefore(job.polyline, job.grid.svg.firstChild);

    job.polyline.setAttribute('fill-opacity', '0');

    if (config.isBlurOn) {
      job.polyline.setAttribute('filter', 'url(#' + config.filterId + ')');
    }
  }

  /**
   * Updates the color values of the line of this animation.
   *
   * @this LineJob
   */
  function updateColorValues() {
    var job, progress, oneMinusProgress;

    job = this;

    progress = job.ellapsedTime / job.duration;
    oneMinusProgress = 1 - progress;

    job.currentHue = oneMinusProgress * job.startHue + progress * job.endHue;
    job.currentSaturation = oneMinusProgress * job.startSaturation + progress * job.endSaturation;
    job.currentLightness = oneMinusProgress * job.startLightness + progress * job.endLightness;
    job.currentOpacity = oneMinusProgress * job.startOpacity + progress * job.endOpacity;
  }

  /**
   * Updates the state of this job to handle its completion.
   *
   * @this LineJob
   */
  function handleCompletion() {
    var job;

    job = this;

    console.log('LineJob completed');

    if (job.polyline) {
      job.grid.svg.removeChild(job.polyline);
      job.polyline = null;
    }

    job.tiles = [];
    job.corners = [];
    job.direction = Number.NaN;
    job.currentCornerIndex = Number.NaN;
    job.hasReachedEdge = true;

    job.isComplete = true;

    job.onComplete(job);
  }

  /**
   * Determines whether this LineJob has reached the edge of the grid.
   *
   * @this LineJob
   */
  function checkHasAlmostReachedEdge() {
    var job;

    job = this;

    if (job.direction === (job.corners[job.currentCornerIndex] + 3) % 6) {
      // When the job is at the opposite corner of a tile from the direction it is headed, then it
      // has not reached the edge
      job.hasAlmostReachedEdge = false;
    } else {
      job.hasAlmostReachedEdge = !job.lowerNeighbors[job.currentCornerIndex] ||
          !job.upperNeighbors[job.currentCornerIndex];
    }
  }

  /**
   * Determines the neighbors of this job's current tile at the current corner.
   *
   * @this LineJob
   */
  function determineNeighbors() {
    var job, lowerNeigborTileIndex, upperNeigborTileIndex, currentCorner;

    job = this;
    currentCorner = job.corners[job.currentCornerIndex];

    if (job.grid.isVertical) {
      lowerNeigborTileIndex = (currentCorner + 5) % 6;
      upperNeigborTileIndex = currentCorner;
    } else {
      lowerNeigborTileIndex = currentCorner;
      upperNeigborTileIndex = (currentCorner + 1) % 6;
    }

    job.lowerNeighbors[job.currentCornerIndex] =
        job.tiles[job.currentCornerIndex].neighborStates[lowerNeigborTileIndex];
    job.upperNeighbors[job.currentCornerIndex] =
        job.tiles[job.currentCornerIndex].neighborStates[upperNeigborTileIndex];

    job.lowerNeighborCorners[job.currentCornerIndex] = (currentCorner + 2) % 6;
    job.upperNeighborCorners[job.currentCornerIndex] = (currentCorner + 4) % 6;
  }

  /**
   * Returns the next vertex in the path of this animation.
   *
   * @this LineJob
   */
  function chooseNextVertex() {
    var job, cornerConfig, neighborProb, lowerSelfProb, upperSelfProb, random, relativeDirection,
        absoluteDirection, nextCorner, nextTile, currentCorner;

    job = this;
    currentCorner = job.corners[job.currentCornerIndex];

    // The first segment of a line animation is forced to go in a given direction
    if (job.currentCornerIndex === 0) {
      relativeDirection = job.forcedInitialRelativeDirection;
      job.latestDirection = relativeToAbsoluteDirection(relativeDirection, currentCorner);
    } else {
      cornerConfig = (currentCorner - job.direction + 6) % 6;

      // Determine relative direction probabilities
      switch (cornerConfig) {
        case 0:
          neighborProb = job.sameDirectionProb;
          lowerSelfProb = config.distantSidewaysDirectionProb;
          upperSelfProb = config.distantSidewaysDirectionProb;
          break;
        case 1:
          neighborProb = config.closeSidewaysDirectionProb;
          lowerSelfProb = config.closeSidewaysDirectionProb;
          upperSelfProb = config.oppositeDirectionProb;
          break;
        case 2:
          neighborProb = config.distantSidewaysDirectionProb;
          lowerSelfProb = job.sameDirectionProb;
          upperSelfProb = config.distantSidewaysDirectionProb;
          break;
        case 3:
          neighborProb = config.oppositeDirectionProb;
          lowerSelfProb = config.closeSidewaysDirectionProb;
          upperSelfProb = config.closeSidewaysDirectionProb;
          break;
        case 4:
          neighborProb = config.distantSidewaysDirectionProb;
          lowerSelfProb = config.distantSidewaysDirectionProb;
          upperSelfProb = job.sameDirectionProb;
          break;
        case 5:
          neighborProb = config.closeSidewaysDirectionProb;
          lowerSelfProb = config.oppositeDirectionProb;
          upperSelfProb = config.closeSidewaysDirectionProb;
          break;
        default:
          throw new Error('Invalid state: cornerConfig=' + cornerConfig);
      }

      // Determine the next direction to travel
      do {
        // Pick a random direction
        random = Math.random();
        relativeDirection = random < neighborProb ? config.NEIGHBOR :
                random < neighborProb + lowerSelfProb ? config.LOWER_SELF : config.UPPER_SELF;
        absoluteDirection = relativeToAbsoluteDirection(relativeDirection, currentCorner);

        // Disallow the line from going back the way it just came
      } while (absoluteDirection === (job.latestDirection + 3) % 6);

      job.latestDirection = absoluteDirection;
    }

    // Determine the next corner configuration
    switch (relativeDirection) {
      case config.NEIGHBOR:
        if (job.grid.isVertical) {
          nextCorner = (currentCorner + 1) % 6;
          nextTile = job.tiles[job.currentCornerIndex].neighborStates[(currentCorner + 5) % 6].tile;
        } else {
          nextCorner = (currentCorner + 1) % 6;
          nextTile = job.tiles[job.currentCornerIndex].neighborStates[currentCorner].tile;
        }
        break;
      case config.LOWER_SELF:
        nextCorner = (currentCorner + 5) % 6;
        nextTile = job.tiles[job.currentCornerIndex];
        break;
      case config.UPPER_SELF:
        nextCorner = (currentCorner + 1) % 6;
        nextTile = job.tiles[job.currentCornerIndex];
        break;
      default:
        throw new Error('Invalid state: relativeDirection=' + relativeDirection);
    }

    job.currentCornerIndex = job.corners.length;

    job.corners[job.currentCornerIndex] = nextCorner;
    job.tiles[job.currentCornerIndex] = nextTile;

    determineNeighbors.call(job);
    checkHasAlmostReachedEdge.call(job);
  }

  /**
   * Translates the givern relative direction to an absolute direction.
   *
   * @param {number} relativeDirection
   * @param {number} corner
   * @returns {number}
   */
  function relativeToAbsoluteDirection(relativeDirection, corner) {
    switch (relativeDirection) {
      case config.NEIGHBOR:
        return corner;
      case config.LOWER_SELF:
        return (corner + 4) % 6;
      case config.UPPER_SELF:
        return (corner + 2) % 6;
      default:
        throw new Error('Invalid state: relativeDirection=' + relativeDirection);
    }
  }

  /**
   * Updates the parameters of the segments of this animation.
   *
   * @this LineJob
   */
  function updateSegments() {
    var job, distanceTravelled, frontSegmentLength, backSegmentLength, segmentsTouchedCount,
        distancePastEdge, segmentsPastEdgeCount;

    job = this;

    // --- Compute some values of the polyline at the current time --- //

    distanceTravelled = job.ellapsedTime / job.lineSidePeriod * hg.Grid.config.tileOuterRadius;
    segmentsTouchedCount = parseInt(job.ellapsedTime / job.lineSidePeriod) + 1;

    // Add additional vertices to the polyline as needed
    while (segmentsTouchedCount >= job.corners.length && !job.hasAlmostReachedEdge) {
      chooseNextVertex.call(job);
    }

    frontSegmentLength = distanceTravelled % hg.Grid.config.tileOuterRadius;
    backSegmentLength = (job.lineLength - frontSegmentLength +
        hg.Grid.config.tileOuterRadius) % hg.Grid.config.tileOuterRadius;

    job.frontSegmentEndRatio = frontSegmentLength / hg.Grid.config.tileOuterRadius;
    job.backSegmentStartRatio = 1 - (backSegmentLength / hg.Grid.config.tileOuterRadius);

    job.isShort = job.lineLength < hg.Grid.config.tileOuterRadius;
    job.isStarting = distanceTravelled < job.lineLength;

    // Check whether the line has reached the edge
    if (job.hasAlmostReachedEdge && segmentsTouchedCount >= job.corners.length) {
      job.hasReachedEdge = true;
    }

    // --- Determine how many segments are included in the polyline --- //

    // When the polyline is neither starting nor ending and is not shorter than the length of a
    // segment, then this is how many segments it includes
    job.segmentsIncludedCount = parseInt((job.lineLength - frontSegmentLength -
        backSegmentLength - config.epsilon) / hg.Grid.config.tileOuterRadius) + 2;

    // Subtract from the number of included segments depending on current conditions
    if (job.isShort) {
      // The polyline is shorter than a tile side

      if (job.isStarting || job.hasReachedEdge) {
        // One end of the polyline would lie outside the grid
        job.segmentsIncludedCount = 1;
      } else {
        if (frontSegmentLength - job.lineLength >= 0) {
          // The polyline is between corners
          job.segmentsIncludedCount = 1;
        } else {
          // The polyline is across a corner
          job.segmentsIncludedCount = 2;
        }
      }
    } else {
      // The polyline is longer than a tile side

      if (job.isStarting) {
        // The polyline is starting; the back of the polyline would lie outside the grid
        job.segmentsIncludedCount = segmentsTouchedCount;
      }

      if (job.hasReachedEdge) {
        // The polyline is ending; the front of the polyline would lie outside the grid
        segmentsPastEdgeCount = segmentsTouchedCount - job.corners.length + 1;
        distancePastEdge = distanceTravelled - (job.corners.length - 1) *
            hg.Grid.config.tileOuterRadius;

        if (distancePastEdge > job.lineLength) {
          handleCompletion.call(job);
        }

        job.segmentsIncludedCount -= segmentsPastEdgeCount;
      }
    }
  }


  /**
   * Calculates the points in the middle of the gaps between tiles at each known corner.
   *
   * @this LineJob
   */
  function computeCornerGapPoints() {
    var job, i, count;

    job = this;

    job.gapPoints = [];

    for (i = 0, count = job.corners.length; i < count; i += 1) {
      job.gapPoints[i] = computeCornerGapPoint(job.tiles[i], job.corners[i], job.lowerNeighbors[i],
          job.upperNeighbors[i], job.lowerNeighborCorners[i], job.upperNeighborCorners[i]);
    }
  }

  /**
   * Calculates the point in the middle of the gap between tiles at the given corner.
   *
   * @param {Tile} tile
   * @param {number} corner
   * @param {Object} lowerNeighbor
   * @param {Object} upperNeighbor
   * @param {number} lowerNeighborCorner
   * @param {number} upperNeighborCorner
   * @returns {{x:number,y:number}}
   */
  function computeCornerGapPoint(tile, corner, lowerNeighbor, upperNeighbor, lowerNeighborCorner,
                             upperNeighborCorner) {
    var count, xSum, ySum;

    if (lowerNeighbor) {
      if (upperNeighbor) {
        count = 3;
        xSum = tile.particle.px + lowerNeighbor.tile.particle.px + upperNeighbor.tile.particle.px;
        ySum = tile.particle.py + lowerNeighbor.tile.particle.py + upperNeighbor.tile.particle.py;
      } else {
        count = 2;
        xSum = tile.vertices[corner * 2] + lowerNeighbor.tile.vertices[lowerNeighborCorner * 2];
        ySum = tile.vertices[corner * 2 + 1] +
            lowerNeighbor.tile.vertices[lowerNeighborCorner * 2 + 1];
      }
    } else {
      if (upperNeighbor) {
        count = 2;
        xSum = tile.vertices[corner * 2] + upperNeighbor.tile.vertices[upperNeighborCorner * 2];
        ySum = tile.vertices[corner * 2 + 1] +
            upperNeighbor.tile.vertices[upperNeighborCorner * 2 + 1];
      } else {
        count = 1;
        xSum = tile.vertices[corner * 2];
        ySum = tile.vertices[corner * 2 + 1];
      }
    }

    return {
      x: xSum / count,
      y: ySum / count
    };
  }

  /**
   * Calculates the points of the SVG polyline element.
   *
   * @this LineJob
   */
  function computePolylinePoints() {
    var job, gapPointsIndex, polylinePointsIndex, stopIndex;

    job = this;

    job.polylinePoints = [];
    gapPointsIndex = job.currentCornerIndex;

    if (job.extraStartPoint && job.isStarting) {
      // Add the extra, forced initial point (this is useful for making radiating lines actually
      // start from the center of the tile and not show any gap around the corners of the tile)
      job.polylinePoints[0] = job.extraStartPoint;

      polylinePointsIndex = job.segmentsIncludedCount + 1;
      stopIndex = 1;
    } else {
      polylinePointsIndex = job.segmentsIncludedCount;
      stopIndex = 0;
    }

    // Add the front-end segment point
    if (!job.hasReachedEdge) {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex].x * job.frontSegmentEndRatio +
            job.gapPoints[gapPointsIndex - 1].x * (1 - job.frontSegmentEndRatio),
        y: job.gapPoints[gapPointsIndex].y * job.frontSegmentEndRatio +
            job.gapPoints[gapPointsIndex - 1].y * (1 - job.frontSegmentEndRatio)
      };
    } else {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex].x,
        y: job.gapPoints[gapPointsIndex].y
      };
    }

    polylinePointsIndex -= 1;
    gapPointsIndex -= 1;

    // Add the internal segment points
    for (; polylinePointsIndex > stopIndex; polylinePointsIndex -= 1, gapPointsIndex -= 1) {
      job.polylinePoints[polylinePointsIndex] = job.gapPoints[gapPointsIndex];
    }

    // Add the back-end segment point
    if (!job.isStarting) {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex + 1].x * job.backSegmentStartRatio +
            job.gapPoints[gapPointsIndex].x * (1 - job.backSegmentStartRatio),
        y: job.gapPoints[gapPointsIndex + 1].y * job.backSegmentStartRatio +
            job.gapPoints[gapPointsIndex].y * (1 - job.backSegmentStartRatio)
      }
    } else {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex].x,
        y: job.gapPoints[gapPointsIndex].y
      };
    }
  }

  /**
   * Updates the actual SVG elements to render the current state of this animation.
   *
   * @this LineJob
   */
  function drawSegments() {
    var job, i, count, pointsString;

    job = this;

    // Create the points string
    pointsString = '';
    for (i = 0, count = job.polylinePoints.length; i < count; i += 1) {
      pointsString += job.polylinePoints[i].x + ',' + job.polylinePoints[i].y + ' ';
    }

    // Update the attributes of the polyline SVG element
    job.polyline.setAttribute('points', pointsString);
    job.polyline.setAttribute('stroke', 'hsl(' + job.currentHue + ',' + job.currentSaturation +
        '%,' + job.currentLightness + '%)');
    job.polyline.setAttribute('stroke-opacity', job.currentOpacity);
    job.polyline.setAttribute('stroke-width', job.lineWidth);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this LineJob as started.
   *
   * @this LineJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this LineJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this LineJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    job.ellapsedTime = currentTime - job.startTime;

    if (job.ellapsedTime >= job.duration) {
      handleCompletion.call(job);
    } else {
      updateColorValues.call(job);
      updateSegments.call(job);

      job.feGaussianBlur.setAttribute('stdDeviation', job.blurStdDeviation);

      if (!job.isComplete) {
        computeCornerGapPoints.call(job);
        computePolylinePoints.call(job);
      }
    }
  }

  /**
   * Draws the current state of this LineJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this LineJob
   */
  function draw() {
    var job = this;

    drawSegments.call(job);
  }

  /**
   * Stops this LineJob, and returns the element its original form.
   *
   * @this LineJob
   */
  function cancel() {
    var job;

    job = this;

    handleCompletion.call(job);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {number} corner
   * @param {number} direction
   * @param {number} forcedInitialRelativeDirection
   * @param {Function} [onComplete]
   * @param {{x:number,y:number}} extraStartPoint
   * @throws {Error}
   */
  function LineJob(grid, tile, corner, direction, forcedInitialRelativeDirection,
                            onComplete, extraStartPoint) {
    var job = this;

    job.grid = grid;
    job.tiles = [tile];
    job.corners = [corner];
    job.lowerNeighbors = [];
    job.upperNeighbors = [];
    job.lowerNeighborCorners = [];
    job.upperNeighborCorners = [];
    job.direction = direction;
    job.forcedInitialRelativeDirection = forcedInitialRelativeDirection;
    job.extraStartPoint = extraStartPoint;
    job.currentCornerIndex = 0;
    job.frontSegmentEndRatio = Number.NaN;
    job.backSegmentStartRatio = Number.NaN;
    job.latestDirection = direction;
    job.polyline = null;
    job.gapPoints = [];
    job.polylinePoints = null;
    job.hasReachedEdge = false;
    job.startTime = 0;
    job.ellapsedTime = 0;
    job.isComplete = false;

    job.startHue = Number.NaN;
    job.endHue = Number.NaN;
    job.currentHue = Number.NaN;

    job.duration = config.duration;
    job.lineWidth = config.lineWidth;
    job.lineLength = config.lineLength;
    job.lineSidePeriod = config.lineSidePeriod;

    job.startSaturation = config.startSaturation;
    job.startLightness = config.startLightness;
    job.startOpacity = config.startOpacity;

    job.endSaturation = config.endSaturation;
    job.endLightness = config.endLightness;
    job.endOpacity = config.endOpacity;

    job.sameDirectionProb = config.sameDirectionProb;

    job.blurStdDeviation = config.blurStdDeviation;
    job.isBlurOn = config.isBlurOn;

    job.currentSaturation = config.startSaturation;
    job.currentLightness = config.startLightness;
    job.currentOpacity = config.startOpacity;

    job.onComplete = onComplete || function () {};

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;

    if (!config.haveDefinedLineBlur) {
      defineLineBlur.call(job);
    }

    if (!checkIsValidInitialCornerConfiguration(job)) {
      throw new Error('LineJob created with invalid initial corner configuration: ' +
          'tileIndex=' + tile.index + ', corner=' + corner + ', direction=' + direction);
    } else {
      determineNeighbors.call(job);
      createHues.call(job);
      createPolyline.call(job);

      console.log('LineJob created: tileIndex=' + tile.index + ', corner=' + corner +
          ', direction=' + direction);
    }
  }

  /**
   * Creates a LineJob that is initialized at a tile vertex along the border of the grid.
   *
   * @param {Grid} grid
   * @param {Function} onComplete
   */
  function createRandomLineJob(grid, onComplete) {
    var tile, corner, direction, forcedInitialRelativeDirection;

    // Pick a random, non-corner, border tile to start from
    do {
      tile = grid.borderTiles[parseInt(Math.random() * grid.borderTiles.length)];
    } while (tile.isCornerTile);

    // Determine which corner and direction to use based on the selected tile
    if (grid.isVertical) {
      if (!tile.neighborStates[4]) { // Left side
        if (tile.isInLargerRow) {
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 1;
          }
        } else { // Smaller row
          if (Math.random() < 0.5) {
            corner = 4;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 5;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 1;
          }
        }
        direction = tile.originalCenterY < grid.centerY ? 2 : 1;
      } else if (!tile.neighborStates[1]) { // Right side
        if (tile.isInLargerRow) {
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 4;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          }
        } else { // Smaller row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          } else {
            corner = 2;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 4;
          }
        }
        direction = tile.originalCenterY < grid.centerY ? 4 : 5;
      } else if (!tile.neighborStates[0]) { // Top side
        if (Math.random() < 0.5) {
          corner = 1;
          forcedInitialRelativeDirection = config.UPPER_SELF;
        } else {
          corner = 5;
          forcedInitialRelativeDirection = config.LOWER_SELF;
        }
        //forcedInitialAbsoluteDirection = 3;
        direction = 3;
      } else { // Bottom side
        if (Math.random() < 0.5) {
          corner = 2;
          forcedInitialRelativeDirection = config.LOWER_SELF;
        } else {
          corner = 4;
          forcedInitialRelativeDirection = config.UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 0;
        direction = 0;
      }
    } else { // Not vertical
      if (!tile.neighborStates[0]) { // Top side
        if (tile.rowIndex === 0) { // First row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 3;
          } else {
            corner = 4;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          }
        } else { // Second row
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 5;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 3;
          }
        }
        direction = tile.originalCenterX < grid.centerX ? 2 : 3;
      } else if (!tile.neighborStates[3]) { // Bottom side
        if (tile.rowIndex === grid.rowCount - 1) { // Last row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          } else {
            corner = 4;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 0;
          }
        } else { // Second-to-last row
          if (Math.random() < 0.5) {
            corner = 2;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 0;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          }
        }
        direction = tile.originalCenterX < grid.centerX ? 0 : 5;
      } else if (!tile.neighborStates[4]) { // Left side
        if (Math.random() < 0.5) {
          corner = 3;
          forcedInitialRelativeDirection = config.LOWER_SELF;
        } else {
          corner = 5;
          forcedInitialRelativeDirection = config.UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 1;
        direction = 1;
      } else { // Right side
        if (Math.random() < 0.5) {
          corner = 0;
          forcedInitialRelativeDirection = config.LOWER_SELF;
        } else {
          corner = 2;
          forcedInitialRelativeDirection = config.UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 4;
        direction = 4;
      }
    }

    return new LineJob(grid, tile, corner, direction, forcedInitialRelativeDirection,
        onComplete, null);
  }

  /**
   * Checks whether the given LineJob has a valid corner configuration for its initial
   * position.
   *
   * @param {LineJob} job
   */
  function checkIsValidInitialCornerConfiguration(job) {
    var tile, corner, direction, forcedInitialRelativeDirection, isValidEdgeDirection;

    tile = job.tiles[0];
    corner = job.corners[0];
    direction = job.direction;
    forcedInitialRelativeDirection = job.forcedInitialRelativeDirection;

    if (tile.isCornerTile) {
      return false;
    }

    if (tile.isBorderTile) {
      if (job.grid.isVertical) {
        if (!tile.neighborStates[4]) { // Left side
          isValidEdgeDirection = direction === 1 || direction === 2;

          if (tile.isInLargerRow) {
            switch (corner) {
              case 0:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 1:
                return true;
              case 2:
                return true;
              case 3:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 4:
                return false;
              case 5:
                return false;
            }
          } else {
            switch (corner) {
              case 0:
                return true;
              case 1:
                return true;
              case 2:
                return true;
              case 3:
                return true;
              case 4:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 5:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
            }
          }
        } else if (!tile.neighborStates[1]) { // Right side
          isValidEdgeDirection = direction === 4 || direction === 5;

          if (tile.isInLargerRow) {
            switch (corner) {
              case 0:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 1:
                return false;
              case 2:
                return false;
              case 3:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 4:
                return true;
              case 5:
                return true;
            }
          } else { // Smaller row
            switch (corner) {
              case 0:
                return true;
              case 1:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 2:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 3:
                return true;
              case 4:
                return true;
              case 5:
                return true;
            }
          }
        } else if (!tile.neighborStates[0]) { // Top side
          isValidEdgeDirection = direction === 3;

          switch (corner) {
            case 0:
              return false;
            case 1:
              return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
            case 2:
              return true;
            case 3:
              return true;
            case 4:
              return true;
            case 5:
              return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
          }
        } else { // Bottom side
          isValidEdgeDirection = direction === 0;

          switch (corner) {
            case 0:
              return true;
            case 1:
              return true;
            case 2:
              return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
            case 3:
              return false;
            case 4:
              return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
            case 5:
              return true;
          }
        }
      } else { // Not vertical
        if (!tile.neighborStates[0]) { // Top side
          isValidEdgeDirection = direction === 2 || direction === 3;

          if (tile.rowIndex === 0) { // First row
            switch (corner) {
              case 0:
                return false;
              case 1:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 2:
                return true;
              case 3:
                return true;
              case 4:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 5:
                return false;
            }
          } else { // Second row
            switch (corner) {
              case 0:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 1:
                return true;
              case 2:
                return true;
              case 3:
                return true;
              case 4:
                return true;
              case 5:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
            }
          }
        } else if (!tile.neighborStates[3]) { // Bottom side
          isValidEdgeDirection = direction === 0 || direction === 5;

          if (tile.rowIndex === job.grid.rowCount - 1) { // Last row
            switch (corner) {
              case 0:
                return true;
              case 1:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 2:
                return false;
              case 3:
                return false;
              case 4:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 5:
                return true;
            }
          } else { // Second-to-last row
            switch (corner) {
              case 0:
                return true;
              case 1:
                return true;
              case 2:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 3:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 4:
                return true;
              case 5:
                return true;
            }
          }
        } else if (!tile.neighborStates[4]) { // Left side
          isValidEdgeDirection = direction === 1;

          switch (corner) {
            case 0:
              return true;
            case 1:
              return true;
            case 2:
              return true;
            case 3:
              return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
            case 4:
              return false;
            case 5:
              return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
          }
        } else { // Right side
          isValidEdgeDirection = direction === 4;

          switch (corner) {
            case 0:
              return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
            case 1:
              return false;
            case 2:
              return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
            case 3:
              return true;
            case 4:
              return true;
            case 5:
              return true;
          }
        }
      }
    }

    return true;
  }

  LineJob.config = config;
  LineJob.createRandomLineJob = createRandomLineJob;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.LineJob = LineJob;

  console.log('LineJob module loaded');
})();

'use strict';

/**
 * @typedef {AnimationJob} LinesRadiateJob
 */

/**
 * This module defines a constructor for LinesRadiateJob objects.
 *
 * @module LinesRadiateJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 700;
  config.lineWidth = 24;
  config.lineLength = 1300;
  config.lineSidePeriod = 30; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 100;
  config.startOpacity = 0.8;

  config.endSaturation = 100;
  config.endLightness = 70;
  config.endOpacity = 0;

  config.sameDirectionProb = 0.85;

  config.blurStdDeviation = 2;
  config.isBlurOn = false;

  config.isRecurring = false;
  config.avgDelay = 2000;
  config.delayDeviationRange = 1800;

  // ---  --- //

  config.haveDefinedLineBlur = false;
  config.filterId = 'random-line-filter';

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates an SVG definition that is used for blurring the lines of LineJobs.
   *
   * @this LinesRadiateJob
   */
  function defineLineBlur() {
    var job, filter, feGaussianBlur;

    job = this;

    // Create the elements

    filter = document.createElementNS(hg.util.svgNamespace, 'filter');
    job.grid.svgDefs.appendChild(filter);

    feGaussianBlur = document.createElementNS(hg.util.svgNamespace, 'feGaussianBlur');
    filter.appendChild(feGaussianBlur);

    // Define the blur

    filter.setAttribute('id', config.filterId);
    filter.setAttribute('x', '-10%');
    filter.setAttribute('y', '-10%');
    filter.setAttribute('width', '120%');
    filter.setAttribute('height', '120%');

    feGaussianBlur.setAttribute('in', 'SourceGraphic');
    feGaussianBlur.setAttribute('result', 'blurOut');

    job.feGaussianBlur = feGaussianBlur;
  }

  /**
   * Creates the individual LineJobs that comprise this LinesRadiateJob.
   *
   * @this LinesRadiateJob
   */
  function createLineJobs() {
    var job, i, line;

    job = this;
    job.lineJobs = [];

    for (i = 0; i < 6; i += 1) {
      try {
        line = new hg.LineJob(job.grid, job.tile, i, i,
            hg.LineJob.config.NEIGHBOR, job.onComplete, job.extraStartPoint);
      } catch (error) {
        console.debug(error.message);
        continue;
      }

      job.lineJobs.push(line);

      // Replace the line animation's normal parameters with some that are specific to radiating
      // lines
      line.duration = config.duration;
      line.lineWidth = config.lineWidth;
      line.lineLength = config.lineLength;
      line.lineSidePeriod = config.lineSidePeriod;

      line.startSaturation = config.startSaturation;
      line.startLightness = config.startLightness;
      line.startOpacity = config.startOpacity;

      line.endSaturation = config.endSaturation;
      line.endLightness = config.endLightness;
      line.endOpacity = config.endOpacity;

      line.sameDirectionProb = config.sameDirectionProb;

      line.filterId = config.filterId;
      line.blurStdDeviation = config.blurStdDeviation;
      line.isBlurOn = config.isBlurOn;

      if (config.isBlurOn) {
        line.polyline.setAttribute('filter', 'url(#' + config.filterId + ')');
      } else {
        line.polyline.setAttribute('filter', 'none');
      }
    }
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   *
   * @this LinesRadiateJob
   */
  function checkForComplete() {
    var job, i;

    job = this;

    for (i = 0; i < job.lineJobs.length; i += 1) {
      if (job.lineJobs[i].isComplete) {
        job.lineJobs.splice(i--, 1);
      } else {
        return;
      }
    }

    console.log('LinesRadiateJob completed');

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this LinesRadiateJob as started.
   *
   * @this LinesRadiateJob
   */
  function start() {
    var job, i, count;

    job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      job.lineJobs[i].start();
    }
  }

  /**
   * Updates the animation progress of this LinesRadiateJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this LinesRadiateJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    // Update the extra point
    job.extraStartPoint.x = job.tile.particle.px;
    job.extraStartPoint.y = job.tile.particle.py;

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      job.lineJobs[i].update(currentTime, deltaTime);

      if (job.lineJobs[i].isComplete) {
        job.lineJobs.splice(i, 1);
        i--;
        count--;
      }
    }

    job.feGaussianBlur.setAttribute('stdDeviation', config.blurStdDeviation);

    checkForComplete.call(job);
  }

  /**
   * Draws the current state of this LinesRadiateJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this LinesRadiateJob
   */
  function draw() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      job.lineJobs[i].draw();
    }
  }

  /**
   * Stops this LinesRadiateJob, and returns the element its original form.
   *
   * @this LinesRadiateJob
   */
  function cancel() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      job.lineJobs[i].cancel();
    }

    job.lineJobs = [];

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} [onComplete]
   */
  function LinesRadiateJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.extraStartPoint = { x: tile.particle.px, y: tile.particle.py };
    job.startTime = 0;
    job.isComplete = false;
    job.lineJobs = null;

    job.onComplete = onComplete || function () {};

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;

    if (!config.haveDefinedLineBlur) {
      defineLineBlur.call(job);
    }

    createLineJobs.call(job);

    console.log('LinesRadiateJob created: tileIndex=' + tile.index);
  }

  LinesRadiateJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.LinesRadiateJob = LinesRadiateJob;

  console.log('LinesRadiateJob module loaded');
})();

'use strict';

/**
 * @typedef {AnimationJob} OpenPostJob
 */

/**
 * This module defines a constructor for OpenPostJob objects.
 *
 * @module OpenPostJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.expandedDisplacementTileCount = 3;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   */
  function checkForComplete() {
    var job = this;

    // TODO:
//    if (???) {
//      console.log('OpenPostJob completed');
//
//      job.isComplete = true;
//      job.onComplete(true);
//    }
  }

  /**
   * @this OpenPostJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('OpenPostJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    // TODO:
    // - reactivate neighbor forces; but make sure they are now using their temporary expanded neighborStates
    // - keep the sectors to re-use for closing

    // TODO: when closing the grid, make sure to de-allocate the sector objects and the tile.expandedState properties (sector.destroy)

    job.grid.isTransitioning = false;

    job.isComplete = true;

    job.onComplete();
  }

  /**
   * Creates the Sectors for expanding the grid.
   *
   * @this OpenPostJob
   */
  function createSectors() {
    var job, i;

    job = this;

    job.grid.sectors = [];

    // Create the sectors
    for (i = 0; i < 6; i += 1) {
      job.grid.sectors[i] =
          new hg.Sector(job.grid, job.baseTile, i, config.expandedDisplacementTileCount);
    }

    // Connect the sectors' tiles' external neighbor states
    for (i = 0; i < 6; i += 1) {
      job.grid.sectors[i].initializeExpandedStateExternalTileNeighbors(job.grid.sectors);
    }

    dumpSectorInfo.call(job);// TODO: comment this out

    // De-allocate the now-unnecessary two-dimensional sector tile collections
    for (i = 0; i < 6; i += 1) {
      job.grid.sectors[i].tilesByIndex = null;
    }

    // Set up the expanded state for the selected tile (which is a member of no sector)
    hg.Tile.initializeTileExpandedState(job.baseTile, null, Number.NaN, Number.NaN);
  }

  /**
   * Logs the new Sector data.
   *
   * @this OpenPostJob
   */
  function dumpSectorInfo() {
    var job, i;

    job = this;

    for (i = 0; i < 6; i += 1) {
      console.log(job.grid.sectors[i]);// TODO: print out something that's more helpful
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this OpenPostJob as started.
   *
   * @this OpenPostJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    job.grid.isPostOpen = true;
    job.grid.isTransitioning = true;

    createSectors.call(job);

    job.grid.annotations.setExpandedAnnotations(true);


    // TODO:
    // - make sure that we are handling three different logical states for all appropriate logic in the app: closed, transitioning, open

    // TODO:
    // - deactivate all neighbor forces
    // - start tapering all current animations to zero
    // - start the panning animation to center on the given tile position
    // - calculate which positions will need additional tiles for the expanded grid at the new panned location
    // - create the new tiles; store them in auxiliary arrays within the new sector objects
  }

  /**
   * Updates the animation progress of this OpenPostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this OpenPostJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    // TODO:
    // - update the base offsets for each of the six sectors
    // -

    checkForComplete.call(job);
  }

  /**
   * Draws the current state of this OpenPostJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this OpenPostJob
   */
  function draw() {
    var job = this;

    // TODO:
  }

  /**
   * Stops this OpenPostJob, and returns the element its original form.
   *
   * @this OpenPostJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} baseTile
   * @param {Function} onComplete
   */
  function OpenPostJob(grid, baseTile, onComplete) {
    var job = this;

    job.grid = grid;
    job.baseTile = baseTile;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;

    console.log('OpenPostJob created');
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.OpenPostJob = OpenPostJob;

  console.log('OpenPostJob module loaded');
})();

'use strict';

/**
 * @typedef {AnimationJob} ColorResetJob
 */

/**
 * This module defines a constructor for ColorResetJob objects.
 *
 * ColorResetJob objects reset tile color values during each animation frame.
 *
 * @module ColorResetJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ColorResetJob as started.
   *
   * @this ColorResetJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorResetJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorResetJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      job.grid.tiles[i].currentHue = job.grid.tiles[i].originalHue;
      job.grid.tiles[i].currentSaturation = job.grid.tiles[i].originalSaturation;
      job.grid.tiles[i].currentLightness = job.grid.tiles[i].originalLightness;
    }
  }

  /**
   * Draws the current state of this ColorResetJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorResetJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorResetJob, and returns the element its original form.
   *
   * @this ColorResetJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function ColorResetJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = function () {
    };

    job.init();

    console.log('ColorResetJob created');
  }

  ColorResetJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.ColorResetJob = ColorResetJob;

  console.log('ColorResetJob module loaded');
})();

'use strict';

/**
 * @typedef {AnimationJob} ColorShiftJob
 */

/**
 * This module defines a constructor for ColorShiftJob objects.
 *
 * ColorShiftJob objects animate the colors of the tiles in a random fashion.
 *
 * @module ColorShiftJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  // TODO:

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    // TODO:
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ColorShiftJob as started.
   *
   * @this ColorShiftJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorShiftJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorShiftJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job;

    job = this;

    // TODO:
  }

  /**
   * Draws the current state of this ColorShiftJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorShiftJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorShiftJob.
   *
   * @this ColorShiftJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function ColorShiftJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = function () {
      config.computeDependentValues();
    };

    job.init();

    console.log('ColorShiftJob created');
  }

  ColorShiftJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.ColorShiftJob = ColorShiftJob;

  console.log('ColorShiftJob module loaded');
})();

'use strict';

/**
 * @typedef {AnimationJob} ColorWaveJob
 */

/**
 * This module defines a constructor for ColorWaveJob objects.
 *
 * ColorWaveJob objects animate the tiles of a Grid in order to create waves of color.
 *
 * @module ColorWaveJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.period = 1000;
  config.wavelength = 600;
  config.originX = -100;
  config.originY = 1400;

  // Amplitude (will range from negative to positive)
  config.deltaHue = 0;
  config.deltaSaturation = 0;
  config.deltaLightness = 5;

  config.opacity = 0.5;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.halfPeriod = config.period / 2;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates a wave offset value for each tile according to their positions in the grid.
   *
   * @this ColorWaveJob
   */
  function initTileProgressOffsets() {
    var job, i, count, tile, length, deltaX, deltaY, halfWaveProgressWavelength;

    job = this;

    halfWaveProgressWavelength = config.wavelength / 2;
    job.waveProgressOffsets = [];

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      tile = job.grid.tiles[i];

      deltaX = tile.originalCenterX - config.originX;
      deltaY = tile.originalCenterY - config.originY;
      length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + config.wavelength;

      job.waveProgressOffsets[i] = -(length % config.wavelength - halfWaveProgressWavelength)
          / halfWaveProgressWavelength;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the animation progress of the given tile.
   *
   * @param {number} progress
   * @param {Tile} tile
   * @param {number} waveProgressOffset
   */
  function updateTile(progress, tile, waveProgressOffset) {
    var tileProgress =
        Math.sin(((((progress + 1 + waveProgressOffset) % 2) + 2) % 2 - 1) * Math.PI);

    tile.currentHue = tile.currentHue + config.deltaHue * tileProgress * config.opacity;
    tile.currentSaturation =
        tile.currentSaturation + config.deltaSaturation * tileProgress * config.opacity;
    tile.currentLightness =
        tile.currentLightness + config.deltaLightness * tileProgress * config.opacity;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ColorWaveJob as started.
   *
   * @this ColorWaveJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorWaveJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorWaveJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count;

    job = this;

    progress = (currentTime + config.halfPeriod) / config.period % 2 - 1;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      updateTile(progress, job.grid.tiles[i], job.waveProgressOffsets[i]);
    }
  }

  /**
   * Draws the current state of this ColorWaveJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorWaveJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorWaveJob, and returns the element its original form.
   *
   * @this ColorWaveJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function ColorWaveJob(grid) {
    var job = this;

    job.grid = grid;
    job.waveProgressOffsets = null;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = function () {
      config.computeDependentValues();
      initTileProgressOffsets.call(job);
    };

    job.init();

    console.log('ColorWaveJob created');
  }

  ColorWaveJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.ColorWaveJob = ColorWaveJob;

  console.log('ColorWaveJob module loaded');
})();

'use strict';

/**
 * @typedef {AnimationJob} DisplacementWaveJob
 */

/**
 * This module defines a constructor for DisplacementWaveJob objects.
 *
 * DisplacementWaveJob objects animate the tiles of a Grid in order to create waves of
 * motion.
 *
 * @module DisplacementWaveJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.period = 3200;
  config.wavelength = 1800;
  config.originX = 0;
  config.originY = 0;

  // Amplitude (will range from negative to positive)
  config.tileDeltaX = -15;
  config.tileDeltaY = -config.tileDeltaX * Math.sqrt(3);

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.halfPeriod = config.period / 2;

    config.displacementAmplitude =
        Math.sqrt(config.tileDeltaX * config.tileDeltaX +
            config.tileDeltaY * config.tileDeltaY);
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates a wave offset value for each tile according to their positions in the grid.
   *
   * @this DisplacementWaveJob
   */
  function initTileProgressOffsets() {
    var job, i, count, tile, length, deltaX, deltaY, halfWaveProgressWavelength;

    job = this;

    halfWaveProgressWavelength = config.wavelength / 2;
    job.waveProgressOffsets = [];

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      tile = job.grid.tiles[i];

      deltaX = tile.originalCenterX - config.originX;
      deltaY = tile.originalCenterY - config.originY;
      length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + config.wavelength;

      job.waveProgressOffsets[i] = -(length % config.wavelength - halfWaveProgressWavelength)
          / halfWaveProgressWavelength;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the animation progress of the given tile.
   *
   * @param {number} progress
   * @param {Tile} tile
   * @param {number} waveProgressOffset
   */
  function updateTile(progress, tile, waveProgressOffset) {
    var tileProgress =
        Math.sin(((((progress + 1 + waveProgressOffset) % 2) + 2) % 2 - 1) * Math.PI);

    tile.centerX = tile.originalCenterX + config.tileDeltaX * tileProgress;
    tile.centerY = tile.originalCenterY + config.tileDeltaY * tileProgress;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this DisplacementWaveJob as started.
   *
   * @this DisplacementWaveJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this DisplacementWaveJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this DisplacementWaveJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count;

    job = this;

    progress = (currentTime + config.halfPeriod) / config.period % 2 - 1;

    for (i = 0, count = job.grid.tiles.length; i < count; i += 1) {
      updateTile(progress, job.grid.tiles[i], job.waveProgressOffsets[i]);
    }
  }

  /**
   * Draws the current state of this DisplacementWaveJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this DisplacementWaveJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this DisplacementWaveJob, and returns the element its original form.
   *
   * @this DisplacementWaveJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function DisplacementWaveJob(grid) {
    var job = this;

    job.grid = grid;
    job.waveProgressOffsets = null;
    job.startTime = 0;
    job.isComplete = false;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = function () {
      config.computeDependentValues();
      initTileProgressOffsets.call(job);
    };

    job.init();

    console.log('DisplacementWaveJob created');
  }

  DisplacementWaveJob.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.DisplacementWaveJob = DisplacementWaveJob;

  console.log('DisplacementWaveJob module loaded');
})();
