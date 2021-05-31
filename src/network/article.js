import { request } from '@/utils/request'

// 获取文章列表   (频道新闻推荐_V1.1)
export const getArticleList = params => {
  return request({
    url: '/app/v1_1/articles',
    params
  })
}
