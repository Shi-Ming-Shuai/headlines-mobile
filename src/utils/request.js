import axios from 'axios'

// 获取用户token  用户 请求拦截器 添加 Authorization 字段
import { getToken } from '@/utils/getToken'

// 处理后端返回数据超出 JS 安全整数范围问题
import jsonBig from 'json-bigint'
// 获取 ref_token 用户更新token
import store from '@/store'

// 响应拦截器 错误提示
import { Toast } from 'vant'
import router from '../router'

// 创建一个新的请求  避免在request 响应拦截中发送请求 出现死循环(防止一直401)
const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 导出自己封装的方法
export function request(config) {
  // 创建axios实例
  const instance = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn',
    timeout: 8000, // 超时时间(请求超过这个时间 直接报错)
    // 处理后端返回数据超出 JS 安全整数范围问题
    transformResponse: [function (data) {
      try {
        // 现在我们定制使用 json-bigint 来帮我们处理转换原始的 JSON 格式字符串
        // 这个方法类似于 JSON.parse，只不过它能把数据中的超出 JS 安全整数范围的数字给处理成正确的
        // 它内部有自己的算法，它会把大数字转为一个对象，我们在使用的时候把对象.toString() 就得到字符串形式的 id 了
        // 如果转换成功则返回成功的结果给请求使用
        // 如果转换失败则进入 catch，直接把数据原封不动的返回
        return jsonBig.parse(data)
        // 它默认是这样的
        // return JSON.parse(data)
      } catch (err) {
        // console.log('转换失败', err)
        // 直接把数据原封不动的返回
        return data
      }
    }]
  })
  // axios拦截器
  // 1.请求拦截
  instance.interceptors.request.use(config => {
    // 判断token是否存在 如果存在 携带在请求头 Authorization
    if (getToken()) {
      config.headers.Authorization = `Bearer ${getToken()}`
    } else {
      console.log('token不存在,请求头没有添加 Authorization 字段')
    }
    return config
  }, error => {
    console.log('请求拦截错误' + error)
  })

  // 2. 响应拦截
  instance.interceptors.response.use(resolve => {
    return resolve.data
  }, async error => {
    // 注意 响应拦截了 error 则代码中 try catch 就没法有效的拦截错误
    // error.config 是 失败的请求对象(重新发一次请求)
    // 重新发一次请求 request(error.config)
    // 根据状态法做不同的处理
    let statusCode = null
    if (error && error.response) {
      statusCode = error.response.status
    } else {
      Toast('请求超时,请重试')
    }
    switch (statusCode) {
      case 400:
        Toast('请求参数错误')
        break
      case 401:
        Toast('401 身份认证错误')
        // 判断是否登录   如果登录并且 ref token存在就更新token(重新发一次刚才的请求)
        if (store.state.user && store.state.user.token) {
          try {
            // 更新token 用户已经登录 并且有token (token过期情况)
            const { data } = await refreshTokenReq({
              url: '/app/v1_0/authorizations',
              method: 'put',
              headers: {
                Authorization: `Bearer ${store.state.user.refresh_token}`
              }
            })
            // 获取到最新token 更新到 vuex 容器中
            const newToken = data.data.token
            store.commit('setNewToken', newToken)
            // 最重要一步  将重新请求的结果 return出去(更新了token 以后 重新再次重新请求401错误的页面)
            return request(error.config)
          } catch (err) {
            // 更新token如果发送错误 ,直接让用户重新登录
            toLogin()
          }
        } else {
          // 用户未登录 跳转至登录页
          toLogin()
        }
        break
      case 403:
        Toast('您没有权限访问')
        break
      case 404:
        Toast('请求地址出错')
        break
      case 500:
        Toast('服务器内部错误')
        break
    }
  }
  )

  // 把实例传递出去
  return instance(config)
}
// 跳转至登录页  记录从哪个页面来的
function toLogin() {
  // 使用router.currentRoute获取当前路由信息 原因： request.js 无法使用 this.$route
  router.replace({
    path: '/login',
    query: {
      redirectRoute: router.currentRoute.fullPath
    }
  })
}
