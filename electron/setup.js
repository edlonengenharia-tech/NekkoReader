const fs = require('fs');
const path = require('path');

// Setup script: modifies package.json to add Electron configuration
const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

// Add Electron configuration
pkg.main = 'electron/main.js';
pkg.author = 'NekoReader';
pkg.description = 'Leitor de Mangá, HQ e Livros';

// Add Electron scripts
pkg.scripts = pkg.scripts || {};
pkg.scripts['electron:dev'] = 'node electron/fix-paths.js && electron electron/main.js';
pkg.scripts['electron:build'] = 'npm run build && node electron/fix-paths.js && electron-builder --win portable --config electron-builder.config.js';
pkg.scripts['electron:installer'] = 'npm run build && node electron/fix-paths.js && electron-builder --win nsis --config electron-builder.config.js';

// Add build config for electron-builder
pkg.build = {
  extends: './electron-builder.config.js'
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
console.log('✅ package.json configurado para Electron!');
console.log('');
console.log('Scripts disponíveis:');
console.log('  npm run electron:dev        - Rodar em modo desenvolvimento');
console.log('  npm run electron:build      - Gerar EXE portátil');
console.log('  npm run electron:installer  - Gerar instalador NSIS');
