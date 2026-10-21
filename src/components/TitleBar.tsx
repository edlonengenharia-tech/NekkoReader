interface TitleBarProps {
  onOpen: () => void;
  onToggleLibrary: () => void;
  onToggleAI: () => void;
  onOptions: () => void;
  showAI: boolean;
  showLibrary: boolean;
}

export default function TitleBar({ onOpen, onToggleLibrary, onToggleAI, onOptions, showAI, showLibrary }: TitleBarProps) {
  return (
    <header className="h-12 flex items-center justify-between px-3 bg-[#0f0f23] border-b border-gray-800/50 select-none shrink-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          🐱 NekoReader
        </span>
        <button
          onClick={onOpen}
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
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer transition-colors" />
        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer transition-colors" />
        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer transition-colors" />
      </div>
    </header>
  );
}
