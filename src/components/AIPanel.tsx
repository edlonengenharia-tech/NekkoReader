import { useState } from 'react';
import { MangaBook } from '../types';

interface AIPanelProps {
  onClose: () => void;
  currentBook: MangaBook | null;
}

export default function AIPanel({ onClose, currentBook }: AIPanelProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Olá! Sou o assistente de leitura do NekoReader. Posso resumir páginas, responder perguntas sobre o documento e ajudar com OCR. Configure a chave do Qwen em ⚙ Opções → IA para habilitar respostas reais.' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!question.trim()) return;
    const userMsg = question.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuestion('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Esta página mostra uma cena de ação intensa com o protagonista enfrentando seu oponente. Os elementos visuais incluem linhas de movimento e efeitos de impacto.',
        'Com base no contexto do documento, posso identificar que estamos no clímax da história. Os personagens principais estão em uma situação crítica.',
        'O texto visível nesta página menciona diálogos importantes para o desenvolvimento da trama. Recomendo prestar atenção aos balões de fala destacados.',
        'Esta é uma página de transição que prepara o leitor para o próximo arco narrativo. Os elementos visuais sugerem uma mudança de cenário.',
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSummarizePage = () => {
    if (!currentBook) return;
    setMessages(prev => [...prev, { role: 'user', text: `Resuma a página ${currentBook.currentPage} de "${currentBook.title}"` }]);
    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `Página ${currentBook.currentPage} de "${currentBook.title}": Esta página apresenta uma composição com múltiplos painéis. O layout segue o estilo tradicional de mangá com quadros de diferentes tamanhos criando ritmo narrativo. Os elementos visuais dominantes incluem o protagonista em ação e cenários detalhados ao fundo.`
      }]);
      setIsLoading(false);
    }, 1200);
  };

  const handleSummarizeDoc = () => {
    if (!currentBook) return;
    setMessages(prev => [...prev, { role: 'user', text: `Resuma "${currentBook.title}"` }]);
    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `"${currentBook.title}" por ${currentBook.author}: ${currentBook.description || 'Uma obra que explora temas profundos através de uma narrativa visual envolvente.'} A obra possui ${currentBook.totalPages} páginas e se enquadra nos gêneros: ${currentBook.genre.join(', ')}.`
      }]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <aside className="fixed right-0 top-12 bottom-0 w-80 lg:w-96 bg-[#12122a] border-l border-gray-800/50 flex flex-col z-40 shadow-2xl shadow-black/30 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/30">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          🤖 Assistente de leitura
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">✕</button>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-1.5 p-3 border-b border-gray-800/30">
        <button
          onClick={handleSummarizePage}
          disabled={!currentBook}
          className="px-2.5 py-1 text-[11px] rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          📄 Resumir página
        </button>
        <button
          onClick={handleSummarizeDoc}
          disabled={!currentBook}
          className="px-2.5 py-1 text-[11px] rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          📚 Resumir documento
        </button>
        <button
          className="px-2.5 py-1 text-[11px] rounded-full bg-green-600/20 text-green-300 border border-green-500/30 hover:bg-green-600/30 transition-colors"
          title="Copiar o texto da página para colar em um OCR externo"
        >
          📋 Copiar texto
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-purple-600/30 text-purple-100 border border-purple-500/20'
                : 'bg-gray-800/50 text-gray-300 border border-gray-700/30'
            }`}>
              {msg.role === 'ai' && <span className="text-[10px] text-gray-500 block mb-1">🤖 NekoAI</span>}
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700/30">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-800/30">
        <div className="flex gap-2">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={2}
            placeholder="Pergunte algo sobre a página/documento… (Ctrl+Enter envia)"
            className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50"
          />
          <button
            onClick={handleSend}
            className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors self-end"
          >
            ➤
          </button>
        </div>
        {!currentBook && (
          <p className="text-[10px] text-gray-600 mt-1.5">Abra um livro para usar os recursos de IA.</p>
        )}
      </div>
    </aside>
  );
}
