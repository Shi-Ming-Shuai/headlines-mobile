<template>
  <!-- 编辑昵称 -->
  <div class="EditName">
    <!-- 公共头部 -->
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close-edit-popup')"
      @click-right="onClickRight"
    />
    <!-- 用户昵称修改框 -->
    <div class="name-input">
      <van-field
        v-model="message"
        rows="2"
        type="textarea"
        maxlength="7"
        placeholder="请输入新昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditName',
  data() {
    return {
      message: this.name // 用户昵称
    }
  },
  props: {
    // 用户昵称 .sync 修饰过了
    name: {
      type: String,
      default: ''
    }
  },
  components: {},
  methods: {
    // 点击右侧完成  修改昵称
    onClickRight() {
      // toast提示
      this.$toast.loading({
        message: '保存中',
        duration: 0,
        forbidClick: true
      })
      // 关闭弹窗  父组件修改name字段
      this.$emit('close-edit-popup')
      // update:name  修改 被.sync 修饰过的传递过来的数据
      this.$emit('update:name', this.message)
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style lang="less" scoped>
.name-input {
  padding: 10px;
}
</style>
