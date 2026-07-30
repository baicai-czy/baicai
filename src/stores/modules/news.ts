// ── 新闻状态管理 Store ──

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { NewsItem, NewsCategory } from '@/types/news'
import { SITE_DEFAULTS } from '@/utils/constants'

// ── 默认 Mock 数据（API 未就绪时的 fallback） ──
const MOCK_NEWS: NewsItem[] = [
  {
    id: 1, title: '城际云发布 CloudMatrix 3.0 平台', summary: '新一代云管理平台正式发布，全面支持混合云与多云管理...', content: '', category: 'company' as NewsCategory, coverImage: '', source: '本站', author: '城际云', viewCount: 1280, isPinned: true, isPublished: true, publishTime: '2026-07-25', createTime: '', updateTime: '', tags: ['云平台', '产品发布'], attachments: [],
  },
  {
    id: 2, title: '城际云获评 2026 年度最佳云服务商', summary: '在 2026 中国云计算大会上，城际云荣获"年度最佳云服务商"称号...', content: '', category: 'company' as NewsCategory, coverImage: '', source: '本站', author: '城际云', viewCount: 960, isPinned: false, isPublished: true, publishTime: '2026-07-20', createTime: '', updateTime: '', tags: ['获奖', '企业荣誉'], attachments: [],
  },
  {
    id: 3, title: '云计算行业规模预计突破万亿', summary: '据工信部最新报告，2026 年中国云计算市场规模将突破万亿...', content: '', category: 'industry' as NewsCategory, coverImage: '', source: '行业资讯', author: '转载', viewCount: 850, isPinned: false, isPublished: true, publishTime: '2026-07-18', createTime: '', updateTime: '', tags: ['行业动态', '市场趋势'], attachments: [],
  },
  {
    id: 4, title: '关于系统升级维护的通知', summary: '为提升平台服务稳定性，计划于 7 月 30 日凌晨进行系统升级维护...', content: '', category: 'notice' as NewsCategory, coverImage: '', source: '本站', author: '运维团队', viewCount: 520, isPinned: true, isPublished: true, publishTime: '2026-07-28', createTime: '', updateTime: '', tags: ['运维通知'], attachments: [],
  },
]

export const useNewsStore = defineStore('news', () => {
  const list = ref<NewsItem[]>([])
  const total = ref<number>(0)
  const category = ref<NewsCategory | 'all'>('all')
  const keyword = ref<string>('')
  const loading = ref<boolean>(false)
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(SITE_DEFAULTS.newsPageSize)
  const detail = ref<NewsItem | null>(null)
  const requestSeq = ref<number>(0)

  const isEmpty = computed<boolean>(() => !loading.value && list.value.length === 0)
  const hasMore = computed<boolean>(() => list.value.length < total.value)

  function nextSeq(): number { requestSeq.value += 1; return requestSeq.value }
  function isLatestSeq(seq: number): boolean { return seq === requestSeq.value }

  async function loadList(page = 1, size?: number): Promise<void> {
    const seq = nextSeq()
    const ps = size ?? pageSize.value
    loading.value = true
    currentPage.value = page

    try {
      const { fetchNewsList: getNewsList } = await import('@/api/modules/news')
      const data = await getNewsList({ page, pageSize: ps, category: category.value, keyword: keyword.value || undefined })
      if (!isLatestSeq(seq)) return
      if (data) {
        list.value = (data as any).records ?? []
        total.value = (data as any).total ?? 0
      }
    } catch {
      if (!isLatestSeq(seq)) return
      // API 未就绪时使用 Mock 数据
      if (list.value.length === 0) {
        list.value = MOCK_NEWS
        total.value = MOCK_NEWS.length
      }
      console.warn('[useNewsStore] loadList failed, using mock data.')
    } finally {
      if (isLatestSeq(seq)) loading.value = false
    }
  }

  async function switchCategory(cat: NewsCategory | 'all'): Promise<void> {
    if (cat === category.value) return
    category.value = cat; keyword.value = ''
    await loadList(1)
  }

  async function search(kw: string): Promise<void> {
    keyword.value = kw
    await loadList(1)
  }

  async function loadDetail(id: number): Promise<NewsItem | null> {
    const seq = nextSeq()
    loading.value = true
    try {
      const { fetchNewsById: getNewsDetail } = await import('@/api/modules/news')
      const data = await getNewsDetail(id)
      if (!isLatestSeq(seq)) return null
      if (data) { detail.value = data as NewsItem; return data as NewsItem }
      return null
    } catch {
      if (!isLatestSeq(seq)) return null
      return null
    } finally {
      if (isLatestSeq(seq)) loading.value = false
    }
  }

  return { list, total, category, keyword, loading, currentPage, pageSize, detail, requestSeq, isEmpty, hasMore, loadList, switchCategory, search, loadDetail }
})
