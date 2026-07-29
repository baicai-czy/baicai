// ── 认证状态管理 Store ──
// 架构规范：第6章 — setup 语法、token 读写 localStorage('admin_token')

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// ── 常量 ──

/** localStorage 中 token 的 Key */
const TOKEN_KEY = 'admin_token'

/** localStorage 中 refreshToken 的 Key */
const REFRESH_TOKEN_KEY = 'admin_refresh_token'

/** localStorage 中用户信息的 Key */
const USER_INFO_KEY = 'admin_user_info'

// ── 类型定义 ──

/** 用户信息 */
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  email: string
  roles: string[]
  permissions: string[]
}

/** 登录请求参数 */
export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

/** 登录响应 */
export interface LoginResult {
  token: string
  refreshToken: string
  userInfo: UserInfo
}

// ── localStorage 工具函数 ──

function getStoredToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? ''
  } catch {
    return ''
  }
}

function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    console.warn('[useAuthStore] Failed to write token to localStorage.')
  }
}

function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_INFO_KEY)
  } catch {
    // ignore
  }
}

function getStoredRefreshToken(): string {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY) ?? ''
  } catch {
    return ''
  }
}

function setStoredRefreshToken(token: string): void {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } catch {
    console.warn('[useAuthStore] Failed to write refreshToken to localStorage.')
  }
}

function getStoredUserInfo(): UserInfo | null {
  try {
    const raw = localStorage.getItem(USER_INFO_KEY)
    return raw ? (JSON.parse(raw) as UserInfo) : null
  } catch {
    return null
  }
}

function setStoredUserInfo(info: UserInfo): void {
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info))
  } catch {
    console.warn('[useAuthStore] Failed to write userInfo to localStorage.')
  }
}

// ── Store 定义 ──

export const useAuthStore = defineStore('auth', () => {
  // ═══════════════════════════ state ═══════════════════════════

  /** 访问令牌 */
  const token = ref<string>(getStoredToken())

  /** 刷新令牌 */
  const refreshToken = ref<string>(getStoredRefreshToken())

  /** 当前用户信息 */
  const userInfo = ref<UserInfo | null>(getStoredUserInfo())

  // ═══════════════════════════ getters ═══════════════════════════

  /** 是否已登录（基于 token 是否存在） */
  const isLoggedIn = computed<boolean>(() => {
    return token.value.length > 0
  })

  // ═══════════════════════════ actions ═══════════════════════════

  /**
   * 登录
   * @param params - 登录参数 { username, password, captcha? }
   * @returns 是否登录成功
   */
  async function login(params: LoginParams): Promise<boolean> {
    try {
      const { login: loginApi } = await import('@/api/modules/auth')
      const res = await loginApi(params)

      if (res?.data) {
        const result = res.data as LoginResult
        token.value = result.token
        refreshToken.value = result.refreshToken
        userInfo.value = result.userInfo

        setStoredToken(result.token)
        setStoredRefreshToken(result.refreshToken)
        setStoredUserInfo(result.userInfo)

        return true
      }
      return false
    } catch {
      console.warn('[useAuthStore] login failed.')
      return false
    }
  }

  /**
   * 登出
   * 清除内存状态与 localStorage 持久化数据
   */
  async function logout(): Promise<void> {
    try {
      const { logout: logoutApi } = await import('@/api/modules/auth')
      await logoutApi()
    } catch {
      // 即使服务端通知失败，也要清除本地状态
    }

    token.value = ''
    refreshToken.value = ''
    userInfo.value = null
    removeStoredToken()
  }

  /**
   * 刷新访问令牌
   * 使用 refreshToken 换取新的 token，并更新状态与 localStorage
   * @returns 是否刷新成功
   */
  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) return false

    try {
      const { refreshToken: refreshApi } = await import('@/api/modules/auth')
      const res = await refreshApi({ refreshToken: refreshToken.value })

      if (res?.data) {
        token.value = res.data.token
        refreshToken.value = res.data.refreshToken ?? refreshToken.value

        setStoredToken(res.data.token)
        if (res.data.refreshToken) {
          setStoredRefreshToken(res.data.refreshToken)
        }

        return true
      }
      return false
    } catch {
      console.warn('[useAuthStore] refreshAccessToken failed.')
      // 刷新失败，清除登录态
      token.value = ''
      refreshToken.value = ''
      userInfo.value = null
      removeStoredToken()
      return false
    }
  }

  /**
   * 获取当前用户信息
   * 从服务端拉取最新用户信息并更新 state 与 localStorage
   * @returns 用户信息，失败返回 null
   */
  async function fetchUserInfo(): Promise<UserInfo | null> {
    try {
      const { getUserInfo } = await import('@/api/modules/auth')
      const res = await getUserInfo()

      if (res?.data) {
        userInfo.value = res.data as UserInfo
        setStoredUserInfo(res.data)
        return res.data
      }
      return null
    } catch {
      console.warn('[useAuthStore] fetchUserInfo failed.')
      return null
    }
  }

  // ═══════════════════════════ return ═══════════════════════════

  return {
    // state
    token,
    refreshToken,
    userInfo,
    // getters
    isLoggedIn,
    // actions
    login,
    logout,
    refreshAccessToken,
    fetchUserInfo,
  }
})
