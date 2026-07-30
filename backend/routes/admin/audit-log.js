// ── /admin-api/audit-log (需鉴权) ──
import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/permission.js'

const router = Router()
router.use(authMiddleware)

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 20)
    const { username, keyword } = req.query
    let where = 'WHERE 1=1'
    const params = []
    if (username) { where += ' AND username = ?'; params.push(username) }
    if (keyword) { where += ' AND detail LIKE ?'; params.push('%' + keyword + '%') }

    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM audit_log ' + where, params)
    const [rows] = await pool.query(
      'SELECT * FROM audit_log ' + where + ' ORDER BY create_time DESC LIMIT ? OFFSET ?',
      [...params, pageSize, (page - 1) * pageSize]
    )
    const records = rows.map(r => ({
      id: r.id, username: r.username, action: r.action,
      module: r.module, detail: r.detail, ip: r.ip,
      createTime: r.create_time ? new Date(r.create_time).toISOString() : '',
    }))
    res.json({ code: 0, data: { records, total, page, pageSize, pages: Math.ceil(total / pageSize) }, message: 'ok' })
  } catch (err) { next(err) }
})

export default router
