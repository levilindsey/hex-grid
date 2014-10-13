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
    var sector;

    sector = this;

    sector.tilesByIndex = [];
    sector.tiles = [];

    // Get the old and new tiles for this sector, and set up neighbor states for the expanded grid
    // configuration
    collectOldTilesInSector.call(sector);
    collectNewTilesInSector.call(sector);

    // Re-assign temporary neighbor states for tiles in this sector
    initializeExpandedStateTileNeighbors.call(sector);

    // Convert the two-dimensional array to a flat array
    flattenTileCollection.call(sector);
  }

  /**
   * Collects references to the pre-existing tiles that lie within this sector.
   *
   * ASSUMPTION: the baseTile is not a border tile (i.e., it has six neighbors)
   *
   * @this Sector
   */
  function collectOldTilesInSector() {
    var sector, majorNeighborIndex, minorNeighborIndex;

    sector = this;

    // Compute which directions to iterate through tiles for this sector
    majorNeighborIndex = sector.index;
    minorNeighborIndex = (sector.index + 1) % 6;

    // TODO: this double-pass major-to-minor line-iteration algorithm is NOT guaranteed to collect all of the tiles in the viewport (but it is likely to) (the breaking edge case is when the viewport's aspect ratio is very large or very small)
    // Collect all of the tiles for this sector into a two-dimensional array
    iterateOverTilesInSectorInMajorOrder(sector, sector.baseTile, majorNeighborIndex,
        minorNeighborIndex);
    iterateOverTilesInSectorInMinorOrder(sector, sector.baseTile, majorNeighborIndex,
        minorNeighborIndex);

    // ---  --- //

    function iterateOverTilesInSectorInMajorOrder(sector, baseTile, majorNeighborIndex,
                                                  minorNeighborIndex) {
      var majorTile, currentTile, majorIndex, minorIndex;

      majorIndex = 0;
      majorTile = baseTile;

      // Iterate over the major indices of the sector (aka, the "rows" of the sector)
      do {
        majorTile = majorTile.neighborStates[majorNeighborIndex].tile;
        currentTile = majorTile;
        minorIndex = 0;

        // Set up the inner array for this "row" of the sector
        sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

        // Store the first tile in this major "row"
        sector.tilesByIndex[majorIndex][minorIndex++] = currentTile;

        // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
        while (currentTile.neighborStates[minorNeighborIndex]) {
          currentTile = currentTile.neighborStates[minorNeighborIndex].tile;

          // Store the current tile in the "row"
          sector.tilesByIndex[majorIndex][minorIndex++] = currentTile;
        }

        majorIndex++;
      } while (majorTile.neighborStates[majorNeighborIndex]);
    }

    function iterateOverTilesInSectorInMinorOrder(sector, baseTile, majorNeighborIndex,
                                                  minorNeighborIndex) {
      var minorTile, currentTile, majorIndex, minorIndex;

      minorIndex = 0;
      minorTile = baseTile.neighborStates[majorNeighborIndex].tile;

      // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
      do {
        currentTile = minorTile;
        majorIndex = 0;

        // Set up the inner array for this "row" of the sector
        sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

        // Store the first tile in this minor "column"
        sector.tilesByIndex[majorIndex++][minorIndex] = currentTile;

        // Iterate over the major indices of the sector (aka, the "rows" of the sector)
        while (currentTile.neighborStates[majorNeighborIndex]) {
          currentTile = currentTile.neighborStates[majorNeighborIndex].tile;

          // Set up the inner array for this "row" of the sector
          sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

          // Store the current tile in the "column"
          sector.tilesByIndex[majorIndex++][minorIndex] = currentTile;
        }

        minorIndex++;
      } while (minorTile.neighborStates[minorNeighborIndex] &&
          (minorTile = minorTile.neighborStates[minorNeighborIndex].tile));
    }
  }

  /**
   * Creates new tiles that will be shown within this sector.
   *
   * ASSUMPTION: the baseTile is not a border tile (i.e., it has six neighbors)
   *
   * @this Sector
   */
  function collectNewTilesInSector() {
    var sector, majorNeighborIndex, minorNeighborIndex, majorNeighborDeltaX, majorNeighborDeltaY,
        minorNeighborDeltaX, minorNeighborDeltaY, i, majorIndex, minorIndex;

    sector = this;

    // Compute which directions to iterate through tiles for this sector
    majorNeighborIndex = sector.index;
    minorNeighborIndex = (sector.index + 1) % 6;

    // Compute the axially-aligned distances between adjacent tiles
    majorNeighborDeltaX =
        sector.baseTile.neighborStates[majorNeighborIndex].tile.originalCenterX -
        sector.baseTile.originalCenterX;
    majorNeighborDeltaY =
        sector.baseTile.neighborStates[majorNeighborIndex].tile.originalCenterY -
        sector.baseTile.originalCenterY;
    minorNeighborDeltaX =
        sector.baseTile.neighborStates[minorNeighborIndex].tile.originalCenterX -
        sector.baseTile.originalCenterX;
    minorNeighborDeltaY =
        sector.baseTile.neighborStates[minorNeighborIndex].tile.originalCenterY -
        sector.baseTile.originalCenterY;

    // TODO: this double-pass major-to-minor line-iteration algorithm is NOT guaranteed to collect all of the tiles in the viewport (but it is likely to) (the breaking edge case is when the viewport's aspect ratio is very large or very small)
    // Collect all of the tiles for this sector into a two-dimensional array
    iterateOverTilesInSectorHelper(sector, sector.baseTile, majorNeighborIndex,
        minorNeighborIndex, false);
    iterateOverTilesInSectorHelper(sector, sector.baseTile, majorNeighborIndex,
        minorNeighborIndex, true);

    // ---  --- //

    function iterateOverTilesInSectorHelper(sector, baseTile, majorNeighborIndex,
                                            minorNeighborIndex, iterateInOtherDirection) {
      var majorTile, currentTile, majorIndex, minorIndex, centerX, centerY,
          iterationMajorNeighborIndex, iterationMinorNeighborIndex;

      ******;// TODO: ****CURRENT****
      // - SCRAP most of the old logic in this function, and use the logic from the above collectOldTilesInSector function
      // - already have added old tiles
      // - just iterate through the positions in the sector, stop when out of bounds, check if a tile already exists at the position in tilesByIndex, maybe add a new tile

      **;// TODO: I am iterating incorrectly (wrong minor direction)

      majorIndex = 0;
      majorTile = baseTile;

      // Determine which direction we are iterating in
      if (iterateInOtherDirection) {
        iterationMajorNeighborIndex = minorNeighborIndex;**;// TODO: use these...
        iterationMinorNeighborIndex = majorNeighborIndex;
      } else {
        iterationMajorNeighborIndex = majorNeighborIndex;
        iterationMinorNeighborIndex = minorNeighborIndex;
      }

      centerX = sector.baseTile.originalCenterX;
      centerY = sector.baseTile.originalCenterY;

      // Iterate over the major indices of the sector (aka, the "rows" of the sector)
      while (*withinExpandedViewport*) {

        // Set up the inner array for this "row" of the sector
        sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

        // Is there a already a tile here, or do we need to create a new one?
        if (majorTile.neighborStates[majorNeighborIndex]) {
          // Use the pre-existing tile
          majorTile = majorTile.neighborStates[majorNeighborIndex].tile;
        } else {
          // Create a new tile
          majorTile = createNewTileInSector(majorIndex, 0, centerX, centerY);
        }

        currentTile = majorTile;
        minorIndex = 1;

        centerX = sector.baseTile.originalCenterX +
            majorIndex * majorNeighborDeltaX +
            minorIndex * minorNeighborDeltaX;
        centerY = sector.baseTile.originalCenterY +
            majorIndex * majorNeighborDeltaY +
            minorIndex * minorNeighborDeltaY;

        // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
        while (minorIndex < minorCount &&
            *withinExpandedViewport*) {

          // Is there a already a tile here, or do we need to create a new one?
          if (currentTile.neighborStates[minorNeighborIndex]) {
            // Use the pre-existing tile
            currentTile = currentTile.neighborStates[minorNeighborIndex].tile;
          } else {
            // Create a new tile
            currentTile = createNewTileInSector(majorIndex, minorIndex, centerX, centerY);
          }

          minorIndex++;
        }

        // After we have added all of the tiles from this line that will lie within the viewport
        // for the expanded grid configuration, also add any remaining pre-existing tiles that lie
        // within this line
        while (currentTile.neighborStates[minorNeighborIndex] &&
            minorIndex < minorCount) {
          // TODO: copy over much of the above while loop...
        }

        majorIndex++;

        centerX = sector.baseTile.originalCenterX + majorIndex * majorNeighborDeltaX;
        centerY = sector.baseTile.originalCenterY + majorIndex * majorNeighborDeltaY;
      }

      // After we have added all of the tiles from this sector that will lie within the viewport
      // for the expanded grid configuration, also add any remaining pre-existing tiles that lie
      // within this sector
      while (majorTile.neighborStates[majorNeighborIndex]) {
        // TODO: copy over much of the above while loop...
      }
    }

    function addOldTileToSector(tile, majorIndex, minorIndex) {
      sector.tilesByIndex[majorIndex][minorIndex] = tile;
      tile.expandedState = {
        sector: sector,
        sectorMajorIndex: majorIndex,
        sectorMinorIndex: minorIndex,
        neighborStates: []
      };
    }

    function createNewTileInSector(majorIndex, minorIndex, centerX, centerY) {
      // TODO: some of the later parameters will need to be set in order for some animations to work
      //   - (BUT, the better solution is probably to just disable those animations for the expanded grid)
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
   * Calculates and stores the neighbor states for the expanded grid configuration for each tile
   * in this Sector.
   *
   * NOTE: this does not address external neighbor relations for tiles that lie on the outside
   * edge of this sector.
   *
   * @this Sector
   */
  function initializeExpandedStateTileNeighbors() {
    var sector, majorIndex, minorIndex;

    sector = this;

    // Iterate over the major indices of the sector (aka, the "rows" of the sector)
    for (majorIndex = 0; sector.tilesByIndex[majorIndex]; majorIndex += 1) {

      // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
      for (minorIndex in sector.tilesByIndex[majorIndex]) {
        setTileNeighborStates(sector, majorIndex, minorIndex);
      }
    }

    // ---  --- //

    function setTileNeighborStates(sector, majorIndex, minorIndex) {
      var tile, neighborRelationIndex, neighborMajorIndex, neighborMinorIndex;

      tile = sector.tilesByIndex[majorIndex][minorIndex];

      for (neighborRelationIndex = 0; neighborRelationIndex < 6; neighborRelationIndex += 1) {
        // Determine the major and minor indices of the current neighbor
        switch (neighborRelationIndex) {
          case sector.index:
            neighborMajorIndex = majorIndex + 1;
            neighborMinorIndex = minorIndex;
            break;
          case (sector.index + 1) % 6:// TODO: pre-compute these case values
            neighborMajorIndex = majorIndex;
            neighborMinorIndex = minorIndex + 1;
            break;
          case (sector.index + 2) % 6:
            neighborMajorIndex = majorIndex - 1;
            neighborMinorIndex = minorIndex + 1;
            break;
          case (sector.index + 3) % 6:
            neighborMajorIndex = majorIndex - 1;
            neighborMinorIndex = minorIndex;
            break;
          case (sector.index + 4) % 6:
            neighborMajorIndex = majorIndex;
            neighborMinorIndex = minorIndex - 1;
            break;
          case (sector.index + 5) % 6:
            neighborMajorIndex = majorIndex + 1;
            neighborMinorIndex = minorIndex - 1;
            break;
          default:
            throw new Error('Invalid neighborRelationIndex: ' + neighborRelationIndex);
        }

        // Is the neighbor position within the bounds of the sector?
        if (neighborMinorIndex >= 0 && neighborMinorIndex <= neighborMajorIndex) {
          // Has a tile been created for the neighbor position?
          if (sector.tilesByIndex[neighborMajorIndex] &&
              sector.tilesByIndex[neighborMajorIndex][neighborMinorIndex]) {
            Tile.setTileNeighborState(tile, neighborRelationIndex,
                sector.tilesByIndex[neighborMajorIndex][neighborMinorIndex], true);
          }
        }
      }
    }
  }

  /**
   * Converts the two-dimensional sector.tilesByIndex array into the flat sector.tiles array.
   *
   * @this Sector
   */
  function flattenTileCollection() {
    var sector, i, majorIndex, minorIndex;

    sector = this;

    i = 0;
    for (majorIndex in sector.tilesByIndex) {
      for (minorIndex in sector.tilesByIndex[majorIndex]) {
        sector.tiles[i++] = sector.tilesByIndex[majorIndex][minorIndex];
      }
    }
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
   *
   * PRE-CONDITION: the given baseTile is not a border tile (i.e., it has six neighbors)
   * PRE-CONDITION: the grid is in a closed state
   *
   * POST-CONDITION: This sector is NOT guaranteed to collect all of the pre-existing tiles in the
   * sector nor to create all of the needed new tiles in the sector (but it probably will).
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
