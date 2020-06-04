
function Observe(vm, data) {
    Object.keys(data).forEach(key => {
        let val = vm[key] = data[key]
        const dep = new Dep()
        Object.defineProperty(data, key, {
            get() {
                Dep.target && dep.depend(Dep.target)
                return val
            },
            set(value) {
                if (value !== val) {
                    if (typeof val === 'object')Observe(vm, val)
                    val = value
                    dep.notify()
                }
            },
        })
        if (typeof val === 'object') Observe(vm, val)
    })
}

function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(v) {
                vm.$data[key] = v
            }
        })
    })
}

class Vue {
    constructor(options) {
        this.$options = options
        this.$el = document.querySelector(options.el) || options.el
        this.$data = options.data
        this.$listeners = {}
        this.$attrs = {}
        this.initMethods()
        this.initData()
        const update = this.compile.bind(this)
        this.render(update)
    }

    initMethods() {
        const {methods} = this.$options
        Object.keys(methods).forEach(key => {
            this.$listeners[key] = methods[key].bind(this)
        })
    }

    initData() {
        const {data} = this.$options
        Observe(this, data)
        proxy(this)
    }

    compile() {
        const {data} = this.$options
        const childNoe =  this.$el.childNodes
        childNoe.forEach(node => {
            const outerHtml = node.outerHTML//不是元素时为undefined
            const innerHtml = node.innerHTML//不是元素时为undefined
            let fn = function() {}
            if (outerHtml) {
                switch (true) {
                    case /k-text=["|'](.*?)['|"]/gm.test(outerHtml): {
                        const e = node
                        e.innerHTML = data[RegExp.$1]
                        break
                    }
                    case /k-html=["|'](.*?)(['|"])/gm.test(outerHtml): {
                        const e = node
                        e.innerHTML = data[RegExp.$1]
                        break
                    }
                    case /k-model=["|'](.*?)['|"]/gm.test(outerHtml): {
                        const e = node
                        if(!e.value) e.value = data[RegExp.$1]
                        node.addEventListener('input', function(e) {
                             data[RegExp.$1] = e.target.value
                        }, {
                            once: true
                        })
                        break
                    }
                    case /@(.*)=["|'](.*?)['|"]/gm.test(outerHtml):{
                        if (fn !== this.$listeners[RegExp.$2]) {
                            fn = this.$listeners[RegExp.$2]
                            node.addEventListener(RegExp.$1, fn)
                        }
                    }
                }
            }
            if (innerHtml) {
                if(/\{\{(.*)}}/gm.test(innerHtml)) {
                    node.innerHTML = data[RegExp.$1]
                }
            }
        })
    }

    render(fn) {
        new Watcher(fn)
    }
}

class Dep {
    constructor() {
        this.subs = []
    }

    depend(watch) {
        this.subs.push(watch)
    }
    notify() {
        this.subs.forEach(watch => watch.update())
    }
}

class Watcher{
    constructor(render) {
        Dep.target = this
        if(render) {
            this.render = render
            render()
        }
        Dep.target = null
    }
    update() {
        this.render()
    }
}
