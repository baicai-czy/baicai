// ── 日期/数字格式化函数 ──

// ── 日期格式化 ──

/** 支持的日期格式令牌 */
type DateFormatToken =
  | 'YYYY'   // 四位年份：2026
  | 'YY'     // 两位年份：26
  | 'MM'     // 两位月份：01-12
  | 'M'      // 不补零月份：1-12
  | 'DD'     // 两位日期：01-31
  | 'D'      // 不补零日期：1-31
  | 'HH'     // 两位小时（24h）：00-23
  | 'hh'     // 两位小时（12h）：01-12
  | 'mm'     // 两位分钟：00-59
  | 'ss'     // 两位秒：00-59
  | 'A'      // 上下午：AM/PM

/** 常用的日期格式预设 */
export const DATE_FORMATS = {
  /** 2026-07-29 */
  date: 'YYYY-MM-DD',
  /** 2026/07/29 */
  dateSlash: 'YYYY/MM/DD',
  /** 07/29/2026 */
  dateUS: 'MM/DD/YYYY',
  /** 2026-07-29 14:30:00 */
  datetime: 'YYYY-MM-DD HH:mm:ss',
  /** 2026年07月29日 */
  dateCN: 'YYYY年MM月DD日',
  /** 2026年07月29日 14:30 */
  datetimeCN: 'YYYY年MM月DD日 HH:mm',
  /** 07-29 14:30 */
  short: 'MM-DD HH:mm',
  /** 14:30:00 */
  time: 'HH:mm:ss',
  /** 14:30 */
  timeShort: 'HH:mm',
} as const

/**
 * 将日期格式化为指定模板字符串
 * @param date  - Date 对象、时间戳（毫秒）或 ISO 字符串
 * @param format - 格式模板，支持 YYYY/YY/MM/M/DD/D/HH/hh/mm/ss/A 令牌
 * @returns 格式化后的日期字符串；无效输入返回空字符串
 *
 * @example
 * formatDate(new Date('2026-07-29'), 'YYYY-MM-DD')      // '2026-07-29'
 * formatDate(1753747200000, 'YYYY年MM月DD日')             // '2026年07月29日'
 * formatDate('2026-07-29T14:30:00', DATE_FORMATS.datetime) // '2026-07-29 14:30:00'
 */
export function formatDate(
  date: Date | number | string,
  format: string,
): string {
  const d = normalizeDate(date)
  if (!d) return ''

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours24 = d.getHours()
  const hours12 = hours24 % 12 || 12
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()
  const ampm = hours24 >= 12 ? 'PM' : 'AM'

  const tokens: Record<string, string> = {
    YYYY: String(year),
    YY: String(year).slice(-2),
    MM: pad(month),
    M: String(month),
    DD: pad(day),
    D: String(day),
    HH: pad(hours24),
    hh: pad(hours12),
    mm: pad(minutes),
    ss: pad(seconds),
    A: ampm,
  }

  // 按令牌长度降序替换，避免 YYYY 被 YY 误替换
  const sortedKeys = Object.keys(tokens).sort((a, b) => b.length - a.length)
  let result = format
  for (const key of sortedKeys) {
    result = result.replaceAll(key, tokens[key])
  }
  return result
}

/** 将各种日期输入规范化为 Date 对象，失败返回 null */
function normalizeDate(date: Date | number | string): Date | null {
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date
  }
  if (typeof date === 'number') {
    const d = new Date(date)
    return isNaN(d.getTime()) ? null : d
  }
  if (typeof date === 'string') {
    const d = new Date(date)
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

/** 数字左侧补零 */
function pad(num: number): string {
  return String(num).padStart(2, '0')
}

// ── 相对时间 ──

/**
 * 返回相对当前时间的友好描述
 * @param date - 目标日期
 * @returns 如 "刚刚"、"5分钟前"、"3小时前"、"2天前"；超过30天返回完整日期
 */
export function timeAgo(date: Date | number | string): string {
  const d = normalizeDate(date)
  if (!d) return ''

  const now = Date.now()
  const diff = now - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return formatDate(d, DATE_FORMATS.date)
}

// ── 数字格式化 ──

/**
 * 数字千分位格式化
 * @param value  - 数值或数值字符串
 * @param decimals - 保留小数位数，默认 0
 * @returns 千分位字符串；无效输入返回 '0'
 *
 * @example
 * formatNumber(1234567)        // '1,234,567'
 * formatNumber(1234567.89, 2)  // '1,234,567.89'
 * formatNumber('9876543')      // '9,876,543'
 */
export function formatNumber(value: number | string, decimals = 0): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (!Number.isFinite(num)) return '0'

  const [intPart, fracPart] = num.toFixed(decimals).split('.')
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return fracPart !== undefined ? `${formatted}.${fracPart}` : formatted
}

/**
 * 数字简写（万/亿）
 * @param value - 数值
 * @returns 简写字符串
 *
 * @example
 * formatCount(1234)    // '1,234'
 * formatCount(12345)   // '1.2万'
 * formatCount(12345678)// '1,234.6万'
 * formatCount(123456789)// '1.2亿'
 */
export function formatCount(value: number): string {
  if (!Number.isFinite(value)) return '0'
  if (value < 0) return `-${formatCount(-value)}`

  if (value >= 100_000_000) {
    return `${(value / 100_000_000).toFixed(1).replace(/\.0$/, '')}亿`
  }
  if (value >= 10_000) {
    return `${(value / 10_000).toFixed(1).replace(/\.0$/, '')}万`
  }
  return formatNumber(value)
}

// ── 文本处理 ──

/**
 * 文本截断并追加省略号
 * @param text  - 原始文本
 * @param maxLength - 最大字符数（含省略号），默认 50
 * @param ellipsis  - 省略号字符，默认 '...'
 * @returns 截断后的文本
 *
 * @example
 * truncateText('这是一段很长的文本内容需要截断处理', 10) // '这是一段很长的...'
 */
export function truncateText(
  text: string,
  maxLength = 50,
  ellipsis = '...',
): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, maxLength)
  return text.slice(0, maxLength - ellipsis.length) + ellipsis
}
