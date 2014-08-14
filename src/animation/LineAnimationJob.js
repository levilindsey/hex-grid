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

  config.duration = 3200;
  config.lineWidth = 8;
  config.lineLength = 200;
  config.lineSidePeriod = 300; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 70;
  config.startOpacity = 0.8;

  config.endSaturation = 50;
  config.endLightness = 90;
  config.endOpacity = 0;

  config.sameDirectionProb = 0.7;


  config.oppositeDirectionProb = 0;
  config.epsilon = 0.00001;

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
    job.polyline.setAttribute('fill-opacity', '0');
    job.grid.svg.appendChild(job.polyline);
  }

  /**
   * Updates the color values of the line of this animation.
   *
   * @this LineAnimationJob
   */
  function updateColorValues() {
    var job, progress, oneMinusProgress;

    job = this;

    progress = job.ellapsedTime / job.duration;
    oneMinusProgress = 1 - progress;

    job.currentHue = oneMinusProgress * job.startHue + progress * job.endHue;
    job.currentSaturation = oneMinusProgress * job.startSaturation + progress * job.endSaturation;
    job.currentLightness = oneMinusProgress * job.startLightness + progress * job.endLightness;
    job.currentOpacity = oneMinusProgress * job.startOpacity + progress * job.endOpacity;
  }

  /**
   * Updates the state of this job to handle its completion.
   *
   * @this LineAnimationJob
   */
  function handleCompletion() {
    var job;

    job = this;

    console.log('LineAnimationJob completed');

    if (job.polyline) {
      job.grid.svg.removeChild(job.polyline);
      job.polyline = null;
    }

    job.tiles = [];
    job.corners = [];
    job.direction = Number.NaN;
    job.currentCornerIndex = Number.NaN;
    job.hasReachedEdge = true;

    job.isComplete = true;
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
      job.hasReachedEdge = !job.lowerNeighbors[job.currentCornerIndex] ||
          !job.upperNeighbors[job.currentCornerIndex];
    }
  }

  /**
   * Determines the neighbors of this job's current tile at the current corner.
   *
   * @this LineAnimationJob
   */
  function determineNeighbors() {
    var job, lowerNeigborTileIndex, upperNeigborTileIndex;

    job = this;

    if (job.grid.isVertical) {
      lowerNeigborTileIndex = (job.corners[job.currentCornerIndex] + 5) % 6;
      upperNeigborTileIndex = job.corners[job.currentCornerIndex];
    } else {
      lowerNeigborTileIndex = job.corners[job.currentCornerIndex];
      upperNeigborTileIndex = (job.corners[job.currentCornerIndex] + 1) % 6;
    }

    job.lowerNeighbors[job.currentCornerIndex] =
        job.tiles[job.currentCornerIndex].neighbors[lowerNeigborTileIndex];
    job.upperNeighbors[job.currentCornerIndex] =
        job.tiles[job.currentCornerIndex].neighbors[upperNeigborTileIndex];

    job.lowerNeighborCorners[job.currentCornerIndex] =
        (job.corners[job.currentCornerIndex] + 1) % 6;
    job.upperNeighborCorners[job.currentCornerIndex] =
        (job.corners[job.currentCornerIndex] + 5) % 6;
  }

  /**
   * Returns the next vertex in the path of this animation.
   *
   * @this LineAnimationJob
   */
  function chooseNextVertex() {
    var job, cornerConfig, neighborProb, lowerSelfProb, upperSelfProb, random, relativeDirection,
        absoluteDirection, nextCorner, nextTile;

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

    do {
      random = Math.random();
      relativeDirection = random < neighborProb ? 0 : random < neighborProb + lowerSelfProb ? 1 : 2;
      absoluteDirection = ;
    } while (absoluteDirection === job.latestDirection + 3 % 6);

    job.latestDirection = absoluteDirection;

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
   */
  function updateSegments() {
    var job, distanceTravelled, frontSegmentLength, backSegmentLength, segmentsTouchedCount,
        distancePastEdge;

    job = this;

    distanceTravelled = job.ellapsedTime / job.lineSidePeriod * hg.HexGrid.config.tileOuterRadius;
    segmentsTouchedCount = parseInt(distanceTravelled / hg.HexGrid.config.tileOuterRadius) + 1;

    while (segmentsTouchedCount >= job.corners.length && !job.hasReachedEdge) {
      chooseNextVertex.call(job);
    }

    frontSegmentLength = distanceTravelled % hg.HexGrid.config.tileOuterRadius;
    backSegmentLength = (job.lineLength - frontSegmentLength +
        hg.HexGrid.config.tileOuterRadius) % hg.HexGrid.config.tileOuterRadius;

    job.frontSegmentEndRatio = frontSegmentLength / hg.HexGrid.config.tileOuterRadius;
    job.backSegmentStartRatio = 1 - (backSegmentLength / hg.HexGrid.config.tileOuterRadius);

    job.isShort = job.lineLength < hg.HexGrid.config.tileOuterRadius;
    job.isStarting = distanceTravelled < job.lineLength;

//    **;// TODO: what if the segment is both starting AND ending?
    //   - it seems that I need to instead first set the segment counts, then subtract from them for the various conditions

    if (job.isStarting) {
      // The polyline is starting; the back of the polyline would lie outside the grid
      job.segmentsIncludedCount = segmentsTouchedCount;
      job.completeSegmentsIncludedCount = job.segmentsIncludedCount - 1;
      console.log('>>>>>1.1');/////TODO/////
    } else if (job.hasReachedEdge) {
      // The polyline is ending; the front of the polyline would lie outside the grid
      if (job.isShort) {
        // The polyline is shorter than a tile side
        job.segmentsIncludedCount = 1;
        job.completeSegmentsIncludedCount = 0;
        console.log('>>>>>2.1');/////TODO/////
      } else {
        distancePastEdge = hg.HexGrid.config.tileOuterRadius *
            (segmentsTouchedCount - job.currentCornerIndex - 1);

        if (distancePastEdge > job.lineLength) {
          handleCompletion.call(job);
        }

        job.segmentsIncludedCount =
            (job.lineLength - distancePastEdge) % hg.HexGrid.config.tileOuterRadius;
        job.segmentsIncludedCount =
            job.segmentsIncludedCount < 0 ? 0 : parseInt(job.segmentsIncludedCount) + 1;
        job.completeSegmentsIncludedCount = job.segmentsIncludedCount - 1;
        console.log('>>>>>2.2');/////TODO/////
      }
    } else {
      // The polyline is fully within the grid
      if (job.isShort) {
        // The polyline is shorter than a tile side
        // (the test is testing equality, but needs to account for floating point round-off error)
        if ((distanceTravelled % hg.HexGrid.config.tileOuterRadius) - frontSegmentLength +
            config.epsilon < config.epsilon * 2) {
          // The polyline is between corners
          job.segmentsIncludedCount = 1;
          job.completeSegmentsIncludedCount = 0;
          console.log('>>>>>3.1');/////TODO/////
        } else {
          // The polyline is across a corner
          job.segmentsIncludedCount = 2;
          job.completeSegmentsIncludedCount = 0;
          console.log('>>>>>3.2');/////TODO/////
        }
      } else {
        job.segmentsIncludedCount = parseInt((job.lineLength - frontSegmentLength -
            backSegmentLength + config.epsilon) % hg.HexGrid.config.tileOuterRadius) + 2;
        job.completeSegmentsIncludedCount = job.segmentsIncludedCount - 2;
        console.log('>>>>>3.3');/////TODO/////
      }
    }
  }

  /**
   * Updates the actual SVG elements to render the current state of this animation.
   *
   * @this LineAnimationJob
   */
  function drawSegments() {
    var job, i, count, polylinePointsIndex, pointsString, gapPoints, polylinePoints, gapPointsIndex;

    job = this;

    gapPoints = [];

    for (i = 0, count = job.corners.length; i < count; i += 1) {
      gapPoints[i] = getCornerGapPoint(job.tiles[i], job.corners[i], job.lowerNeighbors[i],
          job.upperNeighbors[i], job.lowerNeighborCorners[i], job.upperNeighborCorners[i]);
    }

    polylinePoints = [];
    polylinePointsIndex = job.segmentsIncludedCount;
    gapPointsIndex = job.currentCornerIndex;

    // Add the front-end segment point
    if (!job.hasReachedEdge) {
      polylinePoints[polylinePointsIndex] = {
        x: gapPoints[gapPointsIndex].x * job.frontSegmentEndRatio +
            gapPoints[gapPointsIndex - 1].x * (1 - job.frontSegmentEndRatio),
        y: gapPoints[gapPointsIndex].y * job.frontSegmentEndRatio +
            gapPoints[gapPointsIndex - 1].y * (1 - job.frontSegmentEndRatio)
      };
      polylinePointsIndex -= 1;
      gapPointsIndex -= 1;
    }

    // Add the internal segment points
    for (i = 0, count = job.completeSegmentsIncludedCount + 1; i < count;
         i += 1, polylinePointsIndex -= 1, gapPointsIndex -= 1) {
      polylinePoints[polylinePointsIndex] = gapPoints[gapPointsIndex];
    }

    // Add the back-end segment point
    if (!job.isStarting) {
      polylinePoints[0] = {
        x: gapPoints[gapPointsIndex + 1].x * job.backSegmentStartRatio +
            gapPoints[gapPointsIndex].x * (1 - job.backSegmentStartRatio),
        y: gapPoints[gapPointsIndex + 1].y * job.backSegmentStartRatio +
            gapPoints[gapPointsIndex].y * (1 - job.backSegmentStartRatio)
      }
    }

    // Create the points string
    pointsString = '';
    for (i = 0, count = polylinePoints.length; i < count; i += 1) {
      pointsString += polylinePoints[i].x + ',' + polylinePoints[i].y + ' ';
    }

    // Update the attributes of the polyline SVG element
    job.polyline.setAttribute('points', pointsString);
    job.polyline.setAttribute('stroke', 'hsl(' + job.currentHue + ',' + job.currentSaturation +
        '%,' + job.currentLightness + '%)');
    job.polyline.setAttribute('stroke-opacity', job.currentOpacity);
    job.polyline.setAttribute('stroke-width', job.lineWidth);
  }

  /**
   * Calculates the point in the middle of the gap between tiles at the given corner.
   *
   * @param {HexTile} tile
   * @param {number} corner
   * @param {Object} lowerNeighbor
   * @param {Object} upperNeighbor
   * @param {number} lowerNeighborCorner
   * @param {number} upperNeighborCorner
   * @returns {{x:number,y:number}}
   */
  function getCornerGapPoint(tile, corner, lowerNeighbor, upperNeighbor, lowerNeighborCorner,
                             upperNeighborCorner) {
    var count, xSum, ySum;

    if (lowerNeighbor) {
      if (upperNeighbor) {
        count = 3;
        xSum = tile.particle.px + lowerNeighbor.tile.particle.px + upperNeighbor.tile.particle.px;
        ySum = tile.particle.py + lowerNeighbor.tile.particle.py + upperNeighbor.tile.particle.py;
      } else {
        count = 2;
        xSum = tile.vertices[corner * 2] + lowerNeighbor.tile.vertices[lowerNeighborCorner * 2];
        ySum = tile.vertices[corner * 2 + 1] +
            lowerNeighbor.tile.vertices[lowerNeighborCorner * 2 + 1];
      }
    } else {
      if (upperNeighbor) {
        count = 2;
        xSum = tile.vertices[corner * 2] + upperNeighbor.tile.vertices[upperNeighborCorner * 2];
        ySum = tile.vertices[corner * 2 + 1] +
            upperNeighbor.tile.vertices[upperNeighborCorner * 2 + 1];
      } else {
        count = 1;
        xSum = tile.vertices[corner * 2];
        ySum = tile.vertices[corner * 2 + 1];
      }
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

    job.ellapsedTime = currentTime - job.startTime;

    if (job.ellapsedTime >= job.duration) {
      handleCompletion.call(job);
      return;
    }

    updateColorValues.call(job);
    updateSegments.call(job);
    drawSegments.call(job);
  }

  /**
   * Stops this LineAnimationJob, and returns the element its original form.
   *
   * @this LineAnimationJob
   */
  function cancel() {
    var job;

    job = this;

    handleCompletion.call(job);
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
    job.lowerNeighbors = [];
    job.upperNeighbors = [];
    job.lowerNeighborCorners = [];
    job.upperNeighborCorners = [];
    job.direction = direction;
    job.currentCornerIndex = 0;
    job.frontSegmentEndRatio = Number.NaN;
    job.backSegmentStartRatio = Number.NaN;
    job.latestDirection = direction;
    job.polyline = null;
    job.hasReachedEdge = false;
    job.startTime = 0;
    job.ellapsedTime = 0;
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
        corner = Math.random() < 0.5 ? 0 : 3;
        direction = tile.originalCenterY < grid.centerY ? 2 : 1;
      } else if (!tile.neighbors[1]) { // Right side
        corner = Math.random() < 0.5 ? 0 : 3;
        direction = tile.originalCenterY < grid.centerY ? 4 : 5;
      } else if (!tile.neighbors[0]) { // Top side
        corner = Math.random() < 0.5 ? 1 : 5;
        direction = 3;
      } else { // Bottom side
        corner = Math.random() < 0.5 ? 2 : 4;
        direction = 0;
      }
    } else {
      if (!tile.neighbors[0]) { // Top side
        corner = Math.random() < 0.5 ? 1 : 4;
        direction = tile.originalCenterX < grid.centerX ? 2 : 3;
      } else if (!tile.neighbors[3]) { // Bottom side
        corner = Math.random() < 0.5 ? 1 : 4;
        direction = tile.originalCenterX < grid.centerX ? 0 : 5;
      } else if (!tile.neighbors[4]) { // Left side
        corner = Math.random() < 0.5 ? 3 : 5;
        direction = 1;
      } else { // Right side
        corner = Math.random() < 0.5 ? 0 : 2;
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
