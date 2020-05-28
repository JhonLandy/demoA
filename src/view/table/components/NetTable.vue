<template>
    <el-table :data="data">
        <el-table-column
            v-for="{type, label, width, prop, template} in column"
            :key="type"
            :type="type"
            :label="label"
            :width="width"
            :prop="prop"
        >
            <template  v-if="template" v-slot="scope">
               <create-dom :instance="$parent" :template="template" v-if="typeof template === 'string'"></create-dom>
               <create-dom :instance="$parent" :template="template(scope)" v-else></create-dom>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import CreateDom from './CreateDom'

    export default {
        name: "NetTable",
        props: {
            data: {
                type: Array,
                default: () => []
            },
            column: {
                type: Array,
                default: () => []
            }
        },
        components: {
            CreateDom
        }
    }
</script>

<style scoped>

</style>
