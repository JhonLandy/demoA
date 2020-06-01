<script>
    import Vue from  'vue'
    export default {
        name: "CreateDom",
        render() {
            let {template, data, instance} = this.$attrs
            if (!instance) {
                console.error("CreateDom组件找不到组件实例instance，无法渲染！")
                return
            }
            if (typeof template === 'function') {
                template = template(data)
            }
            if (!template) {
                console.error("CreateDom组件找不到模版内容template，请检查！")
                return
            }
            return Vue.compile(template).render.call(instance)
        }
    }
</script>
