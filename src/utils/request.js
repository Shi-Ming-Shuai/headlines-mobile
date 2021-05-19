import axios from 'axios'

// 导出自己封装的方法
export function request(config) {
  // 创建axios实例
  const instance = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn',
    timeout: 5000
  })
  // axios拦截器
  // 1.请求拦截
  instance.interceptors.request.use(config => {
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
