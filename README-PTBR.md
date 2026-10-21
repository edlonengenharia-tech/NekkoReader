# 🐱 NekkoReader

**Leitor de Mangá, HQ e Livros com detecção automática de painéis usando AutoComix**

NekkoReader é um leitor de quadrinhos moderno com interface React/TypeScript que integra o motor de detecção de painéis do [AutoComix](https://github.com/SorbP/AutoComix) para uma experiência de leitura inteligente.

## ✨ Características

### Interface Moderna
- 🎨 3 temas: Escuro, Meia-noite, Claro (aplicação instantânea)
- 📚 Biblioteca com busca e filtros
- 🎯 Controles intuitivos na barra de título
- 📊 HUD com progresso de leitura
- 🔄 Animações suaves

### Leitura Inteligente (AutoComix)
- 🔍 **Detecção automática de painéis** usando ML (YOLO + ONNX)
- 🎯 **Zoom em painel com duplo clique**
- 🔄 **Rotação automática de painéis** para melhor visualização
- ⚡ **Aceleração por GPU** (DirectML no Windows)
- 🎚️ **Controle de confiança** da detecção

### Formatos Suportados
- ✅ **CBZ** (Comic Book ZIP) - Extração completa
- ✅ **CBR** (Comic Book RAR) - Extração completa
- ✅ **PDF** - Detecção de páginas
- 🔄 **CBT/CB7** - Em desenvolvimento

### Recursos Avançados
- 📖 Modo mangá (direita para esquerda)
- 📑 Página dupla
- 🔎 Zoom ajustável
- 🖥️ Tela cheia
- 🤖 Painel de IA (Qwen/OpenAI)
- 💾 Persistência de progresso
- 🖱️ Drag & drop de arquivos

## 🚀 Instalação

### Pré-requisitos
- **Windows 10/11** (64-bit)
- **Node.js 18+** - [Download](https://nodejs.org)
- **Python 3.10+** - [Download](https://python.org) (para AutoComix backend)

### Instalação Rápida

```bash
# 1. Clonar o repositório
git clone <repository-url>
cd nekoreader

# 2. Instalar dependências Node.js
npm install

# 3. Configurar backend Python
cd autocomix-backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cd ..

# 4. (Opcional) Instalar AutoComix completo para ML avançado
git clone https://github.com/SorbP/AutoComix.git
set AUTOCOMIX_PATH=C:\path\to\AutoComix
```

## 🎮 Uso

### Iniciar com AutoComix Backend

```bash
START-AUTOCOMIX.cmd
```

Este script:
1. ✅ Inicia o backend Python (Flask)
2. ✅ Compila o React app
3. ✅ Lança o NekkoReader com Electron
4. ✅ Mostra indicador de status do backend

### Iniciar sem Backend (modo básico)

```bash
TESTE-NPM.cmd
```

Funciona sem o backend Python, mas sem detecção avançada de painéis.

### Abrir Arquivos

1. Clique em **📂 Abrir** na barra de título
2. Selecione um arquivo CBZ, CBR ou PDF
3. Aguarde o processamento
4. Navegue pelas páginas!

### Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `←` `→` | Navegar páginas |
| `Home` | Primeira página |
| `End` | Última página |
| `F` | Tela cheia |
| `M` | Modo mangá (RTL) |
| `D` | Página dupla |
| `Tab` | Alternar biblioteca |
| `+` `-` | Zoom |
| `Ctrl + Scroll` | Zoom fino |
| `Esc` | Sair da tela cheia |
| `Duplo clique` | Zoom no painel |

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────┐
│         NekkoReader (React/TS)          │
│  - Interface moderna com Tailwind       │
│  - Extração de arquivos                 │
│  - Controles de leitura                 │
└──────────────┬──────────────────────────┘
               │ HTTP API
               ▼
┌─────────────────────────────────────────┐
│      AutoComix Backend (Python/Flask)   │
│  - Detecção de painéis (YOLO + ONNX)   │
│  - Aceleração GPU (DirectML)           │
│  - Lógica de auto-rotação              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      AutoComix Engine (Opcional)        │
│  - Pipeline ML completo                 │
│  - Modelo de detecção (int8)           │
│  - Análise geométrica avançada         │
└─────────────────────────────────────────┘
```

## ⚙️ Configuração

### Opções de Leitura (⚙ → Leitura)
- Modo mangá por padrão
- Página dupla por padrão
- Modo de ajuste (largura/altura/página)
- Animação de virada
- Zonas de clique

### Opções de Interface (⚙ → Interface)
- Tema (aplicação instantânea)
- Mostrar biblioteca ao iniciar

### Opções AutoComix (⚙ → AutoComix)
- Detecção de painéis
- Zoom em painel com duplo clique
- Rotação automática
- Direção da rotação
- Limiar de rotação (1.1x - 2.0x)
- Aceleração por GPU

### Opções de IA (⚙ → IA)
- Qwen (Alibaba DashScope)
- OpenAI Compatible (Ollama, LM Studio)
- Configuração de API key

## 📦 Gerar Executável

### EXE Portátil

```bash
BUILD-PORTABLE.cmd
```

Gera: `release\NekkoReader-portable.exe`

### Instalador NSIS

```bash
BUILD-INSTALLER.cmd
```

Gera: `release\NekkoReader-installer.exe`

## 🔧 Desenvolvimento

### Backend (Python)

```bash
cd autocomix-backend
venv\Scripts\activate
python server.py
```

Backend roda em http://localhost:5000

### Frontend (React)

```bash
npm run dev
```

Dev server roda em http://localhost:3000

### Build

```bash
npm run build
```

## 📊 Performance

### Detecção de Painéis

| Configuração | Velocidade (por página) |
|--------------|-------------------------|
| AutoComix + GPU (RTX 3090) | ~0.09s |
| AutoComix + CPU | ~1.0s |
| OpenCV fallback | ~0.5s |

### Uso de Memória

- Backend: ~200MB
- Com modelo AutoComix: ~500MB
- Memória GPU: ~1GB (quando usando GPU)

## 🐛 Troubleshooting

### Backend não inicia

**Erro**: "Python not found"
- Instale Python 3.10+ de https://python.org
- Adicione Python ao PATH

**Erro**: "ModuleNotFoundError"
- Ative o ambiente virtual: `venv\Scripts\activate`
- Instale dependências: `pip install -r requirements.txt`

### Detecção não funciona

**Indicador mostra "Fallback"**:
- AutoComix não está instalado
- Configure `AUTOCOMIX_PATH`
- Ou use fallback OpenCV (detecção básica)

**Nenhum painel detectado**:
- Reduza o limiar de confiança
- Verifique formato da imagem
- Check logs do backend

### GPU não está sendo usada

**No Windows**:
- Instale DirectML: `pip install onnxruntime-directml`
- Verifique se GPU suporta DirectX 12
- Atualize drivers da GPU

**Fallback automático**:
- Backend faz fallback para CPU automaticamente
- Verifique logs para erros de inicialização da GPU

## 📚 Documentação

- [AUTOCOMIX-INTEGRATION.md](AUTOCOMIX-INTEGRATION.md) - Guia completo de integração
- [TESTAR-ARQUIVOS.md](TESTAR-ARQUIVOS.md) - Como testar abertura de arquivos
- [README.md](README.md) - Documentação técnica

## 🙏 Créditos

- **[AutoComix](https://github.com/SorbP/AutoComix)** por SorbP - Motor de detecção de painéis
- **Modelo de detecção**: `mosesb/best-comic-panel-detection` (fine-tuned)
- **Tecnologias**: React, TypeScript, Tailwind CSS, Electron, Flask, Python

## 📄 Licença

- NekkoReader: MIT License
- AutoComix: AGPL-3.0 License
- Integração: MIT License

## 🤝 Contribuindo

Contribuições são bem-vindas! Para issues relacionados a:
- **Interface NekkoReader**: Issues deste repositório
- **Motor AutoComix**: [Repositório AutoComix](https://github.com/SorbP/AutoComix)
- **Integração**: Verifique logs do backend e respostas da API

## 📞 Suporte

Para problemas de:
- **UI/Interface**: Verifique este repositório
- **Detecção de painéis**: Verifique logs do backend Python
- **Integração**: Verifique `AUTOCOMIX-INTEGRATION.md`

---

**NekkoReader** - Seu leitor de mangá inteligente! 🐱📚✨
