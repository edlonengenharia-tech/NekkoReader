const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

/**
 * Extrai páginas de um arquivo CBZ (Comic Book ZIP)
 * Retorna um array de buffers de imagens em base64
 */
function extractCBZ(filePath) {
  try {
    const zip = new AdmZip(filePath);
    const entries = zip.getEntries();
    
    // Filtra apenas arquivos de imagem
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const imageEntries = entries
      .filter(entry => {
        const ext = path.extname(entry.entryName).toLowerCase();
        return imageExtensions.includes(ext) && !entry.isDirectory;
      })
      .sort((a, b) => {
        // Ordena numericamente se possível
        const numA = parseInt(path.basename(a.entryName, path.extname(a.entryName)));
        const numB = parseInt(path.basename(b.entryName, path.extname(b.entryName)));
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.entryName.localeCompare(b.entryName);
      });
    
    const pages = imageEntries.map((entry, index) => {
      const buffer = entry.getData();
      const base64 = buffer.toString('base64');
      const ext = path.extname(entry.entryName).toLowerCase();
      const mimeType = getMimeType(ext);
      
      return {
        id: index + 1,
        url: `data:${mimeType};base64,${base64}`,
        alt: `Página ${index + 1}`,
        fileName: entry.entryName
      };
    });
    
    return {
      success: true,
      pages: pages,
      totalPages: pages.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Extrai páginas de um arquivo CBR (Comic Book RAR)
 */
async function extractCBR(filePath) {
  try {
    const { createExtractorFromFile } = require('node-unrar-js');
    const extractor = await createExtractorFromFile({ filepath: filePath });
    const extracted = extractor.extract();
    
    const files = [...extracted.files];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file.fileHeader.name).toLowerCase();
        return imageExtensions.includes(ext) && !file.fileHeader.flags.directory;
      })
      .sort((a, b) => {
        const numA = parseInt(path.basename(a.fileHeader.name, path.extname(a.fileHeader.name)));
        const numB = parseInt(path.basename(b.fileHeader.name, path.extname(b.fileHeader.name)));
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.fileHeader.name.localeCompare(b.fileHeader.name);
      });
    
    const pages = imageFiles.map((file, index) => {
      const buffer = Buffer.from(file.extraction);
      const base64 = buffer.toString('base64');
      const ext = path.extname(file.fileHeader.name).toLowerCase();
      const mimeType = getMimeType(ext);
      
      return {
        id: index + 1,
        url: `data:${mimeType};base64,${base64}`,
        alt: `Página ${index + 1}`,
        fileName: file.fileHeader.name
      };
    });
    
    return {
      success: true,
      pages: pages,
      totalPages: pages.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Extrai páginas de um arquivo PDF
 */
async function extractPDF(filePath) {
  try {
    const pdf = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    
    // Para PDFs, vamos retornar uma mensagem indicando que precisa de processamento adicional
    // Em produção, usaríamos pdf.js ou similar para renderizar páginas
    return {
      success: true,
      pages: [{
        id: 1,
        url: '',
        alt: 'PDF - Processamento não implementado ainda',
        fileName: path.basename(filePath),
        note: `PDF com ${data.numpages} páginas. Integração com pdf.js necessária.`
      }],
      totalPages: data.numpages,
      info: {
        numPages: data.numpages,
        title: data.info?.Title || path.basename(filePath)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Detecta o tipo de arquivo e extrai as páginas
 */
async function extractBook(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  switch (ext) {
    case '.cbz':
    case '.zip':
      return extractCBZ(filePath);
    
    case '.cbr':
    case '.rar':
      return await extractCBR(filePath);
    
    case '.pdf':
      return await extractPDF(filePath);
    
    case '.cbt':
    case '.tar':
      return {
        success: false,
        error: 'Formato CBR/TAR não suportado ainda'
      };
    
    case '.cb7':
    case '.7z':
      return {
        success: false,
        error: 'Formato CB7/7Z não suportado ainda'
      };
    
    default:
      return {
        success: false,
        error: `Formato não suportado: ${ext}`
      };
  }
}

/**
 * Retorna o MIME type baseado na extensão
 */
function getMimeType(ext) {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp'
  };
  return mimeTypes[ext] || 'image/jpeg';
}

module.exports = {
  extractCBZ,
  extractCBR,
  extractPDF,
  extractBook
};
