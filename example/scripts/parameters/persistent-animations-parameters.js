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
    folder.add(window.hg.ColorShiftJob.config, 'transitionDurationMin', 1, 10000)
        .onChange(function (value) {
          window.hg.ColorShiftJob.config.transitionDurationMax = Math.max(
              window.hg.ColorShiftJob.config.transitionDurationMin,
              window.hg.ColorShiftJob.config.transitionDurationMax
          );
        });
    folder.add(window.hg.ColorShiftJob.config, 'transitionDurationMax', 1, 10000)
        .onChange(function (value) {
          window.hg.ColorShiftJob.config.transitionDurationMin = Math.min(
              window.hg.ColorShiftJob.config.transitionDurationMin,
              window.hg.ColorShiftJob.config.transitionDurationMax
          );
        });
    folder.add(window.hg.ColorShiftJob.config, 'hueDeltaMin', -360, 360)
        .onChange(function (value) {
          window.hg.ColorShiftJob.config.hueDeltaMax = Math.max(
              window.hg.ColorShiftJob.config.hueDeltaMin,
              window.hg.ColorShiftJob.config.hueDeltaMax
          );
        });
    folder.add(window.hg.ColorShiftJob.config, 'hueDeltaMax', -360, 360)
        .onChange(function (value) {
          window.hg.ColorShiftJob.config.hueDeltaMin = Math.min(
              window.hg.ColorShiftJob.config.hueDeltaMin,
              window.hg.ColorShiftJob.config.hueDeltaMax
          );
        });
    folder.add(window.hg.ColorShiftJob.config, 'saturationDeltaMin', -100, 100)
        .onChange(function (value) {
          window.hg.ColorShiftJob.config.saturationDeltaMax = Math.max(
              window.hg.ColorShiftJob.config.saturationDeltaMin,
              window.hg.ColorShiftJob.config.saturationDeltaMax
          );
        });
    folder.add(window.hg.ColorShiftJob.config, 'saturationDeltaMax', -100, 100)
        .onChange(function (value) {
          window.hg.ColorShiftJob.config.saturationDeltaMin = Math.min(
              window.hg.ColorShiftJob.config.saturationDeltaMin,
              window.hg.ColorShiftJob.config.saturationDeltaMax
          );
        });
    folder.add(window.hg.ColorShiftJob.config, 'lightnessDeltaMin', -100, 100)
        .onChange(function (value) {
          window.hg.ColorShiftJob.config.lightnessDeltaMax = Math.max(
              window.hg.ColorShiftJob.config.lightnessDeltaMin,
              window.hg.ColorShiftJob.config.lightnessDeltaMax
          );
        });
    folder.add(window.hg.ColorShiftJob.config, 'lightnessDeltaMax', -100, 100)
        .onChange(function (value) {
          window.hg.ColorShiftJob.config.lightnessDeltaMin = Math.min(
              window.hg.ColorShiftJob.config.lightnessDeltaMin,
              window.hg.ColorShiftJob.config.lightnessDeltaMax
          );
        });
    folder.add(window.hg.ColorShiftJob.config, 'imageBackgroundScreenOpacityDeltaMin', -1.0, 1.0)
        .onChange(function (value) {
          window.hg.ColorShiftJob.config.imageBackgroundScreenOpacityDeltaMax = Math.max(
              window.hg.ColorShiftJob.config.imageBackgroundScreenOpacityDeltaMin,
              window.hg.ColorShiftJob.config.imageBackgroundScreenOpacityDeltaMax
          );
        });
    folder.add(window.hg.ColorShiftJob.config, 'imageBackgroundScreenOpacityDeltaMax', -1.0, 1.0)
        .onChange(function (value) {
          window.hg.ColorShiftJob.config.imageBackgroundScreenOpacityDeltaMin = Math.min(
              window.hg.ColorShiftJob.config.imageBackgroundScreenOpacityDeltaMin,
              window.hg.ColorShiftJob.config.imageBackgroundScreenOpacityDeltaMax
          );
        });
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
