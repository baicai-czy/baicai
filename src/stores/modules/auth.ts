// ── 认证状态管理 Store ──

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// ── 常量 ──

const TOKEN_KEY = 'admin_token'
const REFRESH_TOKEN_KEY = 'admin_refresh_token'
const USER_INFO_KEY = 'admin_user_info'

// ── 类型定义 ──

/** 用户信息 */
export interface UserInfo {
  id: number
  username: string
  avatar: string
  role: string
  permissions: string[]
}

/** 登录请求参数 */
export interface LoginParams {
  username: string
  password: string
}

// ── localStorage 工具函数 ──

function getStoredToken(): string {
  try { return localStorage.getItem(TOKEN_KEY) ?? '' } catch { return '' }
}
function setStoredToken(token: string): void {
  try { localStorage.setItem(TOKEN_KEY, token) } catch { /* ignore */ }
}
function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_INFO_KEY)
  } catch { /* ignore */ }
}
function getStoredRefreshToken(): string {
  try { return localStorage.getItem(REFRESH_TOKEN_KEY) ?? '' } catch { return '' }
}
function setStoredRefreshToken(token: string): void {
  try { localStorage.setItem(REFRESH_TOKEN_KEY, token) } catch { /* ignore */ }
}
function getStoredUserInfo(): UserInfo | null {
  try {
    const raw = localStorage.getItem(USER_INFO_KEY)
    return raw ? (JSON.parse(raw) as UserInfo) : null
  } catch { return null }
}
function setStoredUserInfo(info: UserInfo): void {
  try { localStorage.setItem(USER_INFO_KEY, JSON.stringify(info)) } catch { /* ignore */ }
}

// ── Store 定义 ──

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(getStoredToken())
  const refreshToken = ref<string>(getStoredRefreshToken())
  const userInfo = ref<UserInfo | null>(getStoredUserInfo())

  const isLoggedIn = computed(() => token.value.length > 0)

  async function login(params: LoginParams): Promise<boolean> {
    try {
      const { login: loginApi } = await import('@/api/modules/auth')
      // 后端返回 { token, refreshToken, expiresIn }，拦截器已剥壳
      const result = await loginApi({
        username: params.username,
        password: params.password,
        captchaCode: '',
        captchaUuid: '',
      }) as { token: string; refreshToken: string; expiresIn: number } | null

      if (result?.token) {
        token.value = result.token
        refreshToken.value = result.refreshToken
        setStoredToken(result.token)
        setStoredRefreshToken(result.refreshToken)

        // 登录成功后立即拉取用户信息
        await fetchUserInfo()
        return true
      }
      return false
    } catch {
      console.warn('[useAuthStore] login failed.')
      return false
    }
  }

  async function logout(): Promise<void> {
    try {
      const { logout: logoutApi } = await import('@/api/modules/auth')
      await logoutApi()
    } catch { /* ignore */ }

    token.value = ''
    refreshToken.value = ''
    userInfo.value = null
    removeStoredToken()
  }

  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) return false
    try {
      const { refreshToken: refreshApi } = await import('@/api/modules/auth')
      // 刷新接口：需要在 adminApi 里带上当前 refreshToken
      // 后端 /api/auth/refresh 通过 Authorization Bearer 传 refreshToken
      const result = await refreshApi() as { token: string; refreshToken: string; expiresIn: number } | null

      if (result?.token) {
        token.value = result.token
        refreshToken.value = result.refreshToken || refreshToken.value
        setStoredToken(result.token)
        if (result.refreshToken) setStoredRefreshToken(result.refreshToken)
        return true
      }
      return false
    } catch {
      token.value = ''
      refreshToken.value = ''
      userInfo.value = null
      removeStoredToken()
      return false
    }
  }

  async function fetchUserInfo(): Promise<UserInfo | null> {
    try {
      const { getUserInfo } = await import('@/api/modules/auth')
      const result = await getUserInfo() as UserInfo | null

      if (result) {
        const info: UserInfo = {
          id: result.id,
          username: result.username,
          avatar: result.avatar || '',
          role: result.role || '',
          permissions: Array.isArray(result.permissions) ? result.permissions : [],
        }
        userInfo.value = info
        setStoredUserInfo(info)
        return info
      }
      return null
    } catch {
      console.warn('[useAuthStore] fetchUserInfo failed.')
      return null
    }
  }

  return {
    token, refreshToken, userInfo,
    isLoggedIn,
    login, logout, refreshAccessToken, fetchUserInfo,
  }
})
