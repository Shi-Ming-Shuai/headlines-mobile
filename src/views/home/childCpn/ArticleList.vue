<template>
  <div class="article-list" ref="article-list">
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="refreshSuccessText"
      success-duration="1000"
      @refresh="onRefresh"
    >
      <!-- 对应频道的文章列表 -->
      <van-list
        ref="articleList"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 列表项 通用组件 -->
        <ArticleItem v-for="(item, i) in list" :key="i" :listItem="item" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 网络请求
import { getArticleList } from '@/network/article'
// 组件
import ArticleItem from '@/components/content/ArticleItem'
// lodash 中的防抖
import { debounce } from 'lodash'

export default {
  name: 'ArticleList',
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      pre_timestamp: 0, // 预加载时间戳(用于请求下一页数据)
      isRefreshLoading: false, // 下拉刷新加载 为true展示(下拉 自动变为true)
      refreshSuccessText: '', // 下拉加载提示文字
      cacheScrollTop: 0 // 记录当前滚动的位置(用于页面缓存 进入的时候滚动到离开时的位置)
    }
  },
  props: {
    // 当前频道 id-name
    currentChannel: {
      type: Object,
      require: true
    }
  },
  components: { ArticleItem },
  mounted() {
    // 监听滚动事件  记录离开时的滚动位置(再次进入直接修改到离开时的距离顶部的位置)
    this.$refs['article-list'].onscroll = debounce(() => {
      this.cacheScrollTop = this.$refs['article-list'].scrollTop
    }, 50)
  },
  // keep-alive 生命周期
  // 活跃状态(解决缓存带来的滚动位置不一致问题)  / 不活跃状态
  activated() {
    // 滚动到离开时的位置
    this.$refs['article-list'].scrollTop = this.cacheScrollTop
  },
  deactivated() {},
  methods: {
    // 下拉刷新
    async onRefresh() {
      // 重新请求数据  更改list
      const { data } = await getArticleList({
        channel_id: this.currentChannel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      const dataLength = data.results.length
      // 2. 将请求到的数据  头部添加 list数组
      this.list.unshift(...data.results)

      // 修改下拉刷新状态 为 true(完成)
      this.isRefreshLoading = false
      this.refreshSuccessText = `刷新成功 共加载${dataLength}条数据`
    },
    // 上拉加载
    async onLoad() {
      // channel_id是频道ID
      // timestamp是时间戳整数单位毫秒时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
      // with_top是0或1是否包含置顶,进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      // 1. 请求获取数据
      const { data } = await getArticleList({
        channel_id: this.currentChannel.id,
        timestamp: this.pre_timestamp || Date.now(),
        with_top: 1
      })
      // 2. 将请求到的数据 push 到 list数组
      this.list.push(...data.results)

      // 3. 加载状态结束
      this.loading = false

      // 4. 数据全部加载完成 加载完成后不再触发load事件
      if (data.results.length !== 0) {
        // 记录预加载的时间戳 (用于请求下一页数据)
        this.pre_timestamp = data.pre_timestamp
      } else {
        // 数据全部加载完成 加载完成后不再触发load事件
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
