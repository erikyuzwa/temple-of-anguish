import EntityRepository from '../entities'
import ItemRepository from '../items'
import Map from '../map'
import {ENTITY_MIXIN_ENUMS} from "../enums";
import {HoleToCavernTile} from "../tiles";

class Cave extends Map {
    constructor(tiles, player) {

        super(tiles)

        this.addEntityAtRandomPosition(player, 0);
        // Add random entities and items to each floor.
        for (var z = 0; z < this._depth; z++) {
            // 15 entities per floor
            for (var i = 0; i < 15; i++) {
                var entity = EntityRepository.createRandom();
                // Add a random entity
                this.addEntityAtRandomPosition(entity, z);
                // Level up the entity based on the floor
                if (entity.hasMixin(ENTITY_MIXIN_ENUMS.EXPERIENCE_GAINER)) {
                    for (var level = 0; level < z; level++) {
                        entity.giveExperience(entity.getNextLevelExperience() -
                            entity.getExperience());
                    }
                }
            }
            // 15 items per floor
            for (var i = 0; i < 15; i++) {
                // Add a random entity
                this.addItemAtRandomPosition(ItemRepository.createRandom(), z);
            }
        }
        // Add weapons and armor to the map in random positions and floors
        var templates = [
            'dagger',
            'sword',
            'staff',
            'tunic',
            'chainmail',
            'platemail'
        ];
        for (var i = 0; i < templates.length; i++) {
            this.addItemAtRandomPosition(ItemRepository.create(templates[i]),
                Math.floor(this._depth * Math.random()));
        }
        // Add a hole to the final cavern on the last level.
        var holePosition = this.getRandomFloorPosition(this._depth - 1);
        this._tiles[this._depth - 1][holePosition.x][holePosition.y] =
            HoleToCavernTile;


    }

}

export default Cave