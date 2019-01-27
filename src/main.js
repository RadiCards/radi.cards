// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import App from "./App";
import router from "./router";
import store from "./store";
import logging from "./logging";
import Web3 from "web3";
import VueClipboard from "vue-clipboard2";
import AsyncComputed from "vue-async-computed";
// import messages from "./translation.json";
import i18n from "./lang.js";

Vue.use(VueClipboard);

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

Vue.use(AsyncComputed);

Vue.filter("toEth", function(value) {
  if (!value) return "";
  return Web3.utils.fromWei(value.toString(10), "ether").valueOf();
});

Vue.filter("capitalize", function(value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

(async () => {
  try {
    // pre-Vue JS bootstrap
  } catch (e) {
    // eslint-disable-next-line
    console.log(e);
  } finally {
    /* eslint-disable no-new */
    new Vue({
      el: "#app",
      i18n,
      store,
      router,
      logging,
      components: {
        App
      },
      template: "<App/>"
    });
  }
})();
