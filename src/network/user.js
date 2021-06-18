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

// 获取用户 频道列表
export const getChannels = () => {
  return request({
    url: '/app/v1_0/user/channels'
  })
}

// 关注用户  userId:关注目标（被关注的用户id）
export const addFollow = userId => {
  return request({
    url: '/app/v1_0/user/followings',
    method: 'POST',
    data: {
      target: userId
    }
  })
}

// 取消关注用户  userId:目标用户（被取消关注的用户id）
export const cancelFollow = userId => {
  return request({
    url: `/app/v1_0/user/followings/${userId}`,
    method: 'DELETE'
  })
}

// 获取用户个人资料(用于编辑资料)
export const getUserProfile = () => {
  return request({
    url: '/app/v1_0/user/profile'
  })
}
