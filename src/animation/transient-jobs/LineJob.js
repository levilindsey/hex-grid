/**
 * @typedef {AnimationJob} LineJob
 */

/**
 * This module defines a constructor for LineJob objects.
 *
 * @module LineJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 2000;
  config.lineWidth = 28;
  config.lineLength = 60000;
  config.lineSidePeriod = 5; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 100;
  config.startOpacity = 0.6;

  config.endSaturation = 100;
  config.endLightness = 60;
  config.endOpacity = 0;

  config.sameDirectionProb = 0.8;

  config.blurStdDeviation = 2;
  config.isBlurOn = false;

  config.isRecurring = true;
  config.avgDelay = 2200;
  config.delayDeviationRange = 2100;

  // ---  --- //

  config.NEIGHBOR = 0;
  config.LOWER_SELF = 1;
  config.UPPER_SELF = 2;

  config.oppositeDirectionProb = 0;
  config.epsilon = 0.00001;

  config.haveDefinedLineBlur = false;
  config.filterId = 'random-line-filter';

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.distantSidewaysDirectionProb = (1 - config.sameDirectionProb) / 2;
    config.closeSidewaysDirectionProb = (1 - config.oppositeDirectionProb) / 2;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates an SVG definition that is used for blurring the lines of LineJobs.
   *
   * @this LineJob
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

    config.filter = filter;
    config.feGaussianBlur = feGaussianBlur;
  }

  /**
   * Creates the start and end hue for the line of this animation.
   *
   * @this LineJob
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
   * @this LineJob
   */
  function createPolyline() {
    var job;

    job = this;

    job.polyline = document.createElementNS(window.hg.util.svgNamespace, 'polyline');
    job.grid.svg.insertBefore(job.polyline, job.grid.svg.firstChild);

    job.polyline.setAttribute('fill-opacity', '0');

    if (config.isBlurOn) {
      job.polyline.setAttribute('filter', 'url(#' + config.filterId + ')');
    }
  }

  /**
   * Updates the color values of the line of this animation.
   *
   * @this LineJob
   */
  function updateColorValues() {
    var job, progress, oneMinusProgress;

    job = this;

    progress = job.ellapsedTime / job.duration;
    oneMinusProgress = 1 - progress;

    job.currentColor.h = oneMinusProgress * job.startHue + progress * job.endHue;
    job.currentColor.s = oneMinusProgress * job.startSaturation + progress * job.endSaturation;
    job.currentColor.l = oneMinusProgress * job.startLightness + progress * job.endLightness;
    job.currentOpacity = oneMinusProgress * job.startOpacity + progress * job.endOpacity;
  }

  /**
   * Updates the state of this job to handle its completion.
   *
   * @this LineJob
   */
  function handleCompletion() {
    var job;

    job = this;

    console.log('LineJob completed');

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

    job.onComplete(job);
  }

  /**
   * Determines whether this LineJob has reached the edge of the grid.
   *
   * @this LineJob
   */
  function checkHasAlmostReachedEdge() {
    var job;

    job = this;

    if (job.direction === (job.corners[job.currentCornerIndex] + 3) % 6) {
      // When the job is at the opposite corner of a tile from the direction it is headed, then it
      // has not reached the edge
      job.hasAlmostReachedEdge = false;
    } else {
      job.hasAlmostReachedEdge = !job.lowerNeighbors[job.currentCornerIndex] ||
          !job.upperNeighbors[job.currentCornerIndex];
    }
  }

  /**
   * Determines the neighbors of this job's current tile at the current corner.
   *
   * @this LineJob
   */
  function determineNeighbors() {
    var job, lowerNeigborTileIndex, upperNeigborTileIndex, currentCorner;

    job = this;
    currentCorner = job.corners[job.currentCornerIndex];

    if (job.grid.isVertical) {
      lowerNeigborTileIndex = (currentCorner + 5) % 6;
      upperNeigborTileIndex = currentCorner;
    } else {
      lowerNeigborTileIndex = currentCorner;
      upperNeigborTileIndex = (currentCorner + 1) % 6;
    }

    job.lowerNeighbors[job.currentCornerIndex] =
        job.tiles[job.currentCornerIndex].neighborStates[lowerNeigborTileIndex];
    job.upperNeighbors[job.currentCornerIndex] =
        job.tiles[job.currentCornerIndex].neighborStates[upperNeigborTileIndex];

    job.lowerNeighborCorners[job.currentCornerIndex] = (currentCorner + 2) % 6;
    job.upperNeighborCorners[job.currentCornerIndex] = (currentCorner + 4) % 6;
  }

  /**
   * Returns the next vertex in the path of this animation.
   *
   * @this LineJob
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
          neighborProb = job.sameDirectionProb;
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
          lowerSelfProb = job.sameDirectionProb;
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
          upperSelfProb = job.sameDirectionProb;
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
        relativeDirection = random < neighborProb ? config.NEIGHBOR :
                random < neighborProb + lowerSelfProb ? config.LOWER_SELF : config.UPPER_SELF;
        absoluteDirection = relativeToAbsoluteDirection(relativeDirection, currentCorner);

        // Disallow the line from going back the way it just came
      } while (absoluteDirection === (job.latestDirection + 3) % 6);

      job.latestDirection = absoluteDirection;
    }

    // Determine the next corner configuration
    switch (relativeDirection) {
      case config.NEIGHBOR:
        if (job.grid.isVertical) {
          nextCorner = (currentCorner + 1) % 6;
          nextTile = job.tiles[job.currentCornerIndex].neighborStates[(currentCorner + 5) % 6].tile;
        } else {
          nextCorner = (currentCorner + 1) % 6;
          nextTile = job.tiles[job.currentCornerIndex].neighborStates[currentCorner].tile;
        }
        break;
      case config.LOWER_SELF:
        nextCorner = (currentCorner + 5) % 6;
        nextTile = job.tiles[job.currentCornerIndex];
        break;
      case config.UPPER_SELF:
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
    checkHasAlmostReachedEdge.call(job);
  }

  /**
   * Translates the givern relative direction to an absolute direction.
   *
   * @param {Number} relativeDirection
   * @param {Number} corner
   * @returns {Number}
   */
  function relativeToAbsoluteDirection(relativeDirection, corner) {
    switch (relativeDirection) {
      case config.NEIGHBOR:
        return corner;
      case config.LOWER_SELF:
        return (corner + 4) % 6;
      case config.UPPER_SELF:
        return (corner + 2) % 6;
      default:
        throw new Error('Invalid state: relativeDirection=' + relativeDirection);
    }
  }

  /**
   * Updates the parameters of the segments of this animation.
   *
   * @this LineJob
   */
  function updateSegments() {
    var job, distanceTravelled, frontSegmentLength, backSegmentLength, segmentsTouchedCount,
        distancePastEdge, segmentsPastEdgeCount;

    job = this;

    // --- Compute some values of the polyline at the current time --- //

    distanceTravelled = job.ellapsedTime / job.lineSidePeriod * window.hg.Grid.config.tileOuterRadius;
    segmentsTouchedCount = parseInt(job.ellapsedTime / job.lineSidePeriod) + 1;

    // Add additional vertices to the polyline as needed
    while (segmentsTouchedCount >= job.corners.length && !job.hasAlmostReachedEdge) {
      chooseNextVertex.call(job);
    }

    frontSegmentLength = distanceTravelled % window.hg.Grid.config.tileOuterRadius;
    backSegmentLength = (job.lineLength - frontSegmentLength +
        window.hg.Grid.config.tileOuterRadius) % window.hg.Grid.config.tileOuterRadius;

    job.frontSegmentEndRatio = frontSegmentLength / window.hg.Grid.config.tileOuterRadius;
    job.backSegmentStartRatio = 1 - (backSegmentLength / window.hg.Grid.config.tileOuterRadius);

    job.isShort = job.lineLength < window.hg.Grid.config.tileOuterRadius;
    job.isStarting = distanceTravelled < job.lineLength;

    // Check whether the line has reached the edge
    if (job.hasAlmostReachedEdge && segmentsTouchedCount >= job.corners.length) {
      job.hasReachedEdge = true;
    }

    // --- Determine how many segments are included in the polyline --- //

    // When the polyline is neither starting nor ending and is not shorter than the length of a
    // segment, then this is how many segments it includes
    job.segmentsIncludedCount = parseInt((job.lineLength - frontSegmentLength -
        backSegmentLength - config.epsilon) / window.hg.Grid.config.tileOuterRadius) + 2;

    // Subtract from the number of included segments depending on current conditions
    if (job.isShort) {
      // The polyline is shorter than a tile side

      if (job.isStarting || job.hasReachedEdge) {
        // One end of the polyline would lie outside the grid
        job.segmentsIncludedCount = 1;
      } else {
        if (frontSegmentLength - job.lineLength >= 0) {
          // The polyline is between corners
          job.segmentsIncludedCount = 1;
        } else {
          // The polyline is across a corner
          job.segmentsIncludedCount = 2;
        }
      }
    } else {
      // The polyline is longer than a tile side

      if (job.isStarting) {
        // The polyline is starting; the back of the polyline would lie outside the grid
        job.segmentsIncludedCount = segmentsTouchedCount;
      }

      if (job.hasReachedEdge) {
        // The polyline is ending; the front of the polyline would lie outside the grid
        segmentsPastEdgeCount = segmentsTouchedCount - job.corners.length + 1;
        distancePastEdge = distanceTravelled - (job.corners.length - 1) *
            window.hg.Grid.config.tileOuterRadius;

        if (distancePastEdge > job.lineLength) {
          handleCompletion.call(job);
        }

        job.segmentsIncludedCount -= segmentsPastEdgeCount;
      }
    }
  }


  /**
   * Calculates the points in the middle of the gaps between tiles at each known corner.
   *
   * @this LineJob
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
   * @param {Tile} tile
   * @param {Number} corner
   * @param {Object} lowerNeighbor
   * @param {Object} upperNeighbor
   * @param {Number} lowerNeighborCorner
   * @param {Number} upperNeighborCorner
   * @returns {{x:Number,y:Number}}
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
   * @this LineJob
   */
  function computePolylinePoints() {
    var job, gapPointsIndex, polylinePointsIndex, stopIndex;

    job = this;

    job.polylinePoints = [];
    gapPointsIndex = job.currentCornerIndex;

    if (job.extraStartPoint && job.isStarting) {
      // Add the extra, forced initial point (this is useful for making radiating lines actually
      // start from the center of the tile and not show any gap around the corners of the tile)
      job.polylinePoints[0] = job.extraStartPoint;

      polylinePointsIndex = job.segmentsIncludedCount + 1;
      stopIndex = 1;
    } else {
      polylinePointsIndex = job.segmentsIncludedCount;
      stopIndex = 0;
    }

    // Add the front-end segment point
    if (!job.hasReachedEdge) {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex].x * job.frontSegmentEndRatio +
            job.gapPoints[gapPointsIndex - 1].x * (1 - job.frontSegmentEndRatio),
        y: job.gapPoints[gapPointsIndex].y * job.frontSegmentEndRatio +
            job.gapPoints[gapPointsIndex - 1].y * (1 - job.frontSegmentEndRatio)
      };
    } else {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex].x,
        y: job.gapPoints[gapPointsIndex].y
      };
    }

    polylinePointsIndex -= 1;
    gapPointsIndex -= 1;

    // Add the internal segment points
    for (; polylinePointsIndex > stopIndex; polylinePointsIndex -= 1, gapPointsIndex -= 1) {
      job.polylinePoints[polylinePointsIndex] = job.gapPoints[gapPointsIndex];
    }

    // Add the back-end segment point
    if (!job.isStarting) {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex + 1].x * job.backSegmentStartRatio +
            job.gapPoints[gapPointsIndex].x * (1 - job.backSegmentStartRatio),
        y: job.gapPoints[gapPointsIndex + 1].y * job.backSegmentStartRatio +
            job.gapPoints[gapPointsIndex].y * (1 - job.backSegmentStartRatio)
      }
    } else {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex].x,
        y: job.gapPoints[gapPointsIndex].y
      };
    }
  }

  /**
   * Updates the actual SVG elements to render the current state of this animation.
   *
   * @this LineJob
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
    job.polyline.setAttribute('stroke', 'hsl(' + job.currentColor.h + ',' + job.currentColor.s +
        '%,' + job.currentColor.l + '%)');
    job.polyline.setAttribute('stroke-opacity', job.currentOpacity);
    job.polyline.setAttribute('stroke-width', job.lineWidth);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this LineJob as started.
   *
   * @this LineJob
   */
  function start() {
    var job = this;

    job.startTime = performance.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this LineJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this LineJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    job.ellapsedTime = currentTime - job.startTime;

    if (job.ellapsedTime >= job.duration) {
      handleCompletion.call(job);
    } else {
      updateColorValues.call(job);
      updateSegments.call(job);

      config.feGaussianBlur.setAttribute('stdDeviation', job.blurStdDeviation);

      if (!job.isComplete) {
        computeCornerGapPoints.call(job);
        computePolylinePoints.call(job);
      }
    }
  }

  /**
   * Draws the current state of this LineJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this LineJob
   */
  function draw() {
    var job = this;

    drawSegments.call(job);
  }

  /**
   * Stops this LineJob, and returns the element its original form.
   *
   * @this LineJob
   */
  function cancel() {
    var job;

    job = this;

    handleCompletion.call(job);
  }

  /**
   * @this LineJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Number} corner
   * @param {Number} direction
   * @param {Number} forcedInitialRelativeDirection
   * @param {Function} [onComplete]
   * @param {{x:Number,y:Number}} extraStartPoint
   * @throws {Error}
   */
  function LineJob(grid, tile, corner, direction, forcedInitialRelativeDirection,
                            onComplete, extraStartPoint) {
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
    job.extraStartPoint = extraStartPoint;
    job.currentCornerIndex = 0;
    job.frontSegmentEndRatio = Number.NaN;
    job.backSegmentStartRatio = Number.NaN;
    job.latestDirection = direction;
    job.polyline = null;
    job.gapPoints = [];
    job.polylinePoints = null;
    job.hasReachedEdge = false;
    job.startTime = 0;
    job.ellapsedTime = 0;
    job.isComplete = true;

    job.startHue = Number.NaN;
    job.endHue = Number.NaN;
    job.currentColor = {
      h: Number.NaN,
      s: config.startSaturation,
      l: config.startLightness
    };
    job.currentOpacity = config.startOpacity;

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

    job.blurStdDeviation = config.blurStdDeviation;
    job.isBlurOn = config.isBlurOn;

    job.onComplete = onComplete || function () {};

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = init;

    if (!config.haveDefinedLineBlur) {
      config.haveDefinedLineBlur = true;
      defineLineBlur.call(job);
    }

    if (!checkIsValidInitialCornerConfiguration(job)) {
      throw new Error('LineJob created with invalid initial corner configuration: ' +
          'tileIndex=' + tile.originalIndex + ', corner=' + corner + ', direction=' + direction);
    } else {
      determineNeighbors.call(job);
      createHues.call(job);
      createPolyline.call(job);

      console.log('LineJob created: tileIndex=' + tile.originalIndex + ', corner=' + corner +
          ', direction=' + direction);
    }
  }

  /**
   * Creates a LineJob that is initialized at a tile vertex along the border of the grid.
   *
   * @param {Grid} grid
   * @param {Function} onComplete
   */
  function createRandomLineJob(grid, onComplete) {
    var tile, corner, direction, forcedInitialRelativeDirection;

    // Pick a random, non-corner, border tile to start from
    do {
      tile = grid.originalBorderTiles[parseInt(Math.random() * grid.originalBorderTiles.length)];
    } while (tile.isCornerTile);

    // Determine which corner and direction to use based on the selected tile
    if (grid.isVertical) {
      if (!tile.neighborStates[4]) { // Left side
        if (tile.isInLargerRow) {
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 1;
          }
        } else { // Smaller row
          if (Math.random() < 0.5) {
            corner = 4;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 5;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 1;
          }
        }
        direction = tile.originalAnchor.y < grid.originalCenter.y ? 2 : 1;
      } else if (!tile.neighborStates[1]) { // Right side
        if (tile.isInLargerRow) {
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 4;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          }
        } else { // Smaller row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          } else {
            corner = 2;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 4;
          }
        }
        direction = tile.originalAnchor.y < grid.originalCenter.y ? 4 : 5;
      } else if (!tile.neighborStates[0]) { // Top side
        if (Math.random() < 0.5) {
          corner = 1;
          forcedInitialRelativeDirection = config.UPPER_SELF;
        } else {
          corner = 5;
          forcedInitialRelativeDirection = config.LOWER_SELF;
        }
        //forcedInitialAbsoluteDirection = 3;
        direction = 3;
      } else { // Bottom side
        if (Math.random() < 0.5) {
          corner = 2;
          forcedInitialRelativeDirection = config.LOWER_SELF;
        } else {
          corner = 4;
          forcedInitialRelativeDirection = config.UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 0;
        direction = 0;
      }
    } else { // Not vertical
      if (!tile.neighborStates[0]) { // Top side
        if (tile.rowIndex === 0) { // First row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 3;
          } else {
            corner = 4;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          }
        } else { // Second row
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 5;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 3;
          }
        }
        direction = tile.originalAnchor.x < grid.originalCenter.x ? 2 : 3;
      } else if (!tile.neighborStates[3]) { // Bottom side
        if (tile.rowIndex === grid.rowCount - 1) { // Last row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          } else {
            corner = 4;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 0;
          }
        } else { // Second-to-last row
          if (Math.random() < 0.5) {
            corner = 2;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 0;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          }
        }
        direction = tile.originalAnchor.x < grid.originalCenter.x ? 0 : 5;
      } else if (!tile.neighborStates[4]) { // Left side
        if (Math.random() < 0.5) {
          corner = 3;
          forcedInitialRelativeDirection = config.LOWER_SELF;
        } else {
          corner = 5;
          forcedInitialRelativeDirection = config.UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 1;
        direction = 1;
      } else { // Right side
        if (Math.random() < 0.5) {
          corner = 0;
          forcedInitialRelativeDirection = config.LOWER_SELF;
        } else {
          corner = 2;
          forcedInitialRelativeDirection = config.UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 4;
        direction = 4;
      }
    }

    return new LineJob(grid, tile, corner, direction, forcedInitialRelativeDirection,
        onComplete, null);
  }

  /**
   * Checks whether the given LineJob has a valid corner configuration for its initial
   * position.
   *
   * @param {LineJob} job
   */
  function checkIsValidInitialCornerConfiguration(job) {
    var tile, corner, direction, forcedInitialRelativeDirection, isValidEdgeDirection;

    tile = job.tiles[0];
    corner = job.corners[0];
    direction = job.direction;
    forcedInitialRelativeDirection = job.forcedInitialRelativeDirection;

    if (tile.isCornerTile) {
      return false;
    }

    if (tile.isBorderTile) {
      if (job.grid.isVertical) {
        if (!tile.neighborStates[4]) { // Left side
          isValidEdgeDirection = direction === 1 || direction === 2;

          if (tile.isInLargerRow) {
            switch (corner) {
              case 0:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 1:
                return true;
              case 2:
                return true;
              case 3:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 4:
                return false;
              case 5:
                return false;
            }
          } else {
            switch (corner) {
              case 0:
                return true;
              case 1:
                return true;
              case 2:
                return true;
              case 3:
                return true;
              case 4:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 5:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
            }
          }
        } else if (!tile.neighborStates[1]) { // Right side
          isValidEdgeDirection = direction === 4 || direction === 5;

          if (tile.isInLargerRow) {
            switch (corner) {
              case 0:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 1:
                return false;
              case 2:
                return false;
              case 3:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 4:
                return true;
              case 5:
                return true;
            }
          } else { // Smaller row
            switch (corner) {
              case 0:
                return true;
              case 1:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 2:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 3:
                return true;
              case 4:
                return true;
              case 5:
                return true;
            }
          }
        } else if (!tile.neighborStates[0]) { // Top side
          isValidEdgeDirection = direction === 3;

          switch (corner) {
            case 0:
              return false;
            case 1:
              return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
            case 2:
              return true;
            case 3:
              return true;
            case 4:
              return true;
            case 5:
              return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
          }
        } else { // Bottom side
          isValidEdgeDirection = direction === 0;

          switch (corner) {
            case 0:
              return true;
            case 1:
              return true;
            case 2:
              return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
            case 3:
              return false;
            case 4:
              return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
            case 5:
              return true;
          }
        }
      } else { // Not vertical
        if (!tile.neighborStates[0]) { // Top side
          isValidEdgeDirection = direction === 2 || direction === 3;

          if (tile.rowIndex === 0) { // First row
            switch (corner) {
              case 0:
                return false;
              case 1:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 2:
                return true;
              case 3:
                return true;
              case 4:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 5:
                return false;
            }
          } else { // Second row
            switch (corner) {
              case 0:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 1:
                return true;
              case 2:
                return true;
              case 3:
                return true;
              case 4:
                return true;
              case 5:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
            }
          }
        } else if (!tile.neighborStates[3]) { // Bottom side
          isValidEdgeDirection = direction === 0 || direction === 5;

          if (tile.rowIndex === job.grid.rowCount - 1) { // Last row
            switch (corner) {
              case 0:
                return true;
              case 1:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 2:
                return false;
              case 3:
                return false;
              case 4:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 5:
                return true;
            }
          } else { // Second-to-last row
            switch (corner) {
              case 0:
                return true;
              case 1:
                return true;
              case 2:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 3:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 4:
                return true;
              case 5:
                return true;
            }
          }
        } else if (!tile.neighborStates[4]) { // Left side
          isValidEdgeDirection = direction === 1;

          switch (corner) {
            case 0:
              return true;
            case 1:
              return true;
            case 2:
              return true;
            case 3:
              return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
            case 4:
              return false;
            case 5:
              return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
          }
        } else { // Right side
          isValidEdgeDirection = direction === 4;

          switch (corner) {
            case 0:
              return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
            case 1:
              return false;
            case 2:
              return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
            case 3:
              return true;
            case 4:
              return true;
            case 5:
              return true;
          }
        }
      }
    }

    return true;
  }

  LineJob.config = config;
  LineJob.createRandomLineJob = createRandomLineJob;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.LineJob = LineJob;

  console.log('LineJob module loaded');
})();
