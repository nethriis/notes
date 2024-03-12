import { app } from 'electron'

export const appDirName: 'Notes' = 'Notes'
export const rootDir = `${app.getPath('documents')}/Notes`
export const fileEncoding: BufferEncoding = 'utf-8'
