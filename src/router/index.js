import Vue from 'vue'
import VueRouter from 'vue-router'
// 获取 token  用来判断用户是否登录
import { getToken } from '@/utils/getToken'
// 消息确认 弹出框
import { Dialog } from 'vant'
Vue.use(VueRouter)

const routes = [
  // 登录注册  搜索页面  编辑用户资料 小智同学 文章详情
  { path: '/login', name: 'login', meta: { requireAuth: false }, component: () => import('@/views/login/Login') },
  { path: '/search', name: 'search', meta: { requireAuth: false }, component: () => import('@/views/search/Search') },
  { path: '/editUserInfo', name: 'editUserInfo', meta: { requireAuth: true }, component: () => import('@/views/profile/childCpn/EditUserInfo') },
  { path: '/profile/chat', name: 'ChatIm', meta: { requireAuth: true }, component: () => import('@/views/profile/childCpn/ChatIm') },
  {
    path: '/article',
    name: 'article',
    meta: { requireAuth: false },
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
    meta: { requireAuth: false },
    component: () => import('@/components/common/Tabbar'),
    // 首页 - 问答 - 视频页 - 个人中心页面,
    children: [
      // path : '' 为空,默认打开这个路由 （默认指向这个路由）
      { path: '', meta: { requireAuth: false }, component: () => import('@/views/home/Home') },
      { path: '/qa', meta: { requireAuth: false }, name: 'qa', component: () => import('@/views/qa/Qa') },
      { path: '/video', meta: { requireAuth: false }, name: 'video', component: () => import('@/views/video/Video') },
      { path: '/profile', meta: { requireAuth: false }, name: 'profile', component: () => import('@/views/profile/Profile') }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局前置守卫   判断跳转的页面是否需要登录才能访问
router.beforeEach((to, from, next) => {
  // 登录页可以直接跳转
  if (to.path === '/login') {
    return next()
  }
  // 判断目标路径 是否需要登录才能访问
  if (to.meta.requireAuth && !getToken()) {
    // 需要身份 并且当前未登录 提示用户是否去登录
    Dialog.confirm({
      title: '内容需要登录才能访问',
      message: '是否登录'
    })
      .then(() => {
        // 用的点击去登陆,跳转登录页
        next({
          path: '/login',
          query: {
            redirectRoute: from.fullPath
          }
        })
      })
      .catch(() => {
        // 中断当前的导航 不进行跳转
        next(false)
      })
  } else {
    // 不需要登录也可访问 直接跳转
    next()
  }
})
export default router
