import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import './style.css';
import App from './App.vue';
import router from './router';
import client from './plugins/villus';

// Quasar
import { Quasar } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import { createNaverMap } from "vue3-naver-maps";

const pinia = createPinia();
pinia.use(piniaPluginPersistedState)
const { VITE_CLIENTID } = import.meta.env

createApp(App)
  .use(pinia)
  .use(router)
  .use(Quasar, { plugins: {} })
  .use(client)
  .use(createNaverMap, {
    clientId: VITE_CLIENTID,
    category: "ncp",
    subModules: ["drawing", "geocoder"], // Optional, "panorama" | "geocoder" | "drawing" | "visualization"
  })
  .mount('#app');
