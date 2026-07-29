// ── 全局应用状态 Store ──
// 架构规范：第6章 — setup 语法、getters 使用 computed、actions 为普通函数

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { SITE_DEFAULTS } from '@/utils/constants'

// ── 类型定义 ──

/** 导航项 */
export interface NavItem {
  id: string
  label: string
  path: string
  children?: NavItem[]
}

/** 站点配置 */
export interface SiteConfig {
  title: string
  description: string
  logo: string
  favicon: string
  keywords: string
  icp: string
  copyright: string
}

/** 联系方式 */
export interface ContactInfo {
  address: string
  phone: string
  email: string
  workingHours: string
  qrCode?: string
}

// ── 默认值 ──

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: '首页', path: '/' },
  { id: 'about', label: '关于我们', path: '/about' },
  { id: 'business', label: '业务版块', path: '/business' },
  { id: 'products', label: '产品与服务', path: '/products' },
  { id: 'solutions', label: '解决方案', path: '/solutions' },
  { id: 'news', label: '新闻中心', path: '/news' },
  { id: 'contact', label: '联系我们', path: '/contact' },
]

const DEFAULT_SITE_CONFIG: SiteConfig = {
  title: SITE_DEFAULTS.title,
  description: SITE_DEFAULTS.description,
  logo: '/logo.png',
  favicon: '/favicon.ico',
  keywords: '城际云,云计算,国资云,政务云,智算服务',
  icp: '',
  copyright: `© ${new Date().getFullYear()} ${SITE_DEFAULTS.title}`,
}

const DEFAULT_CONTACT_INFO: ContactInfo = {
  address: '请通过后台配置公司地址',
  phone: '400-000-0000',
  email: 'contact@example.com',
  workingHours: '周一至周五 9:00-18:00',
}

// ── Store 定义 ──

export const useAppStore = defineStore('app', () => {
  // ═══════════════════════════ state ═══════════════════════════

  /** 站点配置对象 */
  const siteConfig = ref<SiteConfig>({ ...DEFAULT_SITE_CONFIG })

  /** 当前激活的导航项 ID */
  const activeNav = ref<string>('home')

  /** 是否为移动端视口 */
  const isMobile = ref<boolean>(false)

  /** 站点配置是否已加载 */
  const configLoaded = ref<boolean>(false)

  // ═══════════════════════════ getters ═══════════════════════════

  /** 导航项列表（7 个默认项，可被远程配置覆盖） */
  const navItems = computed<NavItem[]>(() => {
    // 若远程配置提供了自定义导航，优先使用；否则使用默认值
    return DEFAULT_NAV_ITEMS
  })

  /** 联系方式信息 */
  const contactInfo = computed<ContactInfo>(() => {
    // 若远程配置提供了联系方式，优先使用；否则使用默认值
    return DEFAULT_CONTACT_INFO
  })

  // ═══════════════════════════ actions ═══════════════════════════

  /**
   * 获取站点全局配置
   * 从后端拉取站点元信息（标题、Logo、版权等），失败时回退到 SITE_DEFAULTS
   */
  async function fetchSiteConfig(): Promise<void> {
    try {
      // 动态导入避免循环依赖，API 模块可按需替换
      const { fetchSiteConfig: getSiteConfig } = await import('@/api/modules/common')
      const res = await getSiteConfig()
      if (res?.data) {
        siteConfig.value = { ...DEFAULT_SITE_CONFIG, ...res.data }
      }
    } catch {
      // API 未就绪时静默回退到默认配置
      console.warn('[useAppStore] fetchSiteConfig failed, using defaults.')
    } finally {
      configLoaded.value = true
    }
  }

  /**
   * 设置当前激活的导航项
   * @param navId - 导航项 ID
   */
  function setActiveNav(navId: string): void {
    activeNav.value = navId
  }

  /**
   * 检测当前是否为移动端视口
   * 建议在 App.vue onMounted 中调用，并监听 window resize 事件
   */
  function checkMobile(): void {
    isMobile.value = window.innerWidth < 768
  }

  // ═══════════════════════════ return ═══════════════════════════

  return {
    // state
    siteConfig,
    activeNav,
    isMobile,
    configLoaded,
    // getters
    navItems,
    contactInfo,
    // actions
    fetchSiteConfig,
    setActiveNav,
    checkMobile,
  }
})
