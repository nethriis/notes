import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'node:path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import icon from '../../resources/icon.png?asset'
import { getFolders, getFolderNotes, getRecentNotes, saveNote, renameNote } from '@/lib'
import { Note } from '@shared/types'

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    center: true,
    title: 'Note',
    frame: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(app.getAppPath(), '../renderer/index.html'))
  }

  ipcMain.on('minimize-window', () => {
    mainWindow.minimize()
  })

  ipcMain.on('maximize-window', () => {
      if (mainWindow.isMaximized()) {
          mainWindow.unmaximize()
      } else {
          mainWindow.maximize()
      }
  })

  ipcMain.on('close-window', () => {
      mainWindow.close()
  })

  ipcMain.handle('get-folders', (_, ...args: Parameters<() => Promise<string[]>>) => getFolders(...args))
  ipcMain.handle('get-folder-notes', (_, ...args: Parameters<(folder: string) => Promise<Note[]>>) => getFolderNotes(...args))
  ipcMain.handle('get-recent-notes', (_, ...args: Parameters<() => Promise<Note[]>>) => getRecentNotes(...args))
  ipcMain.handle('save-note', (_, ...args: Parameters<(folder: string, title: string, content: string) => Promise<void>>) => saveNote(...args))
  ipcMain.handle('rename-note', (_, ...args: Parameters<(folder: string, oldTitle: string, newTitle: string) => Promise<void>>) => renameNote(...args))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
