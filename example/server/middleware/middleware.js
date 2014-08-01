/**
 * @module middleware
 *
 * Exposes the init function, which sets up all of the middleware functionality for the server.
 */

var config = require('../config/config');

/**
 * Sets up middleware for the server.
 *
 * @param {Object} server
 */
exports.init = function (server) {
  var morgan = require('morgan'), // For logging
      favicon = require('serve-favicon'), // For serving our favicon
//      connectLivereload = require('connect-livereload')(),
      staticFiles = require('./static-files');

  // Set up the templating engine
  server.set('views', __dirname);
  server.set('view engine', 'ejs');

  server.use(morgan({ format: 'dev', immediate: true }));
  server.use(favicon(config.faviconPath));
//  server.use(connectLivereload);

  staticFiles.init(server);
};
