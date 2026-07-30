// ── /admin-api/site-config (需鉴权) ──

import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/permission.js'

const router = Router()
router.use(authMiddleware)

// PUT / — 更新站点配置（单条记录，id 恒为 1）
router.put('/', requirePermission('site-config:manage'), async (req, res, next) => {
  try {
    const { siteName, logo, icp, copyright, seoTitle, seoDescription, seoKeywords, contactPhone, contactEmail, address } = req.body

    // 只更新显式传入的字段，其余保持不变
    const updates = []
    const values = []
    const map = {
      site_name: siteName, logo, icp, copyright,
      seo_title: seoTitle, seo_description: seoDescription, seo_keywords: seoKeywords,
      contact_phone: contactPhone, contact_email: contactEmail, address,
    }
    for (const [col, val] of Object.entries(map)) {
      if (val !== undefined) { updates.push(`${col} = ?`); values.push(val) }
    }

    if (updates.length > 0) {
      await pool.query(`UPDATE site_config SET ${updates.join(', ')} WHERE id = 1`, values)
    }

    res.json({ code: 0, data: { success: true }, message: '站点配置已更新' })
  } catch (err) { next(err) }
})

export default router
