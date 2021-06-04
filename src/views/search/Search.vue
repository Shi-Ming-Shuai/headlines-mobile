<template>
  <div class="search">
    <!-- 搜索框 -->
    <!-- Tips: 在 van-search 外层增加
    form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        @input="onSearch"
        @cancel="$router.back()"
        @focus="isShowSearchResult = false"
        placeholder="请输入搜索关键词"
      />
    </form>
    <!-- 历史记录 -->
    <div v-if="searchText == false" class="search-history">
      <div class="title">
        <van-cell title="搜索历史">
          <!-- 右侧删除按钮 默认状态: 删除图标 -->
          <div v-if="isDelete === false" class="delete-icon">
            <van-icon name="delete-o" />
          </div>
          <!-- 右侧删除按钮 删除状态: 全部删除 完成 -->
          <div v-else class="delete-text">
            <span>全部删除</span>&nbsp;<span>完成</span>
          </div>
        </van-cell>
      </div>
      <van-cell title="历史2"></van-cell>
      <van-cell title="历史2"></van-cell>
      <van-cell title="历史2"></van-cell>
      <van-cell title="历史2"></van-cell>
    </div>
    <!-- 搜索联想建议 -->
    <div v-else-if="isShowSearchResult == false" class="search-suggest">
      <van-cell icon="search" title="建议11"></van-cell>
      <van-cell icon="search" title="建议11"></van-cell>
      <van-cell icon="search" title="建议11"></van-cell>
    </div>
    <!-- 搜索结果 -->
    <div v-else class="search-result">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in list" :key="item" :title="item" />
      </van-list>
    </div>
  </div>
</template>

<script>
// 防抖
import { debounce } from '@/utils/debounce'

export default {
  name: 'Search',
  data() {
    return {
      searchText: '', // 搜索框 内容
      isShowSearchResult: false, // 是否显示搜索结果
      isDelete: false, //  历史记录删除状态 (删除icon 图标是否被点击)
      list: [], // 搜索结果
      loading: false, // list 加载状态
      finished: false // list 是否加载完成(没有数据可以再加载)
    }
  },
  components: {},
  methods: {
    // input框内容发生改变 时触发搜索  (防抖)
    onSearch: debounce(function (value) {
      // 显示搜索内容
      this.isShowSearchResult = true
      // 找到数据接口 封装请求接口
      // 请求获取数据
      // 模板绑定展示
    }, 500),
    // 搜索结果列表 上拉加载
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }

        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    }
  }
}
</script>

<style lang='less' scoped>
// 搜索结果列表
.search-result {
  height: calc(100vh - 54px);
  overflow-y: auto;
}
</style>
