<template>
  <div class="search-container3">
    <div v-show="tags.length" class="top">
      <div class="search-tag">
        <el-tag
            v-for="[k, {label, value}] in tags"
            :key="k"
            type="info"
            :disable-transitions="true"
            closable
            @close="tagClose(k)"
        >
          {{ label + "：" + value }}
        </el-tag>
      </div>
    </div>
    <el-form
        ref="form"
        :model="params"
        label-width="130px"
        label-position="left"
        @submit.native.prevent
    >
      <el-form-item
          v-if="isSearch"
          :prop="indistinctSearch.param"
      >
        <i slot="label" class="el-icon-search" style="font-size: 16px" />
        <el-input
            :ref="indistinctSearch.param"
            v-model.trim="params[indistinctSearch.param]"
            type="text"
            class="search-input"
            :placeholder="indistinctSearch.placeholder"
        />
      </el-form-item>
      <div v-show="show">
        <el-form-item
            v-for="item in list"
            v-show="item.defaultShow"
            :key="item.searchParam"
            :label="item.label"
            :prop="item.searchParam"
        >
          <el-input
              v-if="item.type === 'input'"
              v-show="item.defaultShow"
              :ref="item.searchParam"
              v-model.trim="params[item.searchParam]"
              class="normal-input"
              :placeholder="item.placeholder || '请输入'"
          />
          <el-radio-group
              v-if="item.options && item.type === 'radioButton'"
              v-show="item.defaultShow"
              v-model="params[item.searchParam]"
              size="small"
          >
            <el-radio-button
                v-for="radio in item.options"
                :key="radio.value"
                :label="radio"
                @click.native="toggleOption(radio, item.searchParam, $event)"
            >
              {{ radio.label }}
            </el-radio-button>
          </el-radio-group>
          <el-checkbox-group
              v-if="item.type === 'checkBoxButton'"
              v-show="item.defaultShow"
              v-model="params[item.searchParam]"
              size="small"
          >
            <el-checkbox-button
                v-for="checkBox in item.options"
                :key="checkBox.value"
                :label="checkBox"
            >
              {{ checkBox.label }}
            </el-checkbox-button>
          </el-checkbox-group>
          <el-select
              v-if="item.type === 'select'"
              v-show="item.defaultShow"
              v-model="params[item.searchParam]"
              :multiple="typeof item.multiple === 'boolean' ? item.multiple : false"
              :loading="typeof item.loading === 'boolean' ? item.loading :false"
              :placeholder="item.placeholder || '请选择'"
              :filterable="typeof item.filterable === 'boolean' ? item.filterable :true"
              :remote="item.remote"
              :remote-method="item.remoteMethod"
              value-key="value"
              @focus="item.focus && matchCallback(item.searchParam)('focus')"
              @change="item.change && matchCallback(item.searchParam)('change')"
          >
            <template slot="empty">
              <div style="padding: 10px 0;text-align: center;color:#ccc">
                <i class="el-icon-loading" />
                <span>加载中</span>
              </div>
            </template>
            <el-option
                v-for="option in (typeof item.options === 'object' ?
                                item.options : optionLinkMap[item.searchParam])"
                :key="option.value"
                :label="option.label"
                :value="option"
            >
              {{ option.label }}
            </el-option>
          </el-select>
          <el-select
              v-if="item.type === 'selectGroup'"
              v-show="item.defaultShow"
              v-model="params[item.searchParam]"
              :multiple="typeof item.multiple === 'boolean' ? item.multiple : false"
              :loading="typeof item.loading === 'boolean' ? item.loading :false"
              :placeholder="item.placeholder || '请选择'"
              :filterable="typeof item.filterable === 'boolean' ? item.filterable :false"
              :remote="item.remote"
              :remote-method="item.remoteMethod"
              value-key="value"
              @focus="item.focus && matchCallback(item.searchParam)('focus')"
              @change="item.change && matchCallback(item.searchParam)('change')"
          >
            <template slot="empty">
              <div style="padding: 10px 0;text-align: center;color:#ccc">
                <i class="el-icon-loading" />
                <span>加载中</span>
              </div>
            </template>
            <el-option-group
                v-for="group in (typeof item.options === 'object' ?
                                item.options : optionLinkMap[item.searchParam])"
                :key="group.value"
                :label="group.label"
            >
              <el-option
                  v-for="option in group.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option"
              >
                {{ option.label }}
              </el-option>
            </el-option-group>
          </el-select>
          <el-date-picker
              v-if="item.type === 'datePicker'"
              v-model="params[item.searchParam]"
              :type="item._type"
              placeholder="选择日期"
              :value-format="item.format"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="item.pickerOptions"
              class="start-end"
          />
        </el-form-item>
      </div>
      <div v-show="show" class="search-btns">
        <el-button size="mini" type="primary" circle icon="el-icon-plus" @click.stop="checkVisible = !checkVisible" />
        <el-button size="small" type="primary" @click="search">查询</el-button>
        <el-button size="small" @click="resetForm('form')">清空</el-button>
      </div>
      <div
          v-show="checkVisible"
          id="checkList"
          class="check-lists"
          @click.stop
      >
        <div class="title">
          <div class="cont">定制搜索条件:</div>
          <el-input
              v-model.trim="searchContent"
              class="check-input"
              placeholder="请输入查询条件"
              @input="fuzzySearch"
          />
        </div>
        <el-checkbox-group
            v-model="searchSelection"
        >
          <el-checkbox
              v-for="comp in searchArgs"
              :key="comp.searchParam"
              :label="comp"
              :disabled="comp.disabled"
              @change="doShow(comp)"
          >
            {{ comp.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-form>
    <div class="change-btn">
            <span class="words" @click="show = !show">
                <i :class="show ? 'el-icon-caret-top': 'el-icon-caret-bottom'" />
                <span>{{ show ? '隐藏搜索条件' : '展示搜索条件' }}</span>
            </span>
    </div>
  </div>
</template>
<script>
function isNull(value) {
  return !value ? true : (typeof value === 'object' && !Object.keys(value).length)
}
function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]'
}
function dataType(type) {
  switch (true) {
    case type === 'object':
      return {}
    case type === 'array':
      return []
    default:
      return ''
  }
}

