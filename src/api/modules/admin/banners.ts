// ── Banner 管理 API ──

import { adminApi } from '@/api'
import type { BannerItem } from '@/types/components'

export function fetchBanners(): Promise<BannerItem[]> {
  return adminApi.get('/banners') as Promise<BannerItem[]>
}

export function fetchBannerById(id: number): Promise<BannerItem> {
  return adminApi.get(`/banners/${id}`) as Promise<BannerItem>
}

export function createBanner(data: Partial<BannerItem>): Promise<{ id: number }> {
  return adminApi.post('/banners', data) as Promise<{ id: number }>
}

export function updateBanner(id: number, data: Partial<BannerItem>): Promise<{ success: boolean }> {
  return adminApi.put(`/banners/${id}`, data) as Promise<{ success: boolean }>
}

export function deleteBanner(id: number): Promise<{ success: boolean }> {
  return adminApi.delete(`/banners/${id}`) as Promise<{ success: boolean }>
}
