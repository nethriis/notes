import { ElectronAPI } from '@electron-toolkit/preload'

import { Note } from '@shared/types'

declare global {
  interface Window {
    context: {
      locale: string
      minimize: () => void
      maximize: () => void
      close: () => void,
      getFolders: () => Promise<string[]>,
      getFolderNotes: (folder: string) => Promise<Note[]>,
      getRecentNotes: () => Promise<Note[]>,
      saveNote: (folder: string, title: string, content: string) => Promise<void>,
      renameNote: (folder: string, oldTitle: string, newTitle: string) => Promise<void>
    }
  }
}
