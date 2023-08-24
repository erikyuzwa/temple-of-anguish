import Tile from './tile'

export const NullTile = new Tile({description: '(unknown)'});

export const FloorTile = new Tile({
    character: '.',
    walkable: true,
    blocksLight: false,
    description: 'A cave floor'
});

export const WallTile = new Tile({
    character: '#',
    foreground: 'goldenrod',
    diggable: true,
    description: 'A cave wall'
});

export const StairsUpTile = new Tile({
    character: '<',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A rock staircase leading upwards'
});

export const StairsDownTile = new Tile({
    character: '>',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A rock staircase leading downwards'
});

export const HoleToCavernTile = new Tile({
    character: 'O',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A great dark hole in the ground'
});

export const WaterTile = new Tile({
    character: '~',
    foreground: 'blue',
    walkable: false,
    blocksLight: false,
    description: 'Murky blue water'
});