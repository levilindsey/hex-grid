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

    sector.majorNeighborDelta.x =
        sector.baseTile.neighborStates[sector.majorNeighborIndex].tile.originalAnchor.x -
        sector.baseTile.originalAnchor.x;
    sector.majorNeighborDelta.y =
        sector.baseTile.neighborStates[sector.majorNeighborIndex].tile.originalAnchor.y -
        sector.baseTile.originalAnchor.y;
    sector.minorNeighborDelta.x =
        sector.baseTile.neighborStates[sector.minorNeighborIndex].tile.originalAnchor.x -
        sector.baseTile.originalAnchor.x;
    sector.minorNeighborDelta.y =
        sector.baseTile.neighborStates[sector.minorNeighborIndex].tile.originalAnchor.y -
        sector.baseTile.originalAnchor.y;

    // Compute the axially-aligned displacement values of this sector when the grid is expanded

    expansionDirectionNeighborIndex = (sector.index + 5) % 6;

    expansionDirectionNeighborDeltaX =
        sector.baseTile.neighborStates[expansionDirectionNeighborIndex].tile.originalAnchor.x -
        sector.baseTile.originalAnchor.x;
    expansionDirectionNeighborDeltaY =
        sector.baseTile.neighborStates[expansionDirectionNeighborIndex].tile.originalAnchor.y -
        sector.baseTile.originalAnchor.y;

    sector.expandedDisplacement.x =
        sector.expandedDisplacementTileCount * expansionDirectionNeighborDeltaX;
    sector.expandedDisplacement.y =
        sector.expandedDisplacementTileCount * expansionDirectionNeighborDeltaY;

    sector.originalAnchor.x = sector.baseTile.originalAnchor.x + sector.majorNeighborDelta.x;
    sector.originalAnchor.y = sector.baseTile.originalAnchor.y + sector.majorNeighborDelta.y;
    sector.currentAnchor.x = sector.originalAnchor.x;
    sector.currentAnchor.y = sector.originalAnchor.y;
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
    sector.newTiles = [];
    sector.tiles = [];

    // Get the old and new tiles for this sector, and set up neighbor states for the expanded grid
    // configuration
    collectOldTilesInSector.call(sector);
    collectNewTilesInSector.call(sector);

    // Re-assign temporary neighbor states for tiles in this sector
    initializeExpandedStateInternalTileNeighbors.call(sector);

    // Convert the two-dimensional array to a flat array
    flattenTileCollection.call(sector);
  }

  /**
   * Collects references to the pre-existing tiles that lie within this sector.
   *
   * PRE-CONDITION: The baseTile is not a border tile (i.e., it has six neighbors).
   *
   * POST-CONDITION: This double-pass major-to-minor line-iteration algorithm is NOT guaranteed to
   * collect all of the tiles in the viewport (but it is likely to) (the breaking edge case is
   * when the viewport's aspect ratio is very large or very small).
   *
   * @this Sector
   */
  function collectOldTilesInSector() {
    var sector;

    sector = this;

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
   * PRE-CONDITION: The baseTile is not a border tile (i.e., it has six neighbors).
   *
   * POST-CONDITION: this double-pass major-to-minor line-iteration algorithm is NOT guaranteed to
   * collect all of the tiles in the viewport (but it is likely to) (the breaking edge case is
   * when the viewport's aspect ratio is very large or very small).
   *
   * @this Sector
   */
  function collectNewTilesInSector() {
    var sector, boundingBoxHalfX, boundingBoxHalfY, minX, maxX, minY, maxY;

    sector = this;

    // Determine the bounding box of the re-positioned viewport
    boundingBoxHalfX = window.innerWidth / 2 - Math.abs(sector.expandedDisplacement.x) + window.hg.Grid.config.tileShortLengthWithGap;
    boundingBoxHalfY = window.innerHeight / 2 - Math.abs(sector.expandedDisplacement.y) + window.hg.Grid.config.tileShortLengthWithGap;
    minX = sector.baseTile.originalAnchor.x - boundingBoxHalfX;
    maxX = sector.baseTile.originalAnchor.x + boundingBoxHalfX;
    minY = sector.baseTile.originalAnchor.y - boundingBoxHalfY;
    maxY = sector.baseTile.originalAnchor.y + boundingBoxHalfY;

    // Collect all of the tiles for this sector into a two-dimensional array
    iterateOverTilesInSectorInMajorOrder();
    iterateOverTilesInSectorInMinorOrder();

    // ---  --- //

    function iterateOverTilesInSectorInMajorOrder() {
      var startX, startY, anchorX, anchorY, majorIndex, minorIndex;

      startX = sector.baseTile.originalAnchor.x + sector.majorNeighborDelta.x;
      startY = sector.baseTile.originalAnchor.y + sector.majorNeighborDelta.y;

      // Set up the first "column"
      majorIndex = 0;
      minorIndex = 0;
      anchorX = startX;
      anchorY = startY;

      // Iterate over the major indices of the sector (aka, the "rows" of the sector)
      do {
        // Set up the inner array for this "row" of the sector
        sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

        // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
        do {
          // Create a new tile if one did not already exist for this position
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            createNewTileInSector.call(sector, majorIndex, minorIndex, anchorX, anchorY);
          }

          // Set up the next "column"
          minorIndex++;
          anchorX += sector.minorNeighborDelta.x;
          anchorY += sector.minorNeighborDelta.y;

        } while (anchorX >= minX && anchorX <= maxX && anchorY >= minY && anchorY <= maxY);

        // Set up the next "row"
        majorIndex++;
        minorIndex = 0;
        anchorX = startX + majorIndex * sector.majorNeighborDelta.x;
        anchorY = startY + majorIndex * sector.majorNeighborDelta.y;

      } while (anchorX >= minX && anchorX <= maxX && anchorY >= minY && anchorY <= maxY);
    }

    function iterateOverTilesInSectorInMinorOrder() {
      var startX, startY, anchorX, anchorY, majorIndex, minorIndex;

      startX = sector.baseTile.originalAnchor.x + sector.majorNeighborDelta.x;
      startY = sector.baseTile.originalAnchor.y + sector.majorNeighborDelta.y;

      // Set up the first "column"
      majorIndex = 0;
      minorIndex = 0;
      anchorX = startX;
      anchorY = startY;

      // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
      do {
        // Iterate over the major indices of the sector (aka, the "rows" of the sector)
        do {
          // Set up the inner array for this "row" of the sector
          sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

          // Create a new tile if one did not already exist for this position
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            createNewTileInSector.call(sector, majorIndex, minorIndex, anchorX, anchorY);
          }

          // Set up the next "row"
          majorIndex++;
          anchorX += sector.majorNeighborDelta.x;
          anchorY += sector.majorNeighborDelta.y;

        } while (anchorX >= minX && anchorX <= maxX && anchorY >= minY && anchorY <= maxY);

        // Set up the next "column"
        majorIndex = 0;
        minorIndex++;
        anchorX = startX + minorIndex * sector.minorNeighborDelta.x;
        anchorY = startY + minorIndex * sector.minorNeighborDelta.y;

      } while (anchorX >= minX && anchorX <= maxX && anchorY >= minY && anchorY <= maxY);
    }
  }

  /**
   * Adds the given pre-existing tile to this Sector's two-dimensional tile collection.
   *
   * Initializes the tile's expandedState configuration.
   *
   * @this Sector
   * @param {Tile} tile
   * @param {Number} majorIndex
   * @param {Number} minorIndex
   */
  function addOldTileToSector(tile, majorIndex, minorIndex) {
    var sector = this;

    sector.tilesByIndex[majorIndex][minorIndex] = tile;

    window.hg.Tile.initializeTileExpandedState(tile, sector, majorIndex, minorIndex);

    tile.sectorAnchorOffset.x = tile.originalAnchor.x - sector.originalAnchor.x;
    tile.sectorAnchorOffset.y = tile.originalAnchor.y - sector.originalAnchor.y;
  }

  /**
   * Adds a new tile to this Sector's two-dimensional tile collection.
   *
   * Initializes the new tile's expandedState configuration.
   *
   * @this Sector
   * @param {Number} majorIndex
   * @param {Number} minorIndex
   * @param {Number} anchorX
   * @param {Number} anchorY
   */
  function createNewTileInSector(majorIndex, minorIndex, anchorX, anchorY) {
    var sector = this;

    var tile = new window.hg.Tile(sector.grid.svg, sector.grid, anchorX, anchorY,
        window.hg.Grid.config.tileOuterRadius, sector.grid.isVertical, window.hg.Grid.config.tileHue,
        window.hg.Grid.config.tileSaturation, window.hg.Grid.config.tileLightness, null, Number.NaN, Number.NaN,
        Number.NaN, true, false, false, false, window.hg.Grid.config.tileMass);

    addOldTileToSector.call(sector, tile, majorIndex, minorIndex);
    sector.newTiles[sector.newTiles.length] = tile;

    return tile;
  }

  /**
   * Calculates and stores the internal neighbor states for the expanded grid configuration for
   * each tile in this Sector.
   *
   * POST-CONDITION: this does not address external neighbor relations for tiles that lie on the
   * outside edge of this sector.
   *
   * @this Sector
   */
  function initializeExpandedStateInternalTileNeighbors() {
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

        // Has a tile been created for the neighbor position?
        if (sector.tilesByIndex[neighborMajorIndex] &&
            sector.tilesByIndex[neighborMajorIndex][neighborMinorIndex]) {

          window.hg.Tile.setTileNeighborState(tile, neighborRelationIndex,
              sector.tilesByIndex[neighborMajorIndex][neighborMinorIndex]);
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

  /**
   * Calculates and stores the external neighbor states for the expanded grid configuration for
   * each tile in this Sector.
   *
   * @this Sector
   * @param {Array.<Sector>} sectors
   */
  function initializeExpandedStateExternalTileNeighbors(sectors) {

    var sector, innerEdgeTiles, neighborTileArrays, i, count, lowerNeighborIndex,
        upperNeighborIndex, innerEdgeNeighborSector, neighborMajorIndex;

    sector = this;

    lowerNeighborIndex = (sector.index + 2) % 6;
    upperNeighborIndex = (sector.index + 3) % 6;

    innerEdgeNeighborSector = sectors[(sector.index + 1) % 6];

    innerEdgeTiles = sector.tilesByIndex[0];
    neighborTileArrays = innerEdgeNeighborSector.tilesByIndex;

    i = sector.expandedDisplacementTileCount;
    neighborMajorIndex = 0;

    // --- Handle the first edge tile --- //

    if (innerEdgeTiles[i]) {
      // The first edge tile with an external neighbor will only have the lower neighbor
      window.hg.Tile.setTileNeighborState(innerEdgeTiles[i], lowerNeighborIndex,
          innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex][0]);
    }

    // --- Handle the middle edge tiles --- //

    for (i += 1, count = innerEdgeTiles.length - 1; i < count; i += 1) {

      // The upper neighbor for the last tile
      window.hg.Tile.setTileNeighborState(innerEdgeTiles[i], upperNeighborIndex,
          innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex][0]);

      neighborMajorIndex += 1;

      // The lower neighbor for the last tile
      window.hg.Tile.setTileNeighborState(innerEdgeTiles[i], lowerNeighborIndex,
          innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex][0]);
    }

    // --- Handle the last edge tile --- //

    if (innerEdgeTiles[i]) {
      // The upper neighbor for the last tile
      window.hg.Tile.setTileNeighborState(innerEdgeTiles[i], upperNeighborIndex,
          innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex][0]);

      neighborMajorIndex += 1;

      // The last edge tile with an external neighbor might not have the lower neighbor
      if (innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex] &&
          innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex][0]) {
        window.hg.Tile.setTileNeighborState(innerEdgeTiles[i], lowerNeighborIndex,
            innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex][0]);
      }
    }

    // --- Mark the inner edge tiles as border tiles --- //

    for (i = 0, count = sector.expandedDisplacementTileCount + 1;
         i < count; i += 1) {
      innerEdgeTiles[i].expandedState.isBorderTile = true;
    }

    // --- Mark the outer edge tiles as border tiles --- //

    for (i = innerEdgeTiles.length - 1 - sector.expandedDisplacementTileCount,
             count = neighborTileArrays.length; i < count; i += 1) {
      if (neighborTileArrays[i][0]) {
        neighborTileArrays[i][0].expandedState.isBorderTile = true;
      }
    }

    // --- Mark the outermost sector tiles as border tiles --- //

    for (i = 0, count = sector.tilesByIndex.length; i < count; i += 1) {
      sector.tilesByIndex[i][sector.tilesByIndex[i].length - 1].expandedState.isBorderTile = true;
    }
  }

  /**
   * Frees up memory used by this Sector.
   *
   * @this Sector
   */
  function destroy() {
    var sector, i, count;

    sector = this;

    for (i = 0, count = sector.newTiles.length; i < count; i += 1) {
      sector.newTiles[i].expandedState = null;
      sector.newTiles[i].neighborStates = null;
    }
  }

  /**
   * Updates the position of this Sector and the positions of all of its Tiles.
   *
   * @this Sector
   * @param {Number} x
   * @param {Number} y
   */
  function setSectorPosition(x, y) {
    var sector, i, count;

    sector = this;

    sector.currentAnchor.x = x;
    sector.currentAnchor.y = y;

    for (i = 0, count = sector.tiles.length; i < count; i += 1) {
      sector.tiles[i].originalAnchor.x = x + sector.tiles[i].sectorAnchorOffset.x;
      sector.tiles[i].originalAnchor.y = y + sector.tiles[i].sectorAnchorOffset.y;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @global
   * @constructor
   * @param {Grid} grid
   * @param {Tile} baseTile
   * @param {Number} sectorIndex
   * @param {Number} expandedDisplacementTileCount
   *
   * PRE-CONDITION: The given baseTile is not a border tile (i.e., it has six neighbors).
   * PRE-CONDITION: The grid is in a closed state.
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
    sector.originalAnchor = {x: Number.NaN, y: Number.NaN};
    sector.currentAnchor = {x: Number.NaN, y: Number.NaN};
    sector.majorNeighborDelta = {x: Number.NaN, y: Number.NaN};
    sector.minorNeighborDelta = {x: Number.NaN, y: Number.NaN};
    sector.expandedDisplacement = {x: Number.NaN, y: Number.NaN};
    sector.tiles = null;
    sector.tilesByIndex = null;
    sector.newTiles = null;

    sector.initializeExpandedStateExternalTileNeighbors =
        initializeExpandedStateExternalTileNeighbors;
    sector.destroy = destroy;
    sector.setSectorPosition = setSectorPosition;

    setUpExpandedDisplacementValues.call(sector);
    setUpTiles.call(sector);
  }

  Sector.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Sector = Sector;

  console.log('Sector module loaded');
})();
