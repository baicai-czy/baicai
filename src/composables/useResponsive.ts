// ── 响应式断点检测 ──
import { ref, onMounted, onBeforeUnmount } from 'vue'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const breakpoints: Record<Breakpoint, number> = {
  xs: 375,
  sm: 768,
  md: 1280,
  lg: 1440,
  xl: 1920,
}

export function useResponsive() {
  const breakpoint = ref<Breakpoint>('xl')
  const isMobile = ref(false)
  const windowWidth = ref(1920)

  function update() {
    windowWidth.value = window.innerWidth
    if (window.innerWidth < 768) {
      breakpoint.value = 'xs'
      isMobile.value = true
    } else if (window.innerWidth < 1280) {
      breakpoint.value = 'sm'
      isMobile.value = false
    } else if (window.innerWidth < 1440) {
      breakpoint.value = 'md'
      isMobile.value = false
    } else if (window.innerWidth < 1920) {
      breakpoint.value = 'lg'
      isMobile.value = false
    } else {
      breakpoint.value = 'xl'
      isMobile.value = false
    }
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update)
  })

  return { breakpoint, isMobile, windowWidth }
}
