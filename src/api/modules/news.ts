// ── 新闻 API ──

import { publicApi } from '@/api'
import type { NewsItem } from '@/types/news'
import type { PaginatedResponse } from '@/types/api'
import type { NewsQueryParams } from '@/api/types'

/**
 * 分页获取新闻列表
 */
export function fetchNewsList(
  params: NewsQueryParams,
): Promise<PaginatedResponse<NewsItem>> {
  return publicApi.get('/news', { params }) as Promise<PaginatedResponse<NewsItem>>
}

/**
 * 根据 ID 获取新闻详情
 */
export function fetchNewsById(id: number): Promise<NewsItem> {
  return publicApi.get(`/news/${id}`) as Promise<NewsItem>
}

/**
 * 获取热门新闻（最新置顶）
 */
export function fetchHotNews(limit: number = 5): Promise<NewsItem[]> {
  return publicApi.get('/news/hot', { params: { limit } }) as Promise<NewsItem[]>
}
