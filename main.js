const {
    app,
    BrowserWindow,
    BrowserView,
    Menu,
    ipcMain,
    dialog,
    powerSaveBlocker,
    nativeTheme,
} = require('electron');
const path = require('path')
const isDev = require('electron-is-dev');
const Store = require('electron-store');

const store = new Store();
const fs = require('fs');
const configDir = app.getPath('userData');
const dirPath = path.join(configDir, 'uploads');
let mainWindow;
let readerWindow;
let mainView;
const singleInstance = app.requestSingleInstanceLock();
var filePath = null;
