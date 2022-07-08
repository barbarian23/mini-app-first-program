import Vue from 'vue'
import App from './App'
import store from './store/index'
import mixins from './mixins';

import './static/css/style.css'
import './static/css/animate.css'

import LangUtils from './utils/LangUtils'
import Constants from "./constants/Constants";
import { rssFeeder } from "./utils/rssFeeder";

Vue.config.productionTip = false

App.mpType = 'app'
Vue.mixin(mixins);
Vue.prototype.$store = store;
Vue.prototype.$rssFeeder = rssFeeder;

Vue.prototype.$onLaunched = new Promise(resolve => {
  Vue.prototype.$isResolve = resolve
  console.log('initLang and setTabBarLang')
  LangUtils.setLang(Constants.langEN)
  LangUtils.initLang();
  LangUtils.setTabBarLang();
})

const app = new Vue({
  ...App,
  store
})
app.$mount()

