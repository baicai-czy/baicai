// ── 解决方案管理 API ──

import { adminApi } from '@/api'
import type { SolutionItem } from '@/types/components'

export function fetchSolutions(): Promise<SolutionItem[]> {
  return adminApi.get('/solutions') as Promise<SolutionItem[]>
}

export function createSolution(data: Partial<SolutionItem> & { title: string }): Promise<{ id: number }> {
  return adminApi.post('/solutions', data) as Promise<{ id: number }>
}

export function updateSolution(id: number, data: Partial<SolutionItem>): Promise<{ success: boolean }> {
  return adminApi.put(`/solutions/${id}`, data) as Promise<{ success: boolean }>
}

export function deleteSolution(id: number): Promise<{ success: boolean }> {
  return adminApi.delete(`/solutions/${id}`) as Promise<{ success: boolean }>
}
