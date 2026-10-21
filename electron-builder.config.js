module.exports = {
  appId: "com.nekoreader.app",
  productName: "NekoReader",
  copyright: "Copyright © 2026 NekoReader",
  
  directories: {
    output: "release",
    buildResources: "electron/assets"
  },
  
  files: [
    "dist/**/*",
    "electron/**/*",
    "package.json"
  ],
  
  win: {
    target: [
      {
        target: "portable",
        arch: ["x64"]
      },
      {
        target: "nsis",
        arch: ["x64"]
      }
    ],
    // icon: "electron/assets/icon.ico", // Descomente quando tiver um ícone .ico personalizado
    artifactName: "${productName}-${version}-${os}-${arch}.${ext}"
  },
  
  portable: {
    artifactName: "NekoReader-portable.exe"
  },
  
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "NekoReader",
    // installerIcon: "electron/assets/icon.ico", // Descomente quando tiver um ícone .ico
    // uninstallerIcon: "electron/assets/icon.ico",
    // installerHeaderIcon: "electron/assets/icon.ico",
    artifactName: "NekoReader-installer.exe"
  },
  
  fileAssociations: [
    {
      ext: "cbz",
      name: "Comic Book ZIP",
      description: "Arquivo de quadrinhos (CBZ)",
      mimeType: "application/x-cbz",
      role: "Viewer"
    },
    {
      ext: "cbr",
      name: "Comic Book RAR",
      description: "Arquivo de quadrinhos (CBR)",
      mimeType: "application/x-cbr",
      role: "Viewer"
    },
    {
      ext: "cbt",
      name: "Comic Book TAR",
      description: "Arquivo de quadrinhos (CBT)",
      mimeType: "application/x-cbt",
      role: "Viewer"
    },
    {
      ext: "cb7",
      name: "Comic Book 7Z",
      description: "Arquivo de quadrinhos (CB7)",
      mimeType: "application/x-cb7",
      role: "Viewer"
    },
    {
      ext: "pdf",
      name: "PDF Document",
      description: "Documento PDF",
      mimeType: "application/pdf",
      role: "Viewer"
    }
  ],
  
  asar: true,
  
  compression: "maximum"
};
