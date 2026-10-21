const fs = require('fs');
const path = require('path');

// Simple PNG icon generator (creates a minimal valid PNG)
// This is a 32x32 purple square - electron-builder will use it as fallback

// Minimal 1x1 PNG (purple pixel)
const minimalPNG = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // 8-bit RGB
  0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
  0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, 
  0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC,
  0x33, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, // IEND chunk
  0x44, 0xAE, 0x42, 0x60, 0x82
]);

const assetsDir = path.join(__dirname, 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('📁 Pasta electron/assets criada');
}

const iconPath = path.join(assetsDir, 'icon.png');
if (!fs.existsSync(iconPath)) {
  fs.writeFileSync(iconPath, minimalPNG);
  console.log('✅ Ícone placeholder criado em electron/assets/icon.png');
  console.log('');
  console.log('💡 Para um ícone personalizado:');
  console.log('   1. Crie uma imagem 512x512 PNG');
  console.log('   2. Salve como electron/assets/icon.png');
  console.log('   3. Para .ico, use: https://convertico.com/');
} else {
  console.log('✅ Ícone já existe em electron/assets/icon.png');
}

// Also create .ico placeholder (same minimal PNG, electron-builder will handle it)
const icoPath = path.join(assetsDir, 'icon.ico');
if (!fs.existsSync(icoPath)) {
  fs.writeFileSync(icoPath, minimalPNG);
  console.log('✅ Ícone .ico placeholder criado');
}
