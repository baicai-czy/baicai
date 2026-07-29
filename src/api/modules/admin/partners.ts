// ── 合作伙伴管理 API ──

import { adminApi } from '@/api'
import type { PartnerItem } from '@/types/components'

export function fetchPartners(): Promise<PartnerItem[]> {
  return adminApi.get('/partners') as Promise<PartnerItem[]>
}

export function createPartner(data: Partial<PartnerItem> & { name: string }): Promise<{ id: number }> {
  return adminApi.post('/partners', data) as Promise<{ id: number }>
}

export function updatePartner(id: number, data: Partial<PartnerItem>): Promise<{ success: boolean }> {
  return adminApi.put(`/partners/${id}`, data) as Promise<{ success: boolean }>
}

export function deletePartner(id: number): Promise<{ success: boolean }> {
  return adminApi.delete(`/partners/${id}`) as Promise<{ success: boolean }>
}
