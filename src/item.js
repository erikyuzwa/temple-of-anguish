
import DynamicGlyph from './dynamicglyph'

class Item extends DynamicGlyph {
    constructor(options) {
        super(options)
        options = options || {}
    }
}

/*
const Item = function(properties) {
    properties = properties || {};
    // Call the dynamic glyph's constructor with our set of properties
    DynamicGlyph.call(this, properties);
};
// Make items inherit all the functionality from dynamic glyphs
//Game.Item.extend(Game.DynamicGlyph);
//extend(Item, DynamicGlyph)
extend(DynamicGlyph, Item)

 */

export default Item
