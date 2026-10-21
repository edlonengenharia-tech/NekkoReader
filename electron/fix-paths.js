const fs = require('fs');
const path = require('path');

// Fix Vite build output for Electron compatibility
// Vite generates absolute paths (/assets/...) but Electron needs relative paths (./assets/...)

const distDir = path.join(__dirname, '..', 'dist');
const indexFile = path.join(distDir, 'index.html');

if (!fs.existsSync(indexFile)) {
  console.error('❌ dist/index.html não encontrado. Rode "npm run build" primeiro.');
  process.exit(1);
}

let html = fs.readFileSync(indexFile, 'utf-8');

// Replace absolute paths with relative paths
html = html.replace(/(src|href)="\/(assets\/[^"]+)"/g, '$1="./$2"');

// Also handle any other absolute references
html = html.replace(/(src|href)="\/([^"]+)"/g, (match, attr, value) => {
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('//')) {
    return match; // Keep external URLs as-is
  }
  return `${attr}="./${value}"`;
});

fs.writeFileSync(indexFile, html, 'utf-8');
console.log('✅ Paths corrigidos para Electron (relativos)');
