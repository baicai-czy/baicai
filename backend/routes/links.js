// ── /api/links ──
import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM links WHERE is_active = 1 ORDER BY sort_order ASC')
    res.json({ code: 0, data: rows.map(r => ({ id: r.id, name: r.name, url: r.url })), message: 'ok' })
  } catch (err) { next(err) }
})

export default router
