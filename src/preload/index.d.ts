import { ElectronAPI } from '@electron-toolkit/preload'
import type { IpcRenderer } from 'electron'

import { Note } from '@shared/types'

declare global {
  interface Window {
    context: {
      locale: string
      minimize: () => void
      maximize: () => void
      close: () => void,
      onFolderCreate: (callback: () => void) => IpcRenderer,
      onFolderDelete: (callback: () => void) => IpcRenderer,
      getFolders: () => Promise<string[]>,
      getFolderNotes: (folder: string) => Promise<Note[]>,
      getRecentNotes: () => Promise<Note[]>,
      saveNote: (folder: string, title: string, content: string) => Promise<void>,
      renameNote: (folder: string, oldTitle: string, newTitle: string) => Promise<void>,
      createFolder: (folder: string) => Promise<void>,
      deleteFolder: (folder: string) => Promise<void>
    }
  }
}
