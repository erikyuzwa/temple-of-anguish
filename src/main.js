
import Game from './game'
import Screen from './screens'

window.addEventListener('DOMContentLoaded', function(e) {

    console.log('DOM loaded and parsed');

    // Initialize the game
    Game.init();

    // Add the container to our HTML page
    var el = 'app';
    document.getElementById(el).appendChild(Game.getDisplay().getContainer());

    // Load the start screen
    Game.switchScreen(Screen.startScreen);

});