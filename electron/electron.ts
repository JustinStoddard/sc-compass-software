import { app, BrowserWindow, ipcMain, screen } from "electron";
import { initialize, enable as enableRemote } from "@electron/remote/main";
import * as path from "path";

// Initialize Electron Remote.
initialize();

const createWindow = () => {

  // Create browser window.
  let window: BrowserWindow | null = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    focusable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    },
  });

  // Enable remote module.
  enableRemote(window.webContents);

  // Load main html page
  window.loadFile(path.join(__dirname, 'index.html'));

  // Forces the window to always be on top.
  window.setAlwaysOnTop(true, "pop-up-menu");

  // Allows mouse events through window
  window.setIgnoreMouseEvents(true, {
    forward: true,
  });

  // Make window the size on the screen on initialization.
  window.maximize();

  // Open dev tools if we are in development mode.
  if (process.env.REACT_APP_ENV === 'development') window.webContents.openDevTools();

  window.on('closed', () => {
    // Dereference the window object, usually you would store windows in an array if your browser supports multi windows, this is the time when you should delete the corresponding element.
    window = null;
  });
};

ipcMain.on('resize', (event, args) => {
  const webContents = event.sender;
  const window = BrowserWindow.fromWebContents(webContents);
  window.maximize();
});

ipcMain.on('compass-enter', (event, args) => {
  const webContents = event.sender;
  const window = BrowserWindow.fromWebContents(webContents);
  window.setIgnoreMouseEvents(false);
});

ipcMain.on('compass-leave', (event, args) => {
  const webContents = event.sender;
  const window = BrowserWindow.fromWebContents(webContents);
  window.setIgnoreMouseEvents(true, {
    forward: true,
  });
});

ipcMain.on('init', (event, args) => {
  const webContents = event.sender;
  const window = BrowserWindow.fromWebContents(webContents);
  const { bounds } = screen.getPrimaryDisplay();
  const dimensions = {
    width: bounds.width,
    height: bounds.height,
  };
  window.webContents.send('init', dimensions);
});

// When app is ready create the browser window.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OSX its common for application and their menu bar to stay active until the user quits explicitly with CMD + Q.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OSX it is common to re-create a window in the app when the dock icon is clicked and there are no windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow(); 
});