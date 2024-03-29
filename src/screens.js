import * as ROT from 'rot-js'
import Game from './game'
import Builder from './builder'
import Cave from './maps/cave'
import Entity from './entity'
import PlayerTemplate from './player'
import Geometry from "./geometry";
import {vsprintf} from 'sprintf-js'
import {sendMessage} from "./helpers";
import {ITEM_MIXIN_ENUMS} from "./enums";
import {NullTile} from "./tiles";
import {invoke} from '@tauri-apps/api/tauri'

const Screen = {};

// Define our initial start screen
Screen.startScreen = {
    enter: function() {
    },

    exit: function() {
    },

    render: function(display) {

      var w = Game.getScreenWidth();
      var h = Game.getScreenHeight();
      var hw = w / 2;
      var hh = h / 2;

      // Render our prompt to the screen
      display.drawText(hw - 10, hh - 8, '%c{yellow}Temple of Anguish');
      display.drawText(hw - 3, hh - 7, '%c{orangeRed}by');
      display.drawText(hw - 6, hh - 6, '%c{deepSkyBlue}Wazoo Games');
      display.drawText(hw - 8, hh + 2, '%c{yellow}[N]ew Game');
      if (window.__TAURI__) {
          display.drawText(hw - 8, hh + 4, '%c{yellow}[Q]uit');
      }
    },
    handleInput: function(inputType, inputData) {
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.KEYS.VK_N) {
                Game.switchScreen(Screen.playScreen);
            } else if (inputData.keyCode === ROT.KEYS.VK_Q) {
                invoke('exit_app')
            }
        }
    }
};

