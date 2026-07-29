// ── /api/site-config ──

import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_config WHERE id = 1')
    const config = rows[0]

    // 转换成前端 SiteConfig 类型（camelCase）
    res.json({
      code: 0,
      data: config ? {
        siteName: config.site_name,
        logo: config.logo,
        icp: config.icp,
        copyright: config.copyright,
        seoTitle: config.seo_title,
        seoDescription: config.seo_description,
        seoKeywords: config.seo_keywords,
        contactPhone: config.contact_phone,
        contactEmail: config.contact_email,
        address: config.address,
      } : {},
      message: 'ok',
    })
  } catch (err) { next(err) }
})

export default router
