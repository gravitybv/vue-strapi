import Vue from "vue";
import App from "./App.vue";

import strapi from "./plugins/strapi";
Vue.use(strapi);

// Set production tip
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
