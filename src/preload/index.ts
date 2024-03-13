import { contextBridge, ipcRenderer } from 'electron'

import { Note } from '@shared/types'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    minimize: () => ipcRenderer.send('minimize-window'),
    maximize: () => ipcRenderer.send('maximize-window'),
    close: () => ipcRenderer.send('close-window'),
    onFolderCreate: (callback: () => void) => ipcRenderer.on('folder-added', callback),
    onFolderDelete: (callback: () => void) => ipcRenderer.on('folder-removed', callback),
    getFolders: (...args: Parameters<() => Promise<string[]>>) =>ipcRenderer.invoke('get-folders', ...args),
    getFolderNotes: (...args: Parameters<(folder: string) => Promise<Note[]>>) => ipcRenderer.invoke('get-folder-notes', ...args),
    getRecentNotes: (...args: Parameters<() => Promise<Note[]>>) => ipcRenderer.invoke('get-recent-notes', ...args),
    saveNote: (...args: Parameters<(folder: string, title: string, content: string) => Promise<void>>) => ipcRenderer.invoke('save-note', ...args),
    renameNote: (...args: Parameters<(folder: string, oldTitle: string, newTitle: string) => Promise<void>>) => ipcRenderer.invoke('rename-note', ...args),
    createFolder: (...args: Parameters<(folder: string) => Promise<void>>) => ipcRenderer.invoke('create-folder', ...args),
    deleteFolder: (...args: Parameters<(folder: string) => Promise<void>>) => ipcRenderer.invoke('delete-folder', ...args),
    createNote: (...args: Parameters<(folder: string, title: string) => Promise<void>>) => ipcRenderer.invoke('create-note', ...args),
    deleteNote: (...args: Parameters<(folder: string, title: string) => Promise<void>>) => ipcRenderer.invoke('delete-note', ...args)
  })
} catch (error) {
  console.error(error)
}
