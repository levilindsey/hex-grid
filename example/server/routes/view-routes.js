/**
 * @module view-routes
 *
 * Handles all HTTP requests that are intended for view retrieval.
 */

var config = require('../config/config');

/**
 * Attaches the route handlers to the server.
 *
 * @param {Object} server
 */
exports.init = function (server) {
  console.log('Attaching view-route handlers');

  server.route('/').get(handleHomeRequest);
  server.route('*').all(handleInvalidRequest);
};

/**
 * Handles requests for the home page.
 *
 * @param {Object} req
 * @param {Object} res
 */
function handleHomeRequest(req, res) {
  res.sendfile(config.viewsPath + '/index.html');
}

/**
 * Handles requests for missing pages.
 *
 * @param {Object} req
 * @param {Object} res
 */
function handleInvalidRequest(req, res) {
  res.status(404).render(config.viewsPath + '/page-missing', {pageName: req.host + req.path});
}
