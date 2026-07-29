// ── API 层专用类型定义 ──

import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api'

// ── 登录 ──
export interface LoginParams {
  username: string
  password: string
  captchaCode: string
  captchaUuid: string
}

export interface LoginResult {
  token: string
  refreshToken: string
  expiresIn: number
}

export interface UserInfo {
  id: number
  username: string
  avatar: string
  role: string
  permissions: string[]
}

// ── 新闻 ──
export interface NewsQueryParams extends PaginationParams {
  category?: string
  keyword?: string
  tag?: string
}

// ── 产品 ──
export interface ProductQueryParams extends PaginationParams {
  category?: string
  keyword?: string
}

// ── 咨询提交 ──
export interface ConsultFormData {
  name: string
  company: string
  phone: string
  email: string
  description: string
  captchaCode: string
}

export interface ServiceRequestData {
  companyName: string
  contactName: string
  phone: string
  email: string
  serviceType: string
  description: string
  captchaCode: string
}

// ── 站点配置 ──
export interface SiteConfig {
  siteName: string
  logo: string
  icp: string
  copyright: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  contactPhone: string
  contactEmail: string
  address: string
}

// ── 重导出常用类型 ──
export type { ApiResponse, PaginatedResponse, PaginationParams }
