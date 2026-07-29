// ── Banner 状态管理 Store ──

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { BannerItem } from '@/types/components'

// ── 默认 Banner（fallback） ──
const DEFAULT_BANNER: BannerItem = {
  id: 0,
  imageUrl: '/images/banner-default.jpg',
  title: '欢迎访问企业门户',
  subtitle: '专业 · 创新 · 共赢',
  link: '/about',
  sortOrder: 0,
  isActive: true,
}

export const useBannerStore = defineStore('banner', () => {
  const banners = ref<BannerItem[]>([])
  const loading = ref<boolean>(false)

  const activeBanners = computed<BannerItem[]>(() => {
    return banners.value
      .filter((b) => b.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  })

  const defaultBanner = computed<BannerItem>(() => {
    return banners.value.length > 0 ? banners.value[0] : DEFAULT_BANNER
  })

  /**
   * 获取 Banner 列表（无缓存，每次调后台实时数据）
   */
  async function fetchBanners(): Promise<void> {
    if (loading.value) return
    loading.value = true
    try {
      const { fetchBanners: getBanners } = await import('@/api/modules/banner')
      const data = await getBanners()
      // 拦截器已剥壳，data 就是 BannerItem[] 数组
      if (Array.isArray(data)) {
        banners.value = data
      }
    } catch {
      if (banners.value.length === 0) {
        banners.value = [DEFAULT_BANNER]
      }
      console.warn('[useBannerStore] fetchBanners failed, using fallback.')
    } finally {
      loading.value = false
    }
  }

  return { banners, loading, activeBanners, defaultBanner, fetchBanners }
})
