'use strict';
/* globals Game */
$(function() {

  // Initialize the game
  Game.init();

  // Add the container to our HTML page
  var el = '#gameContainer';
  $(el).empty().append(Game.getDisplay().getContainer());

  // Load the start screen
  Game.switchScreen(Game.Screen.startScreen);

});
