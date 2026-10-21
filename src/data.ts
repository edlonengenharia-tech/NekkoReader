import { MangaBook } from './types';

// Generate placeholder manga pages using SVG data URIs
function generateMangaPages(bookId: string, count: number, color: string, title: string) {
  const pages = [];
  for (let i = 1; i <= count; i++) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200">
      <rect width="800" height="1200" fill="${color}"/>
      <rect x="40" y="40" width="720" height="1120" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" rx="8"/>
      <text x="400" y="560" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="48" font-family="sans-serif" font-weight="bold">${title}</text>
      <text x="400" y="620" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="28" font-family="sans-serif">Página ${i}</text>
      <text x="400" y="680" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="20" font-family="sans-serif">${bookId}</text>
      <rect x="80" y="80" width="300" height="400" fill="rgba(255,255,255,0.08)" rx="4"/>
      <rect x="420" y="80" width="300" height="400" fill="rgba(255,255,255,0.08)" rx="4"/>
      <rect x="80" y="520" width="640" height="300" fill="rgba(255,255,255,0.05)" rx="4"/>
      <rect x="80" y="860" width="300" height="260" fill="rgba(255,255,255,0.06)" rx="4"/>
      <rect x="420" y="860" width="300" height="260" fill="rgba(255,255,255,0.06)" rx="4"/>
    </svg>`;
    pages.push({
      id: i,
      url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
      alt: `${title} - Página ${i}`,
    });
  }
  return pages;
}

function generateCover(title: string, color: string, emoji: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1"/>
        <stop offset="100%" style="stop-color:${adjustColor(color, -40)};stop-opacity:1"/>
      </linearGradient>
    </defs>
    <rect width="300" height="420" fill="url(#bg)" rx="8"/>
    <rect x="10" y="10" width="280" height="400" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" rx="6"/>
    <text x="150" y="180" text-anchor="middle" font-size="72">${emoji}</text>
    <text x="150" y="260" text-anchor="middle" fill="white" font-size="22" font-family="sans-serif" font-weight="bold">${title}</text>
    <rect x="60" y="350" width="180" height="30" fill="rgba(0,0,0,0.3)" rx="15"/>
    <text x="150" y="370" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="12" font-family="sans-serif">NekoReader</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

export const sampleBooks: MangaBook[] = [
  {
    id: 'sakura-blade',
    title: 'Sakura Blade',
    author: 'Takeshi Yamamoto',
    cover: generateCover('Sakura Blade', '#e91e63', '🌸'),
    pages: generateMangaPages('Sakura Blade', 24, '#2d1b30', 'Sakura Blade'),
    totalPages: 24,
    currentPage: 12,
    genre: ['Ação', 'Samurai', 'Drama'],
    type: 'manga',
    status: 'reading',
    lastRead: '2026-10-19',
    description: 'Uma guerreira solitária busca vingança em um Japão feudal devastado pela guerra.',
  },
  {
    id: 'cyber-neko',
    title: 'Cyber Neko',
    author: 'Akira Digital',
    cover: generateCover('Cyber Neko', '#2196f3', '🐱'),
    pages: generateMangaPages('Cyber Neko', 18, '#0a1929', 'Cyber Neko'),
    totalPages: 18,
    currentPage: 18,
    genre: ['Sci-Fi', 'Cyberpunk'],
    type: 'manga',
    status: 'finished',
    lastRead: '2026-10-15',
    description: 'Em 2099, um gato cibernético navega as ruas neon de Neo-Tokyo.',
  },
  {
    id: 'dragon-quest-origins',
    title: 'Dragon Quest Origins',
    author: 'Mário Silva',
    cover: generateCover('Dragon Quest', '#4caf50', '🐉'),
    pages: generateMangaPages('Dragon Quest Origins', 32, '#1a2e1a', 'Dragon Quest Origins'),
    totalPages: 32,
    currentPage: 0,
    genre: ['Fantasia', 'Aventura', 'RPG'],
    type: 'hq',
    status: 'unread',
    description: 'A origem épica do herói que salvou o reino de Eldoria.',
  },
  {
    id: 'noite-eterna',
    title: 'Noite Eterna',
    author: 'Carlos Mendes',
    cover: generateCover('Noite Eterna', '#9c27b0', '🌙'),
    pages: generateMangaPages('Noite Eterna', 20, '#1a0a2e', 'Noite Eterna'),
    totalPages: 20,
    currentPage: 5,
    genre: ['Terror', 'Sobrenatural'],
    type: 'hq',
    status: 'reading',
    lastRead: '2026-10-18',
    description: 'Uma cidade onde o sol nunca mais nasceu. Os sobreviventes lutam contra criaturas das sombras.',
  },
  {
    id: 'o-caminho-do-monge',
    title: 'O Caminho do Monge',
    author: 'Li Wei',
    cover: generateCover('Caminho Monge', '#ff9800', '🧘'),
    pages: generateMangaPages('O Caminho do Monge', 28, '#2e1a0a', 'O Caminho do Monge'),
    totalPages: 28,
    currentPage: 0,
    genre: ['Filosofia', 'Artes Marciais'],
    type: 'livro',
    status: 'unread',
    description: 'Um jovem monge embarca em uma jornada de autoconhecimento pelas montanhas sagradas.',
  },
  {
    id: 'mecha-squadron',
    title: 'Mecha Squadron',
    author: 'Kenji Robotics',
    cover: generateCover('Mecha Squadron', '#f44336', '🤖'),
    pages: generateMangaPages('Mecha Squadron', 16, '#2e0a0a', 'Mecha Squadron'),
    totalPages: 16,
    currentPage: 8,
    genre: ['Mecha', 'Sci-Fi', 'Ação'],
    type: 'manga',
    status: 'reading',
    lastRead: '2026-10-20',
    description: 'Pilotos de mechas gigantes defendem a Terra contra uma invasão alienígena.',
  },
  {
    id: 'cafe-mistico',
    title: 'Café Místico',
    author: 'Ana Beatriz',
    cover: generateCover('Café Místico', '#795548', '☕'),
    pages: generateMangaPages('Café Místico', 12, '#1a1210', 'Café Místico'),
    totalPages: 12,
    currentPage: 12,
    genre: ['Slice of Life', 'Comédia', 'Sobrenatural'],
    type: 'manga',
    status: 'finished',
    lastRead: '2026-10-10',
    description: 'Um café onde espíritos e humanos se encontram para conversar sobre a vida.',
  },
  {
    id: 'oceano-profundo',
    title: 'Oceano Profundo',
    author: 'Marina Costa',
    cover: generateCover('Oceano Profundo', '#00bcd4', '🌊'),
    pages: generateMangaPages('Oceano Profundo', 22, '#0a1a2e', 'Oceano Profundo'),
    totalPages: 22,
    currentPage: 3,
    genre: ['Aventura', 'Fantasia', 'Mistério'],
    type: 'hq',
    status: 'reading',
    lastRead: '2026-10-17',
    description: 'Uma oceanógrafa descobre uma civilização perdida nas profundezas do Pacífico.',
  },
];
