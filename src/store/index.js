import Vue from 'vue'
import Vuex from 'vuex'
// 数据持久化 vuex存在本地(既能读取本地数据,也使数据变成了响应式数据)
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // 存放用户信息 token...
    userChannelsList: [] // 如果用户未登录 频道列表则存放至本地
  },
  mutations: {
    // 修改user信息  登录、退出登录
    setUser(state, data) {
      state.user = data
    },
    // 修改频道列表信息
    setChannleList(state, payload) {
      console.log(payload)
      state.userChannelsList = payload
    }
  },
  actions: {
  },
  modules: {
  },
  // 使用插件    数据持久化
  plugins: [createPersistedState()] // 会自动保存创建的状态。刷新还在
})
