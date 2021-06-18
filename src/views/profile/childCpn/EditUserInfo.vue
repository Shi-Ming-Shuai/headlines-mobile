<template>
  <div class="EditUserInfo">
    <!-- Navbar 公共顶部导航栏 -->
    <van-nav-bar
      class="nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 可编辑用户信息列表 -->
    <div class="user-info-list">
      <!-- 提交用户头像文件 accept规定通过文件上传来提交的文件的类型 -->
      <input
        type="file"
        hidden
        ref="select-img"
        accept="image/*"
        @change="selectImg"
      />
      <!-- 点击头像 触发 input 的 click事件(选择文件) -->
      <van-cell
        center
        title="头像"
        is-link
        @click="$refs['select-img'].click()"
      >
        <van-image
          class="cover"
          width="30"
          height="30"
          fit="cover"
          round
          :src="userInfo.photo"
        >
        </van-image>
      </van-cell>
      <van-cell
        title="昵称"
        is-link
        :value="userInfo.name"
        @click="showEditName = true"
      ></van-cell>
      <van-cell
        title="性别"
        is-link
        :value="userInfo.gender == 0 ? '男' : '女'"
        @click="showEditGender = true"
      ></van-cell>
      <van-cell
        title="生日"
        is-link
        :value="userInfo.birthday"
        @click="showEditBirthday = true"
      ></van-cell>
    </div>
    <!-- 编辑头像 弹出层 -->
    <van-popup
      class="edit-user-photo"
      v-model="showEditPhoto"
      position="bottom"
      :style="{ height: '100vh' }"
    >
      <EditPhoto
        v-if="showEditPhoto"
        :file="previewImage"
        @close-edit-photo="showEditPhoto = false"
        @update-photo="userInfo.photo = $event"
      />
    </van-popup>
    <!-- 编辑昵称 弹出层 -->
    <van-popup
      class="edit-name"
      v-model="showEditName"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!--  @update-name="userInfo.name = $event" -->
      <EditName
        v-if="showEditName"
        :name.sync="userInfo.name"
        @close-edit-popup="showEditName = false"
      />
    </van-popup>
    <!-- 编辑性别 弹出层 -->
    <van-popup
      class="edit-gender-popup"
      v-model="showEditGender"
      position="bottom"
    >
      <!--  @update-name="userInfo.name = $event" -->
      <EditGender
        v-if="showEditGender"
        :gender.sync="userInfo.gender"
        @close-edit-gender="showEditGender = false"
      />
    </van-popup>
    <!-- 编辑生日 弹出层 -->
    <van-popup v-model="showEditBirthday" position="bottom">
      <EditBirthday
        v-if="showEditBirthday"
        :birthday.sync="userInfo.birthday"
        @close-birthday-popup="showEditBirthday = false"
      />
    </van-popup>
  </div>
</template>

<script>
// 请求
// import { getUserProfile } from '@/network/user'
// 组件
import EditName from './EditName.vue'
import EditGender from './EditGender'
import EditBirthday from './EditBirthday'
import EditPhoto from './EditPhoto'
export default {
  name: 'EditUserInfo',
  data() {
    return {
      userInfo: {}, // 用户资料
      showEditPhoto: false, // 修改用户头像
      showEditName: false, // 修改昵称弹出层
      showEditGender: false, // 修改性别弹出层
      showEditBirthday: false, // 修改生日弹出层
      previewImage: null // 传递给子组件(预览要修改的头像)
    }
  },
  created() {
    this.getUserProfile()
  },
  components: { EditName, EditGender, EditBirthday, EditPhoto },
  methods: {
    // 用户上传头像触发
    selectImg() {
      // 1. 展示弹出层
      this.showEditPhoto = true
      // 2. 在弹出预览图片
      // 使用 Window.URL.createObjectURL()
      // createObjectURL是生成的对象URL.通过这个URL,可以获取到所指定文件的完整内容.
      const file = this.$refs['select-img'].files[0]
      this.previewImage = file
      // onChange 只有在 input 的value 发生改变时才触发(解决第二次重复选择一样文件不触发)
      this.$refs['select-img'].value = ''
    },
    // 获取用户资料
    getUserProfile() {
      // 用户资料
      this.userInfo = {
        name: '明大大',
        photo: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        gender: 0,
        birthday: '2018-12-20'
      }
      // const res = await getUserProfile()
      console.log('服务器内部错误,请求不到用户资料数据')
    }
  }
}
</script>

<style lang="less" scoped>
.edit-name {
  background-color: #f5f7f9;
}
.edit-gender-popup {
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}
.edit-user-photo {
  background-color: #000000;
}
</style>
