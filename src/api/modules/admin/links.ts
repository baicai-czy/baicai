// ── 友情链接管理 API ──
import { adminApi } from '@/api'

export interface LinkItem {
  id: number
  name: string
  url: string
  sortOrder: number
  isActive: boolean
}

export function fetchLinks(): Promise<LinkItem[]> {
  return adminApi.get('/links') as Promise<LinkItem[]>
}

export function createLink(data: Partial<LinkItem>): Promise<{ id: number }> {
  return adminApi.post('/links', data) as Promise<{ id: number }>
}

export function updateLink(id: number, data: Partial<LinkItem>): Promise<{ success: boolean }> {
  return adminApi.put(`/links/${id}`, data) as Promise<{ success: boolean }>
}

export function deleteLink(id: number): Promise<{ success: boolean }> {
  return adminApi.delete(`/links/${id}`) as Promise<{ success: boolean }>
}
