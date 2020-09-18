<template>
    <el-form
        ref="form"
        :model="form"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template
            v-for="({formItem, element, attrs, methods, change, focus, options, controlled, field}, index) in list"
        >
            <Customer
                element="el-form-item"
                :key="field.name+index"
                :prop="field.name"
                :controlled="expression(controlled)"
                v-bind="formItem"
            >
                <Customer
                    :element="element"
                    v-model="form[field.name]"
                    size="small"
                    :options="asyncOptions[field.name] || options"
                    @change="change && matchCallback(field.name)('change')"
                    @focus="focus && matchCallback(field.name)('focus')"
                    :attrs="attrs"
                    :methods="methods"
                >
                </Customer>
            </Customer>
        </template>
        <slot name="button" :handleSubmit="handleSubmit"></slot>
    </el-form>
</template>
<script>
import Customer from './Customer.js' //函数式组件实现自定义组件
// import CreateDom from './CreateDom'

function isPromise(p) {
  return typeof p === 'object' && typeof p.then === 'function' && typeof p.catch === 'function'
}

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
            form: {},
            list: [],
            asyncOptions: {},
            callbacksMap:{},
            callbacksQueue: []
        }
    },

    watch: {

      callbacksQueue(Queue) { // 处理callbacks函数，异步函数

          if (Queue.length === 0) return// 防止死循环

          for (const {field, async} of Queue) {

            if (!async || field in this.asyncOptions) continue// 如果之前请求了，使用缓存，不再次请求

            this.matchCallback(field)('async')

          }

          this.callbacksQueue = []// callbacksQueue watcher 执行后将重新把wather放入队列

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
        this.list = Object.freeze(this.elements.filter(({ field, async, callback, permission }) => {

            this.callbacksQueue.push({field, async})

            this.collectCallbackToMap({field, callback})

            return (permission
                ? (typeof permission === 'function'
                    ? permission() : permission)
                : true) && initData.call(this, field)
        }))
    },
    methods: {
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        handleSubmit() {
            let result = [];
            this.$refs.form.validate(isPass => {
               result = [isPass, { ...this.form }]
            })
            return result
        },
        expression(express) {
            return express && new Function(`
                with(this.form) {
                    return ${express}
                }
           `).call(this)
        },
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
        },

        collectCallbackToMap({ field, callback }) {
            if (!callback) return
            this.callbacksMap[field] = (...params) => callback(...params, key => (...params) => this.matchCallback(key)(...params), { ...this.form })
        },

        matchCallback(key) {

            return async (sign) => {

                const result = this.callbacksMap[key](sign)

                if (isPromise(result)) {

                  const data = await result

                  this.$set(this.asyncOptions, key, Object.freeze(data))

                  return data

                } else {

                    return result

                }
            }
        }
    }
}
</script>

