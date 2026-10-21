import { useState, useCallback, useEffect, useRef } from 'react';
import { MangaBook, Settings, FilterType } from './types';
import { sampleBooks } from './data';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import Reader from './components/Reader';
import OptionsDialog from './components/OptionsDialog';
import AIPanel from './components/AIPanel';

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
  const mainRef = useRef<HTMLDivElement>(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
        showAI={showAI}
        showLibrary={showSidebar}
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
    </div>
  );
}

function getThemeClasses(theme: string): string {
  switch (theme) {
    case 'light': return 'bg-gray-100 text-gray-900';
    case 'midnight': return 'bg-[#0a0a1a] text-gray-100';
    default: return 'bg-[#1a1a2e] text-gray-100';
  }
}
