<template>
  <div>
    <!-- Navbar 公共顶部导航栏 -->
    <van-nav-bar
      class="nav-bar"
      title="注册 / 登录"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- form表单  表单验证 -->
    <!-- 使用 Field 的 rules 属性定义校验规则 -->
    <van-form
      ref="login-form"
      validate-first
      :show-error-message="false"
      :show-error="false"
      @submit="handleLogin"
      @failed="rulesFailed"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="icon"
        left-icon="shouji"
        name="mobile"
        placeholder="请输入手机号"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="icon"
        name="code"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        :rules="formRules.code"
      >
        <!-- 发送短信按钮 发送成功以后 显示倒计时组件-倒计时为 0 显示发送按钮 -->
        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            v-if="isShowCountDown"
            :time="time"
            format="ss s"
            @finish="isShowCountDown = false"
          />
          <!-- 发送 -->
          <van-button
            v-else
            size="small"
            color="#ededed"
            round
            :disabled="isDisabled"
            @click.prevent="sendCode"
            ><span class="send-code">发送验证码</span>
          </van-button>
        </template>
      </van-field>
      <!-- 登录按钮 -->
      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block
          ><span>登录</span></van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 请求接口
import { login, SenCode } from '@/network/user'
export default {
  name: 'Login',
  data() {
    return {
      // 表单验证规则
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1(3|5|7|9|8)\d{9}$/, message: '请输入正确的手机格式' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式不正确' }
        ]
      },
      // 收集用户信息 用于提交
      user: {
        mobile: '',
        code: '246810'
      },
      // 倒计时 时间设置 mm
      time: 60 * 1000,
      // v-if 判断是否显示倒计时组件
      isShowCountDown: false,
      // 点击发送以后 按钮为 禁用状态 不可以点击
      isDisabled: false
    }
  },
  components: {},
  // 业务逻辑
  methods: {
    // 发送验证码  验证手机规则 通过:请求验证码接口 不通过:提示用户 toast
    async sendCode() {
      // 只要用户点击就禁用按钮, 防止用户手机网络太慢(例如3g),没来及显示倒计时组件
      this.isDisabled = true
      // 点击发送验证码按钮 》 验证手机号是否符合规则 》 符合:请求验证码接口, 不符合:提示用户，不触发请求
      try {
        // 表单- 手机号验证
        await this.$refs['login-form'].validate(['mobile'])
        // 发送验证码 注意：间隔一分钟 否则调到catch
        await SenCode(this.user.mobile)
        // 发送验证码成功, 显示倒计时组件(CountDown), 通过组件的
        this.isShowCountDown = true
        // 符合验证规则 请求验证码接口
      } catch (err) {
        let message = ''
        // 根据报错信息  提示用户 手机验证-发送验证码太频繁(1分钟)
        if (err[0] && err[0].name === 'mobile') {
          message = err[0].message
        } else if (err.response && err.response.status === 429) {
          message = '发送太频繁'
        } else {
          message = '未知错误,请稍后重试'
        }
        // 不符合验证规则 toast提示用户
        this.$toast({
          message,
          position: 'top', // 防止用户键盘遮挡
          forbidClick: true
        })
      }
      // 业务逻辑执行完毕 无论成功 还是失败 取消按钮禁言
      this.isDisabled = false
    },
    // 登录按钮 表单验证成功
    async handleLogin() {
      /**
       * 1. 接口文档找到登录接口
       * 2. 封装登录接口
       * 3. 请求-调用封装的登录接口
       * 4. 处理响应结果
       * 5. 页面交互提示
       */
      // 开启 toast 弹窗
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 值为 0 时，toast 不会消失
      })
      //
      try {
        await login(this.user)
        this.$toast.success('登录成功') // 登录成功 或者失败 loading 自动关闭
      } catch (err) {
        this.$toast.fail('登录失败,用户名或密码错误')
      }
    },
    // 登录按钮 表单验证失败
    rulesFailed(err) {
      // 判断是否存在 规则不通过信息
      if (err.errors[0].message) {
        // 自定义提示信息 在顶部
        this.$toast({
          message: err.errors[0].message,
          position: 'top' // 提示信息在顶部(移动设备的键盘高度占一半 在中间会被盖住)
        })
      }
    }
  }
}
</script>

<style lang='less' scoped>
// 深度选择器 父组件修改子组件 如果通过这个修改不了可是使用 /deep/
/deep/ .van-field__button {
  border-left: 1px solid #eeeeee;
  padding-left: 10px;
  .send-code {
    font-size: 11px;
    color: #666666;
  }
}

/deep/ .van-field__left-icon {
  margin-right: 20px;
}
/deep/ .icon {
  font-size: 18px;
}
/deep/ .icon-yanzhengma {
  position: relative;
  top: 5px;
}

.login-btn-wrap {
  padding: 26px 14px;
  .login-btn {
    border-radius: 10px;
    background-color: #6db4fb;
    border: none;
  }
  span {
    color: #fff;
    font-size: 15px;
  }
}
</style>