// Define our playing screen
Screen.playScreen = {
    _player: null,
    _gameEnded: false,
    _subScreen: null,
    enter: function() {
      // Create a map based on our size parameters
      var width = 100;
      var height = 48;
      var depth = 6;
      // Create our map from the tiles and player
      this._player = new Entity(PlayerTemplate);
      const tiles = new Builder(width, height, depth).getTiles();
      const map = new Cave(tiles, this._player);

      // Start the map's engine
      map.getEngine().start();
    },

    exit: function() {

    },

    render: function(display) {

      // Render subscreen if there is one
      if (this._subScreen) {
        this._subScreen.render(display);
        return;
      }

      var screenWidth = Game.getScreenWidth();
      var screenHeight = Game.getScreenHeight();

      // Render the tiles
      this.renderTiles(display);

      // render any player messages
      this.renderPlayerMessages(display);

      // Render player stats
      this.renderPlayerStats(display);

      // Render hunger state
      this.renderPlayerHunger(display);

    },

    renderPlayerMessages: function(display) {
      // Get the messages in the player's queue and render them
      var messages = this._player.getMessages();
      var messageY = 0;
      for (var i = 0; i < messages.length; i++) {
        // Draw each message, adding the number of lines
        messageY += display.drawText(1, messageY, '%c{white}%b{black}' + messages[i]);
      }
    },

    renderPlayerHunger: function(display) {
      var col = '%c{white}%b{black}';
      var hungerState = this._player.getHungerState();
      var sh = Game.getScreenHeight();

      display.drawText(1, (sh/2) + 2, col + hungerState);
    },

    renderPlayerStats: function(display) {

      var col = '%c{white}%b{black}';
      var stats;
      var hcol;
      var sh = Game.getScreenHeight();

      var hp = this._player.getHp();
      var maxHp = this._player.getMaxHp();
      var pct = hp / maxHp;

      // if we drop below 50% health, then change
      // our color to yellow
      if (pct > 0.10 && pct < 0.50) {
        hcol = '%c{yellow}%b{black}';
      } else if (pct < 0.10) {
        // if our health goes below 10% we are in
        // trouble
        hcol = '%c{red}%b{black}';
      } else {
        hcol = '%c{springGreen}%b{black}';
      }

      stats = hcol + vsprintf('HP: %d/%d', [hp, maxHp]);
      display.drawText(1, sh/2 - 1, stats);

      stats = col + vsprintf('L : %d', [this._player.getLevel()]);
      display.drawText(1, sh/2, stats);

      stats = col + vsprintf('XP: %d', [this._player.getExperience()]);
      display.drawText(1, sh/2 + 1, stats);

    },

    getScreenOffsets: function() {
        // Make sure we still have enough space to fit an entire game screen
        var topLeftX = Math.max(0, this._player.getX() - (Game.getScreenWidth() / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._player.getMap().getWidth() - Game.getScreenWidth());
        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (Game.getScreenHeight() / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._player.getMap().getHeight() - Game.getScreenHeight());
        return {
            x: topLeftX,
            y: topLeftY
        };
    },

    renderTiles: function(display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        var offsets = this.getScreenOffsets();
        var topLeftX = offsets.x;
        var topLeftY = offsets.y;
        // This object will keep track of all visible map cells
        var visibleCells = {};
        // Store this._player.getMap() and player's z to prevent losing it in callbacks
        const map = this._player.getMap();
        const currentDepth = this._player.getZ();

        // Find all visible cells and update the object
        map.getFov(currentDepth).compute(
            this._player.getX(), this._player.getY(),
            this._player.getSightRadius(),
            function(x, y, radius, visibility) {
                visibleCells[x + "," + y] = true;
                // Mark cell as explored
                map.setExplored(x, y, currentDepth, true);
            });
        // Render the explored map cells
        for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
                if (map.isExplored(x, y, currentDepth)) {
                    // Fetch the glyph for the tile and render it to the screen
                    // at the offset position.

                    let glyph = map.getTile(x, y, currentDepth);
                    let foreground = glyph.getForeground();

                    // If we are at a cell that is in the field of vision, we need
                    // to check if there are items or entities.
                    if (visibleCells[x + ',' + y]) {
                        // Check for items first, since we want to draw entities
                        // over items.
                        var items = map.getItemsAt(x, y, currentDepth);
                        // If we have items, we want to render the top most item
                        if (items) {
                            glyph = items[items.length - 1];
                        }
                        // Check if we have an entity at the position
                        if (map.getEntityAt(x, y, currentDepth)) {
                            glyph = map.getEntityAt(x, y, currentDepth);
                        }
                        // Update the foreground color in case our glyph changed
                        foreground = glyph.getForeground();
                    } else {
                        // Since the tile was previously explored but is not
                        // visible, we want to change the foreground color to
                        // dark gray.
                        //foreground = 'darkGray';
                        foreground = 'saddleBrown';
                    }
                    display.draw(
                        x - topLeftX,
                        y - topLeftY,
                        glyph.getChar(),
                        foreground,
                        glyph.getBackground());
                }
            }
        }
    },

    handleInput: function(inputType, inputData) {

        // If the game is over, enter will bring the user to the losing screen.
        if (this._gameEnded) {
            if (inputType === 'keydown' && inputData.keyCode === ROT.KEYS.VK_RETURN) {
                Game.switchScreen(Screen.loseScreen);
            }
            // Return to make sure the user can't still play
            return;
        }
        // Handle subscreen input if there is one
        if (this._subScreen) {
            this._subScreen.handleInput(inputType, inputData);
            return;
        }

        if (inputType === 'keydown') {
          // Movement
          if (inputData.keyCode === ROT.KEYS.VK_LEFT) {
            this.move(-1, 0, 0);
          } else if (inputData.keyCode === ROT.KEYS.VK_RIGHT) {
            this.move(1, 0, 0);
          } else if (inputData.keyCode === ROT.KEYS.VK_UP) {
            this.move(0, -1, 0);
          } else if (inputData.keyCode === ROT.KEYS.VK_DOWN) {
            this.move(0, 1, 0);
          } else if (inputData.keyCode === ROT.KEYS.VK_I) {
            // Show the inventory screen
            this.showItemsSubScreen(Screen.inventoryScreen, this._player.getItems(),
              'Not carrying anything.');
            return;
          } else if (inputData.keyCode === ROT.KEYS.VK_D) {
            // Show the drop screen
            this.showItemsSubScreen(Screen.dropScreen, this._player.getItems(),
              'Nothing to drop.');
            return;
          } else if (inputData.keyCode === ROT.KEYS.VK_U) {
            // for now it's just to "u"se our food
            this.showItemsSubScreen(Screen.eatScreen, this._player.getItems(),
              'Nothing to eat.');
            return;
          } else if (inputData.keyCode === ROT.KEYS.VK_R) {
            // Show the wield screen
            this.showItemsSubScreen(Screen.wieldScreen, this._player.getItems(), 'Nothing to wield.');

            return;
          } else if (inputData.keyCode === ROT.KEYS.VK_W) {
            // Show the wear screen
            this.showItemsSubScreen(Screen.wearScreen, this._player.getItems(), 'Nothing to wear.');
            return;
          } else if (inputData.keyCode === ROT.KEYS.VK_X) {
                // Show the drop screen
                this.showItemsSubScreen(Screen.examineScreen, this._player.getItems(),
                   'Nothing to examine.');
                return;
          } else if (inputData.keyCode === ROT.KEYS.VK_G) {
                var items = this._player.getMap().getItemsAt(this._player.getX(),
                    this._player.getY(), this._player.getZ());
                // If there is only one item, directly pick it up
                if (items && items.length === 1) {
                    var item = items[0];
                    if (this._player.pickupItems([0])) {
                        sendMessage(this._player, "You pick up %s.", [item.describeA()]);
                    } else {
                        sendMessage(this._player, 'Your inventory is full!');
                    }
                } else {
                    this.showItemsSubScreen(Screen.pickupScreen, items,
                        'There is nothing here to pick up.');
                }
            } else {
                // Not a valid key
                return;
            }
            // Unlock the engine
            this._player.getMap().getEngine().unlock();
        } else if (inputType === 'keypress') {
            var keyChar = String.fromCharCode(inputData.charCode);
            if (keyChar === '>') {
                this.move(0, 0, 1);
            } else if (keyChar === '<') {
                this.move(0, 0, -1);
            } else if (keyChar === ';') {
                // Setup the look screen.
                var offsets = this.getScreenOffsets();
                Screen.lookScreen.setup(this._player,
                    this._player.getX(), this._player.getY(),
                    offsets.x, offsets.y);
                this.setSubScreen(Screen.lookScreen);
                return;
            } else if (keyChar === '?') {
                // Setup the look screen.
                this.setSubScreen(Screen.helpScreen);
                return;
            } else {
                // Not a valid key
                return;
            }
            // Unlock the engine
            this._player.getMap().getEngine().unlock();
        }
    },
    move: function(dX, dY, dZ) {
        var newX = this._player.getX() + dX;
        var newY = this._player.getY() + dY;
        var newZ = this._player.getZ() + dZ;
        // Try to move to the new cell
        this._player.tryMove(newX, newY, newZ, this._player.getMap());
    },
    setGameEnded: function(gameEnded) {
        this._gameEnded = gameEnded;
    },
    setSubScreen: function(subScreen) {
        this._subScreen = subScreen;
        // Refresh screen on changing the subscreen
        Game.refresh();
    },
    showItemsSubScreen: function(subScreen, items, emptyMessage) {
        if (items && subScreen.setup(this._player, items) > 0) {
            this.setSubScreen(subScreen);
        } else {
            sendMessage(this._player, emptyMessage);
            Game.refresh();
        }
    }
};

