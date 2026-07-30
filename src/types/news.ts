// ── 新闻相关类型 ──

/** 新闻分类 */
export type NewsCategory = 'company' | 'industry' | 'notice'

/** 新闻条目 */
export interface NewsItem {
  id: number
  title: string
  summary: string
  content: string
  category: NewsCategory
  coverImage: string
  source: string
  author: string
  viewCount: number
  isPinned: boolean
  isPublished: boolean
  reviewStatus?: 'draft' | 'pending' | 'approved' | 'rejected'
  publishTime: string
  createTime: string
  updateTime: string
  tags: string[]
  attachments: Attachment[]
}

/** 新闻附件 */
export interface Attachment {
  name: string
  url: string
  size: number
  type: string
}

/** 新闻查询参数 */
export interface NewsQuery {
  page: number
  pageSize: number
  category?: NewsCategory | 'all'
  keyword?: string
  tag?: string
}
