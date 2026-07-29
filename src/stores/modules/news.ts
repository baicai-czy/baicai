// ── 新闻状态管理 Store ──

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { NewsItem, NewsCategory } from '@/types/news'
import { SITE_DEFAULTS } from '@/utils/constants'

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
      // 拦截器已剥壳，data 就是 { records, total, page, pageSize, pages }
      if (!isLatestSeq(seq)) return
      if (data) {
        list.value = (data as any).records ?? []
        total.value = (data as any).total ?? 0
      }
    } catch {
      if (!isLatestSeq(seq)) return
      console.warn('[useNewsStore] loadList failed.')
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
