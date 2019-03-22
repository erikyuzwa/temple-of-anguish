const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('browser-window-blur', function() {
  //TODO
  //pause our game
});

app.on('browser-window-focus', function() {
  //TODO
  //unpause our game
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 820,
    height: 415,
    center: true,
    frame: true,
    resizable: false,
    autoHideMenuBar: true,
    backgroundColor: '#000',
    disableAutoHideCursor: true
  });

  mainWindow.setMenu(null);

  // TODO replace with our app landing page
  mainWindow.setTitle('Temple of Anguish :: Wazoo Enterprises Inc.');

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.desktop.html');

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  app.focus();
});
