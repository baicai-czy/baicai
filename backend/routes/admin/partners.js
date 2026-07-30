// ── /admin-api/partners (需鉴权) ──

import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/permission.js'

const router = Router()
router.use(authMiddleware)

function toPartner(r) {
  return { id: r.id, name: r.name, logoUrl: r.logo_url, website: r.website }
}

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM partners ORDER BY sort_order ASC')
    res.json({ code: 0, data: rows.map(toPartner), message: 'ok' })
  } catch (err) { next(err) }
})

router.post('/', requirePermission('partners:manage'), async (req, res, next) => {
  try {
    const { name, logoUrl, website, sortOrder } = req.body
    const [result] = await pool.query(
      'INSERT INTO partners (name, logo_url, website, sort_order) VALUES (?, ?, ?, ?)',
      [name, logoUrl || '', website || '', sortOrder || 0]
    )
    res.json({ code: 0, data: { id: result.insertId }, message: '新增成功' })
  } catch (err) { next(err) }
})

router.put('/:id', requirePermission('partners:manage'), async (req, res, next) => {
  try {
    const { name, logoUrl, website, sortOrder } = req.body
    await pool.query(
      'UPDATE partners SET name=?, logo_url=?, website=?, sort_order=? WHERE id=?',
      [name, logoUrl || '', website || '', sortOrder || 0, req.params.id]
    )
    res.json({ code: 0, data: { success: true }, message: '修改成功' })
  } catch (err) { next(err) }
})

router.delete('/:id', requirePermission('partners:manage'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM partners WHERE id = ?', [req.params.id])
    res.json({ code: 0, data: { success: true }, message: '删除成功' })
  } catch (err) { next(err) }
})

export default router
