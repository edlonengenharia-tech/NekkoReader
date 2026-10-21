# NekkoReader - Manga, Comic and Book Reader

Windows desktop application built with Electron + React + TypeScript + Tailwind CSS.

**Features inspired by AutoComix v2.20.0**

## Requirements

- **Windows 10/11** (64-bit)
- **Node.js 18+** - [Download](https://nodejs.org)

## Quick Start

### First Time Setup

Run `SETUP.cmd` to install everything:

```
SETUP.cmd
```

### Run in Development

```
TESTE-NPM.cmd
```

### Generate Portable EXE

```
BUILD-PORTABLE.cmd
```

Output: `release\NekkoReader-portable.exe`

### Generate Installer (with file associations)

```
BUILD-INSTALLER.cmd
```

Output: `release\NekkoReader-installer.exe`

## Features

### Core Features
- Library with search and filters
- Manga mode (right-to-left)
- Double page view
- Adjustable zoom
- Fullscreen
- 3 themes: Dark, Midnight, Light (with live preview)
- Smooth animations
- Progress HUD
- AI panel (Qwen/OpenAI)
- Reading progress persistence
- Drag & drop files
- Windows file associations
- Custom frameless window
- Power save blocker during reading

### AutoComix Features (v2.20.0)
- **Panel Detection**: Automatically detects panels/frames on pages using ML
- **Auto Panel Rotation**: Panels that would be larger when rotated are automatically turned (useful for tablets/rotatable monitors)
- **Panel Zoom on Double-Click**: Double-click a panel to zoom into it
- **GPU Acceleration**: Uses DirectML on Windows for faster panel detection (NVIDIA, AMD, Intel cards with DirectX 12)
- **Automatic Fallback**: Falls back to CPU if GPU is not available or slower

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Left/Right` | Navigate pages |
| `Home` | First page |
| `End` | Last page |
| `F` | Fullscreen |
| `M` | Manga mode (RTL) |
| `D` | Double page |
| `Tab` | Toggle library |
| `+` `-` | Zoom |
| `Ctrl + Scroll` | Fine zoom |
| `Esc` | Exit fullscreen |
| `Double-click panel` | Zoom to panel |

## Supported Formats

| Format | Description |
|--------|-------------|
| `.cbz` | Comic Book ZIP |
| `.cbr` | Comic Book RAR |
| `.cbt` | Comic Book TAR |
| `.cb7` | Comic Book 7Z |
| `.pdf` | PDF Document |

## Manual Commands

```bash
# Install dependencies
npm install

# Configure for Electron
node electron/setup.cjs

# Build React app
npm run build

# Fix paths for Electron
node electron/fix-paths.cjs

# Run in dev mode
npm run electron:dev

# Build portable EXE
npm run electron:build

# Build NSIS installer
npm run electron:installer
```

## Project Structure

```
nekkoreader/
  electron/              # Electron files (CommonJS)
    main.cjs            # Main process
    preload.cjs         # Secure bridge
    fix-paths.cjs       # Fix paths for Electron
    setup.cjs           # Configure package.json
    create-icon.cjs     # Create placeholder icon
    assets/             # Icons and resources
  src/                   # React code
    components/         # UI components
    App.tsx             # Main component
    electron.ts         # Electron API helper
    types.ts            # TypeScript types
    data.ts             # Sample data
  dist/                  # React build (generated)
  release/               # Generated EXE (after build)
  SETUP.cmd             # Initial setup
  TESTE-NPM.cmd         # Run the app
  BUILD-PORTABLE.cmd    # Build portable EXE
  BUILD-INSTALLER.cmd   # Build NSIS installer
```

## Settings

### Reading Tab
- Manga mode (RTL) by default
- Double page by default
- Fit mode (width/height/page)
- Page flip animation
- Click zones for navigation
- Prefetch pages

### Interface Tab
- Theme selection (Dark/Midnight/Light) with live preview
- Show library on startup

### AutoComix Tab
- Panel detection (ML-based)
- Panel zoom on double-click
- Auto-rotate panels
- Rotation direction (clockwise/counterclockwise)
- Rotation threshold (1.1x - 2.0x)
- GPU acceleration (DirectML)

### AI Tab
- Qwen (Alibaba DashScope)
- OpenAI Compatible (Ollama, LM Studio)
- API key configuration
- Connection testing

## Troubleshooting

### "Electron not found"
```
npm install
```

### EXE build error
- Check disk space
- Try running as Administrator
- Temporarily disable antivirus

### App won't open after install
- Check if Windows Defender blocked the file
- Right-click -> "Run as administrator"

### Wrong paths in build
```
node electron/fix-paths.cjs
```

### Themes not applying
- Click OK in Options dialog to save theme
- Or click directly on theme preview for instant apply

## Custom Icon

1. Create a 512x512 PNG image
2. Save as `electron/assets/icon.png`
3. For .ico format, use: https://convertico.com/
4. Uncomment icon lines in `electron-builder.config.cjs`

## Credits

Built with:
- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

Features inspired by [AutoComix](https://github.com/SorbP/AutoComix) v2.20.0
