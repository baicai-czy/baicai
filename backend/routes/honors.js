// ── /api/honors ──
import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM honors ORDER BY sort_order ASC')
    res.json({ code: 0, data: rows.map(r => ({
      id: r.id, name: r.name, category: r.category,
      imageUrl: r.image_url || '', issueDate: r.issue_date || '',
      issuingAuthority: r.issuing_authority || '',
    })), message: 'ok' })
  } catch (err) { next(err) }
})

export default router
