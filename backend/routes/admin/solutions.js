// ── /admin-api/solutions (需鉴权) ──

import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

function toSolution(r) {
  return { id: r.id, title: r.title, targetCustomer: r.target_customer || '', description: r.description || '', imageUrl: r.image_url || '', detail: r.detail || '' }
}

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM solutions ORDER BY id ASC')
    res.json({ code: 0, data: rows.map(toSolution), message: 'ok' })
  } catch (err) { next(err) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM solutions WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ code: 404, data: null, message: '不存在' })
    res.json({ code: 0, data: toSolution(rows[0]), message: 'ok' })
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const { title, targetCustomer, description, imageUrl, detail, isActive } = req.body
    const [result] = await pool.query(
      'INSERT INTO solutions (title, target_customer, description, image_url, detail, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [title, targetCustomer || '', description || '', imageUrl || '', detail || '', isActive ? 1 : 0]
    )
    res.json({ code: 0, data: { id: result.insertId }, message: '新增成功' })
  } catch (err) { next(err) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { title, targetCustomer, description, imageUrl, detail, isActive } = req.body
    await pool.query(
      'UPDATE solutions SET title=?, target_customer=?, description=?, image_url=?, detail=?, is_active=? WHERE id=?',
      [title, targetCustomer || '', description || '', imageUrl || '', detail || '', isActive ? 1 : 0, req.params.id]
    )
    res.json({ code: 0, data: { success: true }, message: '修改成功' })
  } catch (err) { next(err) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM solutions WHERE id = ?', [req.params.id])
    res.json({ code: 0, data: { success: true }, message: '删除成功' })
  } catch (err) { next(err) }
})

export default router
