import { request } from '@/utils/request'

// 获取文章列表   (频道新闻推荐_V1.1)
export const getArticleList = params => {
  return request({
    url: '/app/v1_1/articles',
    params
  })
}

// 获取文章详情   因为文章id 超出了 js安全整数
// 使用 json-bigint 将后端返回数据处理一下才能正确使用
export const getArticleDetail = articleId => {
  return request({
    url: `/app/v1_0/articles/${articleId}`
  })
}

// 收藏文章 articleId: 收藏的文章id
export const addCollection = articleId => {
  return request({
    url: '/app/v1_0/article/collections',
    method: 'post',
    data: {
      target: articleId
    }
  })
}

// 取消收藏文章 articleId: 收藏的文章id
export const cancelCollection = articleId => {
  return request({
    url: `/app/v1_0/article/collections/${articleId}`,
    method: 'delete'
  })
}

// 点赞改文章 articleId: 文章id
export const addLike = articleId => {
  return request({
    url: '/app/v1_0/article/likings',
    method: 'post',
    data: {
      target: articleId
    }
  })
}

// 取消点赞改文章 articleId: 文章id
export const cancelLike = articleId => {
  return request({
    url: `/app/v1_0/article/likings/${articleId}`,
    method: 'delete'
  })
}

// 获取评论或评论回复
export const getComment = params => {
  return request({
    url: '/app/v1_0/comments',
    params
  })
}

// 对评论或评论回复点赞 target:点赞的评论id
export const addLikings = commentId => {
  return request({
    url: '/app/v1_0/comment/likings',
    method: 'post',
    data: {
      target: commentId
    }
  })
}

// 取消对评论或评论回复点赞
export const cancelLikings = commentId => {
  return request({
    url: `/app/v1_0/comment/likings/${commentId}`,
    method: 'delete'
  })
}

// 添加评论或评论回复
export const addComment = data => {
  return request({
    url: '/app/v1_0/comments',
    method: 'post',
    data
  })
}
