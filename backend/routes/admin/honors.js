// ── /admin-api/honors (需鉴权) ──
import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

function toHonor(r) {
  return {
    id: r.id, name: r.name, category: r.category,
    imageUrl: r.image_url || '', issueDate: r.issue_date || '',
    issuingAuthority: r.issuing_authority || '', sortOrder: r.sort_order,
  }
}

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM honors ORDER BY sort_order ASC')
    res.json({ code: 0, data: rows.map(toHonor), message: 'ok' })
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, category, imageUrl, issueDate, issuingAuthority, sortOrder } = req.body
    const [result] = await pool.query(
      'INSERT INTO honors (name, category, image_url, issue_date, issuing_authority, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category || '', imageUrl || '', issueDate || '', issuingAuthority || '', sortOrder || 0]
    )
    res.json({ code: 0, data: { id: result.insertId }, message: '新增成功' })
  } catch (err) { next(err) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { name, category, imageUrl, issueDate, issuingAuthority, sortOrder } = req.body
    await pool.query(
      'UPDATE honors SET name=?, category=?, image_url=?, issue_date=?, issuing_authority=?, sort_order=? WHERE id=?',
      [name, category || '', imageUrl || '', issueDate || '', issuingAuthority || '', sortOrder || 0, req.params.id]
    )
    res.json({ code: 0, data: { success: true }, message: '修改成功' })
  } catch (err) { next(err) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM honors WHERE id = ?', [req.params.id])
    res.json({ code: 0, data: { success: true }, message: '删除成功' })
  } catch (err) { next(err) }
})

export default router
