// ── /admin-api/products (需鉴权) ──

import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/permission.js'

const router = Router()
router.use(authMiddleware)

function toProduct(r) {
  return {
    id: r.id, icon: r.icon, title: r.title,
    description: r.description || '', to: r.link,
    features: Array.isArray(r.features) ? r.features : [],
    category: r.category,
  }
}

// GET /
router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY sort_order ASC')
    res.json({ code: 0, data: rows.map(toProduct), message: 'ok' })
  } catch (err) { next(err) }
})

// GET /:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ code: 404, data: null, message: '不存在' })
    res.json({ code: 0, data: toProduct(rows[0]), message: 'ok' })
  } catch (err) { next(err) }
})

// POST /
router.post('/', requirePermission('products:manage'), async (req, res, next) => {
  try {
    const { icon, title, description, to, features, category, sortOrder, isActive } = req.body
    const [result] = await pool.query(
      'INSERT INTO products (icon, title, description, link, features, category, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [icon || '', title, description || '', to || '', JSON.stringify(features || []), category || '', sortOrder || 0, isActive ? 1 : 0]
    )
    res.json({ code: 0, data: { id: result.insertId }, message: '新增成功' })
  } catch (err) { next(err) }
})

// PUT /:id
router.put('/:id', requirePermission('products:manage'), async (req, res, next) => {
  try {
    const { icon, title, description, to, features, category, sortOrder, isActive } = req.body
    await pool.query(
      'UPDATE products SET icon=?, title=?, description=?, link=?, features=?, category=?, sort_order=?, is_active=? WHERE id=?',
      [icon || '', title, description || '', to || '', JSON.stringify(features || []), category || '', sortOrder || 0, isActive ? 1 : 0, req.params.id]
    )
    res.json({ code: 0, data: { success: true }, message: '修改成功' })
  } catch (err) { next(err) }
})

// DELETE /:id
router.delete('/:id', requirePermission('products:manage'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id])
    res.json({ code: 0, data: { success: true }, message: '删除成功' })
  } catch (err) { next(err) }
})

export default router
