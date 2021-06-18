import { request } from '@/utils/request'

// 获取联想建议（自动补全）  q: 请求的前缀词句
export const getSearchSuggests = q => {
  return request({
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 获取搜索结果
export const getSearchResults = params => {
  return request({
    url: '/app/v1_0/search',
    params
  })
}

// 获取用户搜索历史
export const getSearchHistory = () => {
  return request({
    url: '/app/v1_0/search/histories'
  })
}
