// 获取用户token   用户设置 axios 请求头携带

import store from '@/store'

export const getToken = () => {
  // 判断用户是否登录 并且 token存在
  if (store.state.user && store.state.user.token) {
    // 返回token
    return store.state.user.token
  } else {
    return null
  }
}
