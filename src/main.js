
import Game from './game'
import Screen from './screens'
import pkg from '../package.json'
window.addEventListener('DOMContentLoaded', function(e) {

    console.log(`loading client version v${pkg.version}`);

    // Initialize the game
    Game.init();

    // Add the container to our HTML page
    const el = 'app';
    document.getElementById(el).appendChild(Game.getDisplay().getContainer());

    // Load the start screen
    Game.switchScreen(Screen.startScreen);

});