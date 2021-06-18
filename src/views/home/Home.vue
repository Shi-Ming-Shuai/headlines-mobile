<template>
  <div>
    <!-- 首页 顶部导航兰 点击跳转至搜索页-->
    <van-nav-bar class="nav-bar">
      <template #title>
        <van-button to="/search" round icon="search">搜索</van-button>
      </template>
    </van-nav-bar>

    <!--频道列表 tab 导航标签 -->
    <van-tabs
      swipe-threshold="2"
      class="channel-tabs"
      v-model="activeTab"
      animated
      swipeable
    >
      <!-- 遍历 渲染文章标签  van的tab标签 只有点击以后 组件才会渲染出来(渲染以后有缓存)-->
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <AtricleList class="atricle-list" :currentChannel="item" />
      </van-tab>
      <!-- 标签最右侧 占位 -->
      <template #nav-right>
        <div class="zhanwei">
          <div class="zhanwei-text"></div>
        </div>
      </template>
      <!-- 标签最右侧 固定定位 汉堡层按钮 -->
      <template #nav-left>
        <div class="wep-nav-wrap" @click="channelEditPopup = true">
          <van-icon name="wap-nav" />
        </div>
      </template>
    </van-tabs>
    <!-- 频道列表标签 弹出层 popup(挂载节点 body 渲染的时候在body标签中) -->
    <van-popup
      v-model="channelEditPopup"
      get-container="body"
      closeable
      close-icon-position="top-left"
      round
      :overlay="false"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <ChannelEdit
        @childChannelsEdit="childChannelsEdit"
        @updateActiveTab="updateActiveTab"
        :activeTab="activeTab"
        :userchannels="channels"
      />
    </van-popup>
  </div>
</template>

<script>
// 网路请求
import { getChannels } from '@/network/user'

// 组件
import AtricleList from './childCpn/ArticleList'
import ChannelEdit from './childCpn/ChannelEdit'
export default {
  name: 'Home',
  data() {
    return {
      activeTab: 0, // 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。
      channels: [], // 频道列表
      channelEditPopup: false // 频道编辑 弹出层
    }
  },
  components: { AtricleList, ChannelEdit },
  created() {
    // 请求频道列表
    this.getChannels()
  },
  methods: {
    // 业务逻辑
    // 子组件触发   编辑频道(触发 tab跳转指定频道  关闭弹出层)
    childChannelsEdit(payload) {
      this.channelEditPopup = payload.channelEditPopup
      this.activeTab = payload.activeTab
    },
    // 活跃频道 索引更新 (编辑频道删除了活跃频道前面的频道)
    updateActiveTab(num) {
      this.activeTab = num
    },
    // 网络请求
    async getChannels() {
      /**
       * 判断用户是否登录
       * 1. 已登录 请求服务器上的频道列表
       * 2. 未登录(有本地存储)  使用本地存储的频道列表
       * 3. 未登录(没有本地存储)  请求服务器上推荐的频道列表(不传token)
       */
      let res = []
      if (this.$store.state.user) {
        // 用户已登录
        const { data } = await getChannels()
        res = data.channels
      } else {
        if (this.$store.state.userChannelsList.length !== 0) {
          // 未登录 有本地存储
          res = this.$store.state.userChannelsList
        } else {
          // 未登录 没有本地存储
          const { data } = await getChannels()
          res = data.channels
        }
      }
      // 更新 频道列表 channels
      this.channels = res
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
// 频道 标签
/deep/ .channel-tabs {
  .van-tabs__nav {
    padding: 0;
  }
  .van-tab {
    padding: 12px 34px;
    border-right: 1px solid #edeff3;
    border-bottom: 1px solid #edeff3;
  }
  // 最后一个元素取消右边框
  .van-tab:nth-last-child(3) {
    border-right: none;
  }
  // 活跃的标签 底部 横条(绝对定位)
  .van-tabs__line {
    bottom: 4px;
    width: 15px;
    height: 3px;
    background: #3296fa;
    border-radius: 3px;
  }
}

// 最右侧占位
.zhanwei {
  .zhanwei-text {
    width: 34px;
  }
}
// 最右侧 汉堡标签 (点击弹出层)
.wep-nav-wrap {
  position: fixed;
  right: 0;
  width: 34px;
  height: 41px;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
  .van-icon-wap-nav {
    font-size: 16px;
  }
  &::before {
    content: '';
    position: absolute;
    left: 0;
    width: 1px;
    height: 30px;
    background: url('~@/assets/image/home-tab-shu.png') no-repeat;
    background-size: contain;
  }
}

// 将文章列表固定在屏幕中间区域 (navbar + tabs + tabbar) 减去这些区域
.atricle-list {
  height: 526px;
  overflow-y: auto;
}
</style>
