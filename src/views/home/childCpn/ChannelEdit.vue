<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <div class="my-channels">
      <van-cell center title="我的频道" :border="false">
        <van-button
          type="danger"
          round
          size="mini"
          plain
          @click="isEdit = !isEdit"
          >{{ isEdit ? '完成' : '编辑' }}</van-button
        >
      </van-cell>
      <van-grid :border="false" class="channel-list" gutter="0.29333rem">
        <van-grid-item
          class="list-item"
          :class="{ active: activeTab === index }"
          v-for="(item, index) in userchannels"
          :key="item.id"
          :icon="isEdit && index !== 0 ? 'close' : ''"
          :text="item.name"
          @click="channelClick(index)"
        />
      </van-grid>
    </div>
    <!-- 频道推荐 -->
    <div class="recommend-channels">
      <van-cell center title="频道推荐" :border="false"> </van-cell>
      <van-grid :border="false" class="channel-list" gutter="0.29333rem">
        <van-grid-item
          v-for="item in recommendChannels"
          :key="item.id"
          class="list-item"
          @click="addChannel(item)"
        >
          <template #text>
            <van-icon class="icon-jia" name="plus" />
            <span class="text">{{ item.name }}</span>
          </template>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
// 请求
import {
  getAllChannels,
  editChannelList,
  deleteChannel
} from '@/network/channels'

import { mapMutations } from 'vuex'
export default {
  name: 'ChannelEdit',
  data() {
    return {
      allchannels: [], //  全部频道列表 (推荐列表在计算属性中)
      isEdit: false // 编辑状态 (按钮文字  列表项右上角 X 图标)
    }
  },
  props: {
    // 我的频道 (首页tab 标签展示的就是我的频道 直接传递过来就可以)
    userchannels: {
      type: Array,
      require: true
    },
    // 高亮当前阅读的频道  根据首页浏览的频道
    activeTab: {
      type: Number,
      require: true
    }
  },
  components: {},
  // 什么时候会用到计算属性？
  // 往往都是 通过现有的属性 来计算(派生)出一个新的属性
  // 现有的属性发生变化 派生出的新属性 也随之改变
  computed: {
    // 推荐列表 (全部列表 - 我的列表)
    recommendChannels() {
      let recList = []
      // 全部频道过滤出 我的频道中 不存在的频道
      recList = this.allchannels.filter(allItem => {
        return !this.userchannels.find(item => {
          return item.id === allItem.id
        })
      })
      // 查找是否存在该频道
      return recList
      // this.allchannels.forEach((allItem) => {
      //   // 遍历-我的频道 判断是否已经存在该频道
      //   const result = this.userchannels.some((item) => {
      //     return item.name === allItem.name
      //   })
      //   // 如果不存在 则 添加
      //   if (result === false) {
      //     recList.push(allItem)
      //   }
      // })

      // return recList
    }
  },
  created() {
    this.getAllChannels()
  },
  methods: {
    // 映射mustions
    ...mapMutations(['setChannleList']),
    // 点击 我的列表项 移除频道
    channelClick(i) {
      // (isEdit) 处于编辑状态  删除频道  (推荐频道不能删)
      if (this.isEdit && i !== 0) {
        // 保存 被删除的频道信息
        const deleteInfo = this.userchannels.splice(i, 1)
        // 判断是否登录
        if (this.$store.state.user) {
          // 登录: 删除服务器中的列表数据
          deleteChannel(deleteInfo[0].id)
        } else {
          //  未登录: 删除本地列表数据
          this.setChannleList(this.userchannels)
        }
        if (i <= this.activeTab) {
          // 判断是否是当前活跃频道之前的频道,更新父组件的 activeTab 活动的索引
          this.$emit('updateActiveTab', this.activeTab - 1)
        }
      } else {
        // (isEdit) 处于完成状态  关闭弹窗 tab 跳转至指定频道(子传父)
        this.$emit('childChannelsEdit', {
          channelEditPopup: false, // 关闭弹出层
          activeTab: i // tab标签 跳转至指定索引频道
        })
      }
    },
    // 点击推荐列表项 添加至我的列表(要做数据持久化)
    async addChannel(item) {
      this.userchannels.push(item)
      // 如果用户登录 频道列表更新到后台
      if (this.$store.state.user) {
        await editChannelList({
          channels: [
            {
              id: item.id,
              seq: this.userchannels.length
            }
          ]
        })
      } else {
        // 未登录  添加至vuex 本地存储(数据持久化)
        this.$store.commit('setChannleList', this.userchannels)
      }
      // console.log(this.$store.state.userChannelsList.length)
    },
    // 请求全部列表
    async getAllChannels() {
      const { data } = await getAllChannels()
      // 更新全部频道
      this.allchannels = data.channels
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 40px 10px;
  .van-cell {
    padding: 0;
  }
  .van-grid {
    padding-left: 0 !important;
  }
  .van-cell__title {
    font-size: 16px;
    color: #333333;
  }
}
// 高亮频道
.active {
  /deep/.van-grid-item__text {
    color: Red !important;
  }
}
// 频道列表  宫格
.channel-list {
  padding: 20px 0 40px;
  .list-item {
    // flex-basis: unset !important;
    // padding-right: 11px !important;

    // 除了第四的倍数元素 都有右边距 (grid 组件的 gutter 属性设置了rem)
    &:nth-child(4n) {
      flex-basis: unset !important;
      padding-right: 0 !important;
    }
    /deep/.van-icon-close {
      position: absolute;
      right: 1px;
      top: -8px;
      font-size: 20px;
    }
    /deep/.van-grid-item__content {
      flex-direction: row;
      padding: 0;
      width: 80px;
      height: 44px;
      border-radius: 6px;
      background: #f4f5f6;
      span {
        // 文本超出隐藏
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    /deep/.van-grid-item__text {
      margin-top: 0;
      font-size: 14px;
      color: #222222;
    }
  }
}
// 我的频道
.my-channels {
  .van-button {
    width: 52px;
    height: 24px;
  }
}
// 推荐频道
.recommend-channels {
  .icon-jia {
    margin-right: 2px;
    font-size: 12px;
  }
  .text {
    font-size: 14px;
    color: #222222;
  }
}
</style>
