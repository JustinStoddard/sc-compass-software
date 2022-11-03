const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  resize: () => ipcRenderer.send('resize', 'resize'),
});