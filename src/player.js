import EntityMixins from './entitymixins'

// Player template
const PlayerTemplate = {
    name: 'avatar (you)',
    character: '@',
    foreground: 'deepSkyBlue',
    maxHp: 20,
    attackValue: 10,
    sightRadius: 6,
    inventorySlots: 22,
    mixins: [EntityMixins.PlayerActor,
        EntityMixins.Attacker, EntityMixins.Destructible,
        EntityMixins.InventoryHolder, EntityMixins.FoodConsumer,
        EntityMixins.Sight, EntityMixins.MessageRecipient,
        EntityMixins.Equipper,
        EntityMixins.ExperienceGainer, EntityMixins.PlayerStatGainer]
};

export default PlayerTemplate