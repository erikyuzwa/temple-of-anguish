import * as ROT from 'rot-js'
import {getNeighborPositions} from './helpers'
import {FloorTile, StairsDownTile, StairsUpTile, WallTile} from "./tiles";

class Builder {
    constructor(width, height, depth) {
        this._width = width;
        this._height = height;
        this._depth = depth;
        this._tiles = new Array(depth);
        this._regions = new Array(depth);
        // Instantiate the arrays to be multi-dimension
        for (var z = 0; z < depth; z++) {
            // Create a new cave at each level
            this._tiles[z] = this._generateLevel();
            // Setup the regions array for each depth
            this._regions[z] = new Array(width);
            for (var x = 0; x < width; x++) {
                this._regions[z][x] = new Array(height);
                // Fill with zeroes
                for (var y = 0; y < height; y++) {
                    this._regions[z][x][y] = 0;
                }
            }
        }
        for (var z = 0; z < this._depth; z++) {
            this._setupRegions(z);
        }
        this._connectAllRegions();
    }

    getTiles  () {
        return this._tiles;
    }

    getDepth  () {
        return this._depth;
    }

    getWidth  () {
        return this._width;
    }

    getHeight  () {
        return this._height;
    }

    _generateLevel () {
        // Create the empty map
        var map = new Array(this._width);
        for (var w = 0; w < this._width; w++) {
            map[w] = new Array(this._height);
        }
        // Set up the cave generator
        //var generator = new ROT.Map.Cellular(this._width, this._height);
        var generator = new ROT.Map.Rogue(this._width, this._height);
        //generator.randomize(0.5);
        var totalIterations = 3;
        // Iteratively smoothen the map
        for (var i = 0; i < totalIterations - 1; i++) {
            generator.create();
        }
        // Smoothen it one last time and then update our map
        generator.create(function(x,y,v) {
            if (v === 1) {
                map[x][y] = FloorTile;
            } else {
                map[x][y] = WallTile;
            }
        });
        return map;
    }

    _canFillRegion (x, y, z) {
        // Make sure the tile is within bounds
        if (x < 0 || y < 0 || z < 0 || x >= this._width ||
            y >= this._height || z >= this._depth) {
            return false;
        }
        // Make sure the tile does not already have a region
        if (this._regions[z][x][y] !== 0) {
            return false;
        }
        // Make sure the tile is walkable
        return this._tiles[z][x][y].isWalkable();
    }

    _fillRegion (region, x, y, z) {
        var tilesFilled = 1;
        var tiles = [{x:x, y:y}];
        var tile;
        var neighbors;
        // Update the region of the original tile
        this._regions[z][x][y] = region;
        // Keep looping while we still have tiles to process
        while (tiles.length > 0) {
            tile = tiles.pop();
            // Get the neighbors of the tile
            neighbors = getNeighborPositions(tile.x, tile.y);
            // Iterate through each neighbor, checking if we can use it to fill
            // and if so updating the region and adding it to our processing
            // list.
            while (neighbors.length > 0) {
                tile = neighbors.pop();
                if (this._canFillRegion(tile.x, tile.y, z)) {
                    this._regions[z][tile.x][tile.y] = region;
                    tiles.push(tile);
                    tilesFilled++;
                }
            }

        }
        return tilesFilled;
    }

// This removes all tiles at a given depth level with a region number.
// It fills the tiles with a wall tile.
    _removeRegion (region, z) {
        for (var x = 0; x < this._width; x++) {
            for (var y = 0; y < this._height; y++) {
                if (this._regions[z][x][y] === region) {
                    // Clear the region and set the tile to a wall tile
                    this._regions[z][x][y] = 0;
                    this._tiles[z][x][y] = WallTile;
                }
            }
        }
    }

// This sets up the regions for a given depth level.
    _setupRegions (z) {
        var region = 1;
        var tilesFilled;
        // Iterate through all tiles searching for a tile that
        // can be used as the starting point for a flood fill
        for (var x = 0; x < this._width; x++) {
            for (var y = 0; y < this._height; y++) {
                if (this._canFillRegion(x, y, z)) {
                    // Try to fill
                    tilesFilled = this._fillRegion(region, x, y, z);
                    // If it was too small, simply remove it
                    if (tilesFilled <= 20) {
                        this._removeRegion(region, z);
                    } else {
                        region++;
                    }
                }
            }
        }
    }

// This fetches a list of points that overlap between one
// region at a given depth level and a region at a level beneath it.
    _findRegionOverlaps (z, r1, r2) {
        var matches = [];
        // Iterate through all tiles, checking if they respect
        // the region constraints and are floor tiles. We check
        // that they are floor to make sure we don't try to
        // put two stairs on the same tile.
        for (var x = 0; x < this._width; x++) {
            for (var y = 0; y < this._height; y++) {
                if (this._tiles[z][x][y] === FloorTile &&
                    this._tiles[z + 1][x][y] === FloorTile &&
                    this._regions[z][x][y] === r1 &&
                    this._regions[z + 1][x][y] === r2) {
                    matches.push({x: x, y: y});
                }
            }
        }
        // We shuffle the list of matches to prevent bias
        //return matches.randomize();
        let shuffled = matches
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)

        return shuffled
    }

// This tries to connect two regions by calculating
// where they overlap and adding stairs
    _connectRegions (z, r1, r2) {
        var overlap = this._findRegionOverlaps(z, r1, r2);
        // Make sure there was overlap
        if (overlap.length === 0) {
            return false;
        }
        // Select the first tile from the overlap and change it to stairs
        var point = overlap[0];
        this._tiles[z][point.x][point.y] = StairsDownTile;
        this._tiles[z+1][point.x][point.y] = StairsUpTile;
        return true;
    }

// This tries to connect all regions for each depth level,
// starting from the top most depth level.
    _connectAllRegions () {
        for (var z = 0; z < this._depth - 1; z++) {
            // Iterate through each tile, and if we haven't tried
            // to connect the region of that tile on both depth levels
            // then we try. We store connected properties as strings
            // for quick lookups.
            var connected = {};
            var key;
            for (var x = 0; x < this._width; x++) {
                for (var y = 0; y < this._height; y++) {
                    key = this._regions[z][x][y] + ',' +
                        this._regions[z+1][x][y];
                    if (this._tiles[z][x][y] === FloorTile &&
                        this._tiles[z+1][x][y] === FloorTile &&
                        !connected[key]) {
                        // Since both tiles are floors and we haven't
                        // already connected the two regions, try now.
                        this._connectRegions(z, this._regions[z][x][y],
                            this._regions[z+1][x][y]);
                        connected[key] = true;
                    }
                }
            }
        }
    }
}
export default Builder