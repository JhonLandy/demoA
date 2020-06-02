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
                v-if="allowCheck"
                width="50"
                align="center"
            >
                <el-checkbox name="type"></el-checkbox>
                <template v-slot:header>
                    <el-checkbox name="type" @change="checkAll"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                v-for="{id, template, $attrs, header} in column"
                :key="id"
                v-bind="$attrs"
            >
                <template v-slot="scope" v-if="template">
                    <CreateDom :instance="$parent" :template="template" :data="scope" />
                </template>
                <template v-slot:header v-if="header">
                    <CreateDom :instance="$parent" :template="header"/>
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
    import CreateDom from './CreateDom'
    export default {
        name: "NetTable",
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
            allowCheck: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            size: {
                get() {
                    return this.limit
                },
                set(val) {
                    this.$emit('update:limit', val)
                }
            },
            currentPage: {
                get() {
                    return this.page
                },
                set(val) {
                    this.$emit('update:page', val)
                }
            }
        },
        components: {
            CreateDom
        },
        methods: {
            onSize(val) {
                this.size = val
            },
            onCurrent(val) {
                this.currentPage = val
            },
            checkAll(e) {
                this.$emit('update:column', this.column.map(item => {
                    item.check = e.target.value
                }))
            }
        },
        mounted() {
            console.log(this)
        }
    }
</script>

<style scoped>
    .frame {
        display: flex;
        justify-content: space-between;
        padding: 15px 0;
    }
</style>
