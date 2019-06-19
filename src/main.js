import App from './App.vue';
import core from './core.js';
/*global Vue:true*/

Vue.use(core);
new Vue({
  render: h => h(App),
}).$mount('#app')
Vue.config.devtools = true;