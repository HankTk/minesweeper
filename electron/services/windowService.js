const { BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { WINDOW } = require('../constant/constants');

class WindowService {
  constructor() {
    this.mainWindow = null;
  }

  createWindow() {
    // If a window already exists, try to close it safely
    if (this.mainWindow) {
      try {
        if (!this.mainWindow.isDestroyed()) {
          this.mainWindow.close();
        }
      } catch (error) {
        console.error('Error closing existing window:', error);
      }
      this.mainWindow = null;
    }

    this.mainWindow = new BrowserWindow({
      width: WINDOW.WIDTH,
      height: WINDOW.HEIGHT,
      maximizable: false,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload/preload.js'),
        enableWebSQL: false,
        enableRemoteModule: true,
        sandbox: false
      }
    });

    this.setupWindowLoad();
    this.setupErrorHandling();
  }

  setupWindowLoad() {
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Loading from', WINDOW.DEV_SERVER_URL);
      setTimeout(() => {
        this.mainWindow.loadURL(WINDOW.DEV_SERVER_URL).catch(err => {
          console.error('Failed to load URL:', err);
        });
        this.mainWindow.webContents.openDevTools();
      }, WINDOW.DEV_SERVER_TIMEOUT);
    } else {
      console.log('Production mode: Loading from', WINDOW.PROD_INDEX_PATH);

      if (!fs.existsSync(WINDOW.PROD_INDEX_PATH)) {
        console.error('Index file does not exist at:', WINDOW.PROD_INDEX_PATH);
        return;
      }

      this.mainWindow.loadFile(WINDOW.PROD_INDEX_PATH).catch(err => {
        console.error('Failed to load file:', err);
        console.error('Index path:', WINDOW.PROD_INDEX_PATH);
        console.error('Current directory:', __dirname);
        console.error('App path:', app.getAppPath());
      });
    }
  }

  setupErrorHandling() {
    this.mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Page failed to load:', errorCode, errorDescription);
    });
  }

  getMainWindow() {
    return this.mainWindow;
  }

  setWindowSize(width, height) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.setBounds({
        width: width,
        height: height,
        useContentSize: true
      });
    }
  }

  focus() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.focus();
      // Let the renderer process handle the window size
      this.mainWindow.webContents.send('window-activated');
    }
  }
}

module.exports = new WindowService();
