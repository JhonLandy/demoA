<template>
    <div>
        <el-input
            v-if="type === 'input'"
            v-model="data"
            size="small"
        >
        </el-input>
        <el-radio-group
            v-if="type === 'radio'"
            v-model="data"
            size="small"
        >
            <el-radio
                v-for="radio in config.options"
                :key="radio.value"
                :label="radio[radio._data] || radio.value"
            >
                {{radio.label}}
            </el-radio>
        </el-radio-group>
        <el-radio-group
            v-if="type === 'radioButton'"
            v-model="data"
            size="small"
        >
            <el-radio-button
                v-for="radio in config.options"
                :key="radio.value"
                :label="radio[radio._data] || radio.value"
            >
                {{radio.label}}
            </el-radio-button>
        </el-radio-group>
        <el-checkbox-group
            v-if="type === 'checkBoxButton'"
            v-model="data"
            size="small"
        >
            <el-checkbox-button
                v-for="checkbox in config.options"
                :key="checkbox.value"
                :label="checkbox[checkbox._data] || checkbox.value"
            >
                {{checkbox.label}}
            </el-checkbox-button>
        </el-checkbox-group>
        <el-select
            v-if="type === 'select'"
            v-model="data"
            :multiple="typeof config.multiple === 'boolean' ? config.multiple : false"
            :loading="typeof config.loading === 'boolean' ? config.loading :false"
            :placeholder="config.placeholder || '请选择'"
            :filterable="typeof config.filterable === 'boolean' ? config.filterable :false"
            size="small"
        >
            <el-option
                v-for="option in config.options"
                :key="option.value"
                :label="option.label"
                :value="option[option._data] || option.value"
            >
                {{option.label}}
            </el-option>
        </el-select>
        <el-select
            v-if="type === 'selectGroup'"
            v-model="data"
            :multiple="typeof config.multiple === 'boolean' ? config.multiple : false"
            :loading="typeof config.loading === 'boolean' ? config.loading :false"
            :placeholder="config.placeholder || '请选择'"
            :filterable="typeof config.filterable === 'boolean' ? config.filterable :false"
            size="small"
        >
            <el-option-group
                v-for="group in config.options"
                :key="group.value"
                :label="group.label"
            >
                <el-option
                    v-for="option in group.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option[option._data] || option.value"
                >
                    {{option.label}}
                </el-option>
            </el-option-group>
        </el-select>
        <el-input-number
            v-if="type === 'inputNumber'"
            v-model="data"
            :min="config.min" :max="config.max"
            :label="config.label"
        >
        </el-input-number>
        <el-switch
            v-if="type === 'switch'"
            v-model="data"
        >
        </el-switch>
    </div>
</template>

<script>

export default  {
    name: "FormComponent",
    props: {
        type: {
            type: String,
            default: ''
        },
        config: {
            type: [String, Array, Object, Number],
            default: () => {}
        },
        value: {
            type: [String, Array, Object, Number]
        }

    },
    data() {
        return {
            data: this.value
        }
    },
    watch: {
        data: function (value) {
            this.$emit('input', value)
        }
    }
}
</script>
<style lang="scss" scoped>
    .el-form {
        padding: 10px;
        .el-form-item {
            .el-select {
                width: 100%;
            }
        }
    }
</style>

