import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import '@fontsource-variable/dm-sans'
import '@fontsource/dm-mono/500.css'
import './assets/css/main.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
