// ── 全局常量 ──

import type { NewsCategory } from '../types/news'

// ── 新闻分类枚举映射 ──

/** 新闻分类 → 中文显示名映射 */
export const categoryMap: Record<NewsCategory | 'all', string> = {
  all: '全部',
  company: '公司新闻',
  industry: '行业动态',
  notice: '通知公告',
}

/** 新闻分类 → 路由路径映射 */
export const categoryRouteMap: Record<NewsCategory, string> = {
  company: '/news/company',
  industry: '/news/industry',
  notice: '/news/notice',
}

// ── 服务类型 ──

/** 服务类型 → 中文显示名映射 */
export const serviceTypes: Record<string, string> = {
  consulting: '咨询服务',
  development: '定制开发',
  integration: '系统集成',
  maintenance: '运维支持',
  training: '培训服务',
  other: '其他服务',
}

/** 服务类型选项列表（用于下拉框） */
export const serviceTypeOptions = Object.entries(serviceTypes).map(([value, label]) => ({
  value,
  label,
}))

// ── 色彩常量（与 CSS 变量 --accent 等保持同步） ──

/** 品牌色值 — 与 src/style.css 中 CSS 自定义属性同步 */
export const COLORS = {
  /** 主强调色（亮色模式） */
  accent: '#aa3bff',
  /** 主强调色（暗色模式） */
  accentDark: '#c084fc',
  /** 正文色（亮色模式） */
  text: '#6b6375',
  /** 正文色（暗色模式） */
  textDark: '#9ca3af',
  /** 标题色（亮色模式） */
  textHeading: '#08060d',
  /** 标题色（暗色模式） */
  textHeadingDark: '#f3f4f6',
  /** 背景色（亮色模式） */
  bg: '#ffffff',
  /** 背景色（暗色模式） */
  bgDark: '#16171d',
  /** 边框色（亮色模式） */
  border: '#e5e4e7',
  /** 边框色（暗色模式） */
  borderDark: '#2e303a',
  /** 强调色半透明背景 */
  accentBg: 'rgba(170, 59, 255, 0.1)',
  /** 强调色半透明边框 */
  accentBorder: 'rgba(170, 59, 255, 0.5)',
} as const

/** 图表调色盘 — 与品牌色协调的序列色 */
export const CHART_PALETTE = [
  '#aa3bff',
  '#c084fc',
  '#6b6375',
  '#e5e4e7',
  '#f4a261',
  '#2a9d8f',
  '#e76f51',
  '#264653',
] as const

// ── 站点默认配置 fallback ──

/** 站点元信息默认值（环境变量未配置时的回退） */
export const SITE_DEFAULTS = {
  /** 站点标题 */
  title: '城际云',
  /** 站点描述 */
  description: '企业门户网站',
  /** 首页默认分页大小 */
  homePageSize: 6,
  /** 新闻列表默认分页大小 */
  newsPageSize: 12,
  /** 默认每页条数选项 */
  pageSizeOptions: [6, 12, 24, 48] as readonly number[],
  /** 搜索结果高亮截取长度 */
  searchHighlightLength: 120,
  /** 图片加载失败占位图 */
  placeholderImage: '/placeholder.png',
  /** 联系表单提交成功提示 */
  contactSuccessMessage: '提交成功，我们将尽快与您联系！',
  /** API 请求超时时间（毫秒） */
  requestTimeout: 15000,
  /** 短信验证码重发间隔（秒） */
  captchaCooldown: 60,
} as const

// ── 平台/行业标签 ──

/** 客户行业标签 */
export const industryTags = [
  '金融',
  '医疗',
  '教育',
  '制造',
  '零售',
  '政务',
  '能源',
  '交通',
] as const
