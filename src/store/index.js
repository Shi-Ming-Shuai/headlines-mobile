import Vue from 'vue'
import Vuex from 'vuex'
// 数据持久化 vuex存在本地(既能读取本地数据,也使数据变成了响应式数据)
import createPersistedState from 'vuex-persistedstate'
// 对本地存储的数据进行加密   配置加密 等级 默认bs64 没压缩
// import SecureLS from 'secure-ls'
// const ls = new SecureLS({ isCompression: false })

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // 存放本地用户信息 token...
    userChannelsList: [], // 如果用户未登录 频道列表则存放至本地
    searchHistory: [] // 用户搜索记录 本地
  },
  mutations: {
    // 修改user信息  登录、退出登录
    setUser(state, data) {
      state.user = data
    },
    // 修改频道列表信息
    setChannleList(state, payload) {
      state.userChannelsList = payload
    },
    // 修改搜索历史
    setSearchHistory(state, data) {
      state.searchHistory = data
    }
  },
  actions: {
  },
  modules: {
  },
  // 使用插件    数据持久化  加密数据
  // plugins: [createPersistedState(
  //   {
  //     storage: {
  //       getItem: (key) => ls.get(key),
  //       setItem: (key, value) => ls.set('vuex', value),
  //       removeItem: (key) => ls.remove(key)
  //     }
  //   })] // 会自动保存创建的状态。刷新还在
  plugins: [createPersistedState()] // 会自动保存创建的状态。刷新还在

})
