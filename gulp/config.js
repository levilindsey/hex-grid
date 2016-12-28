var config = {};

config.publicRoot = './';
config.hgSrcPath = 'src';
config.hgDistPath = 'dist';
config.examplePath = 'example';
config.nodeModulesPath = 'node_modules';
config.bowerComponentsPath = 'bower_components';
config.exampleDistPath = config.examplePath + '/dist';

config.hgScriptsSrc = [config.hgSrcPath + '/**/*.js'];
config.hgStylesSrc = [config.hgSrcPath + '/**/*.css'];

config.exampleScriptsSrc = [config.examplePath + '/scripts/**/*.js'];
config.exampleStylesSrc = [config.examplePath + '/styles/**/*.css'];

config.hgVendorScriptsSrc = [
  config.nodeModulesPath + '/showdown/dist/showdown.js',
  config.nodeModulesPath + '/showdown-twitter/dist/showdown-twitter.js',
  config.nodeModulesPath + '/showdown-prettify/dist/showdown-prettify.js'
];

config.exampleVendorScriptsSrc = [
  config.bowerComponentsPath + '/dat.gui/dat.gui.min.js'
];

config.allScriptsSrc = config.hgScriptsSrc
  .concat(config.hgVendorScriptsSrc)
  .concat(config.exampleScriptsSrc)
  .concat(config.exampleVendorScriptsSrc);
config.allStylesSrc = config.hgStylesSrc
  .concat(config.exampleStylesSrc);

config.scriptDistFileName = 'hex-grid.js';
config.exampleScriptDistFileName = 'hex-grid-example.js';

config.hgScriptsDistNonMinFilePath = config.hgDistPath + '/hex-grid.js';
config.hgScriptsDistMinFilePath = config.hgDistPath + '/hex-grid.min.js';

config.exampleDataTasksPath = './' + config.examplePath + '/gulp-data-tasks';
config.exampleScriptsTasksPath = './' + config.examplePath + '/gulp-scripts';

config.host = '0.0.0.0';
config.port = '3000';

config.buildTasks = ['scripts', 'styles', 'data', 'watch'];

module.exports = config;
