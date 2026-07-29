// ── Vue Router 实例 ──

import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'

// NProgress 配置
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
})

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    // 每次导航回到页面顶部
    return { top: 0 }
  },
  routes,
})

// ────────────────────────────────────
// 前置守卫
// ────────────────────────────────────

router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start()

  // 设置页面 Title
  const title = to.meta.title as string | undefined
  const appTitle = import.meta.env.VITE_APP_TITLE || '城际云'
  document.title = title ? `${title} - ${appTitle}` : appTitle

  // 后台路由 Token 校验
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      // 无 Token → 跳转登录，携带 redirect 参数
      NProgress.done()
      next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
      return
    }
  }

  // 已登录用户访问登录页 → 重定向到仪表盘
  if (to.name === 'AdminLogin') {
    const token = localStorage.getItem('admin_token')
    if (token) {
      NProgress.done()
      next({ name: 'AdminDashboard' })
      return
    }
  }

  next()
})

// ────────────────────────────────────
// 后置守卫
// ────────────────────────────────────

router.afterEach(() => {
  NProgress.done()
})

export default router
