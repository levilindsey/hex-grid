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

  config.sameDirectionProb = 0.6;


  config.oppositeDirectionProb = 0;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.distantSidewaysDirectionProb = (1 - config.sameDirectionProb) / 2;
    config.closeSidewaysDirectionProb = (1 - config.oppositeDirectionProb) / 2;
  };

config.computeDependentValues();

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

    progress = (currentTime - job.startTime) / job.duration;
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
    var job;

    job = this;

    if (job.hasReachedEdge && ) {
      console.log('LineAnimationJob completed');

      job.isComplete = true;
    }
  }

  /**
   * Determines whether this LineAnimationJob has reached the edge of the grid.
   *
   * @this LineAnimationJob
   */
  function checkHasReachedEdge() {
    var job;

    job = this;

    if (job.direction === (job.corners[job.currentCornerIndex] + 3) % 6) {
      // When the job is at the opposite corner of a tile from the direction it is headed, then it
      // has not reached the edge
      job.hasReachedEdge = false;
    } else {
      job.hasReachedEdge = job.lowerNeighborTiles[job.currentCornerIndex] &&
          job.upperNeighborTiles[job.currentCornerIndex];
    }
  }

  /**
   * Determines the neighbors of this job's current tile at the current corner.
   *
   * @this LineAnimationJob
   */
  function determineNeighbors() {
    var job, lowerNeigborIndex, upperNeigborIndex;

    job = this;

    if (job.grid.isVertical) {
      lowerNeigborIndex = (job.corners[job.currentCornerIndex] + 5) % 6;
      upperNeigborIndex = job.corners[job.currentCornerIndex];
    } else {
      lowerNeigborIndex = job.corners[job.currentCornerIndex];
      upperNeigborIndex = (job.corners[job.currentCornerIndex] + 1) % 6;
    }

    job.lowerNeighborTiles[job.currentCornerIndex] =
        job.tiles[job.currentCornerIndex].neighbors[lowerNeigborIndex];
    job.upperNeighborTiles[job.currentCornerIndex] =
        job.tiles[job.currentCornerIndex].neighbors[upperNeigborIndex];
  }

  /**
   * Returns the next vertex in the path of this animation.
   *
   * @this LineAnimationJob
   */
  function chooseNextVertex() {
    var job, cornerConfig, neighborProb, lowerSelfProb, upperSelfProb, random, relativeDirection, nextCorner, nextTile;

    job = this;

    cornerConfig = (job.corners[job.currentCornerIndex] - job.direction + 6) % 6;

    // Determine relative direction probabilities
    switch (cornerConfig) {
      case 0:
        neighborProb = config.sameDirectionProb;
        lowerSelfProb = config.distantSidewaysDirectionProb;
        upperSelfProb = config.distantSidewaysDirectionProb;
        break;
      case 1:
        neighborProb = config.closeSidewaysDirectionProb;
        lowerSelfProb = config.closeSidewaysDirectionProb;
        upperSelfProb = config.oppositeDirectionProb;
        break;
      case 2:
        neighborProb = config.distantSidewaysDirectionProb;
        lowerSelfProb = config.sameDirectionProb;
        upperSelfProb = config.distantSidewaysDirectionProb;
        break;
      case 3:
        neighborProb = config.oppositeDirectionProb;
        lowerSelfProb = config.closeSidewaysDirectionProb;
        upperSelfProb = config.closeSidewaysDirectionProb;
        break;
      case 4:
        neighborProb = config.distantSidewaysDirectionProb;
        lowerSelfProb = config.distantSidewaysDirectionProb;
        upperSelfProb = config.sameDirectionProb;
        break;
      case 5:
        neighborProb = config.closeSidewaysDirectionProb;
        lowerSelfProb = config.oppositeDirectionProb;
        upperSelfProb = config.closeSidewaysDirectionProb;
        break;
      default:
        throw new Error('Invalid state: cornerConfig=' + cornerConfig);
    }

    random = Math.random();
    relativeDirection = random < neighborProb ? 0 : random < neighborProb + lowerSelfProb ? 1 : 2;

    // Determine the next corner configuration
    switch (relativeDirection) {
      case 0: // neighbor
        if (job.grid.isVertical) {
          nextCorner = (job.corners[job.currentCornerIndex] + 1) % 6;
          nextTile = job.tiles[job.currentCornerIndex].neighbors[(job.corners[job.currentCornerIndex] + 5) % 6].tile;
        } else {
          nextCorner = (job.corners[job.currentCornerIndex] + 1) % 6;
          nextTile = job.tiles[job.currentCornerIndex].neighbors[job.corners[job.currentCornerIndex]].tile;
        }
        break;
      case 1: // lower self
        nextCorner = (job.corners[job.currentCornerIndex] + 5) % 6;
        nextTile = job.tiles[job.currentCornerIndex];
        break;
      case 2: // upper self
        nextCorner = (job.corners[job.currentCornerIndex] + 1) % 6;
        nextTile = job.tiles[job.currentCornerIndex];
        break;
      default:
        throw new Error('Invalid state: relativeDirection=' + relativeDirection);
    }

    job.currentCornerIndex = job.corners.length;

    job.corners[job.currentCornerIndex] = nextCorner;
    job.tiles[job.currentCornerIndex] = nextTile;

    determineNeighbors.call(job);
    checkHasReachedEdge.call(job);
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

    while (segmentsTouchedCount > job.corners.length && !job.hasReachedEdge) {
      chooseNextVertex.call(job);
    }

    checkForComplete.call(job);
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
      points[] = getCornerGapPoint(job.tiles[], job.lowerNeighborTiles[],
          job.upperNeighborTiles[], job.corners[], job.grid.isVertical);
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
   * @param {HexTile} lowerNeighbor
   * @param {HexTile} upperNeighbor
   * @param {number} corner
   * @param {boolean} isVertical
   * @returns {{x:number,y:number}}
   */
  function getCornerGapPoint(tile, lowerNeighbor, upperNeighbor, corner, isVertical) {
    var count, xSum, ySum;

    if (lowerNeighbor) {
      if (upperNeighbor) {
        count = 3;
        xSum = ;
        ySum = ;
      } else {
        count = 2;
        xSum = ;
        ySum = ;
      }
    } else if (upperNeighbor) {
      count = 2;
      xSum = ;
      ySum = ;
    } else {
      count = 1;
      xSum = ;
      ySum = ;
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
    job.direction = Number.NaN;
    job.currentCornerIndex = Number.NaN;
    job.hasReachedEdge = true;

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
    job.lowerNeighborTiles = [];
    job.upperNeighborTiles = [];
    job.direction = direction;
    job.currentCornerIndex = 0;
    job.frontSegmentEndRatio = Number.NaN;
    job.backSegmentStartRatio = Number.NaN;
    job.polyline = null;
    job.hasReachedEdge = false;
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

    job.sameDirectionProb = config.sameDirectionProb;

    job.currentSaturation = config.startSaturation;
    job.currentLightness = config.startLightness;
    job.currentOpacity = config.startOpacity;
    // TODO: add the other line config params here (this is important so that the radiate job can have its own params)

    job.start = start;
    job.update = update;
    job.cancel = cancel;

    determineNeighbors.call(job);
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
