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
        @search="confirmSearch"
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
            <van-icon name="delete-o" @click="isDelete = true" />
          </div>
          <!-- 右侧删除按钮 删除状态: 全部删除 完成 -->
          <div v-else class="delete-text">
            <span @click="removeAllHistory">全部删除</span>&nbsp;<span
              @click="isDelete = false"
              >完成</span
            >
          </div>
        </van-cell>
      </div>
      <div class="search-history-list">
        <van-cell
          v-for="(item, i) in searchHistory"
          :key="i"
          :title="item"
          @click="removeHistory(item, i)"
        >
          <van-icon v-show="isDelete" name="close"></van-icon>
        </van-cell>
      </div>
    </div>
    <!-- 搜索联想建议 -->
    <div v-else-if="isShowSearchResult == false" class="search-suggest">
      <van-cell
        v-for="(item, i) in suggests"
        :key="i"
        icon="search"
        @click="confirmSearch(item)"
      >
        <template #title>
          <p v-html="highlight(item)"></p>
        </template>
      </van-cell>
    </div>
    <!-- 搜索结果 -->
    <div v-else class="search-result">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in list" :key="item.art_id" :title="item.title" />
      </van-list>
    </div>
  </div>
</template>

<script>
// 自己写的防抖
// import { debounce } from '@/utils/debounce'

// lodash 中的防抖
import { debounce } from 'lodash'

// 请求
import {
  getSearchSuggests,
  getSearchResults,
  getSearchHistory
} from '@/network/search'
export default {
  name: 'Search',
  data() {
    return {
      searchText: '', // 搜索框 内容
      isShowSearchResult: false, // 是否显示搜索结果
      isDelete: false, //  历史记录删除状态 (删除icon 图标是否被点击)
      // 历史记录模块
      searchHistory: [], // 用户搜索历史记录
      // 联想建议模块
      suggests: [], // 联想建议列表
      // 搜索结果模块
      list: [], // 搜索结果
      loading: false, // list 加载状态
      finished: false, // list 是否加载完成(没有数据可以再加载)
      page: 1, // 请求页数
      per_page: 20 // 每页请求数量，不传每页数量由后端决定
    }
  },
  components: {},
  created() {
    // 如果用户登录 获取用户服务器上的历史记录  没登录则使用本地历史记录
    if (this.$store.state.user) {
      this.getSearchHistory()
    } else {
      // 本地历史记录
      this.searchHistory = this.$store.state.searchHistory
    }
  },
  watch: {
    // 监听历史记录变化  更新本地
    searchHistory: {
      handler() {
        this.$store.commit('setSearchHistory', this.searchHistory)
      }
    }
  },
  methods: {
    // 高亮显示用户 搜索内容（处理html绑定数据）
    highlight(str) {
      // 使用正则匹配 替换  参数一: 要查询的变量 (搜索框中的字符串)
      // 参数二： 匹配模式 g全局匹配 i 不区分大小写
      const reg = new RegExp(this.searchText, 'gi')
      return str.replace(
        reg,
        `<span style="color:red">${this.searchText}</span>`
      )
    },
    // input框内容发生改变 时触发搜索  (防抖)
    onSearch: debounce(
      async function (value) {
        // 判断是输入框是否不为空
        if (value) {
          // 请求获取数据
          const { data } = await getSearchSuggests(value)
          this.suggests = data.options
        }
      },
      500,
      {
        leading: true // 首次在指定在延迟开始前调用（默认在延迟结束后调用）
      }
    ),
    // 确认搜索  点击键盘上的搜索/回车按钮后触发
    confirmSearch(value) {
      // 将搜索框的内容同步到 data 然后展示搜索列表
      this.searchText = value
      // 本地存储 添加历史记录 搜索结果不为空
      if (value) {
        this.addSearchHistory(value)
      }
      // 显示搜索结果
      this.isShowSearchResult = true
      // 重新初始化 搜索结果数据
      // 1.修改页码为 1 2.清空上一次的搜索结果列表 3.取消加载状态 4.设为没有全部加载完
      this.page = 1
      this.list = []
      this.loading = false
      this.finished = false
    },
    // 本地添加历史记录 (确认搜索功能 代码抽离)
    addSearchHistory(searchText) {
      // 头部添加 判断data是否存在 这个历史 如果存在则删除
      const index = this.searchHistory.indexOf(searchText)
      if (index !== -1) {
        // 存在 删除
        this.searchHistory.splice(index, 1)
      }
      console.log(this.searchHistory)
      // 头部添加
      this.searchHistory.unshift(searchText)
      // 存储到本地 watch处理了
    },
    // 删除状态:删除单条历史记录   非删除状态: 搜索这条历史
    removeHistory(item, i) {
      if (this.isDelete) {
        this.searchHistory.splice(i, 1)
        // 更新本地存储 watch处理了
      } else {
        // 搜索并展示结果
        this.confirmSearch(item)
      }
    },
    // 删除所有历史记录
    removeAllHistory() {
      this.searchHistory = []
    },
    // 请求服务器历史记录
    async getSearchHistory() {
      const { data } = await getSearchHistory()
      this.searchHistory = data.keywords
    },
    // 搜索结果列表 上拉加载
    async onLoad() {
      // 请求分页数据
      const { data } = await getSearchResults({
        page: this.page, // 请求页数
        per_page: this.per_page, // 每页请求数量，不传每页数量由后端决定
        q: this.searchText // 搜索关键词
      })
      // 加载状态结束
      this.loading = false

      // 判断请求页是否有数据  有的话添加 没有的话结束
      if (data.results.length !== 0) {
        // 向列表添加数据  更新页码
        this.list.push(...data.results)
        this.page++
      } else {
        // 数据全部加载完成
        this.finished = true
      }
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
