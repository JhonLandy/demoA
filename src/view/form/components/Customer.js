
function mapMethods(methods) {
    if (!methods) return
    const _methods = {}
    const keys = Object.keys(methods)
    for (let i = 0;i< keys.length;i++) {
        const key = keys[i]
        _methods[key] = methods[key].bind(this)
    }
    return _methods
}


const adapter = (value, index) => (value 
    ? isArray(value) 
        ? value[index] 
        : value 
    : [])


function composeOptions(createElement, element, attrs, methods, options, index) {//用于options写法

    const _element = adapter(element, index)

    const _attrs = adapter(attrs, index)

    const _methods = adapter(methods, index)

    if (!_element || !options) return

    return options.map(({label, value, options: _options}) => createElement(
        _element,
        {
            attrs: {..._attrs, label, value},
            on: mapMethods.call(this, _methods)
        },
        composeOptions(createElement, element, attrs, methods, _options, index + 1)
    ))
}

function composeElements(createElement, element, attrs, methods, index) {//用于数组内嵌数组写法

    const _element = adapter(element, index)

    const _attrs   = adapter(attrs, index)

    const _methods = adapter(methods, index)
    
    if (!_element) return

    if (isArray(_element)) {

        return _element.map((_$element, _$index) => composeElements(createElement, _$element, _attrs[_$index],  mapMethods.call(this, _methods[_$index]), 0))
    
    } else {
        
        return createElement(
            _element,
            {
                attrs: {..._attrs},
                on: mapMethods.call(this, _methods)
            },
            isArray(element) 
            ? composeElements(createElement, element, attrs, methods, index + 1) 
            : void 0
        )
    }
}

function Error(element, msg) {
    const error = console.error
    
    error(`警告：${element}元素${msg}`)
}

function isArray(value) {
    return Array.isArray(value)
}

export default {

    functional: true,

    inject: ['currentInstance'],

    props: {
        element: {
            required: true,
            type: [String, Array],
            default: ''
        },
        options: {
            type: [Array],
            default: void 0
        },
        controlled: {
            type: Boolean,
            default: true
        },
        attrs: {
            type: [Object, Array],
            default:() => {}
        },
        methods: {
            type: [Object, Array],
            default:() => {}
        },
        createElement: {
            type: Function,
            default: null
        }
    },

    render(h, {data: _data, props, injections, children}) {

        if (!props.controlled) return//是否显示

        const _this = injections.currentInstance

        if (props.createElement) {//自定义组件的话直接返回vnode
            
            return props.createElement.call(_this, (elements, data, childrens) => {

                return h(
                    elements, 
                    Object.assign(_data, {
                        attrs: {..._data?.attrs, ...data?.attrs},
                        on: {..._data?.methods, ...mapMethods.call(_this, data?.methods)}
                    }),
                    childrens
                )
            })
        }

        const {element, attrs, methods, options} = props

        if (!element) return//元素标签不能为空

        const index = 0//用于同层获取属性，0表示第一层

        const _element = adapter(element, index)

        if (isArray(_element)) {//顶层元素不能嵌套子元素，没意义。
            Error(_element, '第一个元素不能为数组！')
            return
        }

        const _attrs   =  adapter(attrs, index)

        const _methods =  adapter(methods, index)

        const compose  =  
                options //根据options选项来选择模式
                ? composeOptions.bind(_this, h, element, attrs, methods, options, index + 1) 
                : composeElements.bind(_this, h, element, attrs, methods, index + 1)

        
        return h(_element,
             Object.assign(_data, {
                attrs: {..._data.attrs, ..._attrs},
                on: {..._data.methods, ...mapMethods.call(_this, _methods)}
            }),
            children || compose()
        )

    }
}

