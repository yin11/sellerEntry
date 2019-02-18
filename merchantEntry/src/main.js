// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import './assets/js/rem'



import { Popup , MessageBox } from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.component(Popup.name, Popup);



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


