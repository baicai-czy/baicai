// ── /admin-api/links (需鉴权) ──
import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/permission.js'

const router = Router()
router.use(authMiddleware)

function toLink(r) {
  return { id: r.id, name: r.name, url: r.url, sortOrder: r.sort_order, isActive: !!r.is_active }
}

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM links ORDER BY sort_order ASC')
    res.json({ code: 0, data: rows.map(toLink), message: 'ok' })
  } catch (err) { next(err) }
})

router.post('/', requirePermission('links:manage'), async (req, res, next) => {
  try {
    const { name, url, sortOrder, isActive } = req.body
    const [result] = await pool.query(
      'INSERT INTO links (name, url, sort_order, is_active) VALUES (?, ?, ?, ?)',
      [name, url || '', sortOrder || 0, isActive ? 1 : 0]
    )
    res.json({ code: 0, data: { id: result.insertId }, message: '新增成功' })
  } catch (err) { next(err) }
})

router.put('/:id', requirePermission('links:manage'), async (req, res, next) => {
  try {
    const { name, url, sortOrder, isActive } = req.body
    await pool.query(
      'UPDATE links SET name=?, url=?, sort_order=?, is_active=? WHERE id=?',
      [name, url || '', sortOrder || 0, isActive ? 1 : 0, req.params.id]
    )
    res.json({ code: 0, data: { success: true }, message: '修改成功' })
  } catch (err) { next(err) }
})

router.delete('/:id', requirePermission('links:manage'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM links WHERE id = ?', [req.params.id])
    res.json({ code: 0, data: { success: true }, message: '删除成功' })
  } catch (err) { next(err) }
})

export default router
