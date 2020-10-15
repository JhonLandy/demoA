
function bindInstance(methods = {}, instance) {
    const _methods = {}
    const keys = Object.keys(methods)
    for (let i = 0;i < keys.length;i++) {
        const key = keys[i]
        _methods[key] = methods[key].bind(instance)
    }
    return _methods
}

export default {
    functional: true,
    inject: {
        data: {default: () => {}},
        instance: {default: null}
    },
    render(h, {data: Data, injections: {data, instance}}) {
        let {attrs: {template, _data}, on} = Data
        if (typeof template === 'function') {
            template = template(_data)
        }
        if (!template) {
            console.error("CreateDom组件找不到模版内容template，请检查！")
            return
        }
        return h({
            name: 'ViteRender',
            data: () => (data || {}),
            computed: { scope:() => _data},//当数据为静态数据时，如果为data, 换页的时候数据(状态)不会跟着换页走，为避免这种情况，此处使用computed
            methods: {...bindInstance(on, instance)},
            template
        })
    }
}
