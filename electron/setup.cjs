const fs = require('fs');
const path = require('path');

// Setup script: modifies package.json to add Electron configuration
const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

// Add Electron configuration
pkg.main = 'electron/main.cjs';
pkg.author = 'NekoReader';
pkg.description = 'Manga, Comic and Book Reader';

// Add Electron scripts
pkg.scripts = pkg.scripts || {};
pkg.scripts['electron:dev'] = 'node electron/fix-paths.cjs && electron electron/main.cjs';
pkg.scripts['electron:build'] = 'npm run build && node electron/fix-paths.cjs && electron-builder --win portable --config electron-builder.config.cjs';
pkg.scripts['electron:installer'] = 'npm run build && node electron/fix-paths.cjs && electron-builder --win nsis --config electron-builder.config.cjs';

// Add build config for electron-builder
pkg.build = {
  extends: './electron-builder.config.cjs'
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
console.log('OK: package.json configured for Electron!');
console.log('');
console.log('Available scripts:');
console.log('  npm run electron:dev        - Run in development mode');
console.log('  npm run electron:build      - Generate portable EXE');
console.log('  npm run electron:installer  - Generate NSIS installer');
