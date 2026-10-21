const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  // Dialogs
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openFolder: () => ipcRenderer.invoke('dialog:openFolder'),

  // Power save blocker
  startPowerSaveBlocker: () => ipcRenderer.invoke('powerSaveBlocker:start'),
  stopPowerSaveBlocker: () => ipcRenderer.invoke('powerSaveBlocker:stop'),

  // File system
  readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
  readdir: (dirPath) => ipcRenderer.invoke('fs:readdir', dirPath),
  stat: (filePath) => ipcRenderer.invoke('fs:stat', filePath),
  getAppData: () => ipcRenderer.invoke('fs:getAppData'),

  // Events
  onOpenFile: (callback) => {
    ipcRenderer.on('book:open-file', (event, filePath) => callback(filePath));
  },
  removeOpenFileListener: () => {
    ipcRenderer.removeAllListeners('book:open-file');
  },

  // Platform info
  platform: process.platform,
  isElectron: true,
});
