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
    searchHistory: [], // 用户搜索记录 本地
    cacheRouter: [] // 要被缓存的一级路由
  },
  mutations: {
    // 修改user信息  登录、退出登录
    setUser(state, data) {
      state.user = data
      // 登录信息改变  清除缓存的一级路由(防止切换用户频道没改变)
      state.cacheRouter = []
    },
    setCacheRouters(state, data) {
      state.cacheRouter = data
    },
    // 更新token token过期 401错误触发
    setNewToken(state, newToken) {
      state.user.token = newToken
    },
    // 修改一级缓存路由
    addCacheRouter(state, router) {
      // 判断是否已经存在 如果没存在 才添加
      const isInclude = state.cacheRouter.indexOf(router)
      if (isInclude === -1) {
        // 不存在  添加到缓存路由列表
        state.cacheRouter.push(router)
      }
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
