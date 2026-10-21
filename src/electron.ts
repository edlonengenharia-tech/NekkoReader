// Electron API helper - provides a safe interface to Electron APIs
// Falls back gracefully when running in browser mode

interface BookPage {
  id: number;
  url: string;
  alt: string;
  fileName?: string;
}

interface BookData {
  filePath: string;
  fileName: string;
  pages: BookPage[];
  totalPages: number;
}

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
  
  // Book operations
  openBook: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  openBookDialog: () => Promise<{ success: boolean; canceled?: boolean; error?: string }>;
  
  // Events
  onOpenFile: (callback: (filePath: string) => void) => void;
  onBookLoaded: (callback: (bookData: BookData) => void) => void;
  onBookProgress: (callback: (progress: { status: string; message: string }) => void) => void;
  onBookError: (callback: (error: { error: string }) => void) => void;
  removeBookListeners: () => void;
  
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
  
  // Book operations
  openBook: async (filePath: string) => {
    if (isElectron) return window.electronAPI!.openBook(filePath);
    return { success: false, error: 'Not in Electron' };
  },
  openBookDialog: async () => {
    if (isElectron) return window.electronAPI!.openBookDialog();
    return { success: false, error: 'Not in Electron' };
  },
  
  // Events
  onOpenFile: (callback: (filePath: string) => void) => {
    if (isElectron) window.electronAPI!.onOpenFile(callback);
  },
  onBookLoaded: (callback: (bookData: any) => void) => {
    if (isElectron) window.electronAPI!.onBookLoaded(callback);
  },
  onBookProgress: (callback: (progress: any) => void) => {
    if (isElectron) window.electronAPI!.onBookProgress(callback);
  },
  onBookError: (callback: (error: any) => void) => {
    if (isElectron) window.electronAPI!.onBookError(callback);
  },
  removeBookListeners: () => {
    if (isElectron) window.electronAPI!.removeBookListeners();
  },
};
