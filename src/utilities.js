//'use strict';
/* globals Game */
/*
Game.extend = function(src, dest) {
    // Create a copy of the source.
    var result = {};
    for (var key in src) {
        result[key] = src[key];
    }
    // Copy over all keys from dest
    for (var key in dest) {
        result[key] = dest[key];
    }
    return result;
};*/

const extend = function(src, dest) {
    // Create a copy of the source.
    var result = {};
    for (var key in src) {
        result[key] = src[key];
    }
    // Copy over all keys from dest
    for (var key in dest) {
        result[key] = dest[key];
    }
    return result;
};

// Message sending functions
const sendMessage = function(recipient, message, args) {
    // Make sure the recipient can receive the message
    // before doing any work.
    if (recipient.hasMixin(Game.EntityMixins.MessageRecipient)) {
        // If args were passed, then we format the message, else
        // no formatting is necessary
        if (args) {
            message = vsprintf(message, args);
        }
        recipient.receiveMessage(message);
    }
};

const sendMessageNearby = function(map, centerX, centerY, centerZ, message, args) {
    // If args were passed, then we format the message, else
    // no formatting is necessary
    if (args) {
        message = vsprintf(message, args);
    }
    // Get the nearby entities
    var entities = map.getEntitiesWithinRadius(centerX, centerY, centerZ, 5) || [];
    // Iterate through nearby entities, sending the message if
    // they can receive it.
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].hasMixin(Game.EntityMixins.MessageRecipient)) {
            entities[i].receiveMessage(message);
        }
    }
};

const getNeighborPositions = function(x, y) {
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
    //return tiles.randomize();
    let shuffled = tiles
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    return shuffled
};

export {extend, getNeighborPositions, sendMessage, sendMessageNearby}
