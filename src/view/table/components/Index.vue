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
                    <CreateDom  v-on="methods" :template="template" :_data="scope" />
                </template>
                <template v-slot:header="scope" v-if="header">
                    <CreateDom  v-on="methods"  :_data="scope" :template="header"/>
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
    import CreateDom from  './CreateDom'
    export default {
        name: "Table",
        provide() {
            return {
                ...this.$attrs.provide
            }
        },
        props: {
            column: {
                type: Array,
                default: () => []
            },
            page: {
                type: Number,
                default: 1
            },
            limit: {
                type: Number,
                default: 10
            },
            limitGroup: {
                type: Array,
                default: () => [10, 20, 30, 50]
            },
            total: {
                required: true,
                type: Number
            },
            pagination: {
                type: Function
            },
            checked: {
                type: Object,
                default: () => {
                    return {}
                }
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
        components: {
            CreateDom
        }
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
