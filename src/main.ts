import { createApp } from 'vue'
import initVuePrime from "./plugins/vuePrime";

import './assets/main.scss'
import App from './App.vue'
import router from "./router";

const app = createApp(App)
initVuePrime(app)

app.use(router).mount('#app')
