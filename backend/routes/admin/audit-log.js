// /admin-api/audit-log (需鉴权)
import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20, keyword = '' } = req.query
    const offset = (Number(page) - 1) * Number(pageSize)
    const like = `%${keyword}%`

    let sql = 'SELECT * FROM audit_log'
    let countSql = 'SELECT COUNT(*) as total FROM audit_log'
    const params: any[] = []

    if (keyword) {
      sql += ' WHERE username LIKE ? OR detail LIKE ?'
      countSql += ' WHERE username LIKE ? OR detail LIKE ?'
      params.push(like, like)
    }

    sql += ' ORDER BY create_time DESC LIMIT ? OFFSET ?'

    const [countRows] = await pool.query(countSql, keyword ? params : [])
    const [rows] = await pool.query(sql, [...params, Number(pageSize), offset])

    res.json({
      code: 0,
      data: {
        records: rows.map((r: any) => ({
          id: r.id,
          username: r.username,
          action: r.action,
          module: r.module,
          detail: r.detail,
          ip: r.ip,
          createTime: r.create_time,
        })),
        total: countRows[0].total,
      },
      message: 'ok',
    })
  } catch (err) { next(err) }
})

export default router
