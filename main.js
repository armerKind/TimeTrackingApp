const { app, BrowserWindow, globalShortcut, ipcMain, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

let mainWindow;
let db;

// Initialize database
function initDatabase() {
  // Use Documents folder instead of userData for OneDrive sync
  const documentsPath = app.getPath('documents');
  const timeTrackingFolder = path.join(documentsPath, 'TimeTracking');
  
  // Create TimeTracking folder if it doesn't exist
  const fs = require('fs');
  if (!fs.existsSync(timeTrackingFolder)) {
    fs.mkdirSync(timeTrackingFolder, { recursive: true });
  }
  
  const dbPath = path.join(timeTrackingFolder, 'timetracking.db');
  db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME NULL
    );
    
    CREATE TABLE IF NOT EXISTS time_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER,
      project_name TEXT,
      project_color TEXT,
      date TEXT,
      duration INTEGER,
      type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id)
    );
    
    CREATE TABLE IF NOT EXISTS deleted_projects (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Add status and deleted_at columns if they don't exist
  try {
    const result = db.prepare("PRAGMA table_info(projects)").all();
    const hasStatusColumn = result.some(column => column.name === 'status');
    const hasDeletedAtColumn = result.some(column => column.name === 'deleted_at');
    
    if (!hasStatusColumn) {
      db.exec(`ALTER TABLE projects ADD COLUMN status TEXT DEFAULT 'active'`);
      db.exec(`UPDATE projects SET status = 'active' WHERE status IS NULL`);
    }
    
    if (!hasDeletedAtColumn) {
      db.exec(`ALTER TABLE projects ADD COLUMN deleted_at DATETIME NULL`);
    }
  } catch (error) {
    // Columns might already exist or table is new
    console.log('Database schema already up to date');
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    resizable: true,
    minWidth: 350,
    minHeight: 600,
    show: false
  });

  mainWindow.loadFile('src/index.html');
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
  // Hide menu bar
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  // Set app user model ID for Windows notifications
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.timetracking.app');
  }
  
  initDatabase();
  createWindow();
  setupIpcHandlers();

  // Register shortcuts after window is fully loaded
  mainWindow.webContents.once('did-finish-load', () => {
    registerGlobalShortcuts();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('before-quit', async (event) => {
  // Prevent immediate quit to allow timer saving
  event.preventDefault();
  
  try {
    // Ask renderer to save any running timer
    if (mainWindow && !mainWindow.isDestroyed()) {
      const result = await mainWindow.webContents.executeJavaScript(`
        (async function() {
          try {
            // Check if there's a running timer and save it
            if (window.saveRunningTimerOnClose) {
              await window.saveRunningTimerOnClose();
              return { success: true };
            }
            return { success: true, message: 'No timer to save' };
          } catch (error) {
            return { success: false, error: error.message };
          }
        })()
      `);
    }
  } catch (error) {
    // Ignore errors during cleanup
  }
  
  // Now actually quit
  app.exit(0);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (db) {
    db.close();
  }
});

function registerGlobalShortcuts() {
  for (let i = 1; i <= 9; i++) {
    const shortcut = `CommandOrControl+${i}`;
    
    try {
      const success = globalShortcut.register(shortcut, () => {
        if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents) {
          mainWindow.webContents.send('global-shortcut', { key: i.toString() });
        }
      });
      
      // If registration fails, try alternative shortcuts
      if (!success) {
        // Try with Shift modifier as fallback
        const altShortcut = `CommandOrControl+Shift+${i}`;
        globalShortcut.register(altShortcut, () => {
          if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents) {
            mainWindow.webContents.send('global-shortcut', { key: i.toString() });
          }
        });
      }
      
    } catch (error) {
      // Silently continue if shortcut registration fails
    }
  }
}

