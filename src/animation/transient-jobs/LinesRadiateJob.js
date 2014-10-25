/**
 * @typedef {AnimationJob} LinesRadiateJob
 */

/**
 * This module defines a constructor for LinesRadiateJob objects.
 *
 * @module LinesRadiateJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 700;
  config.lineWidth = 24;
  config.lineLength = 1300;
  config.lineSidePeriod = 30; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 100;
  config.startOpacity = 0.8;

  config.endSaturation = 100;
  config.endLightness = 70;
  config.endOpacity = 0;

  config.sameDirectionProb = 0.85;

  config.blurStdDeviation = 2;
  config.isBlurOn = false;

  config.isRecurring = false;
  config.avgDelay = 2000;
  config.delayDeviationRange = 1800;

  // ---  --- //

  config.haveDefinedLineBlur = false;
  config.filterId = 'random-line-filter';

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates an SVG definition that is used for blurring the lines of LineJobs.
   *
   * @this LinesRadiateJob
   */
  function defineLineBlur() {
    var job, filter, feGaussianBlur;

    job = this;

    // Create the elements

    filter = document.createElementNS(window.hg.util.svgNamespace, 'filter');
    job.grid.svgDefs.appendChild(filter);

    feGaussianBlur = document.createElementNS(window.hg.util.svgNamespace, 'feGaussianBlur');
    filter.appendChild(feGaussianBlur);

    // Define the blur

    filter.setAttribute('id', config.filterId);
    filter.setAttribute('x', '-10%');
    filter.setAttribute('y', '-10%');
    filter.setAttribute('width', '120%');
    filter.setAttribute('height', '120%');

    feGaussianBlur.setAttribute('in', 'SourceGraphic');
    feGaussianBlur.setAttribute('result', 'blurOut');

    job.feGaussianBlur = feGaussianBlur;
  }

  /**
   * Creates the individual LineJobs that comprise this LinesRadiateJob.
   *
   * @this LinesRadiateJob
   */
  function createLineJobs() {
    var job, i, line;

    job = this;
    job.lineJobs = [];

    for (i = 0; i < 6; i += 1) {
      try {
        line = new window.hg.LineJob(job.grid, job.tile, i, i,
            window.hg.LineJob.config.NEIGHBOR, job.onComplete, job.extraStartPoint);
      } catch (error) {
        console.debug(error.message);
        continue;
      }

      job.lineJobs.push(line);

      // Replace the line animation's normal parameters with some that are specific to radiating
      // lines
      line.duration = config.duration;
      line.lineWidth = config.lineWidth;
      line.lineLength = config.lineLength;
      line.lineSidePeriod = config.lineSidePeriod;

      line.startSaturation = config.startSaturation;
      line.startLightness = config.startLightness;
      line.startOpacity = config.startOpacity;

      line.endSaturation = config.endSaturation;
      line.endLightness = config.endLightness;
      line.endOpacity = config.endOpacity;

      line.sameDirectionProb = config.sameDirectionProb;

      line.filterId = config.filterId;
      line.blurStdDeviation = config.blurStdDeviation;
      line.isBlurOn = config.isBlurOn;

      if (config.isBlurOn) {
        line.polyline.setAttribute('filter', 'url(#' + config.filterId + ')');
      } else {
        line.polyline.setAttribute('filter', 'none');
      }
    }
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   *
   * @this LinesRadiateJob
   */
  function checkForComplete() {
    var job, i;

    job = this;

    for (i = 0; i < job.lineJobs.length; i += 1) {
      if (job.lineJobs[i].isComplete) {
        job.lineJobs.splice(i--, 1);
      } else {
        return;
      }
    }

    console.log('LinesRadiateJob completed');

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this LinesRadiateJob as started.
   *
   * @this LinesRadiateJob
   */
  function start() {
    var job, i, count;

    job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      job.lineJobs[i].start();
    }
  }

  /**
   * Updates the animation progress of this LinesRadiateJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this LinesRadiateJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    // Update the extra point
    job.extraStartPoint.x = job.tile.particle.px;
    job.extraStartPoint.y = job.tile.particle.py;

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      job.lineJobs[i].update(currentTime, deltaTime);

      if (job.lineJobs[i].isComplete) {
        job.lineJobs.splice(i, 1);
        i--;
        count--;
      }
    }

    job.feGaussianBlur.setAttribute('stdDeviation', config.blurStdDeviation);

    checkForComplete.call(job);
  }

  /**
   * Draws the current state of this LinesRadiateJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this LinesRadiateJob
   */
  function draw() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      job.lineJobs[i].draw();
    }
  }

  /**
   * Stops this LinesRadiateJob, and returns the element its original form.
   *
   * @this LinesRadiateJob
   */
  function cancel() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      job.lineJobs[i].cancel();
    }

    job.lineJobs = [];

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} [onComplete]
   */
  function LinesRadiateJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.extraStartPoint = { x: tile.particle.px, y: tile.particle.py };
    job.startTime = 0;
    job.isComplete = false;
    job.lineJobs = null;

    job.onComplete = onComplete || function () {};

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = function () {};

    if (!config.haveDefinedLineBlur) {
      defineLineBlur.call(job);
    }

    createLineJobs.call(job);

    console.log('LinesRadiateJob created: tileIndex=' + tile.originalIndex);
  }

  LinesRadiateJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.LinesRadiateJob = LinesRadiateJob;

  console.log('LinesRadiateJob module loaded');
})();
