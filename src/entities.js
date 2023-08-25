
import Entity from './entity'
import Repository from './repository'
import {ENTITY_MIXIN_ENUMS} from "./enums";
import EntityMixins from "./entitymixins";

// Create our central entity repository
const EntityRepository = new Repository('entities', Entity);

EntityRepository.define('fungus', {
    name: 'fungus',
    character: 'F',
    foreground: 'green',
    maxHp: 10,
    speed: 250,
    mixins: [
        EntityMixins[ENTITY_MIXIN_ENUMS.FUNGUS_ACTOR],
        EntityMixins[ENTITY_MIXIN_ENUMS.DESTRUCTIBLE],
        EntityMixins[ENTITY_MIXIN_ENUMS.EXPERIENCE_GAINER],
        EntityMixins[ENTITY_MIXIN_ENUMS.RANDOM_STAT_GAINER]
    ]
});

EntityRepository.define('bat', {
    name: 'bat',
    character: 'B',
    foreground: 'white',
    maxHp: 5,
    attackValue: 4,
    speed: 2000,
    mixins: [
        EntityMixins[ENTITY_MIXIN_ENUMS.TASK_ACTOR],
        EntityMixins[ENTITY_MIXIN_ENUMS.ATTACKER],
        EntityMixins[ENTITY_MIXIN_ENUMS.DESTRUCTIBLE],
        EntityMixins[ENTITY_MIXIN_ENUMS.CORPSE_DROPPER],
        EntityMixins[ENTITY_MIXIN_ENUMS.EXPERIENCE_GAINER],
        EntityMixins[ENTITY_MIXIN_ENUMS.RANDOM_STAT_GAINER]
    ]
});

EntityRepository.define('rat', {
    name: 'rat',
    character: ':',
    foreground: 'yellow',
    maxHp: 3,
    attackValue: 2,
    mixins: [
        EntityMixins[ENTITY_MIXIN_ENUMS.TASK_ACTOR],
        EntityMixins[ENTITY_MIXIN_ENUMS.ATTACKER],
        EntityMixins[ENTITY_MIXIN_ENUMS.DESTRUCTIBLE],
        EntityMixins[ENTITY_MIXIN_ENUMS.CORPSE_DROPPER],
        EntityMixins[ENTITY_MIXIN_ENUMS.EXPERIENCE_GAINER],
        EntityMixins[ENTITY_MIXIN_ENUMS.RANDOM_STAT_GAINER]
    ]
});

EntityRepository.define('kobold', {
    name: 'kobold',
    character: 'k',
    foreground: 'white',
    maxHp: 6,
    attackValue: 4,
    sightRadius: 5,
    tasks: ['hunt', 'wander'],
    mixins: [
        EntityMixins[ENTITY_MIXIN_ENUMS.TASK_ACTOR],
        EntityMixins[ENTITY_MIXIN_ENUMS.SIGHT],
        EntityMixins[ENTITY_MIXIN_ENUMS.ATTACKER],
        EntityMixins[ENTITY_MIXIN_ENUMS.DESTRUCTIBLE],
        EntityMixins[ENTITY_MIXIN_ENUMS.CORPSE_DROPPER],
        EntityMixins[ENTITY_MIXIN_ENUMS.EXPERIENCE_GAINER],
        EntityMixins[ENTITY_MIXIN_ENUMS.RANDOM_STAT_GAINER]
    ]
});

/*
EntityRepository.define('giant zombie', {
    name: 'giant zombie',
    character: 'Z',
    foreground: 'teal',
    maxHp: 30,
    attackValue: 8,
    defenseValue: 5,
    level: 5,
    sightRadius: 6,
    mixins: [ENTITY_MIXIN_ENUMS.G, ENTITY_MIXIN_ENUMS.SIGHT,
        ENTITY_MIXIN_ENUMS.ATTACKER, ENTITY_MIXIN_ENUMS.DESTRUCTIBLE,
        ENTITY_MIXIN_ENUMS.CORPSE_DROPPER,
        ENTITY_MIXIN_ENUMS.EXPERIENCE_GAINER]
}, {
    disableRandomCreation: true
});*/

EntityRepository.define('slime', {
    name: 'slime',
    character: 's',
    foreground: 'lightGreen',
    maxHp: 10,
    attackValue: 5,
    sightRadius: 3,
    tasks: ['hunt', 'wander'],
    mixins: [
        EntityMixins[ENTITY_MIXIN_ENUMS.TASK_ACTOR],
        EntityMixins[ENTITY_MIXIN_ENUMS.SIGHT],
        EntityMixins[ENTITY_MIXIN_ENUMS.ATTACKER],
        EntityMixins[ENTITY_MIXIN_ENUMS.DESTRUCTIBLE],
        EntityMixins[ENTITY_MIXIN_ENUMS.CORPSE_DROPPER],
        EntityMixins[ENTITY_MIXIN_ENUMS.EXPERIENCE_GAINER],
        EntityMixins[ENTITY_MIXIN_ENUMS.RANDOM_STAT_GAINER]
    ]
});

export default EntityRepository