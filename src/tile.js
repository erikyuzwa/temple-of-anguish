
import Glyph from './glyph'


class Tile extends Glyph {
    constructor(options) {
        super(options);
        options = options || {}

        // Call the Glyph constructor with our properties
        //Glyph.call(this, properties);
        // Set up the properties. We use false by default.
        this._walkable = options['walkable'] || false;
        this._diggable = options['diggable'] || false;
        this._blocksLight = (options['blocksLight'] !== undefined) ? options['blocksLight'] : true;
        this._description = options['description'] || '';
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

export default Tile
