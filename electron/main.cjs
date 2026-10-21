const { app, BrowserWindow, ipcMain, dialog, powerSaveBlocker } = require('electron');
const path = require('path');
const fs = require('fs');
const { extractBook } = require('./book-extractor.cjs');

let mainWindow = null;
let powerSaveBlockerId = null;

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      const filePath = commandLine.find(arg =>
        arg.endsWith('.cbz') || arg.endsWith('.cbr') || arg.endsWith('.pdf') ||
        arg.endsWith('.cbt') || arg.endsWith('.cb7')
      );
      if (filePath) {
        mainWindow.webContents.send('book:open-file', filePath);
      }
    }
  });

  app.whenReady().then(createWindow);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#1a1a2e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
  });

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath);
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('will-navigate', (event) => {
    event.preventDefault();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle command line file argument
  const filePath = process.argv.find(arg =>
    arg.endsWith('.cbz') || arg.endsWith('.cbr') || arg.endsWith('.pdf') ||
    arg.endsWith('.cbt') || arg.endsWith('.cb7')
  );
  if (filePath) {
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow.webContents.send('book:open-file', filePath);
    });
  }
}

// IPC Handlers
ipcMain.handle('window:minimize', () => {
  mainWindow && mainWindow.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow && mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else if (mainWindow) {
    mainWindow.maximize();
  }
});

ipcMain.handle('window:close', () => {
  mainWindow && mainWindow.close();
});

ipcMain.handle('window:isMaximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Manga/HQ/Livros', extensions: ['cbz', 'cbr', 'cbt', 'cb7', 'pdf', 'zip', 'rar', 'tar', '7z'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result.filePaths[0] || null;
});

ipcMain.handle('dialog:openFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0] || null;
});

ipcMain.handle('powerSaveBlocker:start', () => {
  if (powerSaveBlockerId === null) {
    powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');
  }
  return powerSaveBlockerId;
});

ipcMain.handle('powerSaveBlocker:stop', () => {
  if (powerSaveBlockerId !== null) {
    powerSaveBlocker.stop(powerSaveBlockerId);
    powerSaveBlockerId = null;
  }
});

ipcMain.handle('fs:readFile', async (event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return { success: true, data: buffer.toString('base64') };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('fs:readdir', async (event, dirPath) => {
  try {
    const files = fs.readdirSync(dirPath);
    return { success: true, files: files };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('fs:stat', async (event, filePath) => {
  try {
    const stat = fs.statSync(filePath);
    return { success: true, stat: { size: stat.size, mtime: stat.mtime, isDirectory: stat.isDirectory() } };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('fs:getAppData', () => {
  return app.getPath('userData');
});

// Book extraction handlers
ipcMain.handle('book:open', async (event, filePath) => {
  try {
    // Send progress update
    mainWindow.webContents.send('book:progress', { status: 'extracting', message: 'Extraindo páginas...' });
    
    const result = await extractBook(filePath);
    
    if (result.success) {
      // Send success with book data
      mainWindow.webContents.send('book:loaded', {
        filePath: filePath,
        fileName: path.basename(filePath),
        pages: result.pages,
        totalPages: result.totalPages
      });
      return { success: true };
    } else {
      mainWindow.webContents.send('book:error', { error: result.error });
      return { success: false, error: result.error };
    }
  } catch (error) {
    mainWindow.webContents.send('book:error', { error: error.message });
    return { success: false, error: error.message };
  }
});

ipcMain.handle('book:openDialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Mangá/HQ/Livros', extensions: ['cbz', 'cbr', 'pdf'] },
      { name: 'Todos os arquivos', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    return await ipcMain.handle('book:open', null, filePath);
  }
  
  return { success: false, canceled: true };
});

// App lifecycle
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('open-file', (event, filePath) => {
  event.preventDefault();
  if (mainWindow) {
    mainWindow.webContents.send('book:open-file', filePath);
  }
});
