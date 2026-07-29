// ── 数据指标管理 API ──

import { adminApi } from '@/api'
import type { StatItem } from '@/types/components'

export function fetchStats(): Promise<StatItem[]> {
  return adminApi.get('/stats') as Promise<StatItem[]>
}

export function createStat(data: Partial<StatItem> & { label: string; value: number }): Promise<{ id: number }> {
  return adminApi.post('/stats', data) as Promise<{ id: number }>
}

export function updateStat(id: number, data: Partial<StatItem>): Promise<{ success: boolean }> {
  return adminApi.put(`/stats/${id}`, data) as Promise<{ success: boolean }>
}

export function deleteStat(id: number): Promise<{ success: boolean }> {
  return adminApi.delete(`/stats/${id}`) as Promise<{ success: boolean }>
}
