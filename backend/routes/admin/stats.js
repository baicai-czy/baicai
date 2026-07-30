// ── /admin-api/stats (需鉴权) ──

import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/permission.js'

const router = Router()
router.use(authMiddleware)

function toStat(r) {
  return { id: r.id, label: r.label, value: parseFloat(r.value), suffix: r.suffix, prefix: r.prefix, decimals: r.decimals }
}

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM stats ORDER BY sort_order ASC')
    res.json({ code: 0, data: rows.map(toStat), message: 'ok' })
  } catch (err) { next(err) }
})

router.post('/', requirePermission('stats:manage'), async (req, res, next) => {
  try {
    const { label, value, suffix, prefix, decimals, sortOrder } = req.body
    const [result] = await pool.query(
      'INSERT INTO stats (label, value, suffix, prefix, decimals, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [label, value, suffix || '', prefix || '', decimals || 0, sortOrder || 0]
    )
    res.json({ code: 0, data: { id: result.insertId }, message: '新增成功' })
  } catch (err) { next(err) }
})

router.put('/:id', requirePermission('stats:manage'), async (req, res, next) => {
  try {
    const { label, value, suffix, prefix, decimals, sortOrder } = req.body
    await pool.query(
      'UPDATE stats SET label=?, value=?, suffix=?, prefix=?, decimals=?, sort_order=? WHERE id=?',
      [label, value, suffix || '', prefix || '', decimals || 0, sortOrder || 0, req.params.id]
    )
    res.json({ code: 0, data: { success: true }, message: '修改成功' })
  } catch (err) { next(err) }
})

router.delete('/:id', requirePermission('stats:manage'), async (req, res, next) => {
  try {
    await pool.query('DELETE FROM stats WHERE id = ?', [req.params.id])
    res.json({ code: 0, data: { success: true }, message: '删除成功' })
  } catch (err) { next(err) }
})

export default router
