/**
 * @module main
 *
 * This script instantiates the server and begins listening for requests.
 */

var config = require('./server/config/config'),
    server = require('./server/server');

server.init().then(function (server) {
  // Specifying an address of '0.0.0.0' allows us to access the server from
  // any computer on the local network
  server.listen(config.app.port, '0.0.0.0', function () {
    console.log('Express server listening over the local network on port ' + config.app.port);
  });
}).catch(function (error) {
  console.error('Unable to start server: ' + error);
  process.exit(1);
});
