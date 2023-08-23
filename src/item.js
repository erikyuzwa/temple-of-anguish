//'use strict';
//import Game from './game'
import DynamicGlyph from './dynamicglyph'
import {extend} from './utilities'

const Item = function(properties) {
    properties = properties || {};
    // Call the dynamic glyph's constructor with our set of properties
    DynamicGlyph.call(this, properties);
};
// Make items inherit all the functionality from dynamic glyphs
//Game.Item.extend(Game.DynamicGlyph);
extend(Item, DynamicGlyph)

export default Item
