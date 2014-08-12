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
  config.lineWidth = 8;
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
   * Creates the polyline SVG element that is used to render this animation.
   *
   * @this LineAnimationJob
   */
  function createPolyline() {
    var job;

    job = this;

    job.polyline = document.createElementNS(hg.util.svgNamespace, 'polyline');
    job.grid.svg.appendChild(job.polyline);
  }

  /**
   * Updates the color values of the line of this animation.
   *
   * @this LineAnimationJob
   * @param {number} currentTime
   */
  function updateColorValues(currentTime) {
    var job, progress, oneMinusProgress;

    job = this;

    progress = (currentTime - job.startTime) / duration;
    oneMinusProgress = 1 - progress;

    job.currentHue = oneMinusProgress * job.startHue + progress * job.endHue;
    job.currentSaturation = oneMinusProgress * job.startSaturation + progress * job.endSaturation;
    job.currentLightness = oneMinusProgress * job.startLightness + progress * job.endLightness;
    job.currentOpacity = oneMinusProgress * job.startOpacity + progress * job.endOpacity;
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   *
   * @this LineAnimationJob
   */
  function checkForComplete() {
    var job = this;

    **;// TODO:
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

    if (job.directions[job.currentCornerIndex] === (job.corners[job.currentCornerIndex] + 3) % 6) {
      // When the job is at the opposite corner of a tile from the direction it is headed, then it
      // has not reached the edge
      return false;
    } else {
      neighborIndex1 = job.corners[job.currentCornerIndex];
      neighborIndex2 = job.grid.isVertical ?
          (job.corners[job.currentCornerIndex] + 5) % 6 :
          (job.corners[job.currentCornerIndex] + 1) % 6;

      return job.tiles[job.currentCornerIndex].neighbors[neighborIndex1] &&
          job.tiles[job.currentCornerIndex].neighbors[neighborIndex2];
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

    **;// TODO:
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
    frontSegmentLength = distanceTravelled % hg.HexGrid.config.tileOuterRadius;
    backSegmentLength = (job.lineLength - frontSegmentLength) % hg.HexGrid.config.tileOuterRadius;
    segmentsTouchedCount = parseInt(distanceTravelled / hg.HexGrid.config.tileOuterRadius) + 1;

    job.frontSegmentEndRatio = frontSegmentLength / hg.HexGrid.config.tileOuterRadius;
    job.backSegmentStartRatio = 1 - (backSegmentLength / hg.HexGrid.config.tileOuterRadius);

    while (segmentsTouchedCount > job.corners.length) {
      job.corners.push(getNextVertex.call(job));
      job.currentCornerIndex = job.corners.length - 1;
    }
  }

  /**
   * Updates the actual SVG elements to render the current state of this animation.
   *
   * @this LineAnimationJob
   */
  function drawSegments() {
    var job, i, count, pointsString, points;

    job = this;

    points = [];

    // TODO: job.frontSegmentEndRatio

    for (i = , count = ; i < count; i += 1) {
      points[] = getCornerGapPoint(job.tiles[], job.corners[], job.directions[]);
    }

    // TODO: job.backSegmentStartRatio

    // Create the points string
    pointsString = '';
    for (i = 0, count = points.length; i < count; i += 1) {
      pointsString += points[i].x + ',' + points[i].y + ' ';
    }

    // Update the attributes of the polyline SVG element
    job.polyline.setAttribute('points', pointsString);
    job.polyline.setAttribute('stroke', 'hsla(' + job.currentHue + ',' + job.currentSaturation +
        '%,' + job.currentLightness + '%,' + job.currentOpacity + ')');
    job.polyline.setAttribute('stroke-width', job.lineWidth);
  }

  /**
   * Calculates the point in the middle of the gap between tiles at the given corner.
   *
   * @param {HexTile} tile
   * @param {number} corner
   * @param {number} direction
   * @returns {{x:number,y:number}}
   */
  function getCornerGapPoint(tile, corner, direction) {
    var job, count, xSum, ySum;

    count = 1;
    xSum = ;
    ySum = ;

    if () {
      count += 1;
      xSum += ;
      ySum += ;
    }

    if () {
      count += 1;
      xSum += ;
      ySum += ;
    }

    return {
      x: xSum / count,
      y: ySum / count
    };
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

    updateColorValues.call(job, currentTime);
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

    job.tiles = [];
    job.corners = [];
    job.directions = [];
    job.currentCornerIndex = Number.NaN;
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
    job.tiles = [tile];
    job.corners = [corner];
    job.directions = [direction];
    job.currentCornerIndex = Number.NaN;
    job.frontSegmentEndRatio = Number.NaN;
    job.backSegmentStartRatio = Number.NaN;
    job.polyline = null;
    job.hasReachedEnd = false;
    job.startTime = 0;
    job.isComplete = false;

    job.startHue = Number.NaN;
    job.endHue = Number.NaN;
    job.currentHue = Number.NaN;

    job.duration = config.duration;
    job.lineWidth = config.lineWidth;
    job.lineLength = config.lineLength;
    job.lineSidePeriod = config.lineSidePeriod;

    job.startSaturation = config.startSaturation;
    job.startLightness = config.startLightness;
    job.startOpacity = config.startOpacity;

    job.endSaturation = config.endSaturation;
    job.endLightness = config.endLightness;
    job.endOpacity = config.endOpacity;

    job.currentSaturation = config.startSaturation;
    job.currentLightness = config.startLightness;
    job.currentOpacity = config.startOpacity;
    // TODO: add the other line config params here (this is important so that the radiate job can have its own params)

    job.start = start;
    job.update = update;
    job.cancel = cancel;

    createHues.call(job);
    createPolyline.call(job);

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
