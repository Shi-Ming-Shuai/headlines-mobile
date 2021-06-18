<template>
  <!-- 修改性别 -->
  <div class="EditGender">
    <van-picker
      title="修改性别"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close-edit-gender')"
      visible-item-count="4"
      :default-index="gender"
    />
  </div>
</template>

<script>
export default {
  name: 'EditGender',
  data() {
    return {
      columns: ['男', '女']
    }
  },
  // 当前用户性别 修改
  props: ['gender'],
  components: {},
  methods: {
    // 右侧确认修改
    onConfirm(value, index) {
      // toast提示
      this.$toast.loading({
        message: '保存中',
        duration: 0,
        forbidClick: true
      })
      // 关闭弹窗  父组件修改name字段
      this.$emit('close-edit-gender')
      // update:name  修改 被.sync 修饰过的传递过来的数据
      this.$emit('update:gender', index)
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style lang="less" scoped></style>
