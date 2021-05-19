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
