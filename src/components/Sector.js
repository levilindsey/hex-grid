'use strict';

/**
 * This module defines a constructor for Sector objects.
 *
 * Sector objects define a collection of hexagonal tiles that lie within a single sector of the
 * grid--outward from a given tile position.
 *
 * Sectors are one-sixth of the grid.
 *
 * Sectors are used to animate open and close a hole in the grid around a given tile, so that the
 * contents of that tile can be shown in an expanded form.
 *
 * @module Sector
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    // TODO:
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Populates the collection of tiles that lie within this sector. These include both the
   * pre-existing tiles and new tiles that are created.
   *
   * @this Sector
   */
  function setUpTiles() {
    var sector, majorNeighborIndex, minorNeighborIndex, oldTiles, newTiles;

    sector = this;

    // Compute which directions to iterate through tiles for this sector
    majorNeighborIndex = sector.index;
    minorNeighborIndex = (sector.index + 2) % 6;

    // Get the old and new tiles for this sector, and set up neighbor states for the expanded grid
    // configuration
    collectTilesInSector.call(sector, majorNeighborIndex, minorNeighborIndex);

    // Re-assign temporary neighbor states for tiles in this sector
    initializeExpandedStateTileNeighbors.call(sector);

    // TODO:
  }

  /**
   * Collects references to the pre-existing tiles that lie within this sector.
   *
   * Creates new tiles that will be shown within this sector.
   *
   * Calculates and stores the neighbor states for the expanded grid configuration for each tile
   * in this Sector.
   *
   * @this Sector
   * @param {number} majorNeighborIndex
   * @param {number} minorNeighborIndex
   * @returns {Array.<Tile>}
   */
  function collectTilesInSector(majorNeighborIndex, minorNeighborIndex) {
    var sector, i, majorIndex, majorCount, minorIndex, minorCount;

    sector = this;

    sector.tilesByIndex = [];
    sector.tiles = [];

    // Collect all of the tiles for this sector into a hash set
    iterateOverTilesInSectorHelper(sector, sector.baseTile, majorNeighborIndex,
        minorNeighborIndex, false);
    iterateOverTilesInSectorHelper(sector, sector.baseTile, majorNeighborIndex,
        minorNeighborIndex, true);

    // Convert the two-dimensional array to a flat array
    for (majorIndex = 0, majorCount = sector.tilesByIndex.length, i = 0;
         majorIndex < majorCount; majorIndex += 1) {
      for (minorIndex = 0, minorCount = sector.tilesByIndex[majorIndex].length;
           minorIndex < minorCount; minorIndex += 1) {
        // Only store tiles for positions that are populated
        if (sector.tilesByIndex[majorIndex][minorIndex]) {
          sector.tiles[i++] = sector.tilesByIndex[majorIndex][minorIndex];
        }
      }
    }

    // TODO:
    // - I will actually need to iterate across all tiles in both directions (major to minor and minor to major)

//    tile.neighborStates[i] = {
//      tile: neighborTile,
//      restLength: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
//      neighborsRelationshipObj: null,
//      springForceX: 0,
//      springForceY: 0
//    };

    // ---  --- //

    function iterateOverTilesInSectorHelper(sector, baseTile, majorNeighborIndex,
                                            minorNeighborIndex, iterateInOtherDirection) {
      var majorTile, currentTile, majorIndex, minorIndex, minorCount,
          iterationMajorNeighborIndex, iterationMinorNeighborIndex;

      majorIndex = -1;
      minorCount = 0;
      majorTile = baseTile;

      // Determine which direction we are iterating in
      if (iterateInOtherDirection) {
        iterationMajorNeighborIndex = minorNeighborIndex;
        iterationMinorNeighborIndex = majorNeighborIndex;
      } else {
        iterationMajorNeighborIndex = majorNeighborIndex;
        iterationMinorNeighborIndex = minorNeighborIndex;
      }

      // Iterate over the major indices of the sector (aka, the "rows" of the sector)
      while (*withinExpandedViewport*) {
        majorIndex++;
        minorCount++;
        minorIndex = 0;

        // Set up the inner array for this "row" of the sector
        sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

        // Is there a already a tile here, or do we need to create a new one?
        if (majorTile.neighborStates[majorNeighborIndex]) {
          // Use the pre-existing tile
          majorTile = majorTile.neighborStates[majorNeighborIndex].tile;
        } else {
          // Create a new tile
          majorTile = createNewTileInSector(majorIndex, minorIndex);
        }

        currentTile = majorTile;

        // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
        while (minorIndex < minorCount &&
            *withinExpandedViewport*) {
          minorIndex++;

          // Is there a already a tile here, or do we need to create a new one?
          if (currentTile.neighborStates[minorNeighborIndex]) {
            // Use the pre-existing tile
            currentTile = currentTile.neighborStates[minorNeighborIndex].tile;
          } else {
            // Create a new tile
            currentTile = createNewTileInSector(majorIndex, minorIndex);
          }
        }

        // After we have added all of the tiles from this line that will lie within the viewport
        // for the expanded grid configuration, also add any remaining pre-existing tiles that lie
        // within this line
        while (currentTile.neighborStates[minorNeighborIndex] &&
            minorIndex < minorCount) {
          // TODO: copy over much of the above while loop...
        }
      }

      // After we have added all of the tiles from this sector that will lie within the viewport
      // for the expanded grid configuration, also add any remaining pre-existing tiles that lie
      // within this sector
      while (majorTile.neighborStates[majorNeighborIndex]) {
        // TODO: copy over much of the above while loop...
      }
    }

    // ---  --- //

    function addOldTileToSector(tile, majorIndex, minorIndex) {
      sector.tilesByIndex[majorIndex][minorIndex] = tile;
      tile.expandedState = {
        sector: sector,
        sectorMajorIndex: majorIndex,
        sectorMinorIndex: minorIndex,
        neighborStates: []
      };
    }

    function createNewTileInSector(majorIndex, minorIndex) {
      var centerX = ;
      var centerY = ;

      // TODO: some of the later parameters will need to be set in order for some animations to work
      var tile = new hg.Tile(sector.grid.svg, centerX, centerY, hg.Grid.config.tileOuterRadius,
          sector.grid.isVertical, hg.Grid.config.tileHue, hg.Grid.config.tileSaturation,
          hg.Grid.config.tileLightness, null, Number.NaN, Number.NaN, Number.NaN, true, false,
          false, false, hg.Grid.config.tileMass);
//      new hg.Tile(grid.svg, centerX, centerY, config.tileOuterRadius,
//          grid.isVertical, config.tileHue, config.tileSaturation, config.tileLightness, null,
//          tileIndex, rowIndex, columnIndex, isMarginTile, isBorderTile, isCornerTile,
//          isLargerRow, config.tileMass);
      addOldTileToSector(tile, majorIndex, minorIndex);

      return tile;
    }
  }

