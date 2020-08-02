<template>
    <el-form
        :model="form"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template
            v-for="({label, prop, element, attrs, controlled, options, field}, index) in list"
        >
            {{prop}}
            <Customer
                tag="el-form-item"
                :key="label+index"
                :label="label"
                :prop="prop"
                :controlled="expression(controlled)"
            >
                <Customer
                    :tag="element"
                    v-model="form[field.name]"
                    size="small"
                    v-bind="attrsConvert(attrs)"
                    :options="options"
                >
                </Customer>
            </Customer>
        </template>
    </el-form>
</template>
<script>
import Customer from './Customer.js' //函数式组件实现自定义组件
// import CreateDom from './CreateDom'

function dataType(type) {
    switch (true) {
        case type === 'object':
            return {}
        case type === 'array':
            return []
        case type === 'string':
            return ''
    }
}
export default {
    name: 'NetForm',
    components: {Customer},
    props: {
        elements: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            form: {
                isOpen: true
            },
            list: [],
            attrsConvert: (attrs) => {
                const newAttrs = {}
                if (!attrs) return newAttrs
                const keys = Object.keys(attrs)
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i]
                    if (typeof attrs[key] === 'function') {
                        newAttrs[key] = attrs[key]()
                    } else {
                        newAttrs[key] = attrs[key]
                    }
                }
                return newAttrs
            }
        }
    },
    created() {
        function initData({ name, type }) {
            if (!name) {
                console.error(`组件name属性为 ${name}`)
                return false
            }
            let i = 0
            let obj = this.form
            const keys = name.split('.')
            const length = keys.length

            while (i < length - 1) {
                obj = this.$set(obj, keys[i], {})
                i--
            }
            this.$set(obj, keys[length - 1], dataType(type))
            return true
        }
        // 把标记权限验证的数据（如：身份不是管理员等）进行处理
        this.list = this.elements.filter(({ field, permission }) => {
            return (permission
                ? (typeof permission === 'function'
                    ? permission() : permission)
                : true) && initData.call(this, field)
        })
    },
    methods: {
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        handleSubmit() {
            this.$refs.form.validate(isPass => {
                const data = {
                    isPass,
                    fields: { ...this.form }
                }
                this.$emit('valid', data)
            })
        },
        expression(express) {
            return express && new Function(`
                with(this.form) {
                    return ${express}
                }
           `).call(this)
        }
    }
}
</script>

