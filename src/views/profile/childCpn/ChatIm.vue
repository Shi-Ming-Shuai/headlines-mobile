<template>
  <div class="ChatIm">
    <!-- Navbar 公共顶部导航栏 -->
    <van-nav-bar
      class="nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 聊天框 -->
    <div class="chat-box">
      <van-cell v-for="item in 40" :key="item" title="内容">
        <template #icon>
          头像---
        </template>
      </van-cell>
    </div>
    <!-- 底部文本输入框 发送 -->
    <div class="bottom-input">
      <van-field v-model="message" center placeholder="请输入聊天内容">
        <template #button>
          <van-button size="small" type="primary">发送</van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
// ES6 import 或 TypeScript
import { io } from 'socket.io-client'

export default {
  name: 'ChatIm',
  data() {
    return {
      message: '', // 当前用户输入的聊天内容
      socket: null // socket.io 实例
    }
  },
  components: {},
  created() {
    // 1. 建立连接
    this.socket = io('http://ttapi.research.itcast.cn', {
      withCredentials: true,
      extraHeaders: { 'my-custom-header': 'abcd' }
    }) // 配置了跨域

    this.socket.on('connect', () => {
      console.log(this.socket.connected)
    })
    this.socket.on('disconnect', () => {
      console.log(this.socket.id)
    })
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.chat-box {
  height: calc(100vh - 53px - 46px);
  overflow-y: auto;
  background-color: #f5f5f6;
}
// 底部输入框
.bottom-input {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
