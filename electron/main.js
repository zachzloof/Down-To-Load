const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'development'

function getConfigPath() {
  return path.join(app.getPath('userData'), 'config.json')
}

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Down-To-Load',
    backgroundColor: '#0f172a',
    show: false,
  })

  mainWindow.once('ready-to-show', () => mainWindow.show())

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ── Config ───────────────────────────────────────────────────────────────────

ipcMain.handle('get-config', () => {
  try {
    const configPath = getConfigPath()
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    }
    return null
  } catch {
    return null
  }
})

ipcMain.handle('save-config', (_, config) => {
  try {
    const configPath = getConfigPath()
    const dir = path.dirname(configPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
})

// ── Files ─────────────────────────────────────────────────────────────────────

ipcMain.handle('get-files', (_, folderPath) => {
  try {
    const entries = fs.readdirSync(folderPath)
    return entries
      .filter(name => {
        try { return fs.statSync(path.join(folderPath, name)).isFile() }
        catch { return false }
      })
      .map(name => {
        const fullPath = path.join(folderPath, name)
        const stats = fs.statSync(fullPath)
        return {
          name,
          path: fullPath,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          ext: path.extname(name).replace('.', '').toLowerCase(),
        }
      })
      .sort((a, b) => new Date(b.modified) - new Date(a.modified))
  } catch (e) {
    return { error: e.message }
  }
})

ipcMain.handle('move-files', async (_, { filePaths, destFolder }) => {
  const results = []
  for (const sourcePath of filePaths) {
    try {
      const fileName = path.basename(sourcePath)
      let destPath = path.join(destFolder, fileName)
      let counter = 1
      while (fs.existsSync(destPath)) {
        const ext = path.extname(fileName)
        const base = path.basename(fileName, ext)
        destPath = path.join(destFolder, `${base} (${counter})${ext}`)
        counter++
      }
      try {
        fs.renameSync(sourcePath, destPath)
      } catch (err) {
        // cross-device move: copy then delete
        if (err.code === 'EXDEV') {
          fs.copyFileSync(sourcePath, destPath)
          fs.unlinkSync(sourcePath)
        } else {
          throw err
        }
      }
      results.push({ sourcePath, destPath, success: true })
    } catch (e) {
      results.push({ sourcePath, success: false, error: e.message })
    }
  }
  return results
})

// ── Dialogs / shell ───────────────────────────────────────────────────────────

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Folder',
  })
  if (result.canceled || !result.filePaths.length) return null
  return result.filePaths[0]
})

ipcMain.handle('reveal-config', () => {
  const configPath = getConfigPath()
  if (fs.existsSync(configPath)) {
    shell.showItemInFolder(configPath)
  } else {
    shell.openPath(path.dirname(configPath))
  }
})

ipcMain.handle('open-folder', (_, folderPath) => {
  shell.openPath(folderPath)
})
