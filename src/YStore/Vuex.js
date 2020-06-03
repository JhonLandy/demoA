let Vue
class Store {

    //暗号： first blood
    constructor(options) {
        this.mutations = options.mutations
        this.actions = options.actions
        this.getters = Object.create(null)
        const store = this

        const computed = {}

        let wrap = options.getters
        Object.keys(wrap).forEach(key => {
            const getComputed = function(fn, store) {
                return function () {
                    return fn(store)
                }
            }
            computed[key] = getComputed(wrap[key], store)

            Object.defineProperty(store.getters, key, {
                get: () => {
                    console.log(this._vm)
                    return this._vm[key]
                },
                enumerable: true
            })
        })

        this._vm = new Vue({
            data: {
                $$state: typeof  options.state === 'function' ?  options.state() : options.state
            },
            computed
        })

        const {commit, dispatch} = store
        this.commit = function boundCommit(type, payload) {
            commit.call(store, type, payload)
        }
        this.dispatch = function boundDispatch(type, payload, cb) {
            return dispatch.call(store, type, payload, cb)
        }
    }

    commit(type, payload) {
        const entry = this.mutations[type]
        if(!entry) {
            return
        }
        entry(this, payload)
    }

    get state() {
        return this._vm._data.$$state
    }

    set state(val) {
        console.error("不能修改")
    }

    dispatch(type, payload, cb) {
        const entry = this.actions[type]
        if (!entry) {
            return
        }
        if(cb) {
            return new Promise( resolve => {
                entry(this, payload)
                resolve('成功')
            }).then(cb)
        } else {
            new Promise( resolve => {
                entry(this, payload)
                resolve('成功')
            })
        }
    }
}
function install(_Vue) {
    Vue = _Vue
    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                this.$store = this.$options.store
            }
        }
    })
}
export default {
    Store,
    install
}
