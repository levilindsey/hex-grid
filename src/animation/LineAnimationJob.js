'use strict';

/**
 * This module defines a constructor for LineAnimationJob objects.
 *
 * @module LineAnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var NEIGHBOR = 0,
      LOWER_SELF = 1,
      UPPER_SELF = 2,
      config = {};

  config.duration = 4400;
  config.lineWidth = 26;
  config.lineLength = 300;
  config.lineSidePeriod = 300; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 70;
  config.startOpacity = 1;

  config.endSaturation = 50;
  config.endLightness = 100;
  config.endOpacity = 0;

  config.sameDirectionProb = 0.9;


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
    job.grid.svg.insertBefore(job.polyline, job.grid.svg.firstChild);
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
        absoluteDirection, nextCorner, nextTile, currentCorner;

    job = this;
    currentCorner = job.corners[job.currentCornerIndex];

    // The first segment of a line animation is forced to go in a given direction
    if (job.currentCornerIndex === 0) {
      relativeDirection = job.forcedInitialRelativeDirection;
      job.latestDirection = relativeToAbsoluteDirection(relativeDirection, currentCorner);
    } else {
      cornerConfig = (currentCorner - job.direction + 6) % 6;

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

      // Determine the next direction to travel
      do {
        // Pick a random direction
        random = Math.random();
        relativeDirection = random < neighborProb ? NEIGHBOR :
                random < neighborProb + lowerSelfProb ? LOWER_SELF : UPPER_SELF;
        absoluteDirection = relativeToAbsoluteDirection(relativeDirection, currentCorner);
        console.log('r=' + relativeDirection);/////TODO/////
        console.log('a=' + absoluteDirection);/////TODO/////

        console.log('np=' + neighborProb);/////TODO/////
        console.log('lsp=' + lowerSelfProb);/////TODO/////
        console.log('usp=' + upperSelfProb);/////TODO/////
        console.log('ld=' + job.latestDirection);/////TODO/////

        // Disallow the line from going back the way it just came
      } while (absoluteDirection === (job.latestDirection + 3) % 6);

      job.latestDirection = absoluteDirection;
    }

    // Determine the next corner configuration
    switch (relativeDirection) {
      case NEIGHBOR:
        if (job.grid.isVertical) {
          nextCorner = (currentCorner + 1) % 6;
          nextTile = job.tiles[job.currentCornerIndex].neighbors[(currentCorner + 5) % 6].tile;
        } else {
          nextCorner = (currentCorner + 1) % 6;
          nextTile = job.tiles[job.currentCornerIndex].neighbors[currentCorner].tile;
        }
        break;
      case LOWER_SELF:
        nextCorner = (currentCorner + 5) % 6;
        nextTile = job.tiles[job.currentCornerIndex];
        break;
      case UPPER_SELF:
        nextCorner = (currentCorner + 1) % 6;
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
   * Translates the givern relative direction to an absolute direction.
   *
   * @param {number} relativeDirection
   * @param {number} corner
   * @returns {number}
   */
  function relativeToAbsoluteDirection(relativeDirection, corner) {
    switch (relativeDirection) {
      case NEIGHBOR:
        return corner;
      case LOWER_SELF:
        return (corner + 4) % 6;
      case UPPER_SELF:
        return (corner + 2) % 6;
      default:
        throw new Error('Invalid state: relativeDirection=' + relativeDirection);
    }
  }

  /**
   * Updates the parameters of the segments of this animation.
   *
   * @this LineAnimationJob
   */
  function updateSegments() {
    var job, distanceTravelled, frontSegmentLength, backSegmentLength, segmentsTouchedCount,
        distancePastEdge, segmentsPastEdgeCount;

    job = this;

    // --- Compute some values of the polyline at the current time --- //

    distanceTravelled = job.ellapsedTime / job.lineSidePeriod * hg.HexGrid.config.tileOuterRadius;
    segmentsTouchedCount = parseInt(distanceTravelled / hg.HexGrid.config.tileOuterRadius) + 1;

    // Add additional vertices to the polyline as needed
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

    // --- Determine how many segments are included in the polyline --- //

    // When the polyline is neither starting nor ending and is not shorter than the length of a
    // segment, then this is how many segments it includes
    job.segmentsIncludedCount = parseInt((job.lineLength - frontSegmentLength -
        backSegmentLength + config.epsilon) % hg.HexGrid.config.tileOuterRadius) + 2;
    job.completeSegmentsIncludedCount = job.segmentsIncludedCount - 2;

    // Subtract from the number of included segments depending on current conditions
    if (job.isShort) {
      // The polyline is shorter than a tile side
      job.completeSegmentsIncludedCount = 0;

      if (job.isStarting || job.hasReachedEdge) {
        // One end of the polyline would lie outside the grid
        job.segmentsIncludedCount = 1;
        console.log('>>>>>1.1');/////TODO/////
      } else {
        if (frontSegmentLength - job.lineLength >= 0) {
          // The polyline is between corners
          job.segmentsIncludedCount = 1;
          console.log('>>>>>1.2');/////TODO/////
        } else {
          // The polyline is across a corner
          job.segmentsIncludedCount = 2;
          console.log('>>>>>2.3');/////TODO/////
        }
      }
    } else {
      // The polyline is longer than a tile side
      console.log('>>>>>2.1');/////TODO/////

      if (job.isStarting) {
        // The polyline is starting; the back of the polyline would lie outside the grid
        job.segmentsIncludedCount = segmentsTouchedCount;
        job.completeSegmentsIncludedCount = segmentsTouchedCount - 1;
        console.log('>>>>>2.2');/////TODO/////
      }

      if (job.hasReachedEdge) {
        // The polyline is ending; the front of the polyline would lie outside the grid
        segmentsPastEdgeCount = segmentsTouchedCount - job.corners.length;
        distancePastEdge = segmentsPastEdgeCount * hg.HexGrid.config.tileOuterRadius;

        if (distancePastEdge > job.lineLength) {
          handleCompletion.call(job);
          return;
        }

        job.segmentsIncludedCount -= segmentsPastEdgeCount;
        job.completeSegmentsIncludedCount -= segmentsPastEdgeCount + 1;
        console.log('>>>>>2.3');/////TODO/////
      }
    }
  }


  /**
   * Calculates the points in the middle of the gaps between tiles at each known corner.
   *
   * @this LineAnimationJob
   */
  function computeCornerGapPoints() {
    var job, i, count;

    job = this;

    job.gapPoints = [];

    for (i = 0, count = job.corners.length; i < count; i += 1) {
      job.gapPoints[i] = computeCornerGapPoint(job.tiles[i], job.corners[i], job.lowerNeighbors[i],
          job.upperNeighbors[i], job.lowerNeighborCorners[i], job.upperNeighborCorners[i]);
    }
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
  function computeCornerGapPoint(tile, corner, lowerNeighbor, upperNeighbor, lowerNeighborCorner,
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

  /**
   * Calculates the points of the SVG polyline element.
   *
   * @this LineAnimationJob
   */
  function computePolylinePoints() {//**;// TODO: do we need i and count?
    var job, gapPointsIndex, polylinePointsIndex;

    job = this;

    job.polylinePoints = [];
    polylinePointsIndex = job.segmentsIncludedCount;
    gapPointsIndex = job.currentCornerIndex;

    // Add the front-end segment point
    if (!job.hasReachedEdge) {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex].x * job.frontSegmentEndRatio +
            job.gapPoints[gapPointsIndex - 1].x * (1 - job.frontSegmentEndRatio),
        y: job.gapPoints[gapPointsIndex].y * job.frontSegmentEndRatio +
            job.gapPoints[gapPointsIndex - 1].y * (1 - job.frontSegmentEndRatio)
      };
      polylinePointsIndex -= 1;
      gapPointsIndex -= 1;
    }

    // Add the internal segment points
    for (i = 0, count = job.completeSegmentsIncludedCount + 1; i < count;
         i += 1, polylinePointsIndex -= 1, gapPointsIndex -= 1) {
      job.polylinePoints[polylinePointsIndex] = job.gapPoints[gapPointsIndex];
    }

    // Add the back-end segment point
    if (!job.isStarting) {
      job.polylinePoints[0] = {
        x: job.gapPoints[gapPointsIndex + 1].x * job.backSegmentStartRatio +
            job.gapPoints[gapPointsIndex].x * (1 - job.backSegmentStartRatio),
        y: job.gapPoints[gapPointsIndex + 1].y * job.backSegmentStartRatio +
            job.gapPoints[gapPointsIndex].y * (1 - job.backSegmentStartRatio)
      }
    }
  }

  /**
   * Updates the actual SVG elements to render the current state of this animation.
   *
   * @this LineAnimationJob
   */
  function drawSegments() {
    var job, i, count, pointsString;

    job = this;

    // Create the points string
    pointsString = '';
    for (i = 0, count = job.polylinePoints.length; i < count; i += 1) {
      pointsString += job.polylinePoints[i].x + ',' + job.polylinePoints[i].y + ' ';
    }

    // Update the attributes of the polyline SVG element
    job.polyline.setAttribute('points', pointsString);
    job.polyline.setAttribute('stroke', 'hsl(' + job.currentHue + ',' + job.currentSaturation +
        '%,' + job.currentLightness + '%)');
    job.polyline.setAttribute('stroke-opacity', job.currentOpacity);
    job.polyline.setAttribute('stroke-width', job.lineWidth);
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
    computeCornerGapPoints.call(job);
    computePolylinePoints.call(job);
  }

  /**
   * Draws the current state of this LineAnimationJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this LineAnimationJob
   */
  function draw() {
    var job = this;

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
   * @param {number} forcedInitialRelativeDirection
   */
  function LineAnimationJob(grid, tile, corner, direction, forcedInitialRelativeDirection) {
    var job = this;

    job.grid = grid;
    job.tiles = [tile];
    job.corners = [corner];
    job.lowerNeighbors = [];
    job.upperNeighbors = [];
    job.lowerNeighborCorners = [];
    job.upperNeighborCorners = [];
    job.direction = direction;
    job.forcedInitialRelativeDirection = forcedInitialRelativeDirection;
    job.currentCornerIndex = 0;
    job.frontSegmentEndRatio = Number.NaN;
    job.backSegmentStartRatio = Number.NaN;
    job.latestDirection = direction;
    job.polyline = null;
    job.gapPoints = null;
    job.polylinePoints = null;
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

    job.start = start;
    job.update = update;
    job.draw = draw;
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
    var tile, corner, direction, forcedInitialRelativeDirection;

    // Pick a random border tile to start from
    tile = grid.borderTiles[parseInt(Math.random() * grid.borderTiles.length)];

    // Determine which corner and direction to use based on the selected tile
    if (grid.isVertical) {
      if (!tile.neighbors[4]) { // Left side
        if (tile.isInLargerRow) {
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 1;
          }
        } else { // Smaller row
          if (Math.random() < 0.5) {
            corner = 4;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 5;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 1;
          }
        }
        direction = tile.originalCenterY < grid.centerY ? 2 : 1;
      } else if (!tile.neighbors[1]) { // Right side
        if (tile.isInLargerRow) {
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 4;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          }
        } else { // Smaller row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          } else {
            corner = 2;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 4;
          }
        }
        direction = tile.originalCenterY < grid.centerY ? 4 : 5;
      } else if (!tile.neighbors[0]) { // Top side
        if (Math.random() < 0.5) {
          corner = 1;
          forcedInitialRelativeDirection = UPPER_SELF;
        } else {
          corner = 5;
          forcedInitialRelativeDirection = LOWER_SELF;
        }
        //forcedInitialAbsoluteDirection = 3;
        direction = 3;
      } else { // Bottom side
        if (Math.random() < 0.5) {
          corner = 2;
          forcedInitialRelativeDirection = LOWER_SELF;
        } else {
          corner = 4;
          forcedInitialRelativeDirection = UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 0;
        direction = 0;
      }
    } else { // Not vertical
      if (!tile.neighbors[0]) { // Top side
        if (tile.rowIndex === 0) { // First row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 3;
          } else {
            corner = 4;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          }
        } else { // Second row
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 5;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 3;
          }
        }
        direction = tile.originalCenterX < grid.centerX ? 2 : 3;
      } else if (!tile.neighbors[3]) { // Bottom side
        if (tile.rowIndex === grid.rowCount - 1) { // Last row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          } else {
            corner = 4;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 0;
          }
        } else { // Second-to-last row
          if (Math.random() < 0.5) {
            corner = 2;
            forcedInitialRelativeDirection = LOWER_SELF;
            //forcedInitialAbsoluteDirection = 0;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = UPPER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          }
        }
        direction = tile.originalCenterX < grid.centerX ? 0 : 5;
      } else if (!tile.neighbors[4]) { // Left side
        if (Math.random() < 0.5) {
          corner = 3;
          forcedInitialRelativeDirection = LOWER_SELF;
        } else {
          corner = 5;
          forcedInitialRelativeDirection = UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 1;
        direction = 1;
      } else { // Right side
        if (Math.random() < 0.5) {
          corner = 0;
          forcedInitialRelativeDirection = LOWER_SELF;
        } else {
          corner = 2;
          forcedInitialRelativeDirection = UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 4;
        direction = 4;
      }
    }

    return new LineAnimationJob(grid, tile, corner, direction, forcedInitialRelativeDirection);
  }

  LineAnimationJob.config = config;
  LineAnimationJob.createRandomLineAnimationJob = createRandomLineAnimationJob;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.LineAnimationJob = LineAnimationJob;

  console.log('LineAnimationJob module loaded');
})();
