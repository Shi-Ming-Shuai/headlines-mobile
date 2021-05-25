import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 移动端适配 lib-flexble + postcss-pxtorem
import 'amfe-flexible'

// 全局样式
import '@/assets/css/global.less'

// Vant 组件库
import { Button, Icon, Tabbar, TabbarItem, NavBar, Field, Toast, Form, CountDown, Cell, CellGroup, Image as VanImage, Grid, GridItem } from 'vant'
Vue.use(Button).use(Icon).use(Tabbar)
  .use(TabbarItem).use(NavBar).use(Field).use(Toast).use(Form)
  .use(CountDown).use(Cell).use(CellGroup).use(VanImage)
  .use(Grid).use(GridItem)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
