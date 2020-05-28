<template>
    <net-table :data="data" :column="column" :instance="instance"/>
</template>
<script>
     import NetTable from './components/NetTable'
     const Table = {
        name: 'tables',
        data() {
            return {
                column: [
                    {
                        type: 1,
                        label: '序号',
                        prop: 'order',
                        template:  `<el-button  type="primary">asasas</el-button>`
                    },
                    {
                        type: 2,
                        label: '姓名',
                        prop: 'name'
                    },
                    {
                        type: 3,
                        label: '性别',
                        prop: 'sex'
                    },
                    {
                        type: 4,
                        label: '住址',
                        prop: 'address'
                    }
                ],
                data: [
                    {
                        order: Date.now(),
                        name: '小明',
                        sex: '男',
                        address: '广州'
                    },
                    {
                        order: Date.now(),
                        name: '小红',
                        sex: '男',
                        address: '佛山'
                    },
                    {
                        order: Date.now(),
                        name: '小白',
                        sex: '男',
                        address: '深圳'
                    },
                    {
                        order: Date.now(),
                        name: '小空',
                        sex: '男',
                        address: '北京'
                    }
                ]
            }
        },
        components: {
            NetTable
        }
    }
    export default Table;
</script>
