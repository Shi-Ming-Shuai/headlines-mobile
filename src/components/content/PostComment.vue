<template>
  <!-- 发布评论弹出层 -->
  <div class="post-comment">
    <van-field
      v-model.trim="message"
      rows="2"
      type="textarea"
      maxlength="50"
      placeholder="优质评论将会被优先展示"
      show-word-limit
    />
    <!-- 发布按钮 -->
    <van-button class="post" size="small" @click="onPost">发布</van-button>
  </div>
</template>

<script>
// 请求
import { addComment } from '@/network/article'

export default {
  name: 'PostComment',
  data() {
    return {
      message: '' // 用户输入的评论内容
    }
  },
  props: {
    // 当前文章id
    acticleId: {
      type: [Object, String, Number],
      require: true
    },
    // 文章id，对评论内容发表回复时，
    // 需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
    art_id: {
      type: [Object, String, Number],
      default: null
    }
  },
  components: {},
  methods: {
    // 发布评论
    async onPost() {
      // 判断是否有内容
      if (!this.message) {
        this.$toast('请输入内容')
        return
      }
      // 提示发布加载中
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 值为 0 时，toast 不会消失
      })
      // 提交发布内容
      try {
        const { data } = await addComment({
          target: this.acticleId, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, // 评论内容
          art_id: this.art_id // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        // 通知父组件 关闭弹出层
        this.$emit('post-comment', data.new_obj)
        // 兄弟组件通信(Comment-list) 评论列表添加新增评论信息
        // this.$bus.$emit('update-comment-list', data.new_obj)
        // 清空评论内容,关闭 提示
        this.message = ''
        this.$toast.success('发布成功')
      } catch (err) {
        // 发布失败 提示用户
        this.$toast.fail('发布失败,请重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.post-comment {
  display: flex;
  align-items: center;
  /deep/.van-field__word-limit {
    font-size: 14px;
  }
}
/deep/ .van-cell__value {
  padding: 10px 16px;
  background-color: #f5f7f9;
}
.post {
  margin-right: 16px;
  width: 58px;
  border: 0;
  font-size: 14px;
}
</style>
