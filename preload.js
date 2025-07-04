const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  getProjects: () => ipcRenderer.invoke('db-get-projects'),
  getDeletedProjects: () => ipcRenderer.invoke('db-get-deleted-projects'),
  addProject: (project) => ipcRenderer.invoke('db-add-project', project),
  updateProject: (id, updates) => ipcRenderer.invoke('db-update-project', id, updates),
  deleteProject: (id) => ipcRenderer.invoke('db-delete-project', id),
  restoreProject: (id) => ipcRenderer.invoke('db-restore-project', id),
  
  getTimeEntries: () => ipcRenderer.invoke('db-get-time-entries'),
  addTimeEntry: (entry) => ipcRenderer.invoke('db-add-time-entry', entry),
  updateTimeEntry: (id, updates) => ipcRenderer.invoke('db-update-time-entry', id, updates),
  deleteTimeEntry: (id) => ipcRenderer.invoke('db-delete-time-entry', id),
  
  // Global shortcuts
  onGlobalShortcut: (callback) => ipcRenderer.on('global-shortcut', callback),
  
  // Notifications - NEW
  showNotification: (options) => ipcRenderer.invoke('show-notification', options)
});