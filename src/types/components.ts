// ── 组件 Props 类型 ──

import type { RouteLocationRaw } from 'vue-router'

// ── Banner ──
export interface BannerItem {
  id: number
  imageUrl: string
  title: string
  subtitle: string
  link: string
  sortOrder: number
  isActive: boolean
}

// ── 快捷入口 ──
export interface QuickEntryItem {
  icon: string
  title: string
  description: string
  to: string | RouteLocationRaw
}

// ── 服务/产品卡片 ──
export interface ServiceCardItem {
  id: number
  icon: string
  title: string
  description: string
  to?: string | RouteLocationRaw
  features?: string[]
  category?: string
}

// ── 解决方案卡片 ──
export interface SolutionItem {
  id: number
  title: string
  targetCustomer: string
  description: string
  imageUrl: string
  detail?: string
}

// ── 案例卡片 ──
export interface CaseItem {
  id: number
  title: string
  customer: string
  industry: string
  description: string
  imageUrl: string
  results: string
}

// ── 时间轴节点 ──
export interface TimelineNode {
  id: number
  year: string
  month: string
  title: string
  description: string
  icon?: string
}

// ── 合作伙伴 ──
export interface PartnerItem {
  id: number
  name: string
  logoUrl: string
  website: string
}

// ── 数据亮点指标 ──
export interface StatItem {
  id: number
  label: string
  value: number
  suffix: string
  prefix: string
  /** 小数位数，默认 0 */
  decimals?: number
}

// ── 资质荣誉 ──
export interface HonorItem {
  id: number
  name: string
  category: string
  imageUrl: string
  issueDate: string
  issuingAuthority: string
}

// ── 联系表单 ──
export interface ContactFormData {
  name: string
  company: string
  phone: string
  email: string
  description: string
  captchaCode: string
}

export interface ServiceFormData {
  companyName: string
  contactName: string
  phone: string
  email: string
  serviceType: string
  description: string
  captchaCode: string
}

// ── 友情链接 ──
export interface LinkItem {
  id: number
  name: string
  url: string
  sortOrder?: number
  isActive?: boolean
}
