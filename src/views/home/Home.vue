<template>
  <div>
    <!-- 首页 顶部导航兰 -->
    <van-nav-bar class="nav-bar">
      <template #title>
        <van-button round icon="search">搜索</van-button>
      </template>
    </van-nav-bar>
    <!--频道列表 tab 导航标签 -->
    <van-tabs v-model="active" animated swipeable>
      <!-- 遍历 渲染文章标签  van的tab标签 只有点击以后 组件才会渲染出来(渲染以后有缓存)-->
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <AtricleList :currentChannel="item" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
// 网路请求
import { getChannels } from '@/network/user'

// 组件
import AtricleList from './childCpn/ArticleList'

export default {
  name: 'Home',
  data() {
    return {
      active: 0, // 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。
      channels: [] // 频道列表
    }
  },
  components: { AtricleList },
  created() {
    // 请求频道列表
    this.getChannels()
  },

  methods: {
    // 业务逻辑

    // 网络请求
    async getChannels() {
      const res = await getChannels()
      // 修改 data 频道列表数据
      this.channels = res.data.channels
    }
  }
}
</script>

<style lang='less' scoped>
/deep/ .nav-bar {
  .van-button {
    width: 228px;
    height: 32px;
    border: none;
    background-color: #5babfb;
  }
  .van-button__text {
    font-size: 14px;
    color: #fff;
  }
  .van-icon {
    font-size: 16px;
    color: #fff;
  }
  .van-nav-bar__title {
    max-width: none;
  }
}
// 将文章列表固定在屏幕中间区域 (navbar + tabs + tabbar) 减去这些区域
/deep/ .van-tabs__content {
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 50px;
  // 内容超出 显示滚动条
  overflow-y: auto;
}
</style>
