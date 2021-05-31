import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 移动端适配 lib-flexble + postcss-pxtorem
import 'amfe-flexible'

// 全局样式
import '@/assets/css/global.less'

// 时间处理插件（全局过滤器 relativeTime 在这里注册）
import '@/utils/dayjs'

// Vant 组件库
import { Button, Lazyload, PullRefresh, List, Tab, Tabs, Dialog, Icon, Tabbar, TabbarItem, NavBar, Field, Toast, Form, CountDown, Cell, CellGroup, Image as VanImage, Grid, GridItem } from 'vant'
Vue.use(Button).use(Icon).use(Tabbar).use(PullRefresh).use(Lazyload)
  .use(TabbarItem).use(NavBar).use(Field).use(Toast).use(Form)
  .use(CountDown).use(Cell).use(CellGroup).use(VanImage)
  .use(Grid).use(GridItem).use(Dialog).use(Tab).use(Tabs)
  .use(List)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
