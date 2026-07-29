// ── Pinia 状态管理入口 ──
// 架构规范：第6章 — 全局 Store 注册与导出

import { createPinia } from 'pinia'

/** 全局 Pinia 实例，在 main.ts 中通过 app.use(pinia) 注册 */
export const pinia = createPinia()

// ── 模块统一导出 ──
export { useAppStore } from './modules/app'
export { useBannerStore } from './modules/banner'
export { useNewsStore } from './modules/news'
export { useContactStore } from './modules/contact'
export { useAuthStore } from './modules/auth'
