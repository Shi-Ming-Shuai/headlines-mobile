module.exports = {
  // 使用的插件 px转rem插件
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // 这个值基于设计稿来写  例如设计搞750 / 10 = 75(由于vant是基于375设定的可以使用ps修改设计稿尺寸为 375点)   375设计稿 / 10 = 37.5
      propList: ['*']
    }
  }
}