// Define our winning screen
Screen.winScreen = {

  enter: function() {
  },

  exit: function() {
  },

  render: function(display) {
    // Render our prompt to the screen
    for (var i = 0; i < 22; i++) {
      // Generate random background colors
      var r = Math.round(Math.random() * 255);
      var g = Math.round(Math.random() * 255);
      var b = Math.round(Math.random() * 255);
      var background = ROT.Color.toRGB([r, g, b]);
      display.drawText(2, i + 1, '%b{' + background + '}You win!');
    }
  },

  handleInput: function(inputType, inputData) {
    // Nothing to do here
  }
};

// Define our winning screen
Screen.loseScreen = {

    enter: function() {
    },

    exit: function() {
    },

    render: function(display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lose! :(");
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here
    }
};

Screen.ItemListScreen = function(template) {
    // Set up based on the template
    this._caption = template['caption'];
    this._okFunction = template['ok'];
    // By default, we use the identity function
    this._isAcceptableFunction = template['isAcceptable'] || function(x) {
        return x;
    };
    // Whether the user can select items at all.
    this._canSelectItem = template['canSelect'];
    // Whether the user can select multiple items.
    this._canSelectMultipleItems = template['canSelectMultipleItems'];
    // Whether a 'no item' option should appear.
    this._hasNoItemOption = template['hasNoItemOption'];
};

Screen.ItemListScreen.prototype.setup = function(player, items) {
    this._player = player;
    // Should be called before switching to the screen.
    var count = 0;
    // Iterate over each item, keeping only the aceptable ones and counting
    // the number of acceptable items.
    var that = this;
    this._items = items.map(function(item) {
        // Transform the item into null if it's not acceptable
        if (that._isAcceptableFunction(item)) {
            count++;
            return item;
        } else {
            return null;
        }
    });
    // Clean set of selected indices
    this._selectedIndices = {};
    return count;
};

Screen.ItemListScreen.prototype.render = function(display) {
    var letters = 'abcdefghijklmnopqrstuvwxyz';
    // Render the caption in the top row
    display.drawText(0, 0, this._caption);
    // Render the no item row if enabled
    if (this._hasNoItemOption) {
        display.drawText(0, 1, '0 - no item');
    }
    var row = 0;
    for (var i = 0; i < this._items.length; i++) {
        // If we have an item, we want to render it.
        if (this._items[i]) {
            // Get the letter matching the item's index
            var letter = letters.substring(i, i + 1);
            // If we have selected an item, show a +, else show a dash between
            // the letter and the item's name.
            var selectionState = (this._canSelectItem && this._canSelectMultipleItems &&
                this._selectedIndices[i]) ? '+' : '-';
            // Check if the item is worn or wielded
            var suffix = '';
            if (this._items[i] === this._player.getArmor()) {
                suffix = ' (wearing)';
            } else if (this._items[i] === this._player.getWeapon()) {
                suffix = ' (wielding)';
            }
            // Render at the correct row and add 2.
            display.drawText(0, 2 + row,  letter + ' ' + selectionState + ' ' +
                this._items[i].describe() + suffix);
            row++;
        }
    }
};

Screen.ItemListScreen.prototype.executeOkFunction = function() {
    // Gather the selected items.
    var selectedItems = {};
    for (var key in this._selectedIndices) {
        selectedItems[key] = this._items[key];
    }
    // Switch back to the play screen.
    Screen.playScreen.setSubScreen(undefined);
    // Call the OK function and end the player's turn if it return true.
    if (this._okFunction(selectedItems)) {
        this._player.getMap().getEngine().unlock();
    }
};
Screen.ItemListScreen.prototype.handleInput = function(inputType, inputData) {
    if (inputType === 'keydown') {
        // If the user hit escape, hit enter and can't select an item, or hit
        // enter without any items selected, simply cancel out
        if (inputData.keyCode === ROT.KEYS.VK_ESCAPE ||
            (inputData.keyCode === ROT.KEYS.VK_RETURN &&
                (!this._canSelectItem || Object.keys(this._selectedIndices).length === 0))) {
            Screen.playScreen.setSubScreen(undefined);
        // Handle pressing return when items are selected
        } else if (inputData.keyCode === ROT.KEYS.VK_RETURN) {
            this.executeOkFunction();
        // Handle pressing zero when 'no item' selection is enabled
        } else if (this._canSelectItem && this._hasNoItemOption && inputData.keyCode === ROT.KEYS.VK_0) {
            this._selectedIndices = {};
            this.executeOkFunction();
        // Handle pressing a letter if we can select
        } else if (this._canSelectItem && inputData.keyCode >= ROT.KEYS.VK_A &&
            inputData.keyCode <= ROT.KEYS.VK_Z) {
            // Check if it maps to a valid item by subtracting 'a' from the character
            // to know what letter of the alphabet we used.
            var index = inputData.keyCode - ROT.KEYS.VK_A;
            if (this._items[index]) {
                // If multiple selection is allowed, toggle the selection status, else
                // select the item and exit the screen
                if (this._canSelectMultipleItems) {
                    if (this._selectedIndices[index]) {
                        delete this._selectedIndices[index];
                    } else {
                        this._selectedIndices[index] = true;
                    }
                    // Redraw screen
                    Game.refresh();
                } else {
                    this._selectedIndices[index] = true;
                    this.executeOkFunction();
                }
            }
        }
    }
};

Screen.inventoryScreen = new Screen.ItemListScreen({
    caption: 'Inventory',
    canSelect: false
});

Screen.pickupScreen = new Screen.ItemListScreen({
    caption: 'Choose the items to pickup',
    canSelect: true,
    canSelectMultipleItems: true,
    ok: function(selectedItems) {
        // Try to pick up all items, messaging the player if they couldn't all be
        // picked up.
        if (!this._player.pickupItems(Object.keys(selectedItems))) {
            sendMessage(this._player, 'Your inventory is full!');
        }
        return true;
    }
});

Screen.dropScreen = new Screen.ItemListScreen({
    caption: 'Choose the item to drop',
    canSelect: true,
    canSelectMultipleItems: false,
    ok: function(selectedItems) {
        // Drop the selected item
        this._player.dropItem(Object.keys(selectedItems)[0]);
        return true;
    }
});

Screen.eatScreen = new Screen.ItemListScreen({
    caption: 'Choose the item to eat',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return item && item.hasMixin(ITEM_MIXIN_ENUMS.EDIBLE);
    },
    ok: function(selectedItems) {
        // Eat the item, removing it if there are no consumptions remaining.
        var key = Object.keys(selectedItems)[0];
        var item = selectedItems[key];
        sendMessage(this._player, "You eat %s.", [item.describeThe()]);
        item.eat(this._player);
        if (!item.hasRemainingConsumptions()) {
            this._player.removeItem(key);
        }
        return true;
    }
});

