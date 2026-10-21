# NekoReader - Manga, Comic and Book Reader

Windows desktop application built with Electron + React + TypeScript + Tailwind CSS.

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

Output: `release\NekoReader-portable.exe`

### Generate Installer (with file associations)

```
BUILD-INSTALLER.cmd
```

Output: `release\NekoReader-installer.exe`

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

## Supported Formats

| Format | Description |
|--------|-------------|
| `.cbz` | Comic Book ZIP |
| `.cbr` | Comic Book RAR |
| `.cbt` | Comic Book TAR |
| `.cb7` | Comic Book 7Z |
| `.pdf` | PDF Document |

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

## Features

- Library with search and filters
- Manga mode (right-to-left)
- Double page view
- Adjustable zoom
- Fullscreen
- 3 themes: Dark, Midnight, Light
- Smooth animations
- Progress HUD
- AI panel (Qwen/OpenAI)
- Reading progress persistence
- Drag & drop files
- Windows file associations
- Custom frameless window
- Power save blocker during reading

## Project Structure

```
nekoreader/
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
