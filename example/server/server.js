/**
 * @module server
 *
 * Exposes the createServer function, which creates the server instance, sets
 * up the middleware, and attaches the route handlers.
 */

/**
 * Sets up the server.
 */
exports.init = function () {
  var deferred = require('q').defer(),
      server = require('express')(),
      middleware = require('./middleware/middleware'),
      routes = require('./routes/routes'),
      config = require('./config/config');

  middleware.init(server);
  routes.init(server);

  deferred.resolve(server);

  return deferred.promise;
};
