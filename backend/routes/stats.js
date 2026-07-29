// ── /api/stats ──

import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM stats ORDER BY sort_order ASC')
    const list = rows.map(r => ({
      id: r.id,
      label: r.label,
      value: parseFloat(r.value),
      suffix: r.suffix,
      prefix: r.prefix,
      decimals: r.decimals,
    }))
    res.json({ code: 0, data: list, message: 'ok' })
  } catch (err) { next(err) }
})

export default router
