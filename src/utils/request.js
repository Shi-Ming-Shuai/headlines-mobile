import axios from 'axios'

// 获取用户token  用户 请求拦截器 添加 Authorization 字段
import { getToken } from '@/utils/getToken'

// 处理后端返回数据超出 JS 安全整数范围问题
import jsonBig from 'json-bigint'

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
    console.log('错误' + error)
  })
  // 2. 响应拦截
  instance.interceptors.response.use(resolve => {
    return resolve.data
  }
    // , error => {
    //   // 注意 响应拦截了 error 则代码中 try catch 就没法有效的拦截错误
    //   console.log('失败' + error)
    // }
  )

  // 把实例传递出去
  return instance(config)
}
