import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import './vue-shims.d.ts'
import '@arco-design/web-vue/dist/arco.css';
import ArcoVue from '@arco-design/web-vue';


createApp(App).use(ArcoVue).mount('#app')
