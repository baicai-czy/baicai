// ── Banner 状态管理 Store ──
// 架构规范：第6章 — setup 语法、5 分钟缓存策略（基于 timestamp）

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { BannerItem } from '@/types/components'

// ── 缓存时长（毫秒） ──
const CACHE_TTL = 5 * 60 * 1000 // 5 分钟

// ── 硬编码默认 Banner（fallback） ──
const DEFAULT_BANNER: BannerItem = {
  id: 0,
  imageUrl: '/images/banner-default.jpg',
  title: '欢迎访问企业门户',
  subtitle: '专业 · 创新 · 共赢',
  link: '/about',
  sortOrder: 0,
  isActive: true,
}

// ── Store 定义 ──

export const useBannerStore = defineStore('banner', () => {
  // ═══════════════════════════ state ═══════════════════════════

  /** Banner 数据列表 */
  const banners = ref<BannerItem[]>([])

  /** 加载状态 */
  const loading = ref<boolean>(false)

  /** 上次成功拉取的时间戳（毫秒），用于缓存判断 */
  const lastFetchTime = ref<number>(0)

  // ═══════════════════════════ getters ═══════════════════════════

  /** 过滤出 isActive 为 true 的 Banner */
  const activeBanners = computed<BannerItem[]>(() => {
    return banners.value
      .filter((b) => b.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  })

  /** 默认 Banner（当 activeBanners 为空时的 fallback） */
  const defaultBanner = computed<BannerItem>(() => {
    return banners.value.length > 0 ? banners.value[0] : DEFAULT_BANNER
  })

  // ═══════════════════════════ 私有辅助 ═══════════════════════════

  /** 判断缓存是否有效 */
  function isCacheValid(): boolean {
    return Date.now() - lastFetchTime.value < CACHE_TTL && banners.value.length > 0
  }

  // ═══════════════════════════ actions ═══════════════════════════

  /**
   * 获取 Banner 列表（带 5 分钟缓存）
   * @param force - 是否强制刷新，忽略缓存
   */
  async function fetchBanners(force = false): Promise<void> {
    // 缓存命中：在有效期内且非强制刷新，直接返回
    if (!force && isCacheValid()) {
      return
    }

    // 防止并发重复请求
    if (loading.value) return

    loading.value = true
    try {
      const { fetchBanners: getBanners } = await import('@/api/modules/banner')
      const res = await getBanners()
      if (res?.data && Array.isArray(res.data)) {
        banners.value = res.data
        lastFetchTime.value = Date.now()
      }
    } catch {
      // API 未就绪时使用默认 Banner，不覆盖已有数据
      if (banners.value.length === 0) {
        banners.value = [DEFAULT_BANNER]
      }
      console.warn('[useBannerStore] fetchBanners failed, using fallback.')
    } finally {
      loading.value = false
    }
  }

  // ═══════════════════════════ return ═══════════════════════════

  return {
    // state
    banners,
    loading,
    lastFetchTime,
    // getters
    activeBanners,
    defaultBanner,
    // actions
    fetchBanners,
  }
})
