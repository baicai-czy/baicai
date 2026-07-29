// ── /api/products ──

import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

function toProduct(r) {
  return {
    id: r.id,
    icon: r.icon,
    title: r.title,
    description: r.description || '',
    to: r.link,
    features: Array.isArray(r.features) ? r.features : [],
    category: r.category,
  }
}

// GET /api/products — 分页列表
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 10))
    const { category, keyword } = req.query

    let where = 'WHERE is_active = 1'
    const params = []

    if (category) { where += ' AND category = ?'; params.push(category) }
    if (keyword) { where += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`) }

    const offset = (page - 1) * pageSize

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM products ${where}`, params)
    const [rows] = await pool.query(
      `SELECT * FROM products ${where} ORDER BY sort_order ASC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    )

    res.json({
      code: 0,
      data: {
        records: rows.map(toProduct),
        total,
        page,
        pageSize,
        pages: Math.ceil(total / pageSize),
      },
      message: 'ok',
    })
  } catch (err) { next(err) }
})

// GET /api/products/:type — 按类型获取列表
router.get('/:type', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE category = ? AND is_active = 1 ORDER BY sort_order ASC',
      [req.params.type]
    )
    res.json({ code: 0, data: rows.map(toProduct), message: 'ok' })
  } catch (err) { next(err) }
})

export default router
