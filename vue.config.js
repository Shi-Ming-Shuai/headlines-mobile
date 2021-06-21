module.exports = {
  devServer: {
    // 内网穿透时 不报错
    disableHostCheck: true,
    // 开发环境 代理
    proxy: {
      '/app': {
        // target: 'https://toutiao.m.lipengzhou.com'
        target: 'http://ttapi.research.itcast.cn'
        // changeOrigin: true, // 不写默认为 true 更改 host 为 target(跨ip)
        // pathRewrite: { // 路径重写
        //   '^/app': ''
        // }
      }
      // ,
      // '/socket.io': {
      //   // 配置跨域 socket io
      //   target: 'http://ttapi.research.itcast.cn', // target host
      //   changeOrigin: true, // needed for virtual hosted sites
      //   logLevel: 'debug'
      // },
      // 'sockjs-node': {
      //   target: 'http://ttapi.research.itcast.cn',
      //   ws: false,
      //   changeOrigin: true
      // },
    }
  }
}