Screen.wieldScreen = new Screen.ItemListScreen({
    caption: 'Choose the item you wish to wield',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasMixin(ITEM_MIXIN_ENUMS.EQUIPPABLE) && item.isWieldable();
    },
    ok: function(selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            this._player.unwield();
            sendMessage(this._player, 'You are empty handed.');
        } else {
            // Make sure to unequip the item first in case it is the armor.
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wield(item);
            sendMessage(this._player, 'You are wielding %s.', [item.describeA()]);
        }
        return true;
    }
});

Screen.wearScreen = new Screen.ItemListScreen({
    caption: 'Choose the item you wish to wear',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasMixin(ITEM_MIXIN_ENUMS.EQUIPPABLE) && item.isWearable();
    },
    ok: function(selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            this._player.unwield();
            sendMessage(this._player, 'You are not wearing anything.');
        } else {
            // Make sure to unequip the item first in case it is the weapon.
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wear(item);
            sendMessage(this._player, 'You are wearing %s.', [item.describeA()]);
        }
        return true;
    }
});

Screen.examineScreen = new Screen.ItemListScreen({
    caption: 'Choose the item you wish to examine',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return true;
    },
    ok: function(selectedItems) {
        var keys = Object.keys(selectedItems);
        if (keys.length > 0) {
            var item = selectedItems[keys[0]];
            sendMessage(this._player, "It's %s (%s).",
                [
                    item.describeA(false),
                    item.details()
                ]);
        }
        return true;
    }
});

