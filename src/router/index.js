import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 登录注册  搜索页面  编辑用户资料 文章详情
  { path: '/login', name: 'login', component: () => import('@/views/login/Login') },
  { path: '/search', name: 'search', component: () => import('@/views/search/Search') },
  { path: '/editUserInfo', name: 'editUserInfo', component: () => import('@/views/profile/childCpn/EditUserInfo') },
  {
    path: '/article',
    name: 'article',
    // props 作用  将动态路由的参数 映射到组件的 props中
    // 组件使用props接收 动态路由参数
    // props: true,
    // query props 传递方式
    props: (route) => ({
      acticleId: route.query.acticleId
    }),
    component: () => import('@/components/content/ArticleDetail')
  },
  // 主要路由 标签栏
  {
    path: '/',
    component: () => import('@/components/common/Tabbar'),
    // 首页 - 问答 - 视频页 - 个人中心页面,
    children: [
      // path : '' 为空,默认打开这个路由 （默认指向这个路由）
      { path: '', component: () => import('@/views/home/Home') },
      { path: '/qa', name: 'qa', component: () => import('@/views/qa/Qa') },
      { path: '/video', name: 'video', component: () => import('@/views/video/Video') },
      { path: '/profile', name: 'profile', component: () => import('@/views/profile/Profile') }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
