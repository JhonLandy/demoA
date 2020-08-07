export default {
    functional: true,
    props: {
        tag: {
            type: String,
        },
        options: {
            type: Object,
            default: () => ({})
        },
        controlled: {
            type: Boolean,
            default: true
        }
    },
    render(h, {data: Data, props, children}) {
        const {tag, options, controlled} = props
        if (!controlled) return
        const compose = (h, {element, data, attrs, methods} = {}) =>  {
            if (!element || !data) return
            return data.map(item => h(element, {attrs:{...item, ...attrs}, on: methods}, compose(h, item.options)))
        }
        return h(tag, Data, children || compose(h, options))
    }
}
