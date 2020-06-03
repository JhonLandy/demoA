import Vue from "vue";
import Vuex from "./Vuex";

Vue.use(Vuex)
const store = new Vuex.Store({
    state() {
        return {
            name: 'ycl'
        }
    },
    mutations: {
        setName({state}, payload) {
            state.name = payload
        }
    },
    actions: {
        setA({state}, payload) {
            state.name = payload
        }
    },
    getters: {
        name({state}) {
            return state.name + "gbk"
        }
    }

})
export default store
