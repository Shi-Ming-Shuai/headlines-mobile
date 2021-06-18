<template>
  <div class="replyComment">
    <!-- 头部 导航标题-->
    <van-nav-bar
      :title="`${replyCommentItem.reply_count}条回复`"
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>
    <!-- 当前回复的评论 -->
    <CommentItem :item="replyCommentItem" />
    <!-- 回复评论列表 -->
    <CommentList
      class="comment-list"
      v-if="replyCommentItem.com_id"
      type="c"
      :source="replyCommentItem.com_id"
      :list="list"
    />
    <!-- 写评论 -->
    <div class="footer">
      <van-button
        class="write-comment"
        size="small"
        round
        @click="showPostCommentPopup = true"
        >回复改评论</van-button
      >
    </div>
    <!-- 回复评论弹出层 -->
    <van-popup v-model="showPostCommentPopup" position="bottom">
      <PostComment
        @post-comment="postComment"
        :art_id="acticleId"
        :acticleId="replyCommentItem.com_id"
      />
    </van-popup>
  </div>
</template>

<script>
// 组件
import CommentItem from './CommentItem.vue'
import CommentList from './CommentList.vue'
import PostComment from './PostComment.vue'

export default {
  name: 'replyComment',
  data() {
    return {
      showPostCommentPopup: false,
      list: []
    }
  },
  props: {
    // 回复的评论项(展示于顶部)
    replyCommentItem: {
      type: Object,
      require: true
    },
    // 当前文章id
    acticleId: {
      type: [Object, Number, String],
      require: true
    }
  },
  components: { CommentItem, CommentList, PostComment },
  methods: {
    // 子父通信 关闭回复评论弹出层
    onClickLeft() {
      this.$emit('close-reply-popup')
    },
    // 父子通信  关闭当前写评论弹出层
    postComment(newObj) {
      this.showPostCommentPopup = false
      this.list.unshift(newObj)
    }
  }
}
</script>

<style lang="less" scoped>
.comment-list {
  margin-bottom: 44px;
}
.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .write-comment {
    width: 225px;
    height: 30px;
  }
}
</style>
