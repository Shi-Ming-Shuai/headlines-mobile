/**
 * @用户相关请求
 */
import { request } from '@/utils/request'
// 登录接口
export const login = (data) => {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data
  })
}
// 发送验证码
export const SenCode = (mobile) => {
  return request({
    // 请求地址 http://ttapi.research.itcast.cn/app/v1_0/sms/codes/13400279713
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

//  获取当前已登录的 用户信息 头像 关注、粉丝...
// headers Authorization(必传) axios 请求拦截处理了
export const getUserInfo = () => {
  return request({
    url: '/app/v1_0/user'
  })
}
