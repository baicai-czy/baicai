// ── /api/solutions ──

import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

function toSolution(r) {
  return {
    id: r.id,
    title: r.title,
    targetCustomer: r.target_customer || '',
    description: r.description || '',
    imageUrl: r.image_url || '',
    detail: r.detail || '',
  }
}

// GET /api/solutions — 全部列表
router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM solutions WHERE is_active = 1 ORDER BY id ASC'
    )
    res.json({ code: 0, data: rows.map(toSolution), message: 'ok' })
  } catch (err) { next(err) }
})

// GET /api/solutions/:id — 详情
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10)
    const [rows] = await pool.query('SELECT * FROM solutions WHERE id = ?', [id])
    if (!rows.length) {
      return res.status(404).json({ code: 404, data: null, message: '解决方案不存在' })
    }
    res.json({ code: 0, data: toSolution(rows[0]), message: 'ok' })
  } catch (err) { next(err) }
})

export default router
