// ── Banner 轮播与预加载逻辑 ──
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useBannerStore } from '@/stores/modules/banner'
import type { BannerItem } from '@/types/components'

export function useBanner() {
  const bannerStore = useBannerStore()
  const currentIndex = ref(0)
  const isPaused = ref(false)
  const preloaded = ref(new Set<number>())
  let timer: ReturnType<typeof setInterval> | null = null
  const INTERVAL = 5000 // 自动轮播间隔

  function startAutoPlay() {
    stopAutoPlay()
    timer = setInterval(() => {
      if (!isPaused.value && bannerStore.activeBanners.length > 1) {
        next()
      }
    }, INTERVAL)
  }

  function stopAutoPlay() {
    if (timer) clearInterval(timer)
  }

  function goTo(index: number) {
    const banners = bannerStore.activeBanners
    if (banners.length === 0) return
    currentIndex.value = ((index % banners.length) + banners.length) % banners.length
    preloadNext()
  }

  function next() {
    goTo(currentIndex.value + 1)
  }

  function prev() {
    goTo(currentIndex.value - 1)
  }

  /** 预加载下一张图片 */
  function preloadNext() {
    const banners = bannerStore.activeBanners
    if (banners.length === 0) return
    const nextIdx = (currentIndex.value + 1) % banners.length
    if (!preloaded.value.has(nextIdx)) {
      const img = new Image()
      img.src = banners[nextIdx].imageUrl
      preloaded.value.add(nextIdx)
    }
  }

  function pause() {
    isPaused.value = true
  }

  function resume() {
    isPaused.value = false
  }

  onMounted(async () => {
    await bannerStore.fetchBanners()
    preloaded.value.add(0) // 首张已加载
    startAutoPlay()
  })

  onBeforeUnmount(() => {
    stopAutoPlay()
  })

  return {
    banners: bannerStore.activeBanners,
    defaultBanner: bannerStore.defaultBanner,
    currentIndex,
    isPaused,
    goTo,
    next,
    prev,
    pause,
    resume,
  }
}
