// ── 全局应用状态 Store ──

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { SITE_DEFAULTS } from '@/utils/constants'

export interface NavItem {
  id: string; label: string; path: string; children?: NavItem[]
}

export interface SiteConfig {
  siteName: string; logo: string; icp: string; copyright: string
  seoTitle: string; seoDescription: string; seoKeywords: string
  contactPhone: string; contactEmail: string; address: string
}

export interface ContactInfo {
  address: string; phone: string; email: string; workingHours: string; qrCode?: string
}

const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: SITE_DEFAULTS.title, logo: '/logo.png', icp: '', copyright: '',
  seoTitle: SITE_DEFAULTS.title, seoDescription: SITE_DEFAULTS.description,
  seoKeywords: '城际云,云计算,国资云,政务云,智算服务',
  contactPhone: '', contactEmail: '', address: '',
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: '首页', path: '/' },
  { id: 'about', label: '关于我们', path: '/about' },
  { id: 'business', label: '业务版块', path: '/business' },
  { id: 'products', label: '产品与服务', path: '/products' },
  { id: 'solutions', label: '解决方案', path: '/solutions' },
  { id: 'news', label: '新闻中心', path: '/news' },
  { id: 'contact', label: '联系我们', path: '/contact' },
]

const DEFAULT_CONTACT_INFO: ContactInfo = {
  address: '请通过后台配置公司地址', phone: '400-000-0000',
  email: 'contact@example.com', workingHours: '周一至周五 9:00-18:00',
}

export const useAppStore = defineStore('app', () => {
  const siteConfig = ref<SiteConfig>({ ...DEFAULT_SITE_CONFIG })
  const activeNav = ref<string>('home')
  const isMobile = ref<boolean>(false)
  const configLoaded = ref<boolean>(false)

  const navItems = computed<NavItem[]>(() => DEFAULT_NAV_ITEMS)
  const contactInfo = computed<ContactInfo>(() => ({
    address: siteConfig.value.address || DEFAULT_CONTACT_INFO.address,
    phone: siteConfig.value.contactPhone || DEFAULT_CONTACT_INFO.phone,
    email: siteConfig.value.contactEmail || DEFAULT_CONTACT_INFO.email,
    workingHours: DEFAULT_CONTACT_INFO.workingHours,
  }))

  async function fetchSiteConfig(): Promise<void> {
    try {
      const { fetchSiteConfig: getSiteConfig } = await import('@/api/modules/common')
      const data = await getSiteConfig()
      // 拦截器已剥壳，data 就是 SiteConfig 对象
      if (data) {
        siteConfig.value = { ...DEFAULT_SITE_CONFIG, ...(data as Record<string, any>) }
      }
    } catch {
      console.warn('[useAppStore] fetchSiteConfig failed, using defaults.')
    } finally {
      configLoaded.value = true
    }
  }

  function setActiveNav(navId: string): void { activeNav.value = navId }
  function checkMobile(): void { isMobile.value = window.innerWidth < 768 }

  return { siteConfig, activeNav, isMobile, configLoaded, navItems, contactInfo, fetchSiteConfig, setActiveNav, checkMobile }
})
