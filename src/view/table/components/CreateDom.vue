<script>
    function mapMethods(methods) {
        const _methods = {}
        const keys = Object.keys(methods)
        for (let i = 0;i< keys.length;i++) {
            const key = keys[i]
            _methods[key] = function (...params) {
                this.$emit(key, ...params)
            }
        }
        return _methods
    }
    import Vue from  'vue'
    export default {
        name: "CreateDom",
        inject: {
            data: {default: () => {}},
            instance: {default: ''}
        },
        computed: {
            scope() {//当数据为静态数据时，如果为data, 换页的时候数据(状态)不会跟着换页走，为避免这种情况，此处使用computed
                return this.$attrs._data
            }
        },
        data() {
            return {
                ...this.data
            }
        },
        beforeCreate() {
            this.$options.methods = {...mapMethods(this.$listeners)}
        },
        render() {
            let {template, _data} = this.$attrs

            if (typeof template === 'function') {
                template = template(_data)
            }
            if (!template) {
                console.error("CreateDom组件找不到模版内容template，请检查！")
                return
            }
            return Vue.compile(template).render.call(this.instance || this)
        }
    }
</script>
