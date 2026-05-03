const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig:    ()       => ipcRenderer.invoke('get-config'),
  saveConfig:   (config) => ipcRenderer.invoke('save-config', config),
  getFiles:     (folder) => ipcRenderer.invoke('get-files', folder),
  moveFiles:    (args)   => ipcRenderer.invoke('move-files', args),
  selectFolder: ()       => ipcRenderer.invoke('select-folder'),
  revealConfig: ()       => ipcRenderer.invoke('reveal-config'),
  openFolder:   (folder) => ipcRenderer.invoke('open-folder', folder),
})