Screen.gainStatScreen = {
    setup: function(entity) {
        // Must be called before rendering.
        this._entity = entity;
        this._options = entity.getStatOptions();
    },
    render: function(display) {
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        display.drawText(0, 0, 'Choose a stat to increase: ');

        // Iterate through each of our options
        for (var i = 0; i < this._options.length; i++) {
            display.drawText(0, 2 + i,
                letters.substring(i, i + 1) + ' - ' + this._options[i][0]);
        }

        // Render remaining stat points
        display.drawText(0, 4 + this._options.length, 'Remaining points: ' + this._entity.getStatPoints());
    },
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            // If a letter was pressed, check if it matches to a valid option.
            if (inputData.keyCode >= ROT.KEYS.VK_A && inputData.keyCode <= ROT.KEYS.VK_Z) {
                // Check if it maps to a valid item by subtracting 'a' from the character
                // to know what letter of the alphabet we used.
                var index = inputData.keyCode - ROT.KEYS.VK_A;
                if (this._options[index]) {
                    // Call the stat increasing function
                    this._options[index][1].call(this._entity);
                    // Decrease stat points
                    this._entity.setStatPoints(this._entity.getStatPoints() - 1);
                    // If we have no stat points left, exit the screen, else refresh
                    if (this._entity.getStatPoints() === 0) {
                        Screen.playScreen.setSubScreen(undefined);
                    } else {
                        Game.refresh();
                    }
                }
            }
        }
    }
};


