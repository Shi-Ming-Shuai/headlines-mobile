<template>
  <!-- 文章列表项 -->
  <div>
    <!-- 分为三种情况 文章没有图片 一张图片 三张图片(展示效果不一样)-->
    <van-cell-group>
      <van-cell class="article-item">
        <!-- 没图  情况-->
        <template #title>
          <div class="title van-multi-ellipsis--l2">
            {{ listItem.title }}
          </div>
        </template>
        <template #label>
          <div>
            <!-- 三张图情况 -->
            <div v-if="listItem.cover.type === 3" class="cover">
              <van-image
                fit="cover"
                v-for="(url, i) in listItem.cover.images"
                :key="i"
                :src="url"
              />
            </div>
            <div class="text">
              <p>
                <span class="author">{{ listItem.aut_name }}</span>
                <span class="comm-count"> {{ listItem.comm_count }}评论 </span>
                <span class="publish-date">
                  {{ listItem.pubdate | relativeTime }}
                </span>
              </p>
            </div>
          </div>
        </template>
        <!-- 只有一个图片情况 -->
        <template v-if="listItem.cover.type === 1" #default>
          <div class="right-cover">
            <van-image fit="cover" lazy-load :src="listItem.cover.images[0]" />
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'ArticleItem',
  data() {
    return {}
  },
  props: {
    listItem: {
      type: Object,
      require: true
    }
  },
  components: {}
}
</script>

<style lang='less' scoped>
.article-item {
  .title {
    font-size: 16px;
    color: #3a3a3a;
    // 因为你是连续字母，被认为是一个长单词
    // （根据文档语法，整个词不允许被拆开显示），
    // 所以是不会换行的，这时用word-wrap让长单词也换行；
    // 反之如果你是中文或者中文加字母串，不用word-wrap，默认是会换行的
    word-wrap: break-word;
  }
  .text {
    margin-top: 14px;
    font-size: 12px;
    color: #b4b4b4;
    span {
      margin-right: 12px;
    }
  }
  .van-cell {
    padding: 15px 12px;
  }
  .van-cell__value {
    flex: unset;
    margin-left: 13px;
  }
  .van-image {
    width: 116px;
    height: 74px;
  }
  // 三张图样式
  .cover {
    margin-top: 14px;
    display: flex;
    .van-image {
      &:not(:last-child) {
        margin-right: 2px;
      }
    }
  }
}
</style>
