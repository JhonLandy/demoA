<template>
    <el-table-column
        type="index"
        label="序号"
        width="60"
    >
        <template>

        </template>
    </el-table-column>
</template>

<script>
    export default {
        name: "TableColumn",
        props: {
            prop: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: '60'
            },
            label: {
                type: String,
                default: ''
            }

        }
    }
</script>

<style scoped>

</style>
