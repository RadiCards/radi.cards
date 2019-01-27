import Vue from "vue";
import VueI18n from "vue-i18n";
import messages from "./translation.json";
// import en from './en'
// import fr from './fr'
// import ro from './ro'

Vue.use(VueI18n);

const en = {
  message: {
    hello: "hello world"
  }
};

export default new VueI18n({
  locale: "en",
  fallbackLocale: "en",
  messages
});
