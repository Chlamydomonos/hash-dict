import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import element from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import * as icons from '@element-plus/icons-vue';

import persist from 'pinia-plugin-persistedstate';
import axios from 'axios';

const app = createApp(App);

const pinia = createPinia();
pinia.use(persist);

app.use(pinia);
app.use(router);
app.use(element);
for (const [key, component] of Object.entries(icons)) {
    app.component(key, component);
}

axios.defaults.baseURL = '/api';

app.mount('#app');
