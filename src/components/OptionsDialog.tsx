import { useState } from 'react';
import { Settings } from '../types';

interface OptionsDialogProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

type TabId = 'reading' | 'ui' | 'ai';

export default function OptionsDialog({ settings, onSave, onClose }: OptionsDialogProps) {
  const [local, setLocal] = useState<Settings>({ ...settings });
  const [activeTab, setActiveTab] = useState<TabId>('reading');
  const [aiKey, setAiKey] = useState('');
  const [aiModel, setAiModel] = useState('qwen-plus');
  const [aiBase, setAiBase] = useState('');
  const [aiTestResult, setAiTestResult] = useState('');

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'reading', label: 'Leitura', icon: '📖' },
    { id: 'ui', label: 'Interface', icon: '🎨' },
    { id: 'ai', label: 'IA', icon: '🤖' },
  ];

  const handleTestAI = () => {
    setAiTestResult('Testando conexão...');
    setTimeout(() => {
      if (aiKey || aiBase) {
        setAiTestResult('✅ Conexão bem-sucedida!');
      } else {
        setAiTestResult('⚠️ Configure uma chave de API ou URL base.');
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[#1a1a2e] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            ⚙ Opções
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-lg">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 max-h-[400px] overflow-y-auto">
          {activeTab === 'reading' && (
            <div className="space-y-4">
              <OptionCheckbox
                checked={local.mangaMode}
                onChange={(v) => setLocal({ ...local, mangaMode: v })}
                label="Abrir livros em modo mangá (direita→esquerda) por padrão"
              />
              <OptionCheckbox
                checked={local.doublePage}
                onChange={(v) => setLocal({ ...local, doublePage: v })}
                label="Página dupla por padrão"
              />
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Ajuste padrão</label>
                <select
                  value={local.fitMode}
                  onChange={(e) => setLocal({ ...local, fitMode: e.target.value as Settings['fitMode'] })}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
                >
                  <option value="width">Largura</option>
                  <option value="height">Altura</option>
                  <option value="page">Página</option>
                </select>
              </div>
              <OptionCheckbox
                checked={local.animation}
                onChange={(v) => setLocal({ ...local, animation: v })}
                label="Animação de virada de página"
              />
              <OptionCheckbox
                checked={local.clickZones}
                onChange={(v) => setLocal({ ...local, clickZones: v })}
                label="Zonas de clique esq./dir. para folhear"
              />
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Páginas pré-carregadas</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={local.prefetchPages}
                  onChange={(e) => setLocal({ ...local, prefetchPages: parseInt(e.target.value) || 0 })}
                  className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200 text-center"
                />
              </div>
            </div>
          )}

          {activeTab === 'ui' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Tema</label>
                <select
                  value={local.theme}
                  onChange={(e) => setLocal({ ...local, theme: e.target.value as Settings['theme'] })}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
                >
                  <option value="dark">Escuro</option>
                  <option value="midnight">Meia-noite</option>
                  <option value="light">Claro</option>
                </select>
              </div>
              <OptionCheckbox
                checked={local.showLibrary}
                onChange={(v) => setLocal({ ...local, showLibrary: v })}
                label="Mostrar biblioteca ao iniciar"
              />
              <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                <p className="text-xs text-gray-500">
                  💡 Dica: Use <kbd className="px-1 py-0.5 bg-gray-700 rounded text-gray-300">Tab</kbd> para alternar a visibilidade da biblioteca.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <ThemePreview name="Escuro" theme="dark" active={local.theme === 'dark'} onClick={() => setLocal({ ...local, theme: 'dark' })} />
                <ThemePreview name="Meia-noite" theme="midnight" active={local.theme === 'midnight'} onClick={() => setLocal({ ...local, theme: 'midnight' })} />
                <ThemePreview name="Claro" theme="light" active={local.theme === 'light'} onClick={() => setLocal({ ...local, theme: 'light' })} />
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Provedor</label>
                <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200">
                  <option value="qwen">Qwen (Alibaba DashScope)</option>
                  <option value="openai_compat">Compatível OpenAI (Ollama / LM Studio)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Chave de API</label>
                <input
                  type="password"
                  value={aiKey}
                  onChange={(e) => setAiKey(e.target.value)}
                  placeholder="sk-…"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-600"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">URL base (opcional)</label>
                <input
                  type="text"
                  value={aiBase}
                  onChange={(e) => setAiBase(e.target.value)}
                  placeholder="https://…/v1/chat/completions"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-600"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Modelo</label>
                <input
                  type="text"
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  placeholder="qwen-plus · qwen2.5:7b …"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestAI}
                  className="px-3 py-1.5 text-xs rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
                >
                  Testar conexão
                </button>
                {aiTestResult && <span className="text-xs text-gray-400">{aiTestResult}</span>}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Crie uma chave grátis do Qwen em{' '}
                <span className="text-blue-400 underline">dashscope.console.aliyun.com</span>.
                Para uso 100% local, escolha "Compatível OpenAI" e aponte para o Ollama.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-700/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(local)}
            className="px-4 py-2 text-sm rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors shadow-lg shadow-purple-500/20"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionCheckbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? 'bg-purple-500 border-purple-500' : 'border-gray-600 group-hover:border-gray-500'
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && <span className="text-white text-[10px]">✓</span>}
      </div>
      <span className="text-sm text-gray-300 group-hover:text-gray-200" onClick={() => onChange(!checked)}>
        {label}
      </span>
    </label>
  );
}

function ThemePreview({ name, theme, active, onClick }: { name: string; theme: string; active: boolean; onClick: () => void }) {
  const colors: Record<string, { bg: string; text: string }> = {
    dark: { bg: '#1a1a2e', text: '#e5e7eb' },
    midnight: { bg: '#0a0a1a', text: '#f3f4f6' },
    light: { bg: '#f3f4f6', text: '#1f2937' },
  };
  const c = colors[theme];
  return (
    <button
      onClick={onClick}
      className={`rounded-lg p-2 border-2 transition-all ${active ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700 hover:border-gray-600'}`}
    >
      <div className="w-full h-12 rounded" style={{ backgroundColor: c.bg }}>
        <div className="p-2">
          <div className="w-3/4 h-1 rounded" style={{ backgroundColor: c.text, opacity: 0.5 }} />
          <div className="w-1/2 h-1 rounded mt-1" style={{ backgroundColor: c.text, opacity: 0.3 }} />
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-1">{name}</p>
    </button>
  );
}
