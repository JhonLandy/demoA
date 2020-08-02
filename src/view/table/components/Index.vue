<template>
    <div>
        <div class="frame">
            <div class="toolbar">
                <slot name="toolbarT"></slot>
            </div>
            <div class="pagination">
                <el-pagination
                    background
                    :current-page.sync="currentPage"
                    :page-size.sync="size"
                    :page-sizes="limitGroup"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="onSize"
                    @current-change="onCurrent"
                ></el-pagination>
            </div>
        </div>
        <el-table v-bind="$attrs" v-on="$listeners">
            <el-table-column
                v-if="checked"
                v-bind="checked.$attrs"
            >
                <template v-slot="scope">
                    <el-checkbox name="type" @change="checkSingle(scope)" :value="scope.row.checked"></el-checkbox>
                </template>
                <template v-slot:header>
                    <el-checkbox name="type" @change="checkAll" :value="isChecked"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                    v-for="{id, template, attrs, header, methods} in column"
                    :key="id"
                    v-bind="attrs"
            >
                <template v-slot="scope" v-if="template">
                    <ViteRender  v-on="methods" :template="template" :_data="scope" />
                </template>
                <template v-slot:header="scope" v-if="header">
                    <ViteRender  v-on="methods"  :_data="scope" :template="header"/>
                </template>
            </el-table-column>
        </el-table>
        <div class="frame">
            <div class="toolbar">
                <slot name="toolbarB"></slot>
            </div>
            <div class="pagination">
                <el-pagination
                    background
                    :current-page.sync="currentPage"
                    :page-size.sync="size"
                    :page-sizes="limitGroup"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="onSize"
                    @current-change="onCurrent"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
// import CreateDom from './CreateDom'
import ViteRender from './ViteRender'//函数式组件精简了很多东西，没有this，响应式数据，没有生命周期钩子函数，渲染性能提高不少，如果不需要生命周期或者做复杂的业务等（或者只是做简单的数据展示），它是一个非常好的选择;当然你需要清爽的页面也可以选择函数式组件；组件库如router-view就是这么做的
function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]'
}
export default {
    name: "Table",
    provide() {
        const provide = {}
        const provideData = this.provide
        if (!provideData) return provide
        for (const key in provideData) {
            if (isObject(provideData[key])) {
                provide[key] = Object.assign({}, provideData[key])
                provide[key] = Object.freeze(provide[key])//冻结参数，避免产生大量闭包
            } else {
                provide[key] = provideData[key]
            }
        }
        return Object.freeze(provide)
    },
    props: {
        provide: {
            default: ''
        },
        column: {
            type: Array,
            default: () => []
        },
        page: {
            type: Number,
            default: 0
        },
        limit: {
            type: Number,
            default: 0
        },
        limitGroup: {
            type: Array,
            default: () => [10, 20, 30, 50]
        },
        total: {
            type: Number,
            default: 0
        },
        pagination: {
            type: Function
        },
        checked: {
            default: ''
        }
    },
    data() {
        return {
            isChecked: ''
        }
    },
    computed: {
        size: {
            get() {
                return this.limit
            },
            set(val) {
                this.$emit('update:limit', val)
                this.pagination && this.pagination()

            }
        },
        currentPage: {
            get() {
                return this.page
            },
            set(val) {
                this.$emit('update:page', val)
                this.pagination && this.pagination()
            }
        }
    },
    methods: {
        onSize(val) {
            this.size = val
        },
        onCurrent(val) {
            this.currentPage = val
        },
        checkAll(value) {
            this.$attrs.data.forEach(item => {
                item.checked = this.isChecked = value
            })
        },
        checkSingle({row}) {
            row.checked = !row.checked
            if (!row.checked) {
                this.isChecked = false
            } else {
                this.isChecked = this.$attrs.data.every(item => item.checked)
            }
        }
    },
    components: {ViteRender}
}
</script>

<style lang="scss" scoped>
    .frame {
        display: flex;
        justify-content: space-between;
        padding: 15px 0;

    }
    .el-table {
        border: 1px solid rgb(223, 230, 236);
        border-radius: 4px;
    }
</style>
