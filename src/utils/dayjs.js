/**
 * 使用全局过滤器 来处理需要转化的相对时间
 */
import Vue from 'vue'

// 时间处理插件  大小只有2kb   moment 大小为16kb
import dayjs from 'dayjs'

// 导入相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'

// 导入中文语言包 国际化(返回的时间是中文) 例如 :31 years ago 则变成 31年前
import 'dayjs/locale/zh-cn'

// 配置使用 相对时间插件  配置使用中文语言包
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 处理相对时间
Vue.filter('relativeTime', value => {
  // to 到的时间 相对于现在 是什么时候
  return dayjs().to(dayjs(value))
})
