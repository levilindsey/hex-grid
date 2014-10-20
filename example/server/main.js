/**
 * @module app
 *
 * This script instantiates the server and begins listening for requests.
 */

var config = require('./config/config');

init().then(function (server) {
  if (config.environment === 'development') {
    // Specifying an address of '0.0.0.0' allows us to access the server from any computer on the
    // local network
    server.listen(config.app.port, '0.0.0.0', function () {
      console.log('Express server listening over the local network on port ' + config.app.port);
    });
  } else {
    server.listen(config.app.port, function () {
      console.log('Express server listening on port ' + config.app.port);
    });
  }
}).catch(function (error) {
  console.error('Unable to start server: ' + error);
  process.exit(1);
});

/**
 * Sets up the server.
 */
function init() {
  var deferred = require('q').defer(),
      server = require('express')(),
      database = require('./database/database'),
      middleware = require('./middleware/middleware'),
      routes = require('./routes/routes'),
      config = require('./config/config');

//  database.init();
  middleware.init(server);
  routes.init(server);

  // Clean up some system state for development and testing
  if (config.environment === 'development') {
//    database.clear();
  }

  deferred.resolve(server);

  return deferred.promise;
}
