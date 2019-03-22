
$(function() {

  var sound = new Howl({
    src: ['audio/Visager_-_02_-_Castle_Theme.mp3'],
    loop: true,
    autoplay: true
  });

  // Initialize the game
  Game.init();

  // Add the container to our HTML page
  var el = '#gameContainer';
  $(el).empty().append(Game.getDisplay().getContainer());

  // Load the start screen
  Game.switchScreen(Game.Screen.startScreen);

});
