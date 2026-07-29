// ── 认证 API ──

import { publicApi, adminApi } from '@/api'
import type { LoginParams, LoginResult, UserInfo } from '@/api/types'

/**
 * 后台登录（公开接口）
 */
export function login(data: LoginParams): Promise<LoginResult> {
  return publicApi.post('/auth/login', data) as Promise<LoginResult>
}

/**
 * 刷新 Token
 */
export function refreshToken(): Promise<LoginResult> {
  return publicApi.post('/auth/refresh') as Promise<LoginResult>
}

/**
 * 登出（通知服务端）
 */
export function logout(): Promise<void> {
  return adminApi.post('/auth/logout') as Promise<void>
}

/**
 * 获取当前登录用户信息（管理端接口）
 */
export function getUserInfo(): Promise<UserInfo> {
  return adminApi.get('/auth/user-info') as Promise<UserInfo>
}
