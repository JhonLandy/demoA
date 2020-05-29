<template>
    <net-table :data="data" :column="column" :page.sync="page" :limit.sync="limit">
        <template v-slot:toolbarT>
            <el-button size="small" >刷新</el-button>
        </template>
        <template v-slot:toolbarB>
            <el-button size="small" @click="doDel">删除</el-button>
        </template>
    </net-table>
</template>
<script>
     import NetTable from './components/NetTable'
     const Table = {
        name: 'tables',
        data() {
            return {
                isAdmin: true,
                page: 1,
                limit: 10,
                column: [
                    {
                        id: 1,
                        label: '序号',
                        prop: 'order',
                        template: `
                             <el-tag type="warning" size="small">${Date.now()}</el-tag>
                        `
                    },

                    {
                        id: 2,
                        label: '申请人',
                        prop: 'name',
                        template: function (scope) {
                            //可以直接写字符串, 需要用到表格数据使用函数方式
                            return `
                                <div>
                                    ${scope.row.name}
                                    <el-tag type="success" size="small" v-if="isAdmin">当前登录的账号有管理员权限</el-tag>
                                </div>
                            `
                        }
                    },
                    {
                        id: 3,
                        label: 'ip地址',
                        prop: 'ip',
                        template: function (scope) {
                            //可以直接写字符串, 需要用到表格数据使用函数方式
                            return `
                                <div>
                                    ${scope.row.ip}
                                    <el-tag type="info" size="small">异常状态</el-tag>
                                </div>
                            `
                        }
                    },
                    {
                        id: 4,
                        label: '流程状态',
                        prop: 'status',
                        template: function (scope) {
                            //可以直接写字符串, 需要用到表格数据使用函数方式
                            return `
                                <div>
                                    <el-tag type="success" v-if="${scope.row.status === '1'}" size="small">通过</el-tag>
                                    <el-tag type="danger" v-else size="small">不通过</el-tag>
                                </div>
                            `
                        }
                    },
                    {
                        id: 5,
                        label: '操作',
                        prop: 'operation',
                        template: function (scope) {
                            //可以直接写字符串, 需要用到表格数据使用函数方式
                            return `
                                <div slot-scope="scope">
                                    <el-button type="success" @click="doRecover(data[${scope.$index}])" size="medium">启动</el-button>
                                    <el-button type="danger" @click="doDel" size="medium">删除</el-button>
                                </div>
                            `
                        }
                    }
                ],
                data: []
            }
        },
        created() {
            for (let i = 0;i < 100;i++) {
                this.data.push({
                    order: i,
                    name: "小明"+i,
                    ip: '192.168.'+(i +1),
                    status: Math.round(Math.random())
                })
            }
        },
        components: {
            NetTable
        },
        methods: {
            doDel() {
                this.$message({
                    message: '删除成功！',
                    type: 'error'
                })
            },
             doRecover(data) {
                data.status = 1//地址引用问题，可触发子组件table更新,一般情况可用，特殊情况不推荐
                this.$message({
                    message: '恢复成功！',
                    type: 'success'
                })
             }
         }
     }
    export default Table;
</script>
