'use strict';

window.addEventListener('DOMContentLoaded', function(e) {
  console.log('DOM loaded and parsed');

  // Initialize the game
  Game.init();

  // Add the container to our HTML page
  var el = 'gameContainer';
  document.getElementById(el).appendChild(Game.getDisplay().getContainer());

  // Load the start screen
  Game.switchScreen(Game.Screen.startScreen);


});
