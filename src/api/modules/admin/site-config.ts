// ── 站点配置管理 API ──

import { adminApi } from '@/api'
import type { SiteConfig } from '@/api/types'

export function updateSiteConfig(data: Partial<SiteConfig>): Promise<{ success: boolean }> {
  return adminApi.put('/site-config', data) as Promise<{ success: boolean }>
}
