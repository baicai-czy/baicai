// ── CMS 内容页管理 API ──
import { adminApi } from '@/api'

export interface CmsPage { id?: number; slug: string; title: string; content: string; meta: Record<string,any>; updatedAt?: string }

export function fetchCmsPage(slug: string): Promise<CmsPage | null> { return adminApi.get('/cms', { params: { slug } }) as Promise<CmsPage | null> }
export function saveCmsPage(data: { slug: string; title: string; content: string; meta?: Record<string,any> }): Promise<{ success: boolean }> { return adminApi.put('/cms', data) as Promise<{ success: boolean }> }
