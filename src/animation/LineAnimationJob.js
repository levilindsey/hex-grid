'use strict';

/**
 * This module defines a constructor for LineAnimationJob objects.
 *
 * @module LineAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 1600;
  config.lineLength = 200;
  config.lineSidePeriod = 300; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 70;
  config.startOpacity = 0.8;

  config.endSaturation = 50;
  config.endLightness = 90;
  config.endOpacity = 0;

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the start and end hue for the line of this animation.
   *
   * @this LineAnimationJob
   */
  function createHues() {
    var job;

    job = this;

    job.startHue = Math.random() * 360;
    job.endHue = Math.random() * 360;
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   *
   * @this LineAnimationJob
   */
  function checkForComplete() {
    var job = this;

    // TODO:
//    if (???) {
//      console.log('LineAnimationJob completed');
//
//      job.isComplete = true;
//    }
  }

  /**
   * Determines whether this LineAnimationJob has reached the edge of the grid.
   *
   * @this LineAnimationJob
   * @returns {boolean}
   */
  function checkHasReachedEdge() {
    var job, neighborIndex1, neighborIndex2;

    job = this;

    if (job.direction === (job.corner + 3) % 6) {
      // When the job is at the opposite corner of a tile from the direction it is headed, then it
      // has not reached the edge
      return false;
    } else {
      neighborIndex1 = job.corner;
      neighborIndex2 = job.grid.isVertical ? (job.corner + 5) % 6 : (job.corner + 1) % 6;

      return job.tile.neighbors[neighborIndex1] && job.tile.neighbors[neighborIndex2];
    }
  }

  /**
   * Returns the next vertex in the path of this animation.
   *
   * @this LineAnimationJob
   */
  function getNextVertex() {
    var job;

    job = this;

    // TODO:
  }

  /**
   * Updates the parameters of the segments of this animation.
   *
   * @this LineAnimationJob
   * @param {number} currentTime
   */
  function updateSegments(currentTime) {
    var job, ellapsedTime, distanceTravelled, frontSegmentLength, backSegmentLength,
        segmentsTouchedCount;

    job = this;

    ellapsedTime = currentTime - job.startTime;
    distanceTravelled = ellapsedTime / job.lineSidePeriod * hg.HexGrid.config.tileOuterRadius;
    frontSegmentLength = ;
    backSegmentLength = ;
    segmentsTouchedCount = ;

    job.frontSegmentEndRatio = ;
    job.backSegmentStartRatio = ;

    if (segmentsTouchedCount > job.vertices.length) {
      job.vertices.push(getNextVertex.call(job));
    }
  }

  /**
   * Updates the actual SVG elements to render the current state of this animation.
   *
   * @this LineAnimationJob
   */
  function drawSegments() {
    var job;

    job = this;

    // TODO:
//    job.frontSegmentEndRatio
//    job.backSegmentStartRatio
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this LineAnimationJob as started.
   *
   * @this LineAnimationJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO:
  }

  /**
   * Updates the animation progress of this LineAnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this LineAnimationJob
   * @param {number} currentTime
   * @param {number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    updateSegments.call(job, currentTime);
    drawSegments.call(job);
    checkForComplete.call(job);
  }

  /**
   * Stops this LineAnimationJob, and returns the element its original form.
   *
   * @this LineAnimationJob
   */
  function cancel() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.segments.length; i < count; i += 1) {
      job.grid.svg.removeChild(job.segments[i]);
    }

    job.tile = null;
    job.corner = Number.NaN;
    job.direction = Number.NaN;
    job.segments = [];
    job.vertices = [];
    job.hasReachedEnd = true;

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HexGrid} grid
   * @param {HexTile} tile
   * @param {number} corner
   * @param {number} direction
   */
  function LineAnimationJob(grid, tile, corner, direction) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.corner = corner;
    job.direction = direction;
    job.hasReachedEnd = false;
    job.startTime = 0;
    job.isComplete = false;
    job.segments = null;
    job.vertices = null;
    job.frontSegmentEndRatio = Number.NaN;
    job.backSegmentStartRatio = Number.NaN;

    job.startHue = Number.NaN;
    job.endHue = Number.NaN;

    job.duration = config.duration;
    job.lineLength = config.lineLength;
    job.lineSidePeriod = config.lineSidePeriod;

    job.startSaturation = config.startSaturation;
    job.startLightness = config.startLightness;
    job.startOpacity = config.startOpacity;

    job.endSaturation = config.endSaturation;
    job.endLightness = config.endLightness;
    job.endOpacity = config.endOpacity;
    // TODO: add the other line config params here (this is important so that the radiate job can have its own params)

    job.start = start;
    job.update = update;
    job.cancel = cancel;

    createHues.call(job);

    console.log('LineAnimationJob created: tileIndex=' + tile.index + ', corner=' + corner +
        ', direction=' + direction);
  }

  /**
   * Creates a LineAnimationJob that is initialized at a tile vertex along the border of the grid.
   *
   * @param {HexGrid} grid
   */
  function createRandomLineAnimationJob(grid) {
    var tile, corner, direction;

    // Pick a random border tile to start from
    tile = grid.borderTiles[parseInt(Math.random() * grid.borderTiles.length)];

    // Determine which corner and direction to use based on the selected tile
    if (grid.isVertical) {
      if (!tile.neighbors[4]) { // Left side
        corner = Math.random() < 0.5 ? 4 : 5;
        direction = tile.originalCenterY < grid.centerY ? 2 : 1;
      } else if (!tile.neighbors[1]) { // Right side
        corner = Math.random() < 0.5 ? 1 : 2;
        direction = tile.originalCenterY < grid.centerY ? 4 : 5;
      } else if (!tile.neighbors[0]) { // Top side
        corner = 0;
        direction = 3;
      } else { // Bottom side
        corner = 3;
        direction = 0;
      }
    } else {
      if (!tile.neighbors[0]) { // Top side
        corner = Math.random() < 0.5 ? 0 : 5;
        direction = tile.originalCenterX < grid.centerX ? 2 : 3;
      } else if (!tile.neighbors[3]) { // Bottom side
        corner = Math.random() < 0.5 ? 2 : 3;
        direction = tile.originalCenterX < grid.centerX ? 0 : 5;
      } else if (!tile.neighbors[4]) { // Left side
        corner = 4;
        direction = 1;
      } else { // Right side
        corner = 1;
        direction = 4;
      }
    }

    return new LineAnimationJob(grid, tile, corner, direction);
  }

  LineAnimationJob.config = config;
  LineAnimationJob.createRandomLineAnimationJob = createRandomLineAnimationJob;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.LineAnimationJob = LineAnimationJob;

  console.log('LineAnimationJob module loaded');
})();
