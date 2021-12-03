import Vue from 'vue/dist/vue.js'
import App from './App'
import Vue2Filters from 'vue2-filters'
import VueEvents from 'vue-events'
// import VeeValidate from 'vee-validate';

window.createjs = {}
require('./vendor/easeljs-0.8.2')
require('./vendor/cut-txt')
require('./vendor/svgexporter.modified')
require('./assets/app.css')
require('./assets/dark-theme.css')

Vue.use(Vue2Filters)
Vue.use(VueEvents)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
