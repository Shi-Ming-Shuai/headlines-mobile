<template>
  <!-- 文章详情 -->
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    >
      <template #right>
        <van-icon name="ellipsis" />
      </template>
    </van-nav-bar>
    <!-- 文章 -->
    <div class="article">
      <!-- 文章标题 -->
      <h1 class="article-title">{{ articleDetail.title }}</h1>
      <!-- 文章作者 发布时间 -->
      <div class="article-author">
        <van-cell center>
          <!-- 作者头像 -->
          <template #icon>
            <div>
              <van-image
                class="avatar"
                fit="cover"
                round
                :src="articleDetail.aut_photo"
              ></van-image>
            </div>
          </template>
          <!-- 作者名称 -->
          <template #title>
            <div>
              <span class="title">{{ articleDetail.aut_name }}</span>
            </div>
          </template>
          <!-- 发布时间 -->
          <template #label>
            <div>
              <span class="pubdate">{{ articleDetail.pubdate }}</span>
            </div>
          </template>
          <!-- 关注按钮 -->
          <van-button
            class="follow"
            round
            size="small"
            :loading="isShowFollowLoading"
            :class="{ 'follow-true': articleDetail.is_followed }"
            :icon="articleDetail.is_followed ? '' : 'plus'"
            @click="onFollow"
            >{{ articleDetail.is_followed ? '已关注' : '关注' }}</van-button
          >
        </van-cell>
      </div>
      <!-- 文章内容  DOM操作 要使用 nextTick -->
      <div
        ref="article-content"
        class="article-content markdown-body"
        v-html="articleDetail.content"
      ></div>
      <!-- 全部评论 列表 -->
      <CommentList
        v-if="articleDetail.art_id"
        :source="articleDetail.art_id"
        @total-count="total_count = $event"
        @reply-click="replyClick"
        :list="list"
      />
      <!-- 底部 写评论  功能区域(收藏、点赞...) -->
      <div class="article-comment">
        <!-- 写评论 -->
        <van-button
          class="write-comment"
          round
          size="small"
          @click="showPostCommentPopup = true"
          >写评论</van-button
        >
        <!-- 功能按键 -->
        <!-- 点赞 -->
        <van-icon
          class="dianzan"
          :color="articleDetail.attitude === 1 ? 'yellow' : '#777'"
          :name="articleDetail.attitude === 1 ? 'good-job' : 'good-job-o'"
          @click="onLike"
        />
        <!-- 评论 -->
        <van-icon :badge="total_count" class="pinglun" name="comment-o" />
        <!-- 收藏 -->
        <van-icon
          class="shoucang"
          :color="articleDetail.is_collected ? 'yellow' : ''"
          :name="articleDetail.is_collected ? 'star' : 'star-o'"
          @click="onCollection"
        />
        <!-- 分享 (前端做不了 需要配合原生) -->
        <van-icon class="fenxiang" name="share-o" />
      </div>
      <!-- 发布评论弹出层 -->
      <van-popup v-model="showPostCommentPopup" position="bottom">
        <PostComment @post-comment="postComment" :acticleId="acticleId" />
      </van-popup>
      <!-- 回复评论(指定评论项) -->
      <van-popup v-model="showReplyCommentPopup" position="bottom">
        <replyComment
          v-if="showReplyCommentPopup"
          @close-reply-popup="showReplyCommentPopup = false"
          :replyCommentItem="replyCommentItem"
          :acticleId="acticleId"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
// 组件
import CommentList from './CommentList'
import PostComment from './PostComment.vue'
import replyComment from './replyComment.vue'
// 请求
import { addFollow, cancelFollow } from '@/network/user'
import {
  getArticleDetail,
  addCollection,
  cancelCollection,
  addLike,
  cancelLike
} from '@/network/article'

// 图片预览
import { ImagePreview } from 'vant'

