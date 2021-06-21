<template>
  <div>
    <!-- 二级路由出口 如果一级路由不被缓存 那么 二级路由也不被缓存  -->
    <keep-alive v-if="$store.state.cacheRouter.length !== 0">
      <router-view></router-view>
    </keep-alive>
    <router-view v-else></router-view>
    <!-- 底部标签栏 route 标签栏支持路由模式 是否开启底部安全区适配，设置 fixed 时默认开启 -->
    <van-tabbar
      v-model="activeIndex"
      route
      active-color="#3597fa"
      inactive-color="#717171"
      safe-area-inset-bottom
    >
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="smile-comment-o" to="/qa">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="manager-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Tabbar',
  data() {
    return {
      activeIndex: 0
    }
  },
  components: {},
  created() {
    // 实例一被创建   就将这个页面添加至缓存的路由列表中 vuex
    this.$store.commit('addCacheRouter', 'Tabbar')
  }
}
</script>

<style lang="less" scoped></style>
