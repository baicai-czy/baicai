// ── /admin-api/contacts (需鉴权) ──

import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/permission.js'

const router = Router()
router.use(authMiddleware)

// GET / — 分页列表
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 10)
    const { type } = req.query
    let where = 'WHERE 1=1'
    const params = []
    if (type) { where += ' AND type = ?'; params.push(type) }

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM contacts ${where}`, params)
    const [rows] = await pool.query(
      `SELECT * FROM contacts ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, (page - 1) * pageSize]
    )
    const records = rows.map(r => ({
      id: r.id, type: r.type, name: r.name, company: r.company,
      phone: r.phone, email: r.email, description: r.description,
      serviceType: r.service_type, status: r.status || 'pending',
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : '',
    }))
    res.json({ code: 0, data: { records, total, page, pageSize, pages: Math.ceil(total / pageSize) }, message: 'ok' })
  } catch (err) { next(err) }
})

// PUT /:id — 更新状态
router.put('/:id', requirePermission('contacts:manage'), async (req, res, next) => {
  try {
    const { status } = req.body
    await pool.query('UPDATE contacts SET status = ? WHERE id = ?', [status || 'pending', req.params.id])
    res.json({ code: 0, data: { success: true }, message: '更新成功' })
  } catch (err) { next(err) }
})

// DELETE /:id
router.delete('/:id', requirePermission('contacts:manage'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id])
    res.json({ code: 0, data: { success: true }, message: '删除成功' })
  } catch (err) { next(err) }
})

export default router
