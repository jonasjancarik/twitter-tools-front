import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import Vuex from 'vuex'
import './registerServiceWorker'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import _ from 'lodash'
// import moment from 'moment'
import store from './store'

Vue.config.productionTip = false

Vue.use(BootstrapVue)

// add lodash everywhere - https://stackoverflow.com/questions/37694243/using-lodash-in-all-of-vue-component-template
Object.defineProperty(Vue.prototype, '$_', { value: _ })
// Object.defineProperty(Vue.prototype, '$moment', { value: moment })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
