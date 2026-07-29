// ── API 层核心：Axios 双实例 + 拦截器 ──

import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types/api'

// ────────────────────────────────────
// 1. 实例创建
// ────────────────────────────────────

/** 前台公开 API —— 无需 Token */
export const publicApi: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

/** 后台管理 API —— Bearer Token 鉴权 */
export const adminApi: AxiosInstance = axios.create({
  baseURL: '/admin-api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ────────────────────────────────────
// 2. 请求拦截器
// ────────────────────────────────────

publicApi.interceptors.request.use(
  (config) => {
    // 防 CSRF / 标识 XHR 请求
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    return config
  },
  (error) => Promise.reject(error),
)

adminApi.interceptors.request.use(
  (config) => {
    // 从 localStorage 读取 Token 并附加
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ────────────────────────────────────
// 3. 响应拦截器 —— 成功时自动剥壳
// ────────────────────────────────────

function unwrapResponse(response: { data: ApiResponse }) {
  const res = response.data
  // 后端约定 code 0 或 200 为成功
  if (res.code === 0 || res.code === 200) {
    return res.data as unknown
  }
  // 业务失败，弹出提示并 reject
  ElMessage.error(res.message || '请求失败')
  return Promise.reject(new Error(res.message || '请求失败'))
}

publicApi.interceptors.response.use(unwrapResponse, undefined)
adminApi.interceptors.response.use(unwrapResponse, undefined)

// ────────────────────────────────────
// 4. 响应拦截器 —— 失败时统一处理
// ────────────────────────────────────

function handleHttpError(error: AxiosError) {
  if (error.response) {
    const status = error.response.status

    // 401 → 跳转后台登录页
    if (status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
      return Promise.reject(error)
    }

    // 其他 HTTP 状态码
    const messageMap: Record<number, string> = {
      403: '权限不足，请联系管理员',
      404: '请求资源不存在',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务暂不可用',
    }
    ElMessage.error(messageMap[status] || `请求失败 (${status})`)
    return Promise.reject(error)
  }

  // 网络层面错误
  if (error.code === 'ERR_NETWORK') {
    ElMessage.error('网络连接失败，请检查网络设置')
  } else if (error.code === 'ECONNABORTED') {
    ElMessage.error('请求超时，请稍后重试')
  } else {
    ElMessage.error('网络异常，请稍后重试')
  }

  return Promise.reject(error)
}

publicApi.interceptors.response.use(undefined, handleHttpError)
adminApi.interceptors.response.use(undefined, handleHttpError)

// ────────────────────────────────────
// 5. 初始化入口（main.ts 调用）
// ────────────────────────────────────

/**
 * 在 main.ts 中调用以完成 Axios 初始化。
 * 当前为静态模块加载，若后续需要动态配置 baseURL 可在此扩展。
 */
export function setupAxios(): void {
  // Axios 实例在模块顶层已创建，拦截器已注册。
  // 此函数保留为扩展入口，后续可按需从 env 覆盖 baseURL。
  if (import.meta.env.DEV) {
    console.log('[API] Axios dual instances initialized.')
    console.log('[API]   publicApi →', publicApi.defaults.baseURL)
    console.log('[API]   adminApi  →', adminApi.defaults.baseURL)
  }
}
