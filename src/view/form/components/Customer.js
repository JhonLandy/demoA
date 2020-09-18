export default {

    functional: true,

    props: {
        element: {
            required: true,
            type: [String, Array],
            default: ''
        },
        options: {
            type: [Array],
            default: () => []
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
        }
    },

    render(h, {data: _data, props, children}) {

        if (!props.controlled) return

        const {element, attrs, methods, options} = props

        if (!element) return

        let index = 0

        const adapter = (value, index) => (value
            ? value instanceof  Array
                ? value[index]
                : value
            : void 0)

        const compose = (options$, index) =>  {

            const _element = adapter(element, index)

            if (!_element || !options) return

            return options$.map(({attrs: _attrs, methods: _methods, options: _options}) => h(
                _element,
                {
                    attrs: {...adapter(attrs, index), ..._attrs},
                    on: {...adapter(methods, index), ..._methods}
                },
                compose(_options, index + 1)
            ))
        }
        return h(
            adapter(element, index),
            Object.assign(_data, {
                attrs: {...adapter(attrs, index), ..._data.attrs},
                on: {...adapter(methods, index), ..._data.methods}
            }),
            element instanceof  Array
            ? children || compose(options, index + 1)
            : children
        )

    }
}

