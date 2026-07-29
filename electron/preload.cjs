const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('maqamDesktop', Object.freeze({
  platform: process.platform,
  version: process.versions.electron,
}));
