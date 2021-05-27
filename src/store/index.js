import Vue from 'vue'
import Vuex from 'vuex'
// 数据持久化 vuex存在本地(既能读取本地数据,也使数据变成了响应式数据)
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {} // 存放用户信息 token...
  },
  mutations: {
    // 修改user信息  登录、退出登录
    setUser(state, data) {
      state.user = data
    }
  },
  actions: {
  },
  modules: {
  },
  // 使用插件    数据持久化
  plugins: [createPersistedState()] // 会自动保存创建的状态。刷新还在
})
