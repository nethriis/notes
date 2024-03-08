import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    context: {
      locale: string
      minimize: () => void
      maximize: () => void
      close: () => void
    }
  }
}
