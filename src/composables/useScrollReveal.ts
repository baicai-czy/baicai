// ── 滚动渐入动画 composable ──
import { onMounted, onBeforeUnmount } from 'vue'

/**
 * 为元素添加滚动渐入动画
 * @param selector - 要观察的 CSS 选择器，默认为 `.reveal`
 * @param options - IntersectionObserver 选项
 */
export function useScrollReveal(
  selector = '.reveal',
  options: {
    threshold?: number
    rootMargin?: string
    staggerDelay?: number
  } = {},
) {
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px', staggerDelay = 120 } = options

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const elements = document.querySelectorAll(selector)

    if (elements.length === 0) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, entryIndex) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            // 逐项延迟，产生依次入场效果
            const index = Array.from(elements).indexOf(el)
            el.style.transitionDelay = `${index * staggerDelay}ms`
            el.classList.add('revealed')
            observer?.unobserve(el)
          }
        })
      },
      { threshold, rootMargin },
    )

    elements.forEach((el) => observer!.observe(el))
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })
}
