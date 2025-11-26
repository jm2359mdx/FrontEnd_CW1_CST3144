// load Vue 3 and root component
import { createApp } from 'vue';
import App from './App.vue';

// mount Vue 3 app
createApp(App).mount('#app');


// old Vue 2 mount (not used in Vue 3 apps)
// kept here only if coursework wants to see contrast
new Vue({
  render: h => h(App)
}).$mount('#app');
