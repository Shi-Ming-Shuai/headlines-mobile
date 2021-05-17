import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 移动端适配 lib-flexble + postcss-pxtorem
import 'amfe-flexible'

// 全局样式
import '@/assets/css/global.less'

// Vant 组件库
import { Button } from 'vant'
Vue.use(Button)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
