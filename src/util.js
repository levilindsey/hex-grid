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
    element.setAttribute('class', element.className + ' ' + className);
  }

  /**
   * Removes the given class from the given element.
   *
   * @param {HTMLElement} element The element to remove the class from.
   * @param {String} className The class to remove.
   */
  function removeClass(element, className) {
    element.setAttribute('class', element.className.split(' ').filter(function (value) {
      return value !== className;
    }).join(' '));
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
   * @returns {String} The query string parameter value, or null if the parameter was not found.
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
   * Sets the CSS transition style of the given element.
   *
   * @param {HTMLElement} element The element.
   * @param {Number} value The transition string.
   */
  function setTransition(element, value) {
    element.style.transition = value;
    element.style.WebkitTransition = value;
    element.style.MozTransition = value;
    element.style.msTransition = value;
    element.style.OTransition = value;
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
   * Sets the userSelect style of the given element to 'none'.
   *
   * @param {HTMLElement} element
   */
  function setUserSelectNone(element) {
    element.style.userSelect = 'none';
    element.style.webkitUserSelect = 'none';
    element.style.MozUserSelect = 'none';
    element.style.msUserSelect = 'none';
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
   * @param {Number} percent Expressed as a number between 0 and 1.
   * @param {Array.<{x:Number,y:Number}>} controlPoints
   * @returns {{x:Number,y:Number}}
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
   * @param {String} transform
   */
  function setTransform(element, transform) {
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
   * @param {Number} pointX
   * @param {Number} pointY
   * @param {Array.<Number>} coordinates
   * @param {Boolean} isClosed
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
   * This only copies enumerable properties.
   *
   * @param {Object} object
   * @returns {Object}
   */
  function shallowCopy(object) {
    var key, cloneObject;

    if (typeof object === 'object') {
      cloneObject = {};

      for (key in object) {
        cloneObject[key] = object[key];
      }

      return cloneObject;
    } else {
      return object;
    }
  }

  /**
   * Performs a deep copy of the given object.
   *
   * This only copies enumerable properties.
   *
   * @param {Object} object
   * @returns {Object}
   */
  function deepCopy(object) {
    var key, cloneObject;

    if (typeof object === 'object') {
      // Hack: Not a good/robust copy policy
      if (object instanceof Array) {
        cloneObject = [];
      } else {
        cloneObject = {};
      }

      for (key in object) {
        if (typeof object[key] === 'object') {
          cloneObject[key] = deepCopy(object[key]);
        } else {
          cloneObject[key] = object[key];
        }
      }

      return cloneObject;
    } else {
      return object;
    }
  }

  /**
   * Converts the given HSL color values to HSV color values.
   *
   * @param {{h:Number,s:Number,l:Number}} hsl
   * @returns {{h:Number,s:Number,v:Number}}
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
   * @param {{h:Number,s:Number,v:Number}} hsv
   * @returns {{h:Number,s:Number,l:Number}}
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
   * @param {String} hex
   * @returns {{r:Number,g:Number,b:Number}}
   */
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);
    return {
      r: r,
      g: g,
      b: b,
    }
  }

  /**
   * @param {{r:Number,g:Number,b:Number}} rgb
   * @returns {{h:Number,s:Number,l:Number}}
   */
  function rgbToHsl(rgb) {
    var r = rgb.r / 255;
    var g = rgb.g / 255;
    var b = rgb.b / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = (max + min) / 2;
    var s = (max + min) / 2;
    var l = (max + min) / 2;

    if (max === min) {
      h = 0;
      s = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    h = Math.round(360 * h);
    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    return {
      h: h,
      s: s,
      l: l,
    }
  }

  /**
   * @param {Number} value
   * @param {Number} min
   * @param {Number} max
   * #returns {Number}
   */
  function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
  }

  /**
   * Checks the given element and all of its ancestors, and returns the first that contains the
   * given class.
   *
   * @param {?HTMLElement} element
   * @param {String} className
   * @returns {?HTMLElement}
   */
  function findClassInSelfOrAncestors(element, className) {
    while (element) {
      if (window.hg.util.containsClass(element, className)) {
        return element;
      }
    }

    return null;
  }

  var utilStyleSheet;

  /**
   * Adds the given style rule to a style sheet for the current document.
   *
   * @param {String} styleRule
   */
  function addRuleToStyleSheet(styleRule) {
    // Create the custom style sheet if it doesn't already exist
    if (!utilStyleSheet) {
      utilStyleSheet = document.createElement('style');
      document.getElementsByTagName('head')[0].appendChild(utilStyleSheet);
    }

    // Add the given rule to the custom style sheet
    if (utilStyleSheet.styleSheet) {
      utilStyleSheet.styleSheet.cssText = styleRule;
    } else {
      utilStyleSheet.appendChild(document.createTextNode(styleRule));
    }
  }

  function checkForSafari() {
    return /Safari/i.test(window.navigator.userAgent) && !/Chrome/i.test(window.navigator.userAgent);
  }

  function checkForIos() {
    return /iPhone|iPod|iPad/i.test(window.navigator.userAgent);
  }

  /**
   * Taken from Underscore.js.
   *
   * Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be
   * called after it stops being called for N milliseconds. If immediate is passed, trigger the function on the
   * leading edge, instead of the trailing.
   *
   * @param {Function} fn
   * @param {Number} delay
   * @param {Boolean} [immediate]
   * @returns {Function}
   */
  function debounce(fn, delay, immediate) {
    var timeout;

    return function () {
      var context = this;
      var args = arguments;
      var callNow = immediate && !timeout;

      var later = function () {
        timeout = null;
        if (!immediate) {
          fn.apply(context, args);
        }
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, delay);

      if (callNow) {
        fn.apply(context, args);
      }
    };
  }

  /**
   * @returns {Boolean}
   */
  function isSmallScreen() {
    return window.innerWidth < 660;
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
    setTransition: setTransition,
    setTransitionDurationSeconds: setTransitionDurationSeconds,
    setTransitionDelaySeconds: setTransitionDelaySeconds,
    setUserSelectNone: setUserSelectNone,
    removeChildrenWithClass: removeChildrenWithClass,
    setTransitionCubicBezierTimingFunction: setTransitionCubicBezierTimingFunction,
    easingFunctions: easingFunctions,
    inverseEasingFunctions: inverseEasingFunctions,
    requestAnimationFrame: requestAnimationFrame,
    getXYFromPercentWithBezier: getXYFromPercentWithBezier,
    setTransform: setTransform,
    shuffle: shuffle,
    isPointInsidePolyline: isPointInsidePolyline,
    shallowCopy: shallowCopy,
    deepCopy: deepCopy,
    hsvToHsl: hsvToHsl,
    hslToHsv: hslToHsv,
    hexToRgb: hexToRgb,
    rgbToHsl: rgbToHsl,
    clamp: clamp,
    findClassInSelfOrAncestors: findClassInSelfOrAncestors,
    addRuleToStyleSheet: addRuleToStyleSheet,
    checkForSafari: checkForSafari,
    checkForIos: checkForIos,
    debounce: debounce,
    isSmallScreen: isSmallScreen,
    svgNamespace: 'http://www.w3.org/2000/svg',
    xlinkNamespace: 'http://www.w3.org/1999/xlink'
  };

  // Expose this module
  window.hg = window.hg || {};
  window.hg.util = util;

  console.log('util module loaded');
})();
