// Electron API helper - provides a safe interface to Electron APIs
// Falls back gracefully when running in browser mode

interface ElectronAPI {
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  openFile: () => Promise<string | null>;
  openFolder: () => Promise<string | null>;
  startPowerSaveBlocker: () => Promise<number>;
  stopPowerSaveBlocker: () => Promise<void>;
  readFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string }>;
  readdir: (dirPath: string) => Promise<{ success: boolean; files?: string[]; error?: string }>;
  stat: (filePath: string) => Promise<{ success: boolean; stat?: { size: number; mtime: Date; isDirectory: boolean }; error?: string }>;
  getAppData: () => Promise<string>;
  onOpenFile: (callback: (filePath: string) => void) => void;
  removeOpenFileListener: () => void;
  platform: string;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export const isElectron = typeof window !== 'undefined' && !!window.electronAPI?.isElectron;

export const electronAPI = {
  minimize: async () => {
    if (isElectron) return window.electronAPI!.minimize();
  },
  maximize: async () => {
    if (isElectron) return window.electronAPI!.maximize();
  },
  close: async () => {
    if (isElectron) return window.electronAPI!.close();
  },
  isMaximized: async () => {
    if (isElectron) return window.electronAPI!.isMaximized();
    return false;
  },
  openFile: async () => {
    if (isElectron) return window.electronAPI!.openFile();
    return null;
  },
  openFolder: async () => {
    if (isElectron) return window.electronAPI!.openFolder();
    return null;
  },
  startPowerSaveBlocker: async () => {
    if (isElectron) return window.electronAPI!.startPowerSaveBlocker();
    return -1;
  },
  stopPowerSaveBlocker: async () => {
    if (isElectron) return window.electronAPI!.stopPowerSaveBlocker();
  },
  readFile: async (filePath: string) => {
    if (isElectron) return window.electronAPI!.readFile(filePath);
    return { success: false, error: 'Not in Electron' };
  },
  readdir: async (dirPath: string) => {
    if (isElectron) return window.electronAPI!.readdir(dirPath);
    return { success: false, error: 'Not in Electron' };
  },
  stat: async (filePath: string) => {
    if (isElectron) return window.electronAPI!.stat(filePath);
    return { success: false, error: 'Not in Electron' };
  },
  getAppData: async () => {
    if (isElectron) return window.electronAPI!.getAppData();
    return '';
  },
  onOpenFile: (callback: (filePath: string) => void) => {
    if (isElectron) window.electronAPI!.onOpenFile(callback);
  },
  removeOpenFileListener: () => {
    if (isElectron) window.electronAPI!.removeOpenFileListener();
  },
};