Screen.TargetBasedScreen = function(template) {
    template = template || {};
    // By default, our ok return does nothing and does not consume a turn.
    this._isAcceptableFunction = template['okFunction'] || function(x, y) {
        return false;
    };
    // The defaut caption function simply returns an empty string.
    this._captionFunction = template['captionFunction'] || function(x, y) {
        return '';
    }
};

Screen.TargetBasedScreen.prototype.setup = function(player, startX, startY, offsetX, offsetY) {
    this._player = player;
    // Store original position. Subtract the offset to make life easy so we don't
    // always have to remove it.
    this._startX = startX - offsetX;
    this._startY = startY - offsetY;
    // Store current cursor position
    this._cursorX = this._startX;
    this._cursorY = this._startY;
    // Store map offsets
    this._offsetX = offsetX;
    this._offsetY = offsetY;
    // Cache the FOV
    var visibleCells = {};
    this._player.getMap().getFov(this._player.getZ()).compute(
        this._player.getX(), this._player.getY(),
        this._player.getSightRadius(),
        function(x, y, radius, visibility) {
            visibleCells[x + ',' + y] = true;
        });
    this._visibleCells = visibleCells;
};

Screen.TargetBasedScreen.prototype.render = function(display) {
    Screen.playScreen.renderTiles.call(Screen.playScreen, display);

    // Draw a line from the start to the cursor.
    var points = Geometry.getLine(this._startX, this._startY, this._cursorX,
        this._cursorY);

    // Render stars along the line.
    for (var i = 0, l = points.length; i < l; i++) {
        display.drawText(points[i].x, points[i].y, '%c{magenta}*');
    }

    // Render the caption at the bottom.
    display.drawText(0, Game.getScreenHeight() - 1,
        this._captionFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY));
};

Screen.TargetBasedScreen.prototype.handleInput = function(inputType, inputData) {
    // Move the cursor
    if (inputType === 'keydown') {
        if (inputData.keyCode === ROT.KEYS.VK_LEFT) {
            this.moveCursor(-1, 0);
        } else if (inputData.keyCode === ROT.KEYS.VK_RIGHT) {
            this.moveCursor(1, 0);
        } else if (inputData.keyCode === ROT.KEYS.VK_UP) {
            this.moveCursor(0, -1);
        } else if (inputData.keyCode === ROT.KEYS.VK_DOWN) {
            this.moveCursor(0, 1);
        } else if (inputData.keyCode === ROT.KEYS.VK_ESCAPE) {
            Screen.playScreen.setSubScreen(undefined);
        } else if (inputData.keyCode === ROT.KEYS.VK_RETURN) {
            this.executeOkFunction();
        }
    }
    Game.refresh();
};

Screen.TargetBasedScreen.prototype.moveCursor = function(dx, dy) {
    // Make sure we stay within bounds.
    this._cursorX = Math.max(0, Math.min(this._cursorX + dx, Game.getScreenWidth()));
    // We have to save the last line for the caption.
    this._cursorY = Math.max(0, Math.min(this._cursorY + dy, Game.getScreenHeight() - 1));
};

