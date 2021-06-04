// 频道列表
import { request } from '@/utils/request'

// 获取全部频道列表
export const getAllChannels = () => {
  return request({
    url: '/app/v1_0/channels'
  })
}

// 批量修改用户频道列表（部分覆盖）
export const editChannelList = data => {
  return request({
    url: '/app/v1_0/user/channels',
    method: 'patch',
    data
  })
}

// 删除指定用户频道
export const deleteChannel = channelId => {
  return request({
    url: `/app/v1_0/user/channels/${channelId}`,
    method: 'delete'
  })
}
