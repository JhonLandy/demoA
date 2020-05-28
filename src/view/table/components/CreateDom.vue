<script>
    import Vue from  'vue'
    export default {
        name: "CreateDom",
        props: {
            instance: {
                type: Object,
                default: null
            },
            template: {
                type: String,
                default: ''
            }
        },
        render() {
            return Vue.compile(this.template).render.call(this.instance)
        }
    }
</script>
