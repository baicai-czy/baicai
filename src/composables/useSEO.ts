// ── SEO 元标签 composable ──
import { useHead } from '@vueuse/head'

export interface SEOMeta {
  title: string
  description?: string
  keywords?: string
  image?: string
}

/**
 * 动态设置页面 SEO 元标签
 * 在页面组件的 setup 中调用
 */
export function useSEO(meta: SEOMeta) {
  useHead({
    title: meta.title,
    meta: [
      { name: 'description', content: meta.description || '' },
      { name: 'keywords', content: meta.keywords || '' },
      { property: 'og:title', content: meta.title },
      { property: 'og:description', content: meta.description || '' },
      { property: 'og:image', content: meta.image || '' },
    ],
  })
}
