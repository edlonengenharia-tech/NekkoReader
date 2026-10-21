import { useState, useCallback, useEffect, useRef } from 'react';
import { MangaBook, Settings, FilterType } from './types';
import { sampleBooks } from './data';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import Reader from './components/Reader';
import OptionsDialog from './components/OptionsDialog';
import AIPanel from './components/AIPanel';
import { isElectron, electronAPI } from './electron';

const defaultSettings: Settings = {
  theme: 'dark',
  mangaMode: false,
  doublePage: false,
  fitMode: 'width',
  zoom: 100,
  showLibrary: true,
  animation: true,
  clickZones: true,
  prefetchPages: 2,
  // AutoComix features
  panelDetection: true,
  autoRotatePanels: false,
  rotateDirection: 'clockwise',
  rotateThreshold: 1.3,
  panelZoomOnDblClick: true,
  gpuAcceleration: true,
};

export default function App() {
  const [books, setBooks] = useState<MangaBook[]>(sampleBooks);
  const [currentBook, setCurrentBook] = useState<MangaBook | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [showOptions, setShowOptions] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<{ status: string; message: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Apply theme
  useEffect(() => {
    const theme = settings.theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply theme colors directly to body for immediate effect
    const themeColors = {
      dark: { bg: '#1a1a2e', text: '#f3f4f6' },
      midnight: { bg: '#0a0a1a', text: '#f9fafb' },
      light: { bg: '#f9fafb', text: '#111827' }
    };
    
    const colors = themeColors[theme as keyof typeof themeColors] || themeColors.dark;
    document.body.style.backgroundColor = colors.bg;
    document.body.style.color = colors.text;
    
    // Also update root div
    const root = document.getElementById('root');
    if (root) {
      root.style.backgroundColor = colors.bg;
      root.style.color = colors.text;
    }
  }, [settings.theme]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Check AutoComix backend availability
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/health');
        if (response.ok) {
          const data = await response.json();
          setBackendAvailable(data.status === 'ok');
        }
      } catch (error) {
        setBackendAvailable(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Electron book events
  useEffect(() => {
    if (!isElectron) return;

    const handleBookLoaded = (bookData: any) => {
      setLoadingProgress(null);
      setLoadError(null);
      
      // Create a new book from the loaded data
      const newBook: MangaBook = {
        id: bookData.filePath,
        title: bookData.fileName,
        author: 'Arquivo Local',
        cover: bookData.pages[0]?.url || '',
        pages: bookData.pages,
        totalPages: bookData.totalPages,
        currentPage: 1,
        genre: ['Local'],
        type: 'manga',
        status: 'reading',
        lastRead: new Date().toISOString().split('T')[0]
      };
      
      setCurrentBook(newBook);
      setShowSidebar(false);
    };

    const handleBookProgress = (progress: any) => {
      setLoadingProgress(progress);
    };

    const handleBookError = (error: any) => {
      setLoadingProgress(null);
      setLoadError(error.error);
      setTimeout(() => setLoadError(null), 5000);
    };

    electronAPI.onBookLoaded(handleBookLoaded);
    electronAPI.onBookProgress(handleBookProgress);
    electronAPI.onBookError(handleBookError);

    return () => {
      electronAPI.removeBookListeners();
    };
  }, []);

  // Drag and drop handlers
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.relatedTarget === null) setIsDragging(false);
    };
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      // In a real app, we'd process the dropped files here
    };
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showOptions) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        setShowSidebar(prev => !prev);
      }
      if (e.key === 'f' || e.key === 'F') {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          toggleFullscreen();
        }
      }
      if (e.key === 'm' || e.key === 'M') {
        if (!e.ctrlKey && !e.metaKey) {
          setSettings(prev => ({ ...prev, mangaMode: !prev.mangaMode }));
        }
      }
      if (e.key === 'd' || e.key === 'D') {
        if (!e.ctrlKey && !e.metaKey) {
          setSettings(prev => ({ ...prev, doublePage: !prev.doublePage }));
        }
      }
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showOptions, isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      mainRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const openBook = useCallback((book: MangaBook) => {
    setCurrentBook(book);
    setShowSidebar(false);
  }, []);

  const updateCurrentPage = useCallback((page: number) => {
    if (!currentBook) return;
    const updated = { ...currentBook, currentPage: page, status: 'reading' as const, lastRead: new Date().toISOString().split('T')[0] };
    setCurrentBook(updated);
    setBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
  }, [currentBook]);

  const closeBook = useCallback(() => {
    setCurrentBook(null);
    setShowSidebar(true);
  }, []);

  const filteredBooks = books.filter(book => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!book.title.toLowerCase().includes(q) && !book.author.toLowerCase().includes(q) && !book.genre.some(g => g.toLowerCase().includes(q))) {
        return false;
      }
    }
    switch (filter) {
      case 'unread': return book.status === 'unread';
      case 'manga': return book.type === 'manga';
      case 'hq': return book.type === 'hq';
      case 'livro': return book.type === 'livro';
      case 'recent': return book.lastRead !== undefined;
      default: return true;
    }
  });

  const continueReading = books.filter(b => b.status === 'reading').sort((a, b) => (b.lastRead || '').localeCompare(a.lastRead || ''));

  return (
    <div ref={mainRef} className={`h-screen w-screen flex flex-col overflow-hidden ${getThemeClasses(settings.theme)}`}>
      <TitleBar
        onOpen={() => {}}
        onToggleLibrary={() => setShowSidebar(prev => !prev)}
        onToggleAI={() => setShowAI(prev => !prev)}
        onOptions={() => setShowOptions(true)}
        onTogglePanelDetection={() => setSettings(prev => ({ ...prev, panelDetection: !prev.panelDetection }))}
        onToggleAutoRotate={() => setSettings(prev => ({ ...prev, autoRotatePanels: !prev.autoRotatePanels }))}
        onTogglePanelZoom={() => setSettings(prev => ({ ...prev, panelZoomOnDblClick: !prev.panelZoomOnDblClick }))}
        showAI={showAI}
        showLibrary={showSidebar}
        panelDetection={settings.panelDetection}
        autoRotatePanels={settings.autoRotatePanels}
        panelZoomOnDblClick={settings.panelZoomOnDblClick}
        backendAvailable={backendAvailable}
      />

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <Sidebar
            books={filteredBooks}
            continueReading={continueReading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filter={filter}
            onFilterChange={setFilter}
            onBookSelect={openBook}
            currentBookId={currentBook?.id}
          />
        )}

        <Reader
          book={currentBook}
          settings={settings}
          onPageChange={updateCurrentPage}
          onClose={closeBook}
          onToggleFullscreen={toggleFullscreen}
          onSettingsChange={setSettings}
          isFullscreen={isFullscreen}
        />
      </div>

      {showAI && (
        <AIPanel onClose={() => setShowAI(false)} currentBook={currentBook} />
      )}

      {showOptions && (
        <OptionsDialog
          settings={settings}
          onSave={(newSettings: Settings) => { setSettings(newSettings); setShowOptions(false); }}
          onClose={() => setShowOptions(false)}
        />
      )}

      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="text-center animate-pulse-glow rounded-2xl p-12 border-2 border-dashed border-purple-500/50 bg-purple-500/5">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-xl text-purple-300 font-medium">Solte o arquivo aqui</p>
            <p className="text-sm text-gray-400 mt-2">.cbz .cbr .cbt .cb7 .pdf</p>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loadingProgress && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center bg-gray-900/90 rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
            <p className="text-lg text-purple-300 font-medium mb-2">{loadingProgress.message}</p>
            <p className="text-sm text-gray-400">Aguarde enquanto processamos o arquivo...</p>
          </div>
        </div>
      )}

      {/* Error toast */}
      {loadError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[160] animate-slide-up">
          <div className="bg-red-900/90 border border-red-500/50 rounded-lg px-6 py-3 shadow-2xl flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-red-200 font-medium">Erro ao abrir arquivo</p>
              <p className="text-red-300/80 text-sm">{loadError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getThemeClasses(theme: string): string {
  // Apply theme via data attribute and CSS variables
  // The actual colors are defined in index.css
  return 'theme-applied';
}
