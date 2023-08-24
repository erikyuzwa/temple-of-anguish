import {ENTITY_MIXIN_ENUMS} from "./enums";
import EntityMixins from "./entitymixins";

// Player template
const PlayerTemplate = {
    name: 'avatar (you)',
    character: '@',
    foreground: 'deepSkyBlue',
    maxHp: 20,
    attackValue: 10,
    sightRadius: 6,
    inventorySlots: 22,
    mixins: [
        EntityMixins[ENTITY_MIXIN_ENUMS.PLAYER_ACTOR],
        EntityMixins[ENTITY_MIXIN_ENUMS.ATTACKER],
        EntityMixins[ENTITY_MIXIN_ENUMS.DESTRUCTIBLE],
        EntityMixins[ENTITY_MIXIN_ENUMS.INVENTORY_HOLDER],
        EntityMixins[ENTITY_MIXIN_ENUMS.FOOD_CONSUMER],
        EntityMixins[ENTITY_MIXIN_ENUMS.SIGHT],
        EntityMixins[ENTITY_MIXIN_ENUMS.MESSAGE_RECIPIENT],
        EntityMixins[ENTITY_MIXIN_ENUMS.EQUIPPER],
        EntityMixins[ENTITY_MIXIN_ENUMS.EXPERIENCE_GAINER],
        EntityMixins[ENTITY_MIXIN_ENUMS.PLAYER_STAT_GAINER]
    ]
};

export default PlayerTemplate