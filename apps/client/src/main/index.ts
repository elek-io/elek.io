import Path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import ElekIoCore from 'core';
import express from 'express';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const handleSetTitle = (event: any, title: string): void => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
};

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  if (app.isPackaged) {
    // Client is in production
    // Serve static files via express and load them inside the window
    // const express = import('express');
    const expressApp = express();
    expressApp.use(
      express.static(Path.resolve(__dirname, '../renderer/main_window'))
    );
    expressApp.listen(3001, () => {
      mainWindow.loadURL('http://localhost:3001');
    });
  } else {
    // Client is in development
    // Consume the "next start" endpoint of client-frontend with HMR support
    mainWindow.loadURL('http://localhost:3002');
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  ipcMain.on('set-title', handleSetTitle);
  const core = await ElekIoCore.init({
    signature: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  });
  const count = await core.projects.count();
  console.log('Projects: ', count);
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
