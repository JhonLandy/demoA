<template>
    <div class="frame">
        <div class="toolbar">
        </div>
        <div class="pagination">
            <el-pagination
                background
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Tool"
    }
</script>

<style scoped>
    .frame {
        display: flex;
        justify-content: space-between;
    }
</style>
