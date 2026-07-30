// ── 通用（站点配置 / 合作伙伴 / 数据指标 / 友情链接 / 历程 / 资质 / CMS内容）API ──

import { publicApi } from '@/api'
import type { SiteConfig } from '@/api/types'
import type { PartnerItem, StatItem, LinkItem, TimelineNode, HonorItem } from '@/types/components'

// ── 站点配置 ──
export function fetchSiteConfig(): Promise<SiteConfig> {
  return publicApi.get('/site-config') as Promise<SiteConfig>
}

// ── 合作伙伴 ──
export function fetchPartners(): Promise<PartnerItem[]> {
  return publicApi.get('/partners') as Promise<PartnerItem[]>
}

// ── 数据指标 ──
export function fetchStats(): Promise<StatItem[]> {
  return publicApi.get('/stats') as Promise<StatItem[]>
}

// ── 友情链接 ──
export function fetchLinks(): Promise<LinkItem[]> {
  return publicApi.get('/links') as Promise<LinkItem[]>
}

// ── 发展历程 ──
export function fetchTimeline(): Promise<TimelineNode[]> {
  return publicApi.get('/timeline') as Promise<TimelineNode[]>
}

// ── 资质荣誉 ──
export function fetchHonors(): Promise<HonorItem[]> {
  return publicApi.get('/honors') as Promise<HonorItem[]>
}

// ── CMS 通用内容 ──
export function fetchCmsPage(slug: string): Promise<{ title: string; content: string; meta: Record<string,any> } | null> {
  return publicApi.get(`/cms/${slug}`) as Promise<{ title: string; content: string; meta: Record<string,any> } | null>
}
