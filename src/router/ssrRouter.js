import Vue from 'vue'
import Router from 'vue-router'
import Store from '../store/index'
import Http from "../service/Http";

Vue.use(Router);

const routes = [
    // {
    // name: 'home',
    // path: '/',
    // component: () =>
    //     import ('../components/home'),
    // meta: {
    //     login: false
    // },
    // children: [{
    //         name: 'login',
    //         path: '/login',
    //         component: () =>
    //             import ('../view/login/login'),
    //         meta: {
    //             login: false
    //         }
    //     },
    //     {
    //         name: 'page',
    //         path: '/page',
    //         component: () =>
    //             import ('../view/page/page'),
    //         meta: {
    //             login: false
    //         }
    //     },
    //     {
    //         name: 'table',
    //         path: '/table',
    //         component: () =>
    //             import ('../view/table/table'),
    //         meta: {
    //             login: true
    //         }
    //     },
        // {
        //     name: 'form',
        //     path: '/form/index',
        //     component: () =>
        //         import ('@/view/form/index')
        // }
    // ]
// }
        {
            name: 'table',
            path: '/table',
            component: () =>
                import ('../view/table/table'),
            meta: {
                login: true
            }
        },
];

export default function createStore() {
    const router = new Router({
        mode: 'history',
        routes
    })
    router.beforeEach(async(to, from, next) => {
        const isLogin = !!window.localStorage.getItem("isLogin");
        Http.post("/ycl/login", {
            isLogin
        }).then(({ data }) => {
            Store.commit('changeUser', data)
        })
        if (to.matched.some(item => item.meta.login)) {
            if (!isLogin) {
                next({ name: 'login' })
            } else if (to.name === 'login') {
                window.localStorage.removeItem("isLogin");
                next();
            } else {
                next();
            }
        } else {
            next();
        }
    });
    return router;
}