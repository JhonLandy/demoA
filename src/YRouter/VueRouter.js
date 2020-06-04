let Vue
class VueRounter {
    constructor(options) {
        Vue.util.defineReactive(this, 'current', '/')

        this.routeList = options.router
        this.RouterMap = {}
        if(this.routeList) {
            this.routeList.forEach(item => {
                this.RouterMap[item.path] = item
            })
        }
        window.addEventListener('hashchange', this.onHashChange.bind(this))
    }

    onHashChange() {
        this.current = window.location.hash.slice(1)
        console.log(this.current)
    }

}

VueRounter.install = function(_Vue) {
    Vue = _Vue
    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router
            }
        }
    })

    Vue.component('router-view', {
        render: h => {
            const {RouterMap, current} = this.$router
            const component = RouterMap[current].component
            return  h(component)
        }
    })
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                default: '/'
            }
        },
        router: h => {
            return h('a', {attrs: {href: this.to}}, this.$slots.default)
        },
    })
}

export default VueRounter
