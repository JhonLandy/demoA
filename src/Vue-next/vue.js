const effectStack = []
let activeEffect//当前的effect，相当于watcher 
const targetMaps = new WeakMap()//存放收集的effect
/*************核心功能******************** */
function createEffect(fn, options) {
    const effect = function() {
        try {
            effectStack.push(effect)
            activeEffect = effect
            return fn()
        } finally {
            effectStack.pop()
            activeEffect = effectStack[effectStack.length - 1]
        }
    }
    effect.options = options
    effect.deps = []
    return effect
}
function effect(fn, options = {}) {
    const effect = createEffect(fn, options)
    if (!options.lazy) {
        return effect()
    } 
    return effect
}
/***************api实现*********************** */
function watchEffect(fn, options) {
    effect(fn, {
        scheduler:() => fn()
    })
}
function computed(getter) {
    class Fn {
        constructor(getter) {
            this.dirty = true
            this.getter = getter
            this.effect = effect(this.getter, {
                lazy: true,
                scheduler: () => {
                    this.dirty = true
                }
            })
        }
        get value() {
            if (this.dirty) {
                this._value = this.effect()
                this.dirty = false
            }
            return this._value
        }
    }
    return new Fn(getter)
}

function reactive(target) {
    return ProxyHandler(target)
}
/***************数据代理**************** */
function ProxyHandler(target) {
    const proxy = new Proxy(target, {
        get(target, key) {
            track(target)
            return Reflect.get(target, key)
        }, 
        set(target, key, value) {
            const result = Reflect.set(target, key, value)
            if(result) {
                tigger(target)
            }
            return result
        } 
    })
    return proxy
}
function track(target) {
    if (!activeEffect) return//不存在effect不收集依赖
    let hasMap = targetMaps.get(target)
    if (!hasMap) {
        const set = new Set()
        set.add(activeEffect)
        targetMaps.set(target, set)
    } else {
        if(!hasMap.has(activeEffect)) {//判断是否已经存放过的effect
            hasMap.add(activeEffect)
        }
    }
}

function tigger(target) {
    const hasMap = targetMaps.get(target)
    if (hasMap) {
        hasMap.forEach(effect => {
            effect.options.scheduler()
        })
    } 
}



export {
    reactive,
    watchEffect,
    computed
}