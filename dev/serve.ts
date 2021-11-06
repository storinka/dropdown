import { createApp } from 'vue';
import Dev from './serve.vue';
import SDropdown from '../src/entry';

const app = createApp(Dev);
app.use(SDropdown);
app.mount('#app');
