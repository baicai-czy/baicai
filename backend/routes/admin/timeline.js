// ── /admin-api/timeline (需鉴权) ──
import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

function toEvent(r) {
  return { id: r.id, year: r.year, month: r.month, title: r.title, description: r.description || '', sortOrder: r.sort_order }
}

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM timeline_events ORDER BY sort_order ASC')
    res.json({ code: 0, data: rows.map(toEvent), message: 'ok' })
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const { year, month, title, description, sortOrder } = req.body
    const [result] = await pool.query(
      'INSERT INTO timeline_events (year, month, title, description, sort_order) VALUES (?, ?, ?, ?, ?)',
      [year, month || '', title, description || '', sortOrder || 0]
    )
    res.json({ code: 0, data: { id: result.insertId }, message: '新增成功' })
  } catch (err) { next(err) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { year, month, title, description, sortOrder } = req.body
    await pool.query(
      'UPDATE timeline_events SET year=?, month=?, title=?, description=?, sort_order=? WHERE id=?',
      [year, month || '', title, description || '', sortOrder || 0, req.params.id]
    )
    res.json({ code: 0, data: { success: true }, message: '修改成功' })
  } catch (err) { next(err) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM timeline_events WHERE id = ?', [req.params.id])
    res.json({ code: 0, data: { success: true }, message: '删除成功' })
  } catch (err) { next(err) }
})

export default router
