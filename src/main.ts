import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
import client from './plugins/villus';

// Quasar
import { Quasar } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';

const pinia = createPinia();

createApp(App)
  .use(pinia)
  .use(router)
  .use(Quasar, { plugins: {} })
  .use(client)
  .mount('#app');
