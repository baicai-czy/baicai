// ── /api/banners ──

import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC'
    )
    const list = rows.map(r => ({
      id: r.id,
      imageUrl: r.image_url,
      title: r.title,
      subtitle: r.subtitle,
      link: r.link,
      sortOrder: r.sort_order,
      isActive: !!r.is_active,
    }))
    res.json({ code: 0, data: list, message: 'ok' })
  } catch (err) { next(err) }
})

export default router
