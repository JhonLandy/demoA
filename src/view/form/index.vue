<template>
    <net-form ref="from" name="form" :elements="components">
      <template v-slot:button="{handleSubmit}">
        <el-button @click="valid(handleSubmit)">提交</el-button>
      </template>
    </net-form>
</template>

<script>
import NetForm, { freeze } from "./index"
export default {
  name: 'formComponent',
  data() {
    const project =  {
        field: {
            name: 'project',
            type: 'string'
        },
        formItem: {
            label: '项目',
            rules: [
              {required: true, message: '请输入活动名称', trigger: 'blur'},
              {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
            ]
        },
        element: ['el-select', 'el-option'],
        attrs: [{multiple: true, filterable: true}],
        options: [
            {attrs: { label: '大湾区', value: 0 }},
            {attrs: { label: '海珠区', value: 1 }},
        ],
        permission: () => {
            return true
        }
    }
    const id =  {
        field: {name: 'id', type: 'string'},
        formItem: {label: '实例ID'},
        element: 'el-input',
        controlled: 'isOpen'
    }
    const isOpen = {
        field: {
            name: 'isOpen',
            type: 'string'
        },
        element: 'el-switch',
        formItem: { label: '开关'},
        methods: {
            change: () => {
              console.log(this)
            }
        }
    }
    const dc_code =  {
      formItem: {
          label: '区域',
          rules: {required: true, message: '请选择活动区域', trigger: 'change'}
      },
      field: {
          name: 'dc_code',
          type: 'array'
      },
      element: ['el-select', 'el-option-group', 'el-option'],
      attrs: [{multiple: true, filterable: true}],
      methods: [],
      options: [
        {
          attrs:{label: '广东'},
          options:[{attrs: {
              label: 'guangdong',
              value: '0'
            }}]
        },
        {
          attrs:{label: '北京'},
          options:[{
            attrs: {
              label: 'beijing',
              value: '1'
            }
          }]
        }
      ]
    }
    const use_case = {
      element: ['el-radio-group','el-radio-button'],
      field: {
        name: 'use_case',
        type: 'string'
      },
      methods: [{
        change: () => {
          console.log('开光')
        }
      }, {
        change: () => {
          console.log('开光')
        }
      }],
      formItem: {
        label: '用途',
        rules: {required: true, message: '请选择时间', trigger: 'change'}
      },
      options: [{
        attrs: {
            value: '1',
            label: '正式'
        }},
        {attrs: {
            value: '2',
            label: '测试'
      }}]
    }
    const status =  {
      field: {
          name: 'status',
          type: 'string'
      },
      formItem: {
          label: '状态',
          rules: {required: true, message: '请至少选择一个活动性质', trigger: 'change'}
      },
      element: ['el-radio-group', 'el-radio-button'],
      controlled: 'isOpen',
      options: [{
        attrs: {
            value: '3',
            label: 'RUNNING'
          }},
        {attrs: {
            value: '4',
            label: 'PENDING'
      }}]
    }
    return {
      components: freeze([project, dc_code, id, isOpen, use_case, status]),
    }
  },

  components: {
      NetForm
  },

  methods: {
      valid(handleSubmit) {
        const [isPass, fields] = handleSubmit()
        console.log(isPass, fields)
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