function isPromise(p) {
  return typeof p === 'object' && typeof p.then === 'function' && typeof p.catch === 'function'
}
let isOnload = true
export default {
  name: 'Search3',
  props: {
    searchLists: {
      type: Array,
      default: () => []
    },
    indistinctSearch: {
      type: [Object],
      default: () => ({
        param: 'search',
        label: '模糊搜索',
        type: 'input',
        placeholder: '全局搜索'
      })
    },
    isSearch: {
      type: Boolean,
      default: false
    },
    defaultShow: {
      type: Boolean,
      default: true
    },
    service: {
      type: String,
      default: 'default_cache'
    }
  },
  data() {
    return {
      show: this.defaultShow,
      params: {},
      list: [],
      tags: [],
      searchArgs: [],
      searchSelection: [],
      searchContent: '',
      checkVisible: false,
      MapTagLinkParams: {},
      optionLinkMap: {},
      callbacksMap: {},
      callbacksQueue: [],
      cache: [],
      unEffectMap: {}
    }
  },
  watch: {
    callbacksQueue(Queue) { // 处理callbacks函数，异步函数
      if (Queue.length === 0) return// 防止死循环
      const query = this.$route.query
      for (const key of Queue) {
        if (key in this.optionLinkMap) continue// 如果之前请求了，使用缓存，不再次请求（此方法仅在第一次加载或切换定制搜索时执行）
        this.matchCallback(key)('async').then(() => {
          this.matchParamValue(query[key], key)
        })
      }
      this.callbacksQueue = []// callbacksQueue watcher 执行后将重新把wather放入队列
    }, // 要放在上面，因为$route 的handler放在callbacksQueue之前会阻塞callbacksQueue执行
    $route: {// 基于params变化执行
      handler({ query }) {
        if (isOnload) {
          this.init(this.searchLists, query)
          this.matchParamsWithQuery(query)
          this.$nextTick(() => {
            isOnload = false// 让它排队，不让刷新路由，再刷新路由有点多余，路由参数会有短暂的不正常
          })
        }
        this.$emit('search', query)
      },
      immediate: true
    }
  },
  beforeCreate() {
    this.$on('doRoute', this.$lodash.debounce((query) => { // 更新路由Emitter
      this.$router.push({ query })
    }, 500))
    this.$on('doSearch', this.$lodash.debounce((query) => { // 搜索Emitter
      this.$emit('doRoute', query)
      this.$emit('search', query)
      this.tagRender('_', true)// 强制刷新所有标签
    }, 500))
  },
  created() {
    if (this.service === 'default_cache') { console.warn('danger:service名称默认为default_cache，不同service的缓存可能会相互覆盖，请给组件传递Props：service') }
  },
  mounted() {
    document.addEventListener('click', this.hideOnClick)
  },
  beforeDestroy() {
    isOnload = true// 虽然组件被销毁，但是此属性内存依然未被浏览器回收，
    this.clearCache()
    for (const key in this.params) { // 去全部除副作用
      this.unEffect(key)
    }
    document.removeEventListener('click', this.hideOnClick)
  },
  methods: {
    matchParamValue(QueryValue, QueryKey) {
      if (!(QueryKey in this.params) || !QueryValue) return// 此queryString参数不在出现的组件中，跳过
      const { type, options, multiple } = this.MapTagLinkParams[QueryKey]
      switch (type) {
        case 'selectGroup': {
          const selectOptions = options || this.optionLinkMap[QueryKey]
          let i = 0
          const arr = QueryValue.split(',')
          const mapValue = {}
          const selected = []
          if (isNull(selectOptions)) {
            while (arr[i]) {
              selected.push(`loading${i + 1}...`)
              i++
            }
            if (multiple) {
              this.params[QueryKey] = selected
            } else {
              this.params[QueryKey] = selected[0].replace('1', '')
            }
            this.tagsChange(QueryKey)
            return
          } else {
            while (arr[i]) {
              mapValue[arr[i]] = true
              i++
            }
          }
          let j = 0
          if (multiple) {
            while (selectOptions[j]) {
              if (mapValue[selectOptions[j].value]) {
                selected.push(selectOptions[j])
              }
              j++
            }
            this.params[QueryKey] = selected
          } else {
            while (selectOptions[j]) {
              if (mapValue[selectOptions[j].value]) {
                this.params[QueryKey] = selectOptions[j]
                break
              }
              j++
            }
          }
          break
        }
        case 'select': {
          const selectOptions = options || this.optionLinkMap[QueryKey]
          let i = 0
          const arr = QueryValue.split(',')
          const mapValue = {}
          const selected = []
          if (isNull(selectOptions)) {
            while (arr[i]) {
              selected.push(`loading${i + 1}...`)
              i++
            }
            if (multiple) {
              this.params[QueryKey] = selected
            } else {
              this.params[QueryKey] = selected[0].replace('1', '')
            }
            this.tagsChange(QueryKey)
            return
          } else {
            while (arr[i]) {
              mapValue[arr[i]] = true
              i++
            }
          }
          let j = 0
          if (multiple) {
            while (selectOptions[j]) {
              if (mapValue[selectOptions[j].value]) {
                selected.push(selectOptions[j])
              }
              j++
            }
            this.params[QueryKey] = selected
          } else {
            while (selectOptions[j]) {
              if (mapValue[selectOptions[j].value]) {
                this.params[QueryKey] = selectOptions[j]
                break
              }
              j++
            }
          }
          break
        }
        case 'radioButton': {
          const selectOptions = options
          let i = 0
          let temp = selectOptions[i]
          while (temp) {
            if (temp.value === QueryValue) {
              this.params[QueryKey] = temp
              temp = undefined
            } else {
              temp = selectOptions[++i]
            }
          }
          break
        }
        case 'checkBoxButton': {
          const selectOptions = options
          let i = 0
          const arr = QueryValue.split(',')
          const mapValue = {}
          while (arr[i]) {
            mapValue[arr[i]] = true
            i++
          }

          let j = 0
          const selected = []
          while (selectOptions[j]) {
            if (mapValue[selectOptions[j].value]) {
              selected.push(selectOptions[j])
            }
            j++
          }
          this.params[QueryKey] = selected
          break
        }
        default: {
          this.params[QueryKey] = QueryValue
          break
        }
      }
      this.tagsChange(QueryKey)
    },
    matchParamsWithQuery(query) {
      for (const key in query) {
        this.matchParamValue(query[key], key)
      }
    },
    useEffect(config) {
      const { type, valueType, searchParam } = config
      if (config.callback) this.callbacksQueue.push(searchParam)// callback加入队列
      // 建立映射,一定要放在最顶部，很多方法都依赖它才能使用，比如下面的tagsChange
      this.MapTagLinkParams[searchParam] = config
      // 数据监听
      this.$set(this.params, searchParam, dataType(valueType))
      let unWatch
      if (type === 'input') {
        const updateData = e => {
          if (e.keyCode === 13) {
            this.updateData(searchParam)
          }
        }
        this.$nextTick(() => {
          const ref = this.$refs[searchParam][0] || this.$refs[searchParam]
          ref.$el.addEventListener('keydown', updateData)
          unWatch = () => {
            ref.$el.removeEventListener('keydown', updateData)
          }
        })
      } else {
        unWatch = this.$watch(`params.${searchParam}`, () => { // 手动watch一下。watch执行比created钩子函数早，动态参数params开始时值为空对象，初始化后需要重新收集依赖
          this.updateData(searchParam)
        }, {
          deep: true
        })
        // 把param 属性key 的订阅者watcher从params订阅管理者删除，以免调用this.$set方法时触发此处的watch（多次$watch,则调用多次），造成不必要的更新
        // 在开发者模式里，你可以尝试把v-show为false的e-input元素的display：none删除，然后在el-input输入数值，你会发现触发了更新
        this.params.__ob__.dep.subs.pop()
      }
      this.unEffectMap[searchParam] = () => {
        unWatch()
        this.clearValue(this.params, searchParam, true)
        this.tagsChange(searchParam)
      }
    },
    unEffect(key) {
      const unEffect = this.unEffectMap[key]
      if (unEffect) {
        unEffect()
        delete this.unEffectMap[key]
      }
    },
    initFuzzySearchParam() {
      if (this.isSearch) {
        const config = {
          label: this.indistinctSearch.label || (this.indistinctSearch.placeholder = '全局搜索'),
          searchParam: this.indistinctSearch.param || (this.indistinctSearch.param = 'search'),
          type: 'input',
          defaultShow: true,
          disabled: true
        }
        this.shouldShowComponent(config, this.initSearchArgs(config))
      }
    },
    initSearchArgs(config, query, cache) {
      const { searchParam } = config
      this.searchArgs.push(config) // 生成定制搜索项
      if (cache) {
        if (cache.includes(searchParam) ||
            !isNull(query) && query[searchParam]
        ) {
          this.searchSelection.push(config)// 选中定制搜索项
          return true
        } else {
          return false
        }
      } else {
        config.defaultShow && this.searchSelection.push(config)// 根据默认配置 是否选中定制搜索项
        return config.defaultShow
      }
    },
    collectCallbackToMap({ searchParam, callback }) {
      if (!callback) return
      this.callbacksMap[searchParam] = (...params) => callback(...params, key => (...params) => this.matchCallback(key)(...params), { ...this.params })
    },
    matchCallback(key) {
      return sign => {
        const p = this.callbacksMap[key](sign)
        if (isPromise(p)) {
          return p.then(data => {
            this.$set(this.optionLinkMap, key, Object.freeze(data))
          }, err => { new Error(err) })
        } else {
          return Promise.resolve(p)
        }
      }
    },
    shouldShowComponent(config, shouldShow) {
      if (config.defaultShow !== shouldShow) config.defaultShow = shouldShow// 设置组件是否要显示，状态不一致则需要重置状态
      if (!shouldShow) return // 不显示就没必要继续执行
      this.useEffect(config)// 添加参数改变时的回调函数,返回取消副作用
      this.cache.push(config.searchParam)// 收集初始缓存，没有缓存时将被用作缓存
    },
    init(list, query) {
      const cache = this.getCache()// 获取缓存
      this.initFuzzySearchParam()// 初始化模糊搜索
      this.list = list.filter(config => {
        const { permission } = config
        // 把标记权限验证的数据（如：身份不是管理员等）进行处理
        const isAllow = (permission
            ? (typeof permission === 'function'
                ? permission()
                : permission)
            : true)
        if (isAllow) {
          this.collectCallbackToMap(config)// 收集回调函数
          const shouldShow = this.initSearchArgs(config, query, cache)// 根据路由 和 缓存 初始化定制搜索 及状态
          this.shouldShowComponent(config, shouldShow)// 再次判断控制组件是否显示
        }
        return isAllow
      })
    },
    search() { // 搜索触发
      this.$emit('doSearch', this.dataTransform({ ...this.params }))
    },
    clearCache() {
      localStorage.removeItem(`${this.service}`, this.searchLists)
    },
    getCache() {
      const hasKey = localStorage.hasOwnProperty(`${this.service}`)
      const hasValue = localStorage.getItem(`${this.service}`)
      if (hasKey) {
        if (hasValue) {
          return localStorage.getItem(`${this.service}`).split(',')
        } else {
          return []
        }
      }
      return null
    },
    setCache(cache) {
      localStorage.setItem(`${this.service}`, cache.join(','))
    },
    resetForm() {
      this.$emit('doRoute', {})// 清空路由，并更新table
      this.clearValue(this.params)// 清空数据
      this.tagRender()
    },
    updateData(key) {
      if (!isOnload) { // 第一次刷新不需要刷新路由
        this.$emit('doRoute', this.dataTransform({ ...this.params }))// 有些组件会自动赋值(比如，el-select),会触发这里watch回调函数。
        this.tagsChange(key)
      }
    },
    tagRender(tags = [], forceRender = false) { // 标签渲染
      if (forceRender) {
        for (const key in this.params) {
          this.tagsChange(key)
        }
      } else {
        this.tags = tags
      }
    },
    tagsChange(key) { // 引用此方法的组件change事件触发标签渲染
      const { type, label, multiple } = this.MapTagLinkParams[key]
      const map = new Map(this.tags)
      const value = this.params[key]
      if (!(value instanceof Date) && isNull(value)) {
        map.delete(key)
        this.tagRender([...map])
        return
      }

      switch (type) {
        case 'selectGroup': {
          if (multiple) {
            const option = value.map(item => (isObject(item) ? item.label : item)).join('、')
            map.set(key, {
              label,
              value: option
            })
          } else {
            map.set(key, {
              label,
              value
            })
          }
          break
        }
        case 'select': {
          if (multiple) {
            const option = value.map(item => (isObject(item) ? item.label : item)).join('、')
            map.set(key, {
              label,
              value: option
            })
          } else {
            const option = isObject(value) ? value.label : value
            map.set(key, {
              label,
              value: option
            })
          }
          break
        }
        case 'checkBoxButton': {
          const option = value.map(item => item.label).join('、')
          map.set(key, {
            label,
            value: option
          })
          break
        }
        case 'radioButton': {
          map.set(key, {
            label,
            value: value.label
          })
          break
        }
        default: {
          map.set(key, { label, value })
        }
      }
      this.tagRender([...map])
    },
    toggleOption(ownValue, key, e) { // radioButton,checkButton再次点击取消选中
      const checkValue = this.params[key]
      if (isNull(checkValue)) {
        return
      }
      function action() {
        this.clearValue(this.params, key)
        this.tagsChange(key)
        e.preventDefault()// 这段代码只会让组件触发一次点击事件，默认是触发两次点击事件，两次事件的效果等于没触发点击事件的一样
      }
      ownValue.value === checkValue.value && action.call(this)
    },
    tagClose(key) { // 清除标签
      this.clearValue(this.params, key)// 改变params触发监听事件doRoute
      this.updateData(key)// params部分参数没有watch，这里在调用，确保路由一定更新
    },
    setValue(data) {
      const keys = Object.keys(data)
      let i = keys.length
      while (i--) {
        const key = keys[i]
        this.params[key] = data[key]
      }
    },
    clearValue(data, key, isDel) {
      if (isDel) {
        this.$delete(data, key)
        return
      }
      if (!key) {
        for (const key in data) {
          switch (true) {
            case Array.isArray(data[key]):
              data[key] = []
              break
            case isObject(data[key]):
              data[key] = {}
              break
            default:
              data[key] = ''
          }
        }
      } else {
        switch (true) {
          case Array.isArray(data[key]):
            data[key] = []
            break
          case isObject(data[key]):
            data[key] = {}
            break
          default:
            data[key] = ''
        }
      }
    },
    dataTransform(value) {
      const data = {}
      for (const key in value) {
        const temp = value[key]
        if (isNull(temp)) { // 去除空字段
          continue
        }
        if (value.hasOwnProperty(key)) {
          switch (true) {
            case Array.isArray(temp):
              data[key] = temp.map(item => {
                return (item[item._data] || item.value)
              }).join(',')
              break
            case isObject(temp):
              data[key] = temp[temp._data] || temp.value
              break
            default:
              data[key] = temp
          }
        }
      }
      return data
    },
    doShow(data) {
      const cache = this.getCache() || this.cache // 判断读缓存使用webStorge还是 默认显示的
      const isShow = data.defaultShow = !data.defaultShow
      const key = data.searchParam
      if (!isShow) {
        this.unEffect(key)
        const index = cache.indexOf(key)
        index > -1 && cache.splice(index, 1)
      } else {
        this.useEffect(data)
        cache.includes(key) || cache.push(key)
      }
      this.setCache(cache)
    },
    fuzzySearch() {
      this.searchArgs = this.list.filter(item => {
        return item.label.includes(this.searchContent)
      })
    },
    hideOnClick() {
      this.checkVisible = false
    }
  }

}
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.search-container3 {
  padding: $gap-md $gap-large;
  margin: $gap-md;
  margin-bottom: $gap-large;
  background-color: #fff;
  border-radius: $border-radius;
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
  /deep/.el-select,
  /deep/.el-cascader {
    width: 90%;
  }
  /deep/.normal-input input {
    width: 90%;
  }
  .search-input {
    /deep/.el-input__inner {
      border: 0px !important;
      border-bottom: 1px solid #c1c1c1 !important;
      border-radius: 0px !important;
      width: 90%;
    }
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
  /deep/ .el-select--medium {
    width: 90% !important;
  }
  .start-end {
    span {
      width: 25px !important;
    }
  }
}
.check-lists{
  margin-top: 45px;
  padding: 15px;
  position: absolute;
  margin-left: -23px;
  width: 760px;
  background: #FFFFFF;
  border:1px solid #c1c1c1;
  z-index: 999;
  border-radius: 5px;
  box-shadow: 6px 6px 4px #c1c1c1;
  /deep/.el-checkbox{
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
.title{
  color: #000000;
  height: 42px;
  padding-bottom: 5px;
  .cont {
    float: left;
    width: 120px;
    line-height: 40px;
    font-size: 16px;
  }
  .check-input {
    float: left;
    width: 80%;
    /deep/.el-input__inner {
      height: 36px;
      line-height: 30px;
      border: 0px!important;
      border-bottom: 1px solid #c1c1c1!important;
      border-radius: 0px!important;
    }
  }
}
</style>
