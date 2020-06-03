import Vue from "vue";
import Router from "./VueRouter.js";

Vue.use(Router)

const route = [
    {
        name: 'home',
        path: '/',
        component: () => import('../components/home'),
        meta: {
            login: false
        }
    },
    {
        name: 'table',
        path: '/table',
        component: () => import('../view/table/table'),
        meta: {
            login: true
        }
    }
]
const router = new Router({
    route
})

export default router