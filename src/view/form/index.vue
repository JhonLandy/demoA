<template>
    <s-form :search-lists="searchItem" :option-link-map="optionLinkMap" @search="getInstanceList"></s-form>
</template>

<script>
    import SForm from "@/view/form/components/Sform"
    // import Input from "@/views/form/components/Input"
    // import Select from "@/views/form/components/Select"
    // import SelectOption from "@/views/form/components/SelectOption"
    
    // Vue.prototype.$bus = new Vue();

    // Vue.component('y-form', Form);
    // Vue.component('y-input', Input);
    // Vue.component('y-select', Select);
    // Vue.component('y-option', SelectOption);
    export default {
        name: 'formComponent',
        data() {
            return {
                searchItem: [
                    {
                        searchParam: 'project',
                        type: 'select',
                        label: '项目',
                        defaultShow: true,
                        multiple: true,
                        filterable: true,
                        loading: true,
                        remote: true,
                        options: 'project',
                        permission: () => {
                            return this.isAdmin
                        }
                    },
                    {
                        searchParam: 'dc_code',
                        type: 'selectGroup',
                        label: '区域',
                        multiple: true,
                        filterable: true,
                        loading: true,
                        options: 'area'
                    },
                    {
                        type: 'input',
                        label: '实例ID',
                        searchParam: 'id'
                    },
                    {
                        searchParam: 'use_case',
                        type: 'radioButton',
                        label: '用途',
                        options: [
                            {
                                value: '1',
                                label: '正式'
                            },
                            {
                                value: '2',
                                label: '测试'
                            }
                        ]
                    },
                    {
                        searchParam: 'status',
                        type: 'radioButton',
                        label: '状态',
                        options: [
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
                ],
                optionLinkMap: {
                    area: [],
                    project: []
                }
            }
        },
        components: {
            SForm
        },
        methods: {
            valid(isPass) {
                isPass && this.$message({
                    message: '保存成功',
                    type: 'success'
                });
            },
            getInstanceList() {

            }
        }
    }
</script>
<style scoped>
    .el-form {
        padding: 10px
    }
</style>