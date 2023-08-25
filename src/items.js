
import Item from './item'
import Repository from './repository'
import {ITEM_MIXIN_ENUMS} from "./enums";
import ItemMixins from "./itemmixins";

const ItemRepository = new Repository('items', Item);

ItemRepository.define('apple', {
    name: 'apple',
    character: '%',
    foreground: 'red',
    foodValue: 50,
    mixins: [
        ItemMixins[ITEM_MIXIN_ENUMS.EDIBLE]
    ]
});

ItemRepository.define('melon', {
    name: 'melon',
    character: '%',
    foreground: 'lightGreen',
    foodValue: 35,
    consumptions: 4,
    mixins: [
        ItemMixins[ITEM_MIXIN_ENUMS.EDIBLE]
    ]
});

ItemRepository.define('pumpkin', {
    name: 'pumpkin',
    character: '%',
    foreground: 'orange',
    foodValue: 50,
    attackValue: 2,
    defenseValue: 2,
    wearable: true,
    wieldable: true,
    mixins: [
        ItemMixins[ITEM_MIXIN_ENUMS.EDIBLE],
        ItemMixins[ITEM_MIXIN_ENUMS.EQUIPPABLE]
    ]
});

ItemRepository.define('corpse', {
    name: 'corpse',
    character: '%',
    foodValue: 75,
    consumptions: 1,
    mixins: [
        ItemMixins[ITEM_MIXIN_ENUMS.EDIBLE]
    ]
}, {
    disableRandomCreation: true
});

ItemRepository.define('rock', {
    name: 'rock',
    character: '*',
    foreground: 'white'
});

// Weapons
ItemRepository.define('dagger', {
    name: 'dagger',
    character: ')',
    foreground: 'gray',
    attackValue: 5,
    wieldable: true,
    mixins: [
        ItemMixins[ITEM_MIXIN_ENUMS.EQUIPPABLE]
    ]
}, {
    disableRandomCreation: true
});

ItemRepository.define('sword', {
    name: 'sword',
    character: ')',
    foreground: 'white',
    attackValue: 10,
    wieldable: true,
    mixins: [
        ItemMixins[ITEM_MIXIN_ENUMS.EQUIPPABLE]
    ]
}, {
    disableRandomCreation: true
});

ItemRepository.define('staff', {
    name: 'staff',
    character: ')',
    foreground: 'yellow',
    attackValue: 5,
    defenseValue: 3,
    wieldable: true,
    mixins: [
        ItemMixins[ITEM_MIXIN_ENUMS.EQUIPPABLE]
    ]
}, {
    disableRandomCreation: true
});

// Wearables
ItemRepository.define('tunic', {
    name: 'tunic',
    character: '[',
    foreground: 'green',
    defenseValue: 2,
    wearable: true,
    mixins: [
        ItemMixins[ITEM_MIXIN_ENUMS.EQUIPPABLE]
    ]
}, {
    disableRandomCreation: true
});

ItemRepository.define('chainmail', {
    name: 'chainmail',
    character: '[',
    foreground: 'white',
    defenseValue: 4,
    wearable: true,
    mixins: [
        ItemMixins[ITEM_MIXIN_ENUMS.EQUIPPABLE]
    ]
}, {
    disableRandomCreation: true
});

ItemRepository.define('platemail', {
    name: 'platemail',
    character: '[',
    foreground: 'aliceblue',
    defenseValue: 6,
    wearable: true,
    mixins: [
        ItemMixins[ITEM_MIXIN_ENUMS.EQUIPPABLE]
    ]
}, {
    disableRandomCreation: true
});

export default ItemRepository