/**
 * @module config
 *
 * Holds server-side configuration data for the app.
 */

var config, root;

// Translates the relative root path to an absolute path
root = require('path').resolve(__dirname + '/../../..');

config = {};

config.app = {};

config.app.port = 3000;
config.app.url = 'http://localhost:' + config.app.port;

// The locations of some important files
config.publicPath = root + '/example/public';
config.hexGridPath = root + '/dist';
config.faviconPath = config.publicPath + '/images/favicon.ico';
config.viewsPath = root + '/example/server/views';

module.exports = config;
