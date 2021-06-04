import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 登录注册   搜索页面
  { path: '/login', name: 'login', component: () => import('@/views/login/Login') },
  { path: '/search', name: 'search', component: () => import('@/views/search/Search') },
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
      { path: 'profile', name: 'profile', component: () => import('@/views/profile/Profile') }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
