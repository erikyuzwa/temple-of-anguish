
//import Game from './game'
import Glyph from './glyph'
//import {extend} from './utilities'
import _ from 'lodash'

/*
const Tile = function(properties) {
    properties = properties || {};
    // Call the Glyph constructor with our properties
    Glyph.call(this, properties);
    // Set up the properties. We use false by default.
    this._walkable = properties['walkable'] || false;
    this._diggable = properties['diggable'] || false;
    this._blocksLight = (properties['blocksLight'] !== undefined) ?
        properties['blocksLight'] : true;
    this._description = properties['description'] || '';
};

// Make tiles inherit all the functionality from glyphs
//extend(Tile, Glyph);

// Standard getters
Tile.prototype.isWalkable = function() {
    return this._walkable;
};

Tile.prototype.isDiggable = function() {
    return this._diggable;
};

Tile.prototype.isBlockingLight = function() {
    return this._blocksLight;
};

Tile.prototype.getDescription = function() {
    return this._description;
};*/

class Tile extends Glyph {
    constructor(properties) {
        super(Glyph);
        properties = properties || {};

        // Call the Glyph constructor with our properties
        //Glyph.call(this, properties);
        // Set up the properties. We use false by default.
        this._walkable = properties['walkable'] || false;
        this._diggable = properties['diggable'] || false;
        this._blocksLight = (properties['blocksLight'] !== undefined) ?
            properties['blocksLight'] : true;
        this._description = properties['description'] || '';
    }

    isWalkable() {
        return this._walkable;
    }

    isDiggable() {
        return this._diggable;
    }

    isBlockingLight() {
        return this._blocksLight;
    }

    getDescription() {
        return this._description;
    }
}


Tile.nullTile = new Tile({description: '(unknown)'});

Tile.floorTile = new Tile({
    character: '.',
    walkable: true,
    blocksLight: false,
    description: 'A cave floor'
});

Tile.wallTile = new Tile({
    character: '#',
    foreground: 'goldenrod',
    diggable: true,
    description: 'A cave wall'
});

Tile.stairsUpTile = new Tile({
    character: '<',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A rock staircase leading upwards'
});

Tile.stairsDownTile = new Tile({
    character: '>',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A rock staircase leading downwards'
});

Tile.holeToCavernTile = new Tile({
    character: 'O',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A great dark hole in the ground'
});

Tile.waterTile = new Tile({
    character: '~',
    foreground: 'blue',
    walkable: false,
    blocksLight: false,
    description: 'Murky blue water'
});

/*
// Helper function
Game.getNeighborPositions = function(x, y) {
    var tiles = [];
    // Generate all possible offsets
    for (var dX = -1; dX < 2; dX ++) {
        for (var dY = -1; dY < 2; dY++) {
            // Make sure it isn't the same tile
            if (dX === 0 && dY === 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }
    return tiles.randomize();
};*/

export default Tile
