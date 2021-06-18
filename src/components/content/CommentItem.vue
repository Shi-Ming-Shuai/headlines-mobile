<template>
  <div>
    <van-cell class="comment-item">
      <!-- 评论的用户头像 -->
      <template #icon>
        <van-image class="avatar" fit="cover" round :src="item.aut_photo" />
      </template>
      <!-- 评论的用户名称- 评论的内容 -->
      <template #title>
        <div class="head">
          <span class="user-name">{{ item.aut_name }}</span>
          <!-- 右侧点赞 -->
          <div class="like" @click="giveLike">
            <van-icon
              :class="{ likeed: item.is_liking }"
              :name="item.is_liking ? 'good-job' : 'good-job-o'"
            />
            <span class="count">{{ item.like_count }}</span>
          </div>
        </div>
        <div class="comment-content">
          {{ item.content }}
        </div>
      </template>
      <!-- 评论的发布时间  回复按钮 -->
      <template #label>
        <div class="time">
          <span class="pubdate">{{
            item.pubdate | handleTimeFormat('MM-DD HH:mm')
          }}</span>
          <span class="dian">·</span>
          <van-button
            class="reply"
            size="mini"
            round
            @click="$emit('reply-click', item)"
            >{{ item.reply_count }}&nbsp;回复</van-button
          >
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
// 请求
import { addLikings, cancelLikings } from '@/network/article'

export default {
  name: 'CommentItem',
  data() {
    return {}
  },
  props: ['item', 'currentIndex'],
  components: {},
  methods: {
    // 给评论点赞
    async giveLike() {
      // 修改父组件点赞状态 判断当前用户点赞状态
      if (this.item.is_liking) {
        // 取消点赞， 已经点赞状态
        await cancelLikings(this.item.com_id.toString())
        // 减少点赞数量
        this.item.like_count--
      } else {
        // 对评论点赞， 未点赞状态
        await addLikings(this.item.com_id)
        // 增加点赞数量
        this.item.like_count++
      }
      // 父组件根据当前索引修改点赞状态(对象可以直接修改)
      this.item.is_liking = !this.item.is_liking
    }
  }
}
</script>

<style lang="less" scoped>
.comment-item {
  margin-top: 8px;
  .avatar {
    margin-right: 12px;
    width: 36px;
    height: 36px;
  }
  .head {
    display: flex;
    justify-content: space-between;
    .user-name {
      font-size: 12px;
      color: #406599;
    }
    .like {
      display: flex;
      align-items: center;
      .van-icon {
        margin-right: 3px;
        font-size: 16px;
      }
      .count {
        font-size: 10px;
      }
    }
    // 已点赞状态
    .likeed {
      color: pink;
    }
  }
  .comment-content {
    font-size: 16px;
    color: #222222;
    // 允许长单词/数字换行到下一行
    // word-wrap: break-word;
    word-break: break-all;
  }
  .time {
    display: flex;
    align-items: center;
    color: #222222;
    .pubdate {
      font-size: 12px;
    }
    .dian {
      font-size: 20px;
      margin: 0 12px 0 6px;
    }
    .reply {
      width: 70px;
      height: 24px;
      border: 0;
      background-color: #f4f5f6;
    }
  }
}
</style>
