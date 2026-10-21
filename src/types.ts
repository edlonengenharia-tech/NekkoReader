export interface MangaPage {
  id: number;
  url: string;
  alt?: string;
}

export interface MangaBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  pages: MangaPage[];
  totalPages: number;
  currentPage: number;
  genre: string[];
  type: 'manga' | 'hq' | 'livro';
  status: 'reading' | 'unread' | 'finished';
  lastRead?: string;
  description?: string;
}

export interface Settings {
  theme: 'dark' | 'midnight' | 'light';
  mangaMode: boolean;
  doublePage: boolean;
  fitMode: 'width' | 'height' | 'page';
  zoom: number;
  showLibrary: boolean;
  animation: boolean;
  clickZones: boolean;
  prefetchPages: number;
  // AutoComix features
  panelDetection: boolean;
  autoRotatePanels: boolean;
  rotateDirection: 'clockwise' | 'counterclockwise';
  rotateThreshold: number;
  panelZoomOnDblClick: boolean;
  gpuAcceleration: boolean;
}

export type FilterType = 'all' | 'unread' | 'manga' | 'recent' | 'hq' | 'livro';