function setupIpcHandlers() {
  // Notification handler
  ipcMain.handle('show-notification', (event, options) => {
    try {
      if (Notification.isSupported()) {
        const notification = new Notification({
          title: options.title,
          body: options.body,
          icon: options.icon || path.join(__dirname, 'assets/icon.png'),
          silent: false
        });
        
        notification.show();
        
        // Optional: Handle notification click
        notification.on('click', () => {
          if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
          }
        });
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  });

  // Get projects - only return active projects
  ipcMain.handle('db-get-projects', () => {
    try {
      const projects = db.prepare('SELECT * FROM projects WHERE status = ? ORDER BY id').all('active');
      return projects;
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  });
  
  // Get deleted projects - return projects with status 'deleted'
  ipcMain.handle('db-get-deleted-projects', () => {
    try {
      // First try to get from projects table with status 'deleted'
      const deletedProjects = db.prepare('SELECT * FROM projects WHERE status = ? ORDER BY deleted_at DESC').all('deleted');
      
      // Also get from the old deleted_projects table for backwards compatibility
      let oldDeletedProjects = [];
      try {
        oldDeletedProjects = db.prepare('SELECT * FROM deleted_projects ORDER BY deleted_at DESC').all();
      } catch (error) {
        // Table might not exist, ignore
      }
      
      // Combine both sources, remove duplicates
      const allDeleted = [...deletedProjects, ...oldDeletedProjects];
      const uniqueDeleted = allDeleted.filter((project, index, array) => 
        array.findIndex(p => p.id === project.id) === index
      );
      
      return uniqueDeleted;
    } catch (error) {
      console.error('Error getting deleted projects:', error);
      return [];
    }
  });
  
  // Add project
  ipcMain.handle('db-add-project', (event, project) => {
    try {
      const stmt = db.prepare('INSERT INTO projects (name, color, status) VALUES (?, ?, ?)');
      const result = stmt.run(project.name, project.color, 'active');
      return { ...project, id: result.lastInsertRowid, status: 'active' };
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  });
  
  // Update project
  ipcMain.handle('db-update-project', (event, id, updates) => {
    try {
      const stmt = db.prepare('UPDATE projects SET name = ?, color = ? WHERE id = ?');
      stmt.run(updates.name, updates.color, id);
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  });
  
  // Delete project - FIXED: Use soft delete (change status instead of deleting)
  ipcMain.handle('db-delete-project', (event, id) => {
    try {
      // Soft delete: Just change status to 'deleted' and set deleted_at timestamp
      const stmt = db.prepare('UPDATE projects SET status = ?, deleted_at = CURRENT_TIMESTAMP WHERE id = ?');
      stmt.run('deleted', id);
      
      console.log(`Project ${id} soft-deleted (status changed to 'deleted')`);
      return true;
    } catch (error) {
      console.error('Error soft-deleting project:', error);
      throw error;
    }
  });
  
  // Restore project - FIXED: Change status back to active
  ipcMain.handle('db-restore-project', (event, id) => {
    try {
      // Restore: Change status back to 'active' and clear deleted_at
      const stmt = db.prepare('UPDATE projects SET status = ?, deleted_at = NULL WHERE id = ?');
      stmt.run('active', id);
      
      // Also remove from old deleted_projects table if it exists there
      try {
        db.prepare('DELETE FROM deleted_projects WHERE id = ?').run(id);
      } catch (error) {
        // Table might not exist or record not there, ignore
      }
      
      console.log(`Project ${id} restored (status changed to 'active')`);
      return true;
    } catch (error) {
      console.error('Error restoring project:', error);
      throw error;
    }
  });
  
  // Get time entries
  ipcMain.handle('db-get-time-entries', () => {
    try {
      return db.prepare('SELECT * FROM time_entries ORDER BY date DESC, created_at DESC').all();
    } catch (error) {
      console.error('Error getting time entries:', error);
      return [];
    }
  });
  
  // Add time entry
  ipcMain.handle('db-add-time-entry', (event, entry) => {
    try {
      const stmt = db.prepare('INSERT INTO time_entries (project_id, project_name, project_color, date, duration, type) VALUES (?, ?, ?, ?, ?, ?)');
      const result = stmt.run(entry.projectId, entry.projectName, entry.projectColor, entry.date, entry.duration, entry.type);
      return { ...entry, id: result.lastInsertRowid };
    } catch (error) {
      console.error('Error adding time entry:', error);
      throw error;
    }
  });
  
  // Update time entry
  ipcMain.handle('db-update-time-entry', (event, id, updates) => {
    try {
      const stmt = db.prepare('UPDATE time_entries SET project_id = ?, project_name = ?, project_color = ?, duration = ? WHERE id = ?');
      stmt.run(updates.projectId, updates.projectName, updates.projectColor, updates.duration, id);
      return true;
    } catch (error) {
      console.error('Error updating time entry:', error);
      throw error;
    }
  });
  
  // Delete time entry
  ipcMain.handle('db-delete-time-entry', (event, id) => {
    try {
      db.prepare('DELETE FROM time_entries WHERE id = ?').run(id);
      return true;
    } catch (error) {
      console.error('Error deleting time entry:', error);
      throw error;
    }
  });
}