export default {
  name: 'ArticleDetail',
  data() {
    return {
      articleDetail: {}, // 文章详情 数据
      isShowFollowLoading: false, // 关注的时候 按钮为不可点击状态
      showPostCommentPopup: false, // 是否显示发布评论弹出层
      showReplyCommentPopup: false, // 是否显示回复评论弹出层
      list: [], // 评论列表
      total_count: 0, // 一共有多少条评论
      replyCommentItem: {} // 回复评论项
    }
  },
  props: ['acticleId'],
  components: { CommentList, PostComment, replyComment },
  created() {
    // json-bigint处理大整数问题 使用 toString来得到真正的内容
    this.getArticleDetail(this.acticleId.toString())

    // 点击内容中的图片 展示图片预览效果
    // 问题： 此时 DOM 还没有渲染   获取不到
    // 原因： 数据改变影响视图更新 (DOM数据) 不是立即的
    // 解决： 如果需要在修改数据之后 马上操作被该数据影响的 DOM，需要把 代码逻辑 放到 $nextTick 中
  },
  methods: {
    // 子父通信 提交评论信息 成功
    postComment(newObj) {
      // 关闭弹出层
      this.showPostCommentPopup = false
      // 评论列表头部添加新的评论信息(子组件列表)
      // 评论总数 + 1
      this.total_count++
      // 子组件 list 头部添加新的评论
      this.list.unshift(newObj)
    },
    // 祖孙通信  评论项 回复按钮被点击
    replyClick(commentItem) {
      // 显示回复评论弹出层
      this.showReplyCommentPopup = true
      // 记录回复评论项 (向子组件传递)
      this.replyCommentItem = commentItem
    },
    // 点击关注按钮  关注/取消关注
    async onFollow() {
      // 显示button为加载状态  禁用不能点击(用户点击过快 发送多次请求)
      this.isShowFollowLoading = true
      // 修改关注状态 判断当前用户是否已经关注
      if (this.articleDetail.is_followed) {
        // 取消关注
        await cancelFollow(this.articleDetail.aut_id)
      } else {
        // 关注用户
        await addFollow(this.articleDetail.aut_id)
      }
      // 取消关注按钮加载状态
      this.isShowFollowLoading = false
      // 更新关注状态(数据改变影响视图更新)
      this.articleDetail.is_followed = !this.articleDetail.is_followed
    },
    // 点击收藏按钮  收藏/取消收藏
    async onCollection() {
      // 显示button为加载状态  禁用不能点击(用户点击过快 发送多次请求)
      // this.isShowFollowLoading = true
      // 提示加载信息  禁止背景点击
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 不关闭则一直展示
      })
      try {
        // 修改收藏状态 判断当前用户是否已经收藏
        if (this.articleDetail.is_collected) {
          // 取消收藏
          await cancelCollection(this.acticleId)
        } else {
          // 收藏用户
          await addCollection(this.acticleId)
        }

        // 更新收藏状态(数据改变影响视图更新)
        this.articleDetail.is_collected = !this.articleDetail.is_collected
        // 关闭提示信息
        this.$toast.success(
          `${this.articleDetail.is_collected ? '' : '取消'}收藏成功`
        )
      } catch (err) {
        // 失败提示信息
        this.$toast.fail(
          `${this.articleDetail.is_collected ? '取消' : ''}收藏失败,请检查网络`
        )
      }
    },
    // 点击点赞按钮  点赞/取消点赞
    async onLike() {
      // 显示button为加载状态  禁用不能点击(用户点击过快 发送多次请求)
      // this.isShowFollowLoading = true
      // 提示加载信息  禁止背景点击
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 不关闭则一直展示
      })
      try {
        // 修改点赞状态 判断当前用户是否已经点赞
        if (this.articleDetail.attitude === 1) {
          // 取消点赞
          await cancelLike(this.acticleId)
          // 更新点赞状态(数据改变影响视图更新) 用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞
          this.articleDetail.attitude = -1
        } else {
          // 点赞用户
          await addLike(this.acticleId)
          // 更新点赞状态(数据改变影响视图更新) 用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞
          this.articleDetail.attitude = 1
        }

        // 关闭提示信息
        this.$toast.success(
          `${this.articleDetail.attitude === 1 ? '' : '取消'}点赞成功`
        )
      } catch (err) {
        // 失败提示信息
        this.$toast.fail(
          `${
            this.articleDetail.attitude === 1 ? '取消' : ''
          }点赞失败,请检查网络`
        )
      }
    },
    // 图片预览 nextTick 调用
    imgsPreview() {
      // 存放所有的 图片 src 路径(用于图片预览)
      const imgSrcs = []
      // 获取 文章内容 DOM 操作DOM
      const articleContent = this.$refs['article-content']
      // 获取文章内容下的所有 图片
      const imgs = articleContent.querySelectorAll('img')
      // 遍历 img 标签 给每一个img 都添加点击事件
      imgs.forEach((item, i) => {
        // 向imgSrcs中添加图片路径
        imgSrcs.push(item.src)
        // 给每个img标签都注册点击事件
        item.onclick = () => {
          // 调用图片预览方法 传入图片路径数组
          ImagePreview({
            images: imgSrcs,
            startPosition: i // 展示指定位置 的 图片
          })
        }
      })
    },
    // 请求文章详情
    async getArticleDetail(acticleId) {
      const { data } = await getArticleDetail(acticleId)
      this.articleDetail = data
      // 点击内容中的图片 展示图片预览效果
      // 问题： 此时 DOM 还没有渲染   获取不到
      // 原因： 数据改变影响视图更新 (DOM数据) 不是立即的
      // 解决： 如果需要在修改数据之后 马上操作被该数据影响的 DOM，需要把 代码逻辑 放到 $nextTick 中

      this.$nextTick(() => {
        // 点击内容中的图片 展示图片预览效果
        /**
         * 因为是通过 v-html渲染的   无法在template模板中使用@Click
         * 操作DOM  获取列表的DOM
         * 获取指定 DOM中 所有的 img标签   将img标签上的src属性存放到数组中(用于图片预览)
         * 循环给每一个img标签添加点击事件
         */
        this.imgsPreview()
      })
    }
  }
}
</script>

