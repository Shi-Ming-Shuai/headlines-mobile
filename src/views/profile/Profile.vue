<template>
  <!-- 我的 个人中心页 -->
  <div class="profile">
    <!--已登录状态下展示   头部信息 -->
    <van-cell-group v-if="user" class="user-info">
      <!--头部用户基本信息 -->
      <van-cell :border="false" class="base-info" center>
        <template #icon>
          <van-image
            class="avatar"
            width="66"
            height="66"
            round
            fit="cover"
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
          />
        </template>
        <template #title>
          <span class="name">用户名称</span>
        </template>
        <van-button class="edit" round size="small">编辑资料</van-button>
      </van-cell>
      <!-- 用户关注-粉丝-获赞-头条(发表的帖子) -->
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <template #text>
            <div class="count">12</div>
            <div class="text">头条</div>
          </template>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <template #text>
            <div class="count">125532</div>
            <div class="text">关注</div>
          </template>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <template #text>
            <div class="count">12231</div>
            <div class="text">粉丝</div>
          </template>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <template #text>
            <div class="count">12</div>
            <div class="text">获赞</div>
          </template>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- 未登录状态下展示  头部信息 点击手机图片 跳转到登录-->
    <div v-else class="no-login">
      <img
        class="phone"
        @click="$router.push('/login')"
        src="~@/assets/image/profily-phone.png"
        alt=""
      />
      <div class="login" @click="$router.push('/login')">
        登录&nbsp;/&nbsp;注册
      </div>
    </div>
    <!-- 收藏-历史 -->
    <van-grid column-num="2" class="nav-grid">
      <van-grid-item
        icon-prefix="icon"
        icon="shoucang"
        text="收藏"
        class="nav-grid-item"
      ></van-grid-item>
      <van-grid-item
        icon-prefix="icon"
        icon="lishi"
        text="历史"
        class="nav-grid-item"
      ></van-grid-item>
    </van-grid>
    <!-- 消息通知-小智同学- -->
    <van-cell-group :border="false" class="tool-nav">
      <van-cell title="消息通知" is-link to="/"></van-cell>
      <van-cell title="小智同学" is-link to="/"></van-cell>
    </van-cell-group>
    <!-- 退出登录(登录才显示) -->
    <van-button v-if="user" class="log-out" block @click="loginOut"
      >退出登录</van-button
    >
  </div>
</template>

<script>
// 使用mapState 助手 获取 vuex中的state
import { mapState } from 'vuex'

// 网络请求
import { getUserInfo } from '@/network/user'

export default {
  name: 'Profile',
  data() {
    return {
      userInfo: null
    }
  },
  created() {
    // 获取当前用户信息
    this.getCurrentUserInfo()
  },
  components: {},
  computed: {
    // 使用拓展运算符导入state
    ...mapState(['user'])
  },
  methods: {
    // 退出登录    vuex 中的 user 设为 null
    loginOut() {
      // 提示弹窗
      this.$dialog
        .confirm({
          title: '确定退出吗',
          message: '弹窗内容'
        })
        .then(() => {
          // 确定   veux 中 user 设为 null
          this.$store.commit('setUser', null)
        })
        .catch((e) => {
          // 取消
        })
      // 用户确认 退出
      // 用户取消
    },
    // 获取当前用户信息
    async getCurrentUserInfo() {
      // const res = await getUserInfo()
      // console.log(res)

      try {
        const res = await getUserInfo()
        console.log(res)
      } catch (e) {
        const res = '服务器错误'
        console.log(res)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.profile {
  background-color: #f5f7f9;
}
// 未登录状态 头部信息
.no-login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 180px;
  background: url('~@/assets/image/profily-banner_bg.png') no-repeat;
  background-size: cover;
  .phone {
    width: 66px;
    height: 66px;
  }
  .login {
    margin-top: 7px;
    font-size: 14px;
    color: #fff;
  }
}
// 头部用户信息
.user-info {
  background: url('~@/assets/image/profily-banner_bg.png') no-repeat;
  background-size: cover;
  // 取消 vant 设置的背景颜色
  /deep/ div {
    background: none;
  }
}
// 用户基础信息
.base-info {
  padding: 38px 16px 11px;
  height: 115px;
  .avatar {
    margin-right: 11px;
    width: 66px;
    height: 66px;
    border: 1px solid #fff;
  }
  .name {
    font-size: 15px;
    color: #fff;
  }
  .edit {
    height: 22px;
    font-size: 10px;
    color: #666666;
    background-color: #fff;
  }
}
// 用户数据信息 发布的头条-关注-粉丝...
.data-info {
  padding: 0 16px;
  &-item {
    height: 65px;
    color: #fff;
  }
  .count {
    font-size: 18px;
  }
  .text {
    font-size: 11px;
  }
}
// 收藏 - 历史记录
/deep/ .nav-grid {
  &-item {
    height: 70px;
  }
  // 图标
  .icon-shoucang {
    font-size: 22px;
    color: #eb5253;
  }
  .icon-lishi {
    font-size: 22px;
    color: #ff9d1d;
  }
  .van-grid-item__text {
    font-size: 14px;
    color: #333333;
  }
}
// 工具导航  小智同学 消息通知
.tool-nav {
  margin: 4px 0;
}
.log-out {
  height: 52px;
  border: 0;
  font-size: 15px;
  color: #d86262;
}
</style>
