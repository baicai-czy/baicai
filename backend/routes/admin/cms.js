// ── /admin-api/cms (需鉴权) ──
import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/permission.js'
import sanitizeHtml from 'sanitize-html'

const router = Router()
router.use(authMiddleware)

function clean(html) {
  if (!html) return ''
  return sanitizeHtml(html, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3','span','pre','code']), allowedAttributes: { img:['src','alt'], a:['href','target','rel'] } })
}

// GET /?slug=xxx — 获取指定页面
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cms_pages WHERE slug = ?', [req.query.slug])
    if (!rows.length) return res.json({ code: 0, data: null, message: 'ok' })
    const r = rows[0]
    res.json({ code: 0, data: {
      id: r.id, slug: r.slug, title: r.title,
      content: r.content || '',
      meta: typeof r.meta === 'string' ? JSON.parse(r.meta) : (r.meta || {}),
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : '',
    }, message: 'ok' })
  } catch (err) { next(err) }
})

// PUT / — 更新或创建页面
router.put('/', requirePermission('cms:manage'), async (req, res, next) => {
  try {
    const { slug, title, content, meta } = req.body
    if (!slug) return res.status(400).json({ code: 400, data: null, message: 'slug 必填' })
    const metaJson = meta ? JSON.stringify(meta) : '{}'
    await pool.query(
      'INSERT INTO cms_pages (slug, title, content, meta) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), meta=VALUES(meta)',
      [slug, title || '', clean(content), metaJson]
    )
    res.json({ code: 0, data: { success: true }, message: '保存成功' })
  } catch (err) { next(err) }
})

export default router
