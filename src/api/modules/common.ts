// ── 通用（站点配置 / 合作伙伴 / 数据指标）API ──

import { publicApi } from '@/api'
import type { SiteConfig } from '@/api/types'
import type { PartnerItem, StatItem } from '@/types/components'

/**
 * 获取站点全局配置（Logo、SEO、备案号等）
 */
export function fetchSiteConfig(): Promise<SiteConfig> {
  return publicApi.get('/site-config') as Promise<SiteConfig>
}

/**
 * 获取合作伙伴列表
 */
export function fetchPartners(): Promise<PartnerItem[]> {
  return publicApi.get('/partners') as Promise<PartnerItem[]>
}

/**
 * 获取首页数据亮点指标
 */
export function fetchStats(): Promise<StatItem[]> {
  return publicApi.get('/stats') as Promise<StatItem[]>
}
