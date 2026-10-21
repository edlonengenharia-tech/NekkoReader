import { useState, useCallback, useEffect, useRef } from 'react';
import { MangaBook, Settings } from '../types';

interface ReaderProps {
  book: MangaBook | null;
  settings: Settings;
  onPageChange: (page: number) => void;
  onClose: () => void;
  onToggleFullscreen: () => void;
  onSettingsChange: (settings: Settings) => void;
  isFullscreen: boolean;
}

export default function Reader({
  book,
  settings,
  onPageChange,
  onClose,
  onToggleFullscreen,
  onSettingsChange,
  isFullscreen,
}: ReaderProps) {
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPage = book?.currentPage || 1;
  const totalPages = book?.totalPages || 0;

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (book) setShowControls(false);
    }, 3000);
  }, [book]);

  useEffect(() => {
    if (book) {
      resetHideTimer();
      return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
    }
  }, [book, resetHideTimer]);

  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  }, [totalPages, onPageChange]);

  const goNext = useCallback(() => {
    if (settings.mangaMode) {
      goToPage(currentPage - 1);
    } else {
      goToPage(currentPage + 1);
    }
  }, [currentPage, settings.mangaMode, goToPage]);

  const goPrev = useCallback(() => {
    if (settings.mangaMode) {
      goToPage(currentPage + 1);
    } else {
      goToPage(currentPage - 1);
    }
  }, [currentPage, settings.mangaMode, goToPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!book) return;
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          if (settings.mangaMode) goToPage(currentPage - 1);
          else goToPage(currentPage + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (settings.mangaMode) goToPage(currentPage + 1);
          else goToPage(currentPage - 1);
          break;
        case 'Home':
          e.preventDefault();
          goToPage(1);
          break;
        case 'End':
          e.preventDefault();
          goToPage(totalPages);
          break;
        case '+':
        case '=':
          e.preventDefault();
          onSettingsChange({ ...settings, zoom: Math.min(300, settings.zoom + 10) });
          break;
        case '-':
          e.preventDefault();
          onSettingsChange({ ...settings, zoom: Math.max(25, settings.zoom - 10) });
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [book, currentPage, totalPages, settings, goToPage, onSettingsChange]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -5 : 5;
      onSettingsChange({ ...settings, zoom: Math.max(25, Math.min(300, settings.zoom + delta)) });
    }
  }, [settings, onSettingsChange]);

  // Click zones
  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const isLeft = x < rect.width / 3;
    const isRight = x > (rect.width * 2) / 3;

    if (settings.clickZones) {
      if (settings.mangaMode) {
        if (isLeft) goNext();
        else if (isRight) goPrev();
      } else {
        if (isLeft) goPrev();
        else if (isRight) goNext();
      }
    }
    resetHideTimer();
  }, [settings, goNext, goPrev, resetHideTimer]);

  const cycleFitMode = useCallback(() => {
    const modes: Settings['fitMode'][] = ['width', 'height', 'page'];
    const idx = modes.indexOf(settings.fitMode);
    onSettingsChange({ ...settings, fitMode: modes[(idx + 1) % modes.length] });
  }, [settings, onSettingsChange]);

  const fitModeLabels: Record<string, string> = {
    width: 'Largura',
    height: 'Altura',
    page: 'Página',
  };

  // Empty state
  if (!book) {
    return (
      <main className="flex-1 flex items-center justify-center bg-[#0d0d1a] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(236,72,153,0.08)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.08)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.04)_0%,_transparent_60%)]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
          {/* Floating manga panels */}
          <div className="absolute top-[15%] left-[10%] w-32 h-44 border border-purple-500/10 rounded-lg rotate-[-8deg] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-[25%] right-[15%] w-28 h-40 border border-pink-500/10 rounded-lg rotate-[5deg] animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute bottom-[20%] left-[20%] w-24 h-36 border border-blue-500/10 rounded-lg rotate-[12deg] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-[30%] right-[10%] w-36 h-48 border border-purple-500/10 rounded-lg rotate-[-3deg] animate-pulse" style={{ animationDuration: '4.5s' }} />
        </div>

        <div className="text-center z-10 max-w-lg px-6 animate-slide-up">
          {/* Logo */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl scale-150" />
            <div className="relative text-8xl filter drop-shadow-lg" style={{ textShadow: '0 0 40px rgba(139,92,246,0.3)' }}>
              🐱
            </div>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3 tracking-tight">
            NekoReader
          </h1>
          <p className="text-purple-300/60 text-sm mb-6 font-medium tracking-wide uppercase">
            Leitor de Mangá, HQ e Livros
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            Selecione um item na biblioteca ou arraste um arquivo <b className="text-gray-300">.cbz .cbr .cbt .cb7 .pdf</b> para começar a ler.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs max-w-sm mx-auto">
            <KbdHint kbd="← →" label="Páginas" />
            <KbdHint kbd="F" label="Tela cheia" />
            <KbdHint kbd="M" label="Mangá RTL" />
            <KbdHint kbd="D" label="Página dupla" />
            <KbdHint kbd="Tab" label="Biblioteca" />
            <KbdHint kbd="Ctrl+⚙" label="Zoom" />
          </div>

          {/* Supported formats */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            {['CBZ', 'CBR', 'CBT', 'CB7', 'PDF'].map(fmt => (
              <span key={fmt} className="px-2 py-0.5 text-[10px] rounded bg-gray-800/50 text-gray-500 border border-gray-700/30 font-mono">
                .{fmt.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Reader state
  const currentPageData = book.pages[currentPage - 1];
  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  return (
    <main
      ref={containerRef}
      className="flex-1 flex flex-col bg-[#0d0d1a] relative overflow-hidden"
      onMouseMove={resetHideTimer}
      onClick={handleClick}
      onWheel={handleWheel}
    >
      {/* Page display */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
        <div
          className={`relative transition-all duration-300 ${settings.animation ? 'animate-fade-in' : ''}`}
          style={{
            maxWidth: settings.fitMode === 'width' ? '100%' : settings.fitMode === 'page' ? '90vh' : 'auto',
            maxHeight: settings.fitMode === 'height' ? '100%' : settings.fitMode === 'page' ? '90vh' : 'auto',
            transform: `scale(${settings.zoom / 100})`,
            transformOrigin: 'center center',
          }}
        >
          {currentPageData && (
            <img
              src={currentPageData.url}
              alt={currentPageData.alt}
              className={`max-w-full max-h-full object-contain rounded shadow-2xl shadow-black/50 ${
                settings.fitMode === 'width' ? 'w-full' : ''
              } ${settings.fitMode === 'height' ? 'h-full' : ''}`}
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* HUD - Page indicator */}
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-white/90 flex items-center gap-2 shadow-lg">
          <span className="font-mono">{currentPage}</span>
          <span className="text-white/40">/</span>
          <span className="font-mono text-white/60">{totalPages}</span>
          <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden ml-2">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8 pb-3 px-4">
          {/* Book title */}
          <div className="text-center mb-2">
            <span className="text-white/70 text-xs font-medium">{book.title}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <NavButton onClick={() => goToPage(1)} title="Primeira (Home)" icon="⏮" />
            <NavButton onClick={goPrev} title="Anterior (←)" icon="◀" />
            <span className="text-white/80 text-sm font-mono min-w-[60px] text-center">
              {currentPage} / {totalPages}
            </span>
            <NavButton onClick={goNext} title="Próxima (→)" icon="▶" />
            <NavButton onClick={() => goToPage(totalPages)} title="Última (End)" icon="⏭" />

            <div className="w-px h-6 bg-white/20 mx-1" />

            <ToggleButton
              active={settings.mangaMode}
              onClick={() => onSettingsChange({ ...settings, mangaMode: !settings.mangaMode })}
              label="Mangá"
              title="Modo mangá RTL (M)"
            />
            <ToggleButton
              active={settings.doublePage}
              onClick={() => onSettingsChange({ ...settings, doublePage: !settings.doublePage })}
              label="Dupla"
              title="Página dupla (D)"
            />
            <button
              onClick={cycleFitMode}
              className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
              title="Ajuste (W)"
            >
              Ajuste: {fitModeLabels[settings.fitMode]}
            </button>

            <span className="text-white/60 text-xs min-w-[35px] text-center">{settings.zoom}%</span>
            <NavButton onClick={() => onSettingsChange({ ...settings, zoom: Math.max(25, settings.zoom - 10) })} title="Diminuir zoom" icon="−" />
            <NavButton onClick={() => onSettingsChange({ ...settings, zoom: Math.min(300, settings.zoom + 10) })} title="Aumentar zoom" icon="＋" />

            <div className="w-px h-6 bg-white/20 mx-1" />

            <ToggleButton
              active={isFullscreen}
              onClick={onToggleFullscreen}
              label="⛶ Tela cheia"
              title="Tela cheia (F)"
            />
            <button
              onClick={onClose}
              className="px-2 py-1 text-xs rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors"
            >
              ✕ Fechar
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-2 mx-auto max-w-md">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Click zone indicators (subtle) */}
      {settings.clickZones && showControls && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-1/3 hover:bg-white/5 transition-colors cursor-pointer z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hover:bg-white/5 transition-colors cursor-pointer z-10" />
        </>
      )}
    </main>
  );
}

function NavButton({ onClick, title, icon }: { onClick: () => void; title: string; icon: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      className="w-8 h-8 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors"
    >
      {icon}
    </button>
  );
}

function ToggleButton({ active, onClick, label, title }: { active: boolean; onClick: () => void; label: string; title: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      className={`px-2 py-1 text-xs rounded transition-colors ${
        active
          ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80'
      }`}
    >
      {label}
    </button>
  );
}

function KbdHint({ kbd, label }: { kbd: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-gray-800/50 rounded-lg px-2 py-1.5 border border-gray-700/30">
      <kbd className="text-purple-400 font-mono text-xs">{kbd}</kbd>
      <span className="text-gray-500">{label}</span>
    </div>
  );
}
