<template>
  <!-- 评论列表 -->
  <div>
    <van-cell :border="false" title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 评论列表中的每一项 -->
      <CommentItem
        v-for="(item, i) in list"
        :key="i"
        :item="item"
        :currentIndex="i"
        @reply-click="$emit('reply-click', $event)"
      />
      <!-- 查看更多
      <div class="more" @click="onLoad">查看更多</div> -->
    </van-list>
  </div>
</template>

<script>
// 请求
import { getComment } from '@/network/article'

// 组件
import CommentItem from './CommentItem.vue'

export default {
  name: 'CommentList',
  data() {
    return {
      loading: false,
      finished: false,
      // 请求参数
      offset: null, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
      limit: 10 // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
    }
  },
  props: {
    // 评论列表数据
    list: {
      type: Array,
      require: true
    },
    // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
    type: {
      type: String,
      default: 'a'
    },
    // 源id，文章id或评论id
    source: {
      type: [Object, Number, String],
      require: true
    }
  },
  components: { CommentItem },
  mounted() {
    // 兄弟组件通信  接收新增评论
    // this.$bus.$on('update-comment-list', data => {
    //   console.log('更新', data)
    //   // 向列表头部添加 新增评论信息
    //   this.list.unshift(data)
    // })
  },
  beforeDestroy() {
    // 注册的总线事件要在组件销毁时卸载，否则会多次挂载，造成触发一次但多个响应的情况
    // this.$bus.$off('update-comment-list')
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      const { data } = await getComment({
        type: this.type,
        source: this.source.toString(),
        offset: this.offset,
        limit: this.limit
      })
      // 将总评论数 传递到父组件
      this.$emit('total-count', data.total_count)
      // 判断是否有值-有:添加到list 停止加载 更新请求下一个的页面
      if (data.results.length) {
        this.list.push(...data.results)
        this.offset = data.last_id
        this.loading = false
      } else {
        // 数据全部加载完成-没有数据  停止下拉刷新
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
