<template>
  <!-- 修改用户头像 -->
  <div class="EditPhoto">
    <!--2. 用块元素（容器）包裹图像或画布元素 -->
    <img v-if="photo" id="image" :src="photo" alt="" />
    <span v-else>请选择图片</span>
    <!-- 底部功能栏 取消 确认 -->
    <van-nav-bar
      class="bottom-tool"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close-edit-photo')"
      @click-right="onConfirm"
    ></van-nav-bar>
  </div>
</template>

<script>
// 步骤 1:图像裁切插件
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'EditPhoto',
  data() {
    return {
      // 使用 Window.URL.createObjectURL()
      // createObjectURL是生成的对象URL.通过这个URL,可以获取到所指定文件的完整内容.
      photo: window.URL.createObjectURL(this.file), // blob 地址
      cropper: null // 图片裁切实例
    }
  },
  props: {
    // 预览选择的图片
    file: {
      type: File,
      required: true
    }
  },
  // watch: {
  //   file: {
  //     handler(newV, oldV) {
  //       this.photo = window.URL.createObjectURL(newV)
  //       console.log(newV, 1)
  //       console.log(oldV, 2)
  //     },
  //     immediate: true
  //   }
  // },
  components: {},
  mounted() {
    // 3. 获取 img的dom  配置裁切实例(裁切框的大小 功能)
    const image = document.getElementById('image')
    this.cropper = new Cropper(image, {
      minCropBoxWidth: 300, // 裁剪框的最小宽度(如果图像比最小宽度小 那么就是图像最大的宽度)。
      minCropBoxHeight: 300, // 裁剪框的最小高度。(如果图像比最小高度小 那么就是图像最大的高度)
      aspectRatio: 1, // 定义裁剪框的固定纵横比
      viewMode: 1, // 限制裁剪框不超过画布的大小
      dragMode: 'move', // 拖动模式 : 移动画布
      cropBoxMovable: true, // 剪切框是否可以移动
      cropBoxResizable: false, // 剪切框是否可以调整大小
      background: false, // 显示容器的网格背景
      movable: true // 图像是否可以移动
    })
  },
  methods: {
    // 4. 封装一个 promise 获取裁切以后的图片 File
    getCroppedCanvas() {
      return new Promise(resolve => {
        // 如果浏览器支持`HTMLCanvasElement.toBlob`，则将裁剪后的图像上传到服务器。
        // `toBlob` 的第二个参数的默认值为 'image/png'，如有必要，请更改它。
        this.cropper.getCroppedCanvas().toBlob(blob => {
          resolve(blob)
        }, 'image/jpeg')
      })
    },
    // 确认修改头像
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0
      })
      // 5. 获取 裁切以后的图片文件 , 创建formData对象
      const imgBlob = await this.getCroppedCanvas()
      const data = new FormData()
      data.append('photo', imgBlob)
      // 要求 Content-Type 是 multipart/form-data 必须传递 FromData 对象
      // 创建 formData 实例对象, 添加要请求的键值对
      // const data = new FormData()
      // data.append('photo', this.file)
      // patch 请求 服务器
      // 父组件更改头像,关闭修改头像弹出层
      const resultPhoto = window.URL.createObjectURL(imgBlob)
      this.$emit('update-photo', resultPhoto)
      this.$emit('close-edit-photo')
      // 提示完成
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style lang="less" scoped>
.EditPhoto {
  // 图片展示位置 垂直居中
  /deep/.cropper-container {
    position: fixed;
    top: 50%;
    transform: translate(0, -50%);
  }
}
.bottom-tool {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000000;
  /deep/ .van-nav-bar__text {
    color: #fff;
  }
}
/* 确保图像的大小完全适合容器 */
#image {
  display: block;

  /* 这个规则很重要，请不要忽略这个 */
  max-width: 100%;
}
</style>