//  /**
//   * Creates the new tiles that will be shown within this sector.
//   *
//   * @this Sector
//   * @param {number} majorNeighborIndex
//   * @param {number} minorNeighborIndex
//   * @returns {Array.<Tile>}
//   */
//  function createNewTiles(majorNeighborIndex, minorNeighborIndex) {
//    var sector, newTiles, minX, maxX, minY, maxY, i, j, iCount, jCount, deltaX, deltaY;
//
//    sector = this;
//
//    newTiles = [];
//
//    // This assumes that a sector is never created based on a border tile
//    deltaX = ;
//    deltaY = ;
//
////    minX = sector.selectedTile.originalCenterX - window.innerWidth / 2;
////    maxX = sector.selectedTile.originalCenterX + window.innerWidth / 2;
////    minY = sector.selectedTile.originalCenterY - window.innerHeight / 2;
////    maxY = sector.selectedTile.originalCenterY + window.innerHeight / 2;
//
//    for (i = 0, iCount = ; i < iCount; i += 1) {
//      for (j = 0, jCount = ; j < jCount; j += 1) {
//        **;
//      }
//    }
//
//    // TODO:
//    // - will need to consider both the sector displacement and the viewport dimensions when considering max x/y displacement
//    // - will need to be able to tell which tile positions already have a pre-existing tile
//    // - ANSWER: iterate first (somehow during the overall nested loop) through the pre-existing tiles via neighbor links
//
//    return newTiles;
//  }

  /**
   * Calculates and stores the neighbor state for the expanded grid configuration for tiles in
   * this Sector.
   *
   * NOTE: this does not address external neighbor relations for tiles that lie on the outside
   * edge of this sector.
   *
   * @this Sector
   */
  function initializeExpandedStateTileNeighbors() {
    var sector;

    sector = this;

    **;// TODO:
    // Tile.setTileNeighborState(tile, neighborRelationIndex, neighborTile, true)
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @global
   * @constructor
   * @param {Grid} grid
   * @param {Tile} baseTile
   * @param {number} sectorIndex
   */
  function Sector(grid, baseTile, sectorIndex) {
    var sector = this;

    sector.grid = grid;
    sector.baseTile = baseTile;
    sector.index = sectorIndex;
    sector.tiles = null;
    sector.tilesByIndex = null;

    setUpTiles.call(sector);
  }

  Sector.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.Sector = Sector;

  console.log('Sector module loaded');
})();
