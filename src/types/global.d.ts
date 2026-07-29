// ── 全局类型声明 ──

/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_ADMIN_URL: string
  readonly VITE_APP_TITLE: string
  /** 是否启用后端 API 调用，开发时可设为 false 使用 fallback 数据 */
  readonly VITE_USE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
