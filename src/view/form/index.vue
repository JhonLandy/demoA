<template>
    <div>
        <net-form name="form" :elements="components" :rules="rules"  @valid="valid">

        </net-form>
    </div>
</template>

<script>
    import NetForm from "./components/NetForm"

    export default {
        name: 'formComponent',
        data() {
            return {
                components: [
                    {
                        field: {
                            name: 'project',
                            type: 'string'
                        },
                        element: 'el-select',
                        label: '项目',
                        attrs: {
                            defaultShow: true,
                            multiple: true,
                            filterable: true,
                        },
                        options: {
                            element: 'el-option',
                            data:[
                                {
                                    label: '大湾区',
                                    value: '0'
                                },
                                {
                                    label: '海珠区',
                                    value: 1
                                }
                            ]
                        },
                        permission: () => {
                            return true
                        }
                    },
                    {

                        field: {
                            name: 'dc_code',
                            type: 'array'
                        },
                        element: 'el-select',
                        label: '区域',
                        attrs: {
                            multiple: true
                        },
                        options: {
                            element: 'el-option-group',
                            data: [
                                {

                                    label: '广东',
                                    options: {
                                        element: 'el-option',
                                        data: [

                                            {
                                                label: 'guangdong',
                                                value: '0',
                                            }
                                        ]
                                    }
                                },
                                {
                                    label: '北京',
                                    options: {
                                        element: 'el-option',
                                        data: [

                                            {
                                                label: 'beijing',
                                                value: '1',
                                            }
                                        ],

                                    }
                                }
                            ]
                        }
                    },
                    {
                        field: {
                            name: 'id',
                            type: 'string'
                        },
                        element: 'el-input',
                        label: '实例ID',
                        controlled: 'isOpen'
                    },
                    {
                        field: {
                            name: 'isOpen',
                            type: 'string'
                        },
                        element: 'el-switch',
                        label: '开关',
                        attrs: {
                            checked: false
                        }
                    },
                    {
                        field: {
                            name: 'use_case',
                            type: 'string'
                        },
                        element: 'el-radio-group',
                        label: '用途',
                        options: {
                            element: 'el-radio-button',
                            data: [
                                {
                                    value: '1',
                                    label: '正式'
                                },
                                {
                                    value: '2',
                                    label: '测试'
                                }
                            ]
                        }
                    },
                    {
                        field: {
                            name: 'status',
                            type: 'string'
                        },
                        element: 'el-radio-group',
                        label: '状态',
                        controlled: '!isOpen',
                        options: {
                            element: 'el-radio-button',
                            data: [
                                {
                                    value: '3',
                                    label: 'RUNNING'
                                },
                                {
                                    value: '4',
                                    label: 'PENDING'
                                }
                            ]
                        }
                    }
                ],
                rules: {
                    project: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    dc_code: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                    id: [
                        {required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    use_case: [
                        {  required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    status: [
                        { required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                    ]
                }
            }
        },
        components: {
            NetForm
        },
        methods: {
            valid({isPass, fields}) {
                isPass && this.$message({
                    message: '保存成功',
                    type: 'success'
                });
                console.log(fields);
            }
        }
    }
</script>
<style>
    div, input, select {
        margin: 0;
        padding: 0;
    }
</style>

