// ── XSS 过滤（基于 DOMPurify） ──

import DOMPurify from 'dompurify'

// ── 默认配置 ──

/** DOMPurify 默认清洗选项 — 仅允许安全标签和属性 */
const DEFAULT_OPTIONS: DOMPurify.Config = {
  // 白名单：仅允许排版相关标签，禁止 script/iframe/object/embed 等
  ALLOWED_TAGS: [
    'b',
    'i',
    'em',
    'strong',
    'a',
    'p',
    'br',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'code',
    'pre',
    'span',
    'div',
    'img',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ],
  ALLOWED_ATTR: [
    'href',
    'title',
    'target',
    'rel',
    'src',
    'alt',
    'width',
    'height',
    'class',
    'id',
    'style',
  ],
  // 禁止所有 data: / javascript: 协议
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
}

// ── 导出函数 ──

/**
 * 清洗 HTML 字符串，移除 XSS 攻击向量
 *
 * 使用 DOMPurify 对 HTML 进行白名单过滤，仅保留安全的标签和属性。
 * 建议在渲染用户生成内容（如新闻正文、评论）之前调用。
 *
 * @param dirty  - 待清洗的原始 HTML 字符串
 * @param options - 可选，合并到默认白名单之上（如需额外标签可用 ADD_TAGS）
 * @returns 清洗后的安全 HTML 字符串
 *
 * @example
 * const safe = sanitizeHTML('<p>Hello</p><script>alert(1)</script>')
 * // => '<p>Hello</p>'
 */
export function sanitizeHTML(
  dirty: string,
  options?: DOMPurify.Config,
): string {
  if (!dirty) return ''
  const mergedOptions = options
    ? { ...DEFAULT_OPTIONS, ...options }
    : DEFAULT_OPTIONS
  return DOMPurify.sanitize(dirty, mergedOptions)
}

/**
 * 清洗 HTML 并仅返回纯文本（移除所有标签）
 *
 * @param dirty - 待清洗的 HTML 字符串
 * @returns 纯文本内容
 *
 * @example
 * const text = sanitizeText('<p>Hello <b>World</b></p>')
 * // => 'Hello World'
 */
export function sanitizeText(dirty: string): string {
  if (!dirty) return ''
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}
