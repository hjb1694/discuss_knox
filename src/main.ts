import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/styles/main.scss'
import '../node_modules/vue-multiselect/dist/vue-multiselect.css';

const app = createApp(App)

app.use(createPinia())
app.use(router);

app.mount('#app')
