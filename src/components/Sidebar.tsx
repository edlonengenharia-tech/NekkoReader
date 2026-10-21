import { MangaBook, FilterType } from '../types';

interface SidebarProps {
  books: MangaBook[];
  continueReading: MangaBook[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  onBookSelect: (book: MangaBook) => void;
  currentBookId?: string;
}

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'unread', label: 'Não lidos' },
  { key: 'manga', label: 'Mangá' },
  { key: 'hq', label: 'HQ' },
  { key: 'livro', label: 'Livro' },
  { key: 'recent', label: '↻ Recentes' },
];

export default function Sidebar({
  books,
  continueReading,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  onBookSelect,
  currentBookId,
}: SidebarProps) {
  return (
    <aside className="w-64 sm:w-72 lg:w-80 bg-[#12122a] border-r border-gray-800/50 flex flex-col overflow-hidden shrink-0 animate-slide-in">
      {/* Search */}
      <div className="p-3 border-b border-gray-800/30">
        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar na biblioteca…"
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">🔍</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5 p-3 border-b border-gray-800/30">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`px-2.5 py-1 text-xs rounded-full transition-all ${
              filter === f.key
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Continue reading */}
        {continueReading.length > 0 && (
          <section className="p-3 border-b border-gray-800/30">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span className="text-green-400">▶</span> Continuar lendo
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {continueReading.slice(0, 5).map((book) => (
                <button
                  key={book.id}
                  onClick={() => onBookSelect(book)}
                  className={`flex-shrink-0 w-16 group ${currentBookId === book.id ? 'ring-2 ring-purple-500 rounded-lg' : ''}`}
                >
                  <div className="w-16 h-22 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 truncate group-hover:text-gray-200">{book.title}</p>
                  <p className="text-[9px] text-gray-600">p. {book.currentPage}/{book.totalPages}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Library grid */}
        <section className="p-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            Todos os itens
            <span className="text-gray-600">({books.length})</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {books.map((book) => (
              <button
                key={book.id}
                onClick={() => onBookSelect(book)}
                className={`text-left rounded-lg overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg ${
                  currentBookId === book.id ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/10' : 'shadow-md'
                }`}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1">
                    <StatusBadge status={book.status} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-[10px] text-white/90 font-medium truncate">{book.title}</p>
                  </div>
                </div>
                <div className="p-1.5 bg-gray-800/30">
                  <p className="text-[9px] text-gray-500 truncate">{book.author}</p>
                  <div className="flex gap-1 mt-0.5">
                    {book.genre.slice(0, 2).map((g) => (
                      <span key={g} className="text-[8px] px-1 py-0.5 rounded bg-gray-700/50 text-gray-400">{g}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800/30">
        <p className="text-[10px] text-gray-600 text-center">
          Arraste arquivos .cbz .cbr .pdf para abrir
        </p>
      </div>
    </aside>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    reading: 'bg-green-500/80',
    unread: 'bg-blue-500/80',
    finished: 'bg-gray-500/80',
  };
  const labels = {
    reading: '▶',
    unread: '●',
    finished: '✓',
  };
  return (
    <span className={`${colors[status as keyof typeof colors]} text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}
