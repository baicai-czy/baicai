// ── 工具函数统一导出 ──

// constants
export {
  categoryMap,
  categoryRouteMap,
  serviceTypes,
  serviceTypeOptions,
  COLORS,
  CHART_PALETTE,
  SITE_DEFAULTS,
  industryTags,
} from './constants'

// format
export {
  formatDate,
  timeAgo,
  formatNumber,
  formatCount,
  truncateText,
  DATE_FORMATS,
} from './format'

// validate
export {
  PHONE_REGEX,
  EMAIL_REGEX,
  URL_REGEX,
  CHINESE_NAME_REGEX,
  ID_CARD_REGEX,
  CAPTCHA_REGEX,
  requiredRule,
  minLengthRule,
  maxLengthRule,
  patternRule,
  phoneRules,
  emailRules,
  captchaRules,
  urlRules,
  contactFormRules,
  serviceFormRules,
} from './validate'

// sanitize
export { sanitizeHTML, sanitizeText } from './sanitize'
