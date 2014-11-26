'use strict';

/**
 * This module defines a singleton that renders a menu panel across the top of the window.
 *
 * @module menu-panel
 */
(function () {

  var config = {};

  var menuPanel = {};

  menuPanel.config = config;

  window.app = window.app || {};
  app.menuPanel = menuPanel;

  // ---  --- //

  console.log('menu-panel module loaded');
})();
