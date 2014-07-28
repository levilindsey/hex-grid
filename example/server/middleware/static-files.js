/**
 * @module static-files
 *
 * Handles the serving of static files.
 */

var config = require('../config/config');

/**
 * Sets up middleware for the server.
 *
 * @param {Object} server
 */
exports.init = function (server) {
  setUpStaticFiles(server);
};

/**
 * Serve static files.
 *
 * @param {Object} server
 */
function setUpStaticFiles(server) {
  var mountPath, staticPath, serveStatic;

  serveStatic = require('serve-static'); // For serving static files

  // Set up the sample's public files
  mountPath = '/';
  staticPath = config.publicPath;
  server.use(mountPath, serveStatic(staticPath));
  console.log('Serving static files: staticPath=' + staticPath + ', mountPath=' + mountPath);

  // Set up the package's public src files
  mountPath = '/src';
  staticPath = config.srcPath;
  server.use(mountPath, serveStatic(staticPath));
  console.log('Serving static files: staticPath=' + staticPath + ', mountPath=' + mountPath);

  // Set up the package's public dist files
  mountPath = '/dist';
  staticPath = config.distPath;
  server.use(mountPath, serveStatic(staticPath));
  console.log('Serving static files: staticPath=' + staticPath + ', mountPath=' + mountPath);
}
