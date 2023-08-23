import Game from './game'
import DynamicGlyph from './dynamicglyph'
import EntityMixins from './entitymixins'
import Tile from './tile'
import BossCavern from './maps/bosscavern'
import {extend, sendMessage} from './utilities'

const Entity = function(properties) {
    properties = properties || {};
    // Call the dynamic glyph's construtor with our set of properties
    DynamicGlyph.call(this, properties);
    // Instantiate any properties from the passed object
    this._x = properties['x'] || 0;
    this._y = properties['y'] || 0;
    this._z = properties['z'] || 0;
    this._map = null;
    this._alive = true;
    // Acting speed
    this._speed = properties['speed'] || 1000;
};
// Make entities inherit all the functionality from dynamic glyphs
extend(Entity, DynamicGlyph);

Entity.prototype.setX = function(x) {
    this._x = x;
};

Entity.prototype.setY = function(y) {
    this._y = y;
};

Entity.prototype.setZ = function(z) {
    this._z = z;
};

Entity.prototype.setMap = function(map) {
    this._map = map;
};

Entity.prototype.setSpeed = function(speed) {
    this._speed = speed;
};

Entity.prototype.setPosition = function(x, y, z) {
    var oldX = this._x;
    var oldY = this._y;
    var oldZ = this._z;
    // Update position
    this._x = x;
    this._y = y;
    this._z = z;
    // If the entity is on a map, notify the map that the entity has moved.
    if (this._map) {
        this._map.updateEntityPosition(this, oldX, oldY, oldZ);
    }
};

Entity.prototype.getX = function() {
    return this._x;
};

Entity.prototype.getY   = function() {
    return this._y;
};

Entity.prototype.getZ = function() {
    return this._z;
};

Entity.prototype.getMap = function() {
    return this._map;
};

Entity.prototype.getSpeed = function() {
    return this._speed;
};

Entity.prototype.tryMove = function(x, y, z, map) {
    var map = this.getMap();
    // Must use starting z
    var tile = map.getTile(x, y, this.getZ());
    var target = map.getEntityAt(x, y, this.getZ());
    // If our z level changed, check if we are on stair
    if (z < this.getZ()) {
        if (tile !== Tile.stairsUpTile) {
            sendMessage(this, "You can't go up here!");
        } else {
            sendMessage(this, 'You ascend to level %d!', [z + 1]);
            this.setPosition(x, y, z);
        }
    } else if (z > this.getZ()) {
        if (tile === Tile.holeToCavernTile &&
            this.hasMixin(EntityMixins.PlayerActor)) {
            // Switch the entity to a boss cavern!
            this.switchMap(new BossCavern());
        } else if (tile !== Tile.stairsDownTile) {
            sendMessage(this, "You can't go down here!");
        } else {
            this.setPosition(x, y, z);
            sendMessage(this, 'You descend to level %d!', [z + 1]);
        }
    // If an entity was present at the tile
    } else if (target) {
        // An entity can only attack if the entity has the Attacker mixin and
        // either the entity or the target is the player.
        if (this.hasMixin('Attacker') &&
            (this.hasMixin(EntityMixins.PlayerActor) ||
             target.hasMixin(EntityMixins.PlayerActor))) {
            this.attack(target);
            return true;
        }
        // If not nothing we can do, but we can't
        // move to the tile
        return false;
    // Check if we can walk on the tile
    // and if so simply walk onto it
    } else if (tile.isWalkable()) {
        // Update the entity's position
        this.setPosition(x, y, z);
        // Notify the entity that there are items at this position
        var items = this.getMap().getItemsAt(x, y, z);
        if (items) {
            if (items.length === 1) {
                sendMessage(this, 'You see %s.', [items[0].describeA()]);
            } else {
                sendMessage(this, 'There are several objects here.');
            }
        }
        return true;
    // Check if the tile is diggable
    } else if (tile.isDiggable()) {
        // Only dig if the entity is the player
        if (this.hasMixin(EntityMixins.PlayerActor)) {
            map.dig(x, y, z);
            return true;
        }
        // If not nothing we can do, but we can't
        // move to the tile
        return false;
    }
    return false;
};

Entity.prototype.isAlive = function() {
    return this._alive;
};

Entity.prototype.kill = function(message) {
    // Only kill once!
    if (!this._alive) {
        return;
    }
    this._alive = false;
    if (message) {
        sendMessage(this, message);
    } else {
        sendMessage(this, 'You have died!');
    }

    // Check if the player died, and if so call their act method to prompt the user.
    if (this.hasMixin(EntityMixins.PlayerActor)) {
        this.act();
    } else {
        this.getMap().removeEntity(this);
    }
};

Entity.prototype.switchMap = function(newMap) {
    // If it's the same map, nothing to do!
    if (newMap === this.getMap()) {
        return;
    }
    this.getMap().removeEntity(this);
    // Clear the position
    this._x = 0;
    this._y = 0;
    this._z = 0;
    // Add to the new map
    newMap.addEntity(this);
};

export default Entity
