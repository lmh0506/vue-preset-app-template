import Vue from 'vue'
import VueRouter from 'vue-router'
// import { getToken } from '@/common/js/cache'

Vue.use(VueRouter)

// meta: {
//   index: 设置路由层级 方便路由过渡动画的实现  如果不需要则不需要设置
//   cache: true // 设置页面缓存
// }

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  }
]

const router = new VueRouter({
  base: process.env.VUE_APP_BASE_URL || '/',
  mode: 'history',
  routes
})

export default router
