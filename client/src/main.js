import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMeta from 'vue-meta'
import VueScrollTo from 'vue-scrollto'
import VueSmoothScroll from 'vue2-smooth-scroll'
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';

import './assets/css/index.css'

Vue.config.productionTip = false

Vue.use(VueMeta)
Vue.use(VueScrollTo)
Vue.use(VueSmoothScroll)
Vue.use(VueFilterDateFormat)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#adobefashion')
