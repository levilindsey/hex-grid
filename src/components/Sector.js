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
   * Calculates major and minor neighbor values and displacement values for the expanded grid
   * configuration.
   *
   * @this Sector
   */
  function setUpExpandedDisplacementValues() {
    var sector, expansionDirectionNeighborIndex, expansionDirectionNeighborDeltaX,
        expansionDirectionNeighborDeltaY;

    sector = this;

    // Compute which directions to iterate through tiles for this sector

    sector.majorNeighborIndex = sector.index;
    sector.minorNeighborIndex = (sector.index + 1) % 6;

    // Compute the axially-aligned distances between adjacent tiles

    sector.majorNeighborDeltaX =
        sector.baseTile.neighborStates[sector.majorNeighborIndex].tile.originalCenterX -
        sector.baseTile.originalCenterX;
    sector.majorNeighborDeltaY =
        sector.baseTile.neighborStates[sector.majorNeighborIndex].tile.originalCenterY -
        sector.baseTile.originalCenterY;
    sector.minorNeighborDeltaX =
        sector.baseTile.neighborStates[sector.minorNeighborIndex].tile.originalCenterX -
        sector.baseTile.originalCenterX;
    sector.minorNeighborDeltaY =
        sector.baseTile.neighborStates[sector.minorNeighborIndex].tile.originalCenterY -
        sector.baseTile.originalCenterY;

    // Compute the axially-aligned displacement values of this sector when the grid is expanded

    expansionDirectionNeighborIndex = (sector.index + 5) % 6;

    expansionDirectionNeighborDeltaX =
        sector.baseTile.neighborStates[expansionDirectionNeighborIndex].tile.originalCenterX -
        sector.baseTile.originalCenterX;
    expansionDirectionNeighborDeltaY =
        sector.baseTile.neighborStates[expansionDirectionNeighborIndex].tile.originalCenterY -
        sector.baseTile.originalCenterY;

    sector.expandedDisplacementX =
        sector.expandedDisplacementTileCount * expansionDirectionNeighborDeltaX;
    sector.expandedDisplacementY =
        sector.expandedDisplacementTileCount * expansionDirectionNeighborDeltaY;
  }

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
    var sector;

    sector = this;

    // TODO: this double-pass major-to-minor line-iteration algorithm is NOT guaranteed to collect all of the tiles in the viewport (but it is likely to) (the breaking edge case is when the viewport's aspect ratio is very large or very small)
    // Collect all of the tiles for this sector into a two-dimensional array
    iterateOverTilesInSectorInMajorOrder();
    iterateOverTilesInSectorInMinorOrder();

    // ---  --- //

    function iterateOverTilesInSectorInMajorOrder() {
      var majorTile, currentTile, majorIndex, minorIndex;

      majorIndex = 0;
      majorTile = sector.baseTile.neighborStates[sector.majorNeighborIndex].tile;

      // Iterate over the major indices of the sector (aka, the "rows" of the sector)
      do {
        currentTile = majorTile;
        minorIndex = 0;

        // Set up the inner array for this "row" of the sector
        sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

        // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
        do {
          // Store the current tile in the "row" if it hasn't already been stored
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            addOldTileToSector.call(sector, currentTile, majorIndex, minorIndex);
          }

          minorIndex++;

        } while (currentTile.neighborStates[sector.minorNeighborIndex] &&
            (currentTile = currentTile.neighborStates[sector.minorNeighborIndex].tile));

        majorIndex++;

      } while (majorTile.neighborStates[sector.majorNeighborIndex] &&
          (majorTile = majorTile.neighborStates[sector.majorNeighborIndex].tile));
    }

    function iterateOverTilesInSectorInMinorOrder() {
      var minorTile, currentTile, majorIndex, minorIndex;

      minorIndex = 0;
      minorTile = sector.baseTile.neighborStates[sector.majorNeighborIndex].tile;

      // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
      do {
        currentTile = minorTile;
        majorIndex = 0;

        // Iterate over the major indices of the sector (aka, the "rows" of the sector)
        do {
          // Set up the inner array for this "row" of the sector
          sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

          // Store the current tile in the "column" if it hasn't already been stored
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            addOldTileToSector.call(sector, currentTile, majorIndex, minorIndex);
          }

          majorIndex++;

        } while (currentTile.neighborStates[sector.majorNeighborIndex] &&
            (currentTile = currentTile.neighborStates[sector.majorNeighborIndex].tile));

        minorIndex++;

      } while (minorTile.neighborStates[sector.minorNeighborIndex] &&
          (minorTile = minorTile.neighborStates[sector.minorNeighborIndex].tile));
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
    var sector, boundingBoxHalfX, boundingBoxHalfY, minX, maxX, minY, maxY;

    sector = this;

    // Determine the bounding box of the re-positioned viewport
    boundingBoxHalfX = window.innerWidth / 2 - sector.expandedDisplacementX + hg.Grid.config.tileShortLengthWithGap;
    boundingBoxHalfY = window.innerHeight / 2 - sector.expandedDisplacementY + hg.Grid.config.tileShortLengthWithGap;
    minX = sector.baseTile.originalCenterX - boundingBoxHalfX;
    maxX = sector.baseTile.originalCenterX + boundingBoxHalfX;
    minY = sector.baseTile.originalCenterY - boundingBoxHalfY;
    maxY = sector.baseTile.originalCenterY + boundingBoxHalfY;

    // TODO: this double-pass major-to-minor line-iteration algorithm is NOT guaranteed to collect all of the tiles in the viewport (but it is likely to) (the breaking edge case is when the viewport's aspect ratio is very large or very small)
    // Collect all of the tiles for this sector into a two-dimensional array
    iterateOverTilesInSectorInMajorOrder();
    iterateOverTilesInSectorInMinorOrder();

    // ---  --- //

    function iterateOverTilesInSectorInMajorOrder() {
      var startX, startY, centerX, centerY, majorIndex, minorIndex;

      startX = sector.baseTile.originalCenterX + sector.majorNeighborDeltaX;
      startY = sector.baseTile.originalCenterY + sector.majorNeighborDeltaY;

      majorIndex = 0;
      minorIndex = 0;

      centerX = startX;
      centerY = startY;

      // Iterate over the major indices of the sector (aka, the "rows" of the sector)
      do {
        // Set up the inner array for this "row" of the sector
        sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

        // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
        do {
          // Create a new tile if one did not already exist for this position
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            createNewTileInSector.call(sector, majorIndex, minorIndex, centerX, centerY);
          }

          // Set up the next "column"
          minorIndex++;
          centerX += sector.minorNeighborDeltaX;
          centerY += sector.minorNeighborDeltaY;

        } while (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY);

        // Set up the next "row"
        majorIndex++;
        minorIndex = 0;
        centerX = startX + majorIndex * sector.majorNeighborDeltaX;
        centerY = startY + majorIndex * sector.majorNeighborDeltaY;

      } while (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY);
    }

    function iterateOverTilesInSectorInMinorOrder() {
      var startX, startY, centerX, centerY, majorIndex, minorIndex;

      startX = sector.baseTile.originalCenterX + sector.majorNeighborDeltaX;
      startY = sector.baseTile.originalCenterY + sector.majorNeighborDeltaY;

      // Set up the first "column"
      majorIndex = 0;
      minorIndex = 0;
      centerX = startX;
      centerY = startY;

      // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
      do {
        // Iterate over the major indices of the sector (aka, the "rows" of the sector)
        do {
          // Set up the inner array for this "row" of the sector
          sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

          // Create a new tile if one did not already exist for this position
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            createNewTileInSector.call(sector, majorIndex, minorIndex, centerX, centerY);
          }

          // Set up the next "row"
          majorIndex++;
          centerX += sector.majorNeighborDeltaX;
          centerY += sector.majorNeighborDeltaY;

        } while (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY);

        // Set up the next "column"
        majorIndex = 0;
        minorIndex++;
        centerX = startX + minorIndex * sector.minorNeighborDeltaX;
        centerY = startY + minorIndex * sector.minorNeighborDeltaY;

      } while (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY);
    }
  }

  /**
   * Adds the given pre-existing tile to this Sector's two-dimensional tile collection.
   *
   * Initializes the tile's expandedState configuration.
   *
   * @this Sector
   * @param {Tile} tile
   * @param {number} majorIndex
   * @param {number} minorIndex
   */
  function addOldTileToSector(tile, majorIndex, minorIndex) {
    var sector = this;
    sector.tilesByIndex[majorIndex][minorIndex] = tile;
    tile.expandedState = {
      sector: sector,
      sectorMajorIndex: majorIndex,
      sectorMinorIndex: minorIndex,
      neighborStates: [],
      isBorderTile: false
    };
  }

  /**
   * Adds a new tile to this Sector's two-dimensional tile collection.
   *
   * Initializes the new tile's expandedState configuration.
   *
   * @this Sector
   * @param {number} majorIndex
   * @param {number} minorIndex
   * @param {number} centerX
   * @param {number} centerY
   */
  function createNewTileInSector(majorIndex, minorIndex, centerX, centerY) {
    var sector = this;
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
    addOldTileToSector.call(sector, tile, majorIndex, minorIndex);

    return tile;
  }

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
          } else {
            tile.expandedState.isBorderTile = true;
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
   * @param {number} expandedDisplacementTileCount
   *
   * PRE-CONDITION: the given baseTile is not a border tile (i.e., it has six neighbors)
   * PRE-CONDITION: the grid is in a closed state
   *
   * POST-CONDITION: This sector is NOT guaranteed to collect all of the pre-existing tiles in the
   * sector nor to create all of the needed new tiles in the sector (but it probably will).
   */
  function Sector(grid, baseTile, sectorIndex, expandedDisplacementTileCount) {
    var sector = this;

    sector.grid = grid;
    sector.baseTile = baseTile;
    sector.index = sectorIndex;
    sector.expandedDisplacementTileCount = expandedDisplacementTileCount;
    sector.majorNeighborDeltaX = Number.NaN;
    sector.majorNeighborDeltaY = Number.NaN;
    sector.minorNeighborDeltaX = Number.NaN;
    sector.minorNeighborDeltaY = Number.NaN;
    sector.expandedDisplacementX = Number.NaN;
    sector.expandedDisplacementY = Number.NaN;
    sector.tiles = null;
    sector.tilesByIndex = null;

    setUpExpandedDisplacementValues.call(sector);
    setUpTiles.call(sector);
  }

  Sector.config = config;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.Sector = Sector;

  console.log('Sector module loaded');
})();
