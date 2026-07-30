// ── /api/news ──

import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

// 将 snake_case 的行转为 camelCase 的 NewsItem
function toNewsItem(r) {
  return {
    id: r.id,
    title: r.title,
    summary: r.summary || '',
    content: r.content || '',
    category: r.category,
    coverImage: r.cover_image || '',
    source: r.source || '',
    author: r.author || '',
    viewCount: r.view_count || 0,
    isPinned: !!r.is_pinned,
    isPublished: !!r.is_published,
    publishTime: r.publish_time ? new Date(r.publish_time).toISOString() : '',
    createTime: r.created_at ? new Date(r.created_at).toISOString() : '',
    updateTime: r.updated_at ? new Date(r.updated_at).toISOString() : '',
    tags: Array.isArray(r.tags) ? r.tags : [],
    attachments: Array.isArray(r.attachments) ? r.attachments : [],
  }
}

// GET /api/news — 分页列表
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 10))
    const { category, keyword, tag } = req.query

    let where = 'WHERE is_published = 1 AND publish_time <= NOW()'
    const params = []

    if (category && category !== 'all') {
      where += ' AND category = ?'
      params.push(category)
    }
    if (keyword) {
      where += ' AND (title LIKE ? OR summary LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }
    if (tag) {
      where += ' AND JSON_CONTAINS(tags, ?)'
      params.push(JSON.stringify(tag))
    }

    const offset = (page - 1) * pageSize

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM news ${where}`, params)
    const [rows] = await pool.query(
      `SELECT * FROM news ${where} ORDER BY is_pinned DESC, publish_time DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    )

    res.json({
      code: 0,
      data: {
        records: rows.map(toNewsItem),
        total,
        page,
        pageSize,
        pages: Math.ceil(total / pageSize),
      },
      message: 'ok',
    })
  } catch (err) { next(err) }
})

// GET /api/news/hot — 热门新闻（必须在 /:id 前定义）
router.get('/hot', async (req, res, next) => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 5)
    const [rows] = await pool.query(
      'SELECT * FROM news WHERE is_published = 1 AND publish_time <= NOW() AND is_pinned = 1 ORDER BY publish_time DESC LIMIT ?',
      [limit]
    )
    // 置顶不够则补热门
    if (rows.length < limit) {
      const [extra] = await pool.query(
        'SELECT * FROM news WHERE is_published = 1 AND publish_time <= NOW() AND is_pinned = 0 ORDER BY view_count DESC LIMIT ?',
        [limit - rows.length]
      )
      rows.push(...extra)
    }
    res.json({ code: 0, data: rows.map(toNewsItem), message: 'ok' })
  } catch (err) { next(err) }
})

// GET /api/news/:id — 详情
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10)
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id])
    if (!rows.length) {
      return res.status(404).json({ code: 404, data: null, message: '新闻不存在' })
    }
    // 浏览数 +1
    await pool.query('UPDATE news SET view_count = view_count + 1 WHERE id = ?', [id])
    res.json({ code: 0, data: toNewsItem(rows[0]), message: 'ok' })
  } catch (err) { next(err) }
})

export default router
