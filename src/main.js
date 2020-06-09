import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
// import router from './YRouter/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/index'
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => {
    return h(App)
  },
}).$mount('#app')
