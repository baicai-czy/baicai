// ── /api/timeline ──
import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM timeline_events ORDER BY sort_order ASC')
    res.json({ code: 0, data: rows.map(r => ({
      id: r.id, year: r.year, month: r.month, title: r.title, description: r.description || '',
    })), message: 'ok' })
  } catch (err) { next(err) }
})

export default router
