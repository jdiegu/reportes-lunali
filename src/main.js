import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

window.addEventListener('auth:unauthorized', () => {
  router.push('/login')
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
