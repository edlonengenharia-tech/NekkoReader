module.exports = {
  appId: "com.nekkoreader.app",
  productName: "NekkoReader",
  copyright: "Copyright 2026 NekkoReader",
  
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
    artifactName: "${productName}-${version}-${os}-${arch}.${ext}"
  },
  
  portable: {
    artifactName: "NekkoReader-portable.exe"
  },
  
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "NekkoReader",
    artifactName: "NekkoReader-installer.exe"
  },
  
  fileAssociations: [
    {
      ext: "cbz",
      name: "Comic Book ZIP",
      description: "Comic Book Archive (CBZ)",
      mimeType: "application/x-cbz",
      role: "Viewer"
    },
    {
      ext: "cbr",
      name: "Comic Book RAR",
      description: "Comic Book Archive (CBR)",
      mimeType: "application/x-cbr",
      role: "Viewer"
    },
    {
      ext: "cbt",
      name: "Comic Book TAR",
      description: "Comic Book Archive (CBT)",
      mimeType: "application/x-cbt",
      role: "Viewer"
    },
    {
      ext: "cb7",
      name: "Comic Book 7Z",
      description: "Comic Book Archive (CB7)",
      mimeType: "application/x-cb7",
      role: "Viewer"
    },
    {
      ext: "pdf",
      name: "PDF Document",
      description: "PDF Document",
      mimeType: "application/pdf",
      role: "Viewer"
    }
  ],
  
  asar: true,
  
  compression: "maximum"
};
