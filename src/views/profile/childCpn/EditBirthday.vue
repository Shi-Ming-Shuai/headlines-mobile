<template>
  <!-- 编辑生日 时间选择 -->
  <div class="EditBirthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onConfirm"
      @cancel="$emit('close-birthday-popup')"
    />
  </div>
</template>

<script>
// 插件
import dayjs from 'dayjs'

export default {
  name: 'EditBirthday',
  data() {
    return {
      minDate: new Date(1960, 0, 1), // 最小可选择的时间
      maxDate: new Date(), // 最大可选择的时间
      currentDate: new Date(this.birthday) // 当前选择的时间(第一次打开为用户的生日)
    }
  },
  props: {
    // 当前用户生日
    birthday: {
      type: String,
      default: new Date()
    }
  },
  components: {},
  methods: {
    // 右侧确定按钮
    onConfirm() {
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      console.log(date)
      // toast提示
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0
      })
      // 修改信息提交服务器 父组件修改生日-关闭弹窗
      this.$emit('update:birthday', date)
      this.$emit('close-birthday-popup')
      // 关闭提示
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style lang="less" scoped></style>
