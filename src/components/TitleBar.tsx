import { isElectron, electronAPI } from '../electron';

interface TitleBarProps {
  onOpen: () => void;
  onToggleLibrary: () => void;
  onToggleAI: () => void;
  onOptions: () => void;
  onTogglePanelDetection: () => void;
  onToggleAutoRotate: () => void;
  onTogglePanelZoom: () => void;
  showAI: boolean;
  showLibrary: boolean;
  panelDetection: boolean;
  autoRotatePanels: boolean;
  panelZoomOnDblClick: boolean;
}

export default function TitleBar({ 
  onOpen, 
  onToggleLibrary, 
  onToggleAI, 
  onOptions,
  onTogglePanelDetection,
  onToggleAutoRotate,
  onTogglePanelZoom,
  showAI, 
  showLibrary,
  panelDetection,
  autoRotatePanels,
  panelZoomOnDblClick
}: TitleBarProps) {
  const handleMinimize = async () => {
    if (isElectron) await electronAPI.minimize();
  };

  const handleMaximize = async () => {
    if (isElectron) await electronAPI.maximize();
  };

  const handleClose = async () => {
    if (isElectron) await electronAPI.close();
  };

  const handleOpen = async () => {
    if (isElectron) {
      const result = await electronAPI.openBookDialog();
      if (!result.success && !result.canceled) {
        console.error('Erro ao abrir livro:', result.error);
      }
    } else {
      onOpen();
    }
  };

  return (
    <header className="h-12 flex items-center justify-between px-3 bg-[#0f0f23] border-b border-gray-800/50 select-none shrink-0 z-50"
      style={isElectron ? { WebkitAppRegion: 'drag' } as React.CSSProperties : undefined}
    >
      <div className="flex items-center gap-2" style={isElectron ? { WebkitAppRegion: 'no-drag' } as React.CSSProperties : undefined}>
        <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          🐱 NekkoReader
        </span>
        <button
          onClick={handleOpen}
          className="px-3 py-1 text-xs rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors border border-gray-700"
        >
          📂 Abrir
        </button>
        <button
          onClick={onToggleLibrary}
          className={`px-3 py-1 text-xs rounded-full transition-colors border ${
            showLibrary
              ? 'bg-purple-600/30 border-purple-500/50 text-purple-300'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
          }`}
        >
          📚 Biblioteca
        </button>
        <button
          onClick={onTogglePanelDetection}
          className={`px-3 py-1 text-xs rounded-full transition-colors border ${
            panelDetection
              ? 'bg-green-600/30 border-green-500/50 text-green-300'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
          }`}
          title="Detecção de painéis (AutoComix)"
        >
          🔍 Painéis
        </button>
        <button
          onClick={onToggleAutoRotate}
          className={`px-3 py-1 text-xs rounded-full transition-colors border ${
            autoRotatePanels
              ? 'bg-orange-600/30 border-orange-500/50 text-orange-300'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
          }`}
          title="Rotação automática de painéis"
        >
          🔄 Auto-Rotação
        </button>
        <button
          onClick={onTogglePanelZoom}
          className={`px-3 py-1 text-xs rounded-full transition-colors border ${
            panelZoomOnDblClick
              ? 'bg-cyan-600/30 border-cyan-500/50 text-cyan-300'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
          }`}
          title="Zoom em painel com duplo clique"
        >
          🎯 Zoom Painel
        </button>
        <button
          onClick={onToggleAI}
          className={`px-3 py-1 text-xs rounded-full transition-colors border ${
            showAI
              ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
          }`}
          title="Resumo e perguntas com IA"
        >
          🤖 IA
        </button>
        <button
          onClick={onOptions}
          className="px-3 py-1 text-xs rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors border border-gray-700"
        >
          ⚙ Opções
        </button>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1" style={isElectron ? { WebkitAppRegion: 'no-drag' } as React.CSSProperties : undefined}>
        {isElectron ? (
          <>
            <button
              onClick={handleMinimize}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
              title="Minimizar"
            >
              ─
            </button>
            <button
              onClick={handleMaximize}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
              title="Maximizar"
            >
              ▢
            </button>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-red-600 rounded transition-colors text-gray-400 hover:text-white"
              title="Fechar"
            >
              ✕
            </button>
          </>
        ) : (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer transition-colors" />
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer transition-colors" />
          </div>
        )}
      </div>
    </header>
  );
}
