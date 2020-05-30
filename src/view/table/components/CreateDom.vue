<script>
    import Vue from  'vue'
    export default {
        name: "CreateDom",
        inject: ['instance'],
        props: {
            template: {
                default: ''
            },
            scope: {
                type: Object,
                default: () => {}
            }
        },
        render() {
            let template
            if (typeof this.template === 'function') {
                template = this.template(this.scope) || '你使用了template函数方式，返回值为undefined'
            } else {
                template = this.template
            }
            return Vue.compile(template).render.call(this.instance)
        }
    }
</script>
