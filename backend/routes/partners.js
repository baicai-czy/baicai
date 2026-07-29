// ── /api/partners ──

import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM partners ORDER BY sort_order ASC')
    const list = rows.map(r => ({
      id: r.id,
      name: r.name,
      logoUrl: r.logo_url,
      website: r.website,
    }))
    res.json({ code: 0, data: list, message: 'ok' })
  } catch (err) { next(err) }
})

export default router
