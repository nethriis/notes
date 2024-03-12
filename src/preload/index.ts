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
    getFolders: (...args: Parameters<() => Promise<string[]>>) =>ipcRenderer.invoke('get-folders', ...args),
    getFolderNotes: (...args: Parameters<(folder: string) => Promise<Note[]>>) => ipcRenderer.invoke('get-folder-notes', ...args),
    getRecentNotes: (...args: Parameters<() => Promise<Note[]>>) => ipcRenderer.invoke('get-recent-notes', ...args),
    saveNote: (...args: Parameters<(folder: string, title: string, content: string) => Promise<void>>) => ipcRenderer.invoke('save-note', ...args),
    renameNote: (...args: Parameters<(folder: string, oldTitle: string, newTitle: string) => Promise<void>>) => ipcRenderer.invoke('rename-note', ...args)
  })
} catch (error) {
  console.error(error)
}
