// ── 新闻状态管理 Store ──
// 架构规范：第6章 — setup 语法、竞态处理（requestSeq 递增序号）

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { NewsItem, NewsCategory } from '@/types/news'
import { SITE_DEFAULTS } from '@/utils/constants'

// ── Store 定义 ──

export const useNewsStore = defineStore('news', () => {
  // ═══════════════════════════ state ═══════════════════════════

  /** 新闻列表 */
  const list = ref<NewsItem[]>([])

  /** 新闻总数 */
  const total = ref<number>(0)

  /** 当前分类（默认 'all' 表示全部） */
  const category = ref<NewsCategory | 'all'>('all')

  /** 搜索关键词 */
  const keyword = ref<string>('')

  /** 加载状态 */
  const loading = ref<boolean>(false)

  /** 当前页码 */
  const currentPage = ref<number>(1)

  /** 每页条数 */
  const pageSize = ref<number>(SITE_DEFAULTS.newsPageSize)

  /** 当前详情项 */
  const detail = ref<NewsItem | null>(null)

  // ── 竞态处理 ──

  /**
   * 请求序号：每次发起请求前自增，回调中比对是否仍为最新。
   * 当用户快速切换分类或翻页时，旧请求的响应会被自动丢弃。
   */
  const requestSeq = ref<number>(0)

  // ═══════════════════════════ getters ═══════════════════════════

  /** 列表是否为空 */
  const isEmpty = computed<boolean>(() => {
    return !loading.value && list.value.length === 0
  })

  /** 是否还有更多数据（用于无限滚动） */
  const hasMore = computed<boolean>(() => {
    return list.value.length < total.value
  })

  // ═══════════════════════════ 私有辅助 ═══════════════════════════

  /**
   * 生成并返回新的请求序号，同时将旧序号作废
   */
  function nextSeq(): number {
    requestSeq.value += 1
    return requestSeq.value
  }

  /**
   * 检查给定的序号是否为最新
   */
  function isLatestSeq(seq: number): boolean {
    return seq === requestSeq.value
  }

  // ═══════════════════════════ actions ═══════════════════════════

  /**
   * 加载新闻列表
   * @param page - 目标页码，默认 1
   * @param size - 每页条数，默认使用 pageSize state
   */
  async function loadList(page = 1, size?: number): Promise<void> {
    const seq = nextSeq()
    const ps = size ?? pageSize.value

    loading.value = true
    currentPage.value = page

    try {
      const { fetchNewsList: getNewsList } = await import('@/api/modules/news')
      const res = await getNewsList({
        page,
        pageSize: ps,
        category: category.value,
        keyword: keyword.value || undefined,
      })

      // 竞态检查：仅当序号仍为最新时才更新 state
      if (!isLatestSeq(seq)) return

      if (res?.data) {
        list.value = res.data.records ?? []
        total.value = res.data.total ?? 0
      }
    } catch {
      if (!isLatestSeq(seq)) return
      console.warn('[useNewsStore] loadList failed.')
      // 失败时不清空已有数据
    } finally {
      if (isLatestSeq(seq)) {
        loading.value = false
      }
    }
  }

  /**
   * 切换新闻分类并重新加载列表
   * @param cat - 目标分类（NewsCategory 或 'all'）
   */
  async function switchCategory(cat: NewsCategory | 'all'): Promise<void> {
    // 相同分类不重复请求
    if (cat === category.value) return

    category.value = cat
    keyword.value = ''
    await loadList(1)
  }

  /**
   * 按关键词搜索并重新加载列表
   * @param kw - 搜索关键词
   */
  async function search(kw: string): Promise<void> {
    keyword.value = kw
    await loadList(1)
  }

  /**
   * 加载新闻详情
   * @param id - 新闻 ID
   */
  async function loadDetail(id: number): Promise<NewsItem | null> {
    const seq = nextSeq()
    loading.value = true

    try {
      const { fetchNewsById: getNewsDetail } = await import('@/api/modules/news')
      const res = await getNewsDetail(id)

      if (!isLatestSeq(seq)) return null

      if (res?.data) {
        detail.value = res.data
        return res.data
      }
      return null
    } catch {
      if (!isLatestSeq(seq)) return null
      console.warn('[useNewsStore] loadDetail failed.')
      return null
    } finally {
      if (isLatestSeq(seq)) {
        loading.value = false
      }
    }
  }

  // ═══════════════════════════ return ═══════════════════════════

  return {
    // state
    list,
    total,
    category,
    keyword,
    loading,
    currentPage,
    pageSize,
    detail,
    requestSeq,
    // getters
    isEmpty,
    hasMore,
    // actions
    loadList,
    switchCategory,
    search,
    loadDetail,
  }
})
