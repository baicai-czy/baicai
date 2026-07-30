// ── 新闻管理 API ──

import { adminApi } from '@/api'
import type { NewsItem } from '@/types/news'
import type { PaginatedResponse } from '@/types/api'

export function fetchNewsList(params: { page: number; pageSize?: number; category?: string; keyword?: string }): Promise<PaginatedResponse<NewsItem>> {
  return adminApi.get('/news', { params }) as Promise<PaginatedResponse<NewsItem>>
}

export function fetchNewsById(id: number): Promise<NewsItem> {
  return adminApi.get(`/news/${id}`) as Promise<NewsItem>
}

export function createNews(data: Partial<NewsItem> & { title: string }): Promise<{ id: number }> {
  return adminApi.post('/news', data) as Promise<{ id: number }>
}

export function updateNews(id: number, data: Partial<NewsItem>): Promise<{ success: boolean }> {
  return adminApi.put(`/news/${id}`, data) as Promise<{ success: boolean }>
}

export function deleteNews(id: number): Promise<{ success: boolean }> {
  return adminApi.delete(`/news/${id}`) as Promise<{ success: boolean }>
}

export function reviewNews(id: number, reviewStatus: 'approved' | 'rejected' | 'pending'): Promise<{ success: boolean }> {
  return adminApi.patch(`/news/${id}/review`, { reviewStatus }) as Promise<{ success: boolean }>
}
