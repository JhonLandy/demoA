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
                v-for="{id, label, width, prop, template} in column"
                :key="id"
                :label="label"
                :width="width"
                :prop="prop"
            >
                <template v-slot="scope" v-if="template">
                    <create-dom :instance="$parent"  :template="template" :data="scope"></create-dom>
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
            }
        }
    }
</script>

<style scoped>
    .frame {
        display: flex;
        justify-content: space-between;
        padding: 20px 0;
    }
</style>
