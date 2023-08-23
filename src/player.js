import EntityMixins from './entitymixins'
import {ENTITY_MIXIN_ENUMS} from "./enums";

// Player template
const PlayerTemplate = {
    name: 'avatar (you)',
    character: '@',
    foreground: 'deepSkyBlue',
    maxHp: 20,
    attackValue: 10,
    sightRadius: 6,
    inventorySlots: 22,
    mixins: [ENTITY_MIXIN_ENUMS.PLAYER_ACTOR,
        ENTITY_MIXIN_ENUMS.ATTACKER, ENTITY_MIXIN_ENUMS.DESTRUCTIBLE,
        ENTITY_MIXIN_ENUMS.INVENTORY_HOLDER, ENTITY_MIXIN_ENUMS.FOOD_CONSUMER,
        ENTITY_MIXIN_ENUMS.SIGHT, ENTITY_MIXIN_ENUMS.MESSAGE_RECIPIENT,
        ENTITY_MIXIN_ENUMS.EQUIPPER,
        ENTITY_MIXIN_ENUMS.EXPERIENCE_GAINER, ENTITY_MIXIN_ENUMS.PLAYER_STAT_GAINER]
};

export default PlayerTemplate