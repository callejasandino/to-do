import './assets/main.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

const api = import.meta.env.VITE_API_URL

axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'

axios.interceptors.request.use(
  async (config) => {
    config.url = `${api}${config.url}`
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return await config
  },
  (error) => {
    return Promise.reject(error)
  }
)

app.use(createPinia())
app.use(router)

app.mount('#app')
