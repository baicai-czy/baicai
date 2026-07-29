// ── 解决方案 API ──

import { publicApi } from '@/api'
import type { SolutionItem } from '@/types/components'

/**
 * 获取全部解决方案列表
 */
export function fetchSolutions(): Promise<SolutionItem[]> {
  return publicApi.get('/solutions') as Promise<SolutionItem[]>
}

/**
 * 根据 ID 获取解决方案详情
 */
export function fetchSolutionById(id: number): Promise<SolutionItem> {
  return publicApi.get(`/solutions/${id}`) as Promise<SolutionItem>
}
