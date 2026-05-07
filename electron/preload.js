const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig:    ()       => ipcRenderer.invoke('get-config'),
  saveConfig:   (config) => ipcRenderer.invoke('save-config', config),
  getFiles:     (folder) => ipcRenderer.invoke('get-files', folder),
  moveFiles:    (args)   => ipcRenderer.invoke('move-files', args),
  readFileBuffer: (path) => ipcRenderer.invoke('read-file-buffer', path),
  renameFile:   (args)   => ipcRenderer.invoke('rename-file', args),
  selectFolder: ()       => ipcRenderer.invoke('select-folder'),
  revealConfig: ()       => ipcRenderer.invoke('reveal-config'),
  openFolder:   (folder) => ipcRenderer.invoke('open-folder', folder),
})
