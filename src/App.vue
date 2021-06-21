<template>
  <div id="app">
    <!-- 一级路由出口 只要进入 Tabbar页面 Tabbar就被缓存(除非切换帐号)-->
    <keep-alive :include="$store.state.cacheRouter">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
// 导入 vuex  被缓存的一级路由
export default {
  name: 'App'
}
</script>

<style lang="less"></style>
