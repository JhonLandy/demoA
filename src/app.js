import Vue from 'vue'
import App from './App.vue'
import createRouter from './router/ssrRouter'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import creatStore from './store/ssrStore'
Vue.use(ElementUI);

Vue.mixin({
    beforeMount() {
        const { asyncData } = this.$options
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: this.$route
            })
        }
    }
})
export default function createApp() {
    const router = createRouter();
    const store = creatStore();
    const app = new Vue({
        router,
        store,
        render: h => h(App)
    })
    return { app, router, store };
}