<style lang="less" scoped>
// import '@/assets/css/github-markdown-css.css'
@import url('~@/assets/css/github-markdown-css.css');

.nav-bar .van-icon {
  color: #fff;
}
// 文章
.article {
  min-height: calc(100vh - 46px);
  background-color: #fff;
  &-title {
    padding: 25px 15px 0;
    font-size: 20px;
    color: #3a3a3a;
  }
  // 作者 发布时间
  &-author {
    .van-cell {
      padding: 20px 15px;
      /deep/ .van-cell__label {
        margin-top: 0;
      }
    }
    .avatar {
      margin-right: 8px;
      width: 35px;
      height: 35px;
    }
    .title {
      font-size: 12px;
      color: #333333;
    }
    .pubdate {
      font-size: 11px;
      color: #b4b4b4;
    }
    .follow {
      width: 85px;
      height: 30px;
      background-color: #3296fa;
      color: #ffffff;
    }
    // 已关注状态
    .follow-true {
      background-color: #fff;
      color: #000;
    }
  }
  // 文章内容
  &-content {
    padding: 20px 15px;
  }
  // 底部评论 收藏功能区域
  &-comment {
    display: flex;
    align-items: center;
    padding: 0 15px;
    height: 42px;
    border-top: 1px solid #d8d8d8;
    .write-comment {
      margin-right: 38px;
      width: 140px;
      height: 22px;
      font-size: 14px;
      color: #a7a7a7;
    }
    .van-button__content {
      margin-left: 14px;
      justify-content: unset;
    }
    .van-icon {
      font-size: 21px;
    }
    // 功能按键
    .dianzan {
      margin-right: 22px;
    }
    .pinglun,
    .shoucang {
      margin-right: 28px;
    }
  }
}
</style>
