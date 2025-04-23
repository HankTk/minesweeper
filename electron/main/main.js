const { app, BrowserWindow, dialog, shell } = require('electron');
const windowService = require('../services/windowService');
const { setupIpcHandlers } = require('../handler/ipcHandlers');
const remoteMain = require('@electron/remote/main');

// Initialize Remote Module
remoteMain.initialize();

// Initialize Application
app.whenReady().then(() => {
  windowService.createWindow();
  setupIpcHandlers();
  remoteMain.enable(windowService.getMainWindow().webContents);
});

// Activated
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    windowService.createWindow();
  } else {
    // If window exists, focus it and let the renderer process handle the window size
    const win = windowService.getMainWindow();
    if (win) {
      win.focus();
      // Let the renderer process handle the window size
      win.webContents.send('window-activated');
    }
  }
});

// Window All Closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
