// ── /api/cms ──
import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

router.get('/:slug', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cms_pages WHERE slug = ?', [req.params.slug])
    if (!rows.length) return res.json({ code: 0, data: null, message: 'ok' })
    const r = rows[0]
    res.json({ code: 0, data: {
      id: r.id, slug: r.slug, title: r.title,
      content: r.content || '',
      meta: typeof r.meta === 'string' ? JSON.parse(r.meta) : (r.meta || {}),
    }, message: 'ok' })
  } catch (err) { next(err) }
})

export default router
