# 🐱 NekoReader - Leitor de Mangá, HQ e Livros

Aplicação desktop para Windows desenvolvida com Electron + React + TypeScript + Tailwind CSS.

## 📋 Requisitos

- **Windows 10/11** (64-bit)
- **Node.js 18+** - [Download](https://nodejs.org)

## 🚀 Como Usar

### Modo Desenvolvimento (Teste)

Execute o script `TESTE-NPM.cmd`:

```cmd
TESTE-NPM.cmd
```

Este script irá:
1. Verificar se o Node.js está instalado
2. Instalar dependências automaticamente (se necessário)
3. Compilar a aplicação React
4. Ajustar os paths para Electron
5. Iniciar o NekoReader

### Gerar EXE Portátil

Execute o script `BUILD-PORTABLE.cmd`:

```cmd
BUILD-PORTABLE.cmd
```

Este script irá:
1. Compilar a aplicação
2. Gerar um arquivo `NekoReader-portable.exe` na pasta `release/`
3. Abrir automaticamente a pasta com o executável

O EXE portátil pode ser copiado para qualquer lugar e executado sem instalação!

### Gerar Instalador

Para gerar um instalador com associação de arquivos:

```cmd
npm run electron:installer
```

Ou use o script:

```cmd
BUILD-INSTALLER.cmd
```

## 📚 Formatos Suportados

| Formato | Descrição |
|---------|-----------|
| `.cbz` | Comic Book ZIP |
| `.cbr` | Comic Book RAR |
| `.cbt` | Comic Book TAR |
| `.cb7` | Comic Book 7Z |
| `.pdf` | PDF Document |

## ⌨️ Atalhos de Teclado

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

## 🎨 Recursos

- ✅ Biblioteca com busca e filtros
- ✅ Modo mangá (direita para esquerda)
- ✅ Página dupla
- ✅ Zoom ajustável
- ✅ Tela cheia
- ✅ 3 temas: Escuro, Meia-noite, Claro
- ✅ Animações suaves
- ✅ HUD com progresso
- ✅ Painel de IA (Qwen/OpenAI)
- ✅ Persistência de progresso
- ✅ Drag & drop de arquivos
- ✅ Associação de arquivos no Windows
- ✅ Janela frameless custom
- ✅ Power save blocker durante leitura

## 🏗️ Estrutura do Projeto

```
nekoreader/
├── electron/              # Arquivos do Electron
│   ├── main.js           # Processo principal
│   ├── preload.js        # Ponte segura
│   ├── fix-paths.js      # Ajusta paths para Electron
│   ├── setup.js          # Configura package.json
│   └── assets/           # Ícones e recursos
├── src/                   # Código React
│   ├── components/       # Componentes UI
│   ├── App.tsx           # Componente principal
│   ├── electron.ts       # Helper para Electron API
│   ├── types.ts          # Tipos TypeScript
│   └── data.ts           # Dados de exemplo
├── dist/                  # Build do React (gerado)
├── release/               # EXE gerado (após build)
├── TESTE-NPM.cmd         # Script de teste
├── BUILD-PORTABLE.cmd    # Script de build portátil
└── package.json          # Configuração do projeto
```

## 🔧 Configuração Manual

Se preferir executar manualmente:

```bash
# Instalar dependências
npm install

# Configurar package.json para Electron
node electron/setup.js

# Build do React
npm run build

# Ajustar paths
node electron/fix-paths.js

# Rodar em desenvolvimento
npm run electron:dev

# Gerar EXE portátil
npm run electron:build

# Gerar instalador
npm run electron:installer
```

## 🤖 Integração com IA

O NekoReader suporta integração com IA para resumos e perguntas:

1. Abra **⚙ Opções → IA**
2. Escolha o provedor:
   - **Qwen** (Alibaba DashScope) - Gratuito
   - **OpenAI Compatible** (Ollama, LM Studio, etc.)
3. Configure a chave de API
4. Use o painel **🤖 IA** para:
   - Resumir páginas
   - Resumir documentos
   - Fazer perguntas sobre o conteúdo

## 🐛 Solução de Problemas

### "Electron não encontrado"
```cmd
npm install
```

### Erro ao gerar EXE
- Verifique se tem espaço em disco suficiente
- Tente executar como Administrador
- Desative temporariamente o antivírus

### App não abre após instalar
- Verifique se o Windows Defender não bloqueou o arquivo
- Clique com botão direito → "Executar como administrador"

### Paths incorretos no build
```cmd
node electron/fix-paths.js
```

## 📝 Licença

Este projeto é um exemplo educacional. Sinta-se livre para modificar e usar como base.

## 🙏 Créditos

Desenvolvido com ❤️ usando:
- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

**NekoReader** - Seu leitor de mangá favorito! 🐱📚
