// ── Banner API ──

import { publicApi } from '@/api'
import type { BannerItem } from '@/types/components'

/**
 * 获取全部启用的 Banner 列表（按 sortOrder 排序）
 */
export function fetchBanners(): Promise<BannerItem[]> {
  return publicApi.get('/banners') as Promise<BannerItem[]>
}
