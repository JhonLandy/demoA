<script>
    import Vue from  'vue'
    export default {
        name: "CreateDom",
        inject: ['instance'],
        render() {
            let {template, data} = this.$attrs
            if (typeof template === 'function') {
                template = template(data) || '你使用了template函数方式，返回值为undefined'
            } else {
                template = template || '请给组件输入模版内容'
            }
            return Vue.compile(template).render.call(this.instance)
        }
    }
</script>
