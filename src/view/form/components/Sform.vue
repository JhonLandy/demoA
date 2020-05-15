<template>
    <el-form
        ref="form"
        :model="felids"
    >

        <el-form-item
            v-for="(item, index) in list"
            :key="index"
            :label="item.label"
            :prop="item.name"
        >
            <el-input
                v-if="item.type === 'input'"
                v-model="felids[item.name]"
            />
            <el-radio-group
                v-if="item.options && item.type === 'radioButton'"
                v-model="felids[item.name]"
            >
                <el-radio-button
                    v-for="o in item.options"
                    :key="o.value"
                    :label="o.label"
                    :value="o.value"
                >
                    {{ o.label }}
                </el-radio-button>
            </el-radio-group>
            <el-checkbox-group
                v-if="item.type === 'checkBoxButton'"
                v-model="felids[item.name]"
            >
                <el-checkbox-button
                    v-for="o in item.options"
                    :key="o.value"
                    :label="o.label"
                    :value="o.value"
                >
                    {{ e.label }}
                </el-checkbox-button>
            </el-checkbox-group>
            <el-select
                v-if="(item.options || optionLinkMap) && item.type === 'select'"
                v-model="felids[item.name]"
                :multiple="typeof item.multiple === 'boolean' ? item.multiple : false"
                :loading="typeof item.loading === 'boolean' ? item.loading :false"
                :placeholder="item.placeholder || '请选择'"
                :filterable="typeof item.filterable === 'boolean' ? item.filterable :false"
            >
                <el-option
                    v-for="o in (typeof item.options === 'object' ?
                    item.options : optionLinkMap[item.options])"
                    :key="o.value"
                    :label="o.label"
                    :value="o"
                />
            </el-select>
            <el-select
                v-if="(item.options || optionLinkMap) && item.type === 'selectGroup'"
                v-model="felids[item.name]"
                :multiple="typeof item.multiple === 'boolean' ? item.multiple : false"
                :loading="typeof item.loading === 'boolean' ? item.loading :false"
                :placeholder="item.placeholder || '请选择'"
                :filterable="typeof item.filterable === 'boolean' ? item.filterable :false"
            >
                <el-option-group
                    v-for="o in (typeof item.options === 'object' ?
                    item.options : optionLinkMap[item.options])"
                    :key="o.value"
                    :label="o.label"
                >
                    <el-option
                        v-for="option in o.options"
                        :key="option.value"
                        :label="option.label"
                        :value="option"
                    />
                </el-option-group>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button  type="primary" @click="search">创建</el-button>
            <el-button  type="default" @click="resetForm('form')">取消</el-button>
        </el-form-item>
    </el-form>
</template>
<script>

    export default {
        name: 'Search3',
        props: {
            searchLists: {
                type: Array,
                default() {
                    return
                }
            },
            optionLinkMap: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                felids: {
                }
            }
        },
        created() {
            // 把标记权限验证的数据（如：身份不是管理员等）进行处理
            this.list = this.searchLists.filter(({ permission }) => {
                return (permission
                    ? (typeof permission === 'function'
                        ? permission() : permission)
                    : true)
            })
        },
        methods: {
            search(type) { // 搜索触发
                const params = {...this.params}
                if (type === 'fuzzySearch') {
                    const tempArr = {}
                    for (const {k} of params) {
                        tempArr[k] = this.params.fuzzySearch
                    }
                    this.$emit('search', tempArr)
                } else {
                    this.$emit('search', params)
                }
            },
            resetForm(formName) {
                if (formName) {
                    this.tags = []
                    this.$refs[formName].resetFields()
                }
            }
        }
    }
</script>
<style lang="scss">

    .search-container3 {

        .top {
            margin-bottom: 25px;
            border-bottom: 1px solid #c1c1c1;
            .search-tag {
                // text-align: center;

                .el-tag {
                    margin-right: 5px;
                    margin-bottom: 10px;
                }
            }
        }

        .is_show {
            height: 55px;
            overflow: hidden;
            margin-top: 10px;
        }
        .is_hidden {
            height: auto;
            margin-top: 10px;
        }
        .el-select,
        .el-cascader {
            width: 90%;
        }
        .all input {
            border: 0px !important;
            border-bottom: solid 1px #c1c1c1 !important;
            border-radius: 0 !important;
            width: 90%;
        }
        .search-input {
            width: 90%;
        }
        .search-btns {
            display: inline-block;
            position: absolute;
            // top: 10px;
            left: 40px;
            text-align: left;
            // margin-left: -40px;
            z-index: 100;
        }
        .change-btn {
            width: 100%;
            line-height: 44px;
            box-sizing: border-box;
            background-color: #fff;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            text-align: center;
            margin-top: 2px;
            color: #d3dce6;
            cursor: pointer;
            position: relative;
            .words  {
                color: #4091ff;
                font-size: 13px;
                transition: 0.3s;
            }
            .words:hover {
                font-size: 16px
            }
        }

        .check-lists{
            margin-top: 45px;
            // margin-left: -20px;
            padding: 15px;
            position: absolute;
            margin-left: -23px;
            width: 760px;
            background: #FFFFFF;
            border:1px solid #c1c1c1;
            z-index: 999;
            border-radius: 5px;
            box-shadow: 6px 6px 4px #c1c1c1;
            .title{
                color: #000000;
                font-size: 12px;
                line-height: 14px;
                border-bottom: 1px solid #bbb5b5;
                padding-bottom: 5px;
            }
            .el-checkbox{
                width: 150px;
                line-height: 50px;
            }
        }
        .check-lists:after {
            display: block;
            content: '';
            border-width: 8px 8px 8px 8px;
            border-style: solid;
            border-color: transparent transparent #c1c1c1 transparent;
            position: absolute;
            left: 3.5%;
            top: -16px;
        }
        .el-select--medium {
            width: 90% !important;
        }
        .start-end {
            span {
                width: 25px !important;
            }
        }
    }
</style>
