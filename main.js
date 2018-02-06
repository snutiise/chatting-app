const electron = require('electron');

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const ipcMain =electron.ipcMain;

let mainWindow, child;
function createWindow () {
  mainWindow = new BrowserWindow({width: 400, height: 750, icon: path.join(__dirname, 'icon.png')});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'build/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
    child.close();
  });
  mainWindow.setResizable(false);
  mainWindow.setMenu(null);
  //mainWindow.webContents.openDevTools();

  //child window... real child not...
  child = new BrowserWindow({width: 210, height: 60, frame: false, type:"notification"});
  child.setIgnoreMouseEvents(true);
  child.setAlwaysOnTop(true);
  child.setPosition(electron.screen.getPrimaryDisplay().bounds.width-210, electron.screen.getPrimaryDisplay().bounds.height-60);
  child.loadURL(url.format({
    pathname: path.join(__dirname, 'childView/getMsg.html'),
    protocol: 'file:',
    slashes: true
  }));
  child.isResizable(false);
  child.hide();
  //child.webContents.openDevTools();
}

ipcMain.on('msgReceive', (event, data) => {
  if(mainWindow.isFocused()==false){
    child.reload();
    child.webContents.once('did-finish-load', () => {
      child.webContents.send("requestMsg",data);
      child.show();
    });
    //child.webContents.send("requestMsg",data);
  }
});

ipcMain.on('hideChild', (event, data) => {
  child.hide();
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});