Screen.TargetBasedScreen.prototype.executeOkFunction = function() {
    // Switch back to the play screen.
    Screen.playScreen.setSubScreen(undefined);
    // Call the OK function and end the player's turn if it return true.
    if (this._okFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY)) {
        this._player.getMap().getEngine().unlock();
    }
};

Screen.lookScreen = new Screen.TargetBasedScreen({
    captionFunction: function(x, y) {
        var z = this._player.getZ();
        var map = this._player.getMap();
        // If the tile is explored, we can give a better capton
        if (map.isExplored(x, y, z)) {
            // If the tile isn't explored, we have to check if we can actually
            // see it before testing if there's an entity or item.
            if (this._visibleCells[x + ',' + y]) {
                var items = map.getItemsAt(x, y, z);
                // If we have items, we want to render the top most item
                if (items) {
                    var item = items[items.length - 1];
                    return String.format('%s - %s (%s)',
                        item.getRepresentation(),
                        item.describeA(true),
                        item.details());
                // Else check if there's an entity
                } else if (map.getEntityAt(x, y, z)) {
                    var entity = map.getEntityAt(x, y, z);
                    return String.format('%s - %s (%s)',
                        entity.getRepresentation(),
                        entity.describeA(true),
                        entity.details());
                }
            }
            // If there was no entity/item or the tile wasn't visible, then use
            // the tile information.
            return String.format('%s - %s',
                map.getTile(x, y, z).getRepresentation(),
                map.getTile(x, y, z).getDescription());

        } else {
            // If the tile is not explored, show the null tile description.
            return String.format('%s - %s',
                NullTile.getRepresentation(),
                NullTile.getDescription());
        }
    }
});

Screen.lookScreen = new Screen.TargetBasedScreen({
    captionFunction: function(x, y) {
        const z = this._player.getZ();
        const map = this._player.getMap();
        // If the tile is explored, we can give a better capton
        if (map.isExplored(x, y, z)) {
            // If the tile isn't explored, we have to check if we can actually
            // see it before testing if there's an entity or item.
            if (this._visibleCells[x + ',' + y]) {
                const items = map.getItemsAt(x, y, z);
                // If we have items, we want to render the top most item
                if (items) {
                    const item = items[items.length - 1];
                    return String.format('%s - %s (%s)',
                        item.getRepresentation(),
                        item.describeA(true),
                        item.details());
                // Else check if there's an entity
                } else if (map.getEntityAt(x, y, z)) {
                    const entity = map.getEntityAt(x, y, z);
                    return String.format('%s - %s (%s)',
                        entity.getRepresentation(),
                        entity.describeA(true),
                        entity.details());
                }
            }
            // If there was no entity/item or the tile wasn't visible, then use
            // the tile information.
            return String.format('%s - %s',
                map.getTile(x, y, z).getRepresentation(),
                map.getTile(x, y, z).getDescription());

        } else {
            // If the tile is not explored, show the null tile description.
            return String.format('%s - %s',
                NullTile.getRepresentation(),
                NullTile.getDescription());
        }
    }
});

// Define our help screen
Screen.helpScreen = {
    render: function(display) {
        let text = 'Temple of Anguish -=- help -=-';
        const border = '-------------';
        let y = 3;
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, border);
        display.drawText(0, y++, "The Queen's spies have tracked down the leader of Infinity Sect.");
        display.drawText(0, y++, 'Find out who the leader is and deal with it.');
        y += 3;
        display.drawText(0, y++, '[,] to pick up items');
        display.drawText(0, y++, '[d] to drop items');
        display.drawText(0, y++, '[u] to eat items');
        display.drawText(0, y++, '[e] to equip items');
        display.drawText(0, y++, '[w] to wield armor');
        display.drawText(0, y++, '[x] to examine items');
        display.drawText(0, y++, '[;] to look around you');
        display.drawText(0, y++, '[?] to show this help screen');
        y += 3;
        text = '--- press any key to continue ---';
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
    },
    handleInput: function(inputType, inputData) {
        Screen.playScreen.setSubScreen(null)
    }
};

export default Screen