import Path from 'path';
import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
// import ElekIoCore from 'core/dist/cjs/index.js';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  // const core = await ElekIoCore.init({
  //   signature: {
  //     name: 'John Doe',
  //     email: 'john.doe@example.com'
  //   }
  // });

  // console.log('Core: ', await core.projects.count())

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      // @todo preload script is not working yet (module is not defined)
      // preload: Path.join(__dirname, 'preload.js')
    }
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
