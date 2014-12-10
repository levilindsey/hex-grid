'use strict';

/**
 * This module defines a singleton that handles the contents of folders within the dat.GUI menu that represent
 * persistent animation parameters.
 *
 * @module persistent-animation-parameters
 */
(function () {

  var config = {};

  config.folders = [
    {
      name: 'Persistent',
      isOpen: false,
      createItems: null,
      children: [
        {
          name: 'Color Shift',
          isOpen: false,
          createItems: createColorShiftItems
        },
        {
          name: 'Color Wave',
          isOpen: false,
          createItems: createColorWaveItems
        },
        {
          name: 'Displacement Wave',
          isOpen: false,
          createItems: createDisplacementWaveItems
        }
      ]
    }
  ];

  // ---  --- //

  var persistentParams = {};

  persistentParams.init = init;
  persistentParams.config = config;

  window.app = window.app || {};
  app.persistentParams = persistentParams;

  // ---  --- //

  function init(grid) {
    persistentParams.grid = grid;
  }

  function createColorShiftItems(folder) {
    // TODO:
  }

  function createColorWaveItems(folder) {
    folder.add(window.hg.ColorWaveJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          window.hg.ColorWaveJob.config.halfPeriod = value / 2;
        });
    folder.add(window.hg.ColorWaveJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          window.hg.controller.persistentJobs.ColorWaveJob.start(persistentParams.grid);
        });
    folder.add(window.hg.ColorWaveJob.config, 'originX', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.ColorWaveJob.start(persistentParams.grid);
        });
    folder.add(window.hg.ColorWaveJob.config, 'originY', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.ColorWaveJob.start(persistentParams.grid);
        });
    folder.add(window.hg.ColorWaveJob.config, 'deltaHue', 0, 360);
    folder.add(window.hg.ColorWaveJob.config, 'deltaSaturation', 0, 100);
    folder.add(window.hg.ColorWaveJob.config, 'deltaLightness', 0, 100);
    folder.add(window.hg.ColorWaveJob.config, 'opacity', 0, 1);
  }

  function createDisplacementWaveItems(folder) {
    folder.add(window.hg.DisplacementWaveJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          window.hg.DisplacementWaveJob.config.halfPeriod = value / 2;
        });
    folder.add(window.hg.DisplacementWaveJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          window.hg.controller.persistentJobs.DisplacementWaveJob.start(persistentParams.grid);
        });
    folder.add(window.hg.DisplacementWaveJob.config, 'originX', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.DisplacementWaveJob.start(persistentParams.grid);
        });
    folder.add(window.hg.DisplacementWaveJob.config, 'originY', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.DisplacementWaveJob.start(persistentParams.grid);
        });
    folder.add(window.hg.DisplacementWaveJob.config, 'tileDeltaX', -300, 300);
    folder.add(window.hg.DisplacementWaveJob.config, 'tileDeltaY', -300, 300);
  }

  console.log('persistent-animation-parameters module loaded');
})();
