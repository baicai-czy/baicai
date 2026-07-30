// ── /admin-api/banners (需鉴权) ──

import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/permission.js'

const router = Router()
router.use(authMiddleware)

// GET / — 全部列表
router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM banners ORDER BY sort_order ASC')
    const list = rows.map(r => ({
      id: r.id, imageUrl: r.image_url, title: r.title,
      subtitle: r.subtitle, link: r.link,
      sortOrder: r.sort_order, isActive: !!r.is_active,
    }))
    res.json({ code: 0, data: list, message: 'ok' })
  } catch (err) { next(err) }
})

// GET /:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM banners WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ code: 404, data: null, message: '不存在' })
    const r = rows[0]
    res.json({ code: 0, data: {
      id: r.id, imageUrl: r.image_url, title: r.title,
      subtitle: r.subtitle, link: r.link,
      sortOrder: r.sort_order, isActive: !!r.is_active,
    }, message: 'ok' })
  } catch (err) { next(err) }
})

// POST / — 新增
router.post('/', requirePermission('banners:manage'), async (req, res, next) => {
  try {
    const { imageUrl, title, subtitle, link, sortOrder, isActive } = req.body
    const [result] = await pool.query(
      'INSERT INTO banners (image_url, title, subtitle, link, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [imageUrl || '', title, subtitle || '', link || '', sortOrder || 0, isActive ? 1 : 0]
    )
    res.json({ code: 0, data: { id: result.insertId }, message: '新增成功' })
  } catch (err) { next(err) }
})

// PUT /:id — 修改
router.put('/:id', requirePermission('banners:manage'), async (req, res, next) => {
  try {
    const { imageUrl, title, subtitle, link, sortOrder, isActive } = req.body
    await pool.query(
      'UPDATE banners SET image_url=?, title=?, subtitle=?, link=?, sort_order=?, is_active=? WHERE id=?',
      [imageUrl, title, subtitle || '', link || '', sortOrder || 0, isActive ? 1 : 0, req.params.id]
    )
    res.json({ code: 0, data: { success: true }, message: '修改成功' })
  } catch (err) { next(err) }
})

// DELETE /:id — 删除
router.delete('/:id', requirePermission('banners:manage'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM banners WHERE id = ?', [req.params.id])
    res.json({ code: 0, data: { success: true }, message: '删除成功' })
  } catch (err) { next(err) }
})

export default router
