// ── /admin-api/site-config (需鉴权) ──

import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

// PUT / — 更新站点配置（单条记录，id 恒为 1）
router.put('/', async (req, res, next) => {
  try {
    const { siteName, logo, icp, copyright, seoTitle, seoDescription, seoKeywords, contactPhone, contactEmail, address } = req.body

    await pool.query(`UPDATE site_config SET
      site_name = ?, logo = ?, icp = ?, copyright = ?,
      seo_title = ?, seo_description = ?, seo_keywords = ?,
      contact_phone = ?, contact_email = ?, address = ?
      WHERE id = 1`, [
      siteName, logo, icp, copyright,
      seoTitle, seoDescription, seoKeywords,
      contactPhone, contactEmail, address,
    ])

    res.json({ code: 0, data: { success: true }, message: '站点配置已更新' })
  } catch (err) { next(err) }
})

export default router
