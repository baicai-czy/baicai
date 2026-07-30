// ── /admin-api/news (需鉴权) ──

import { Router } from 'express'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'
import sanitizeHtml from 'sanitize-html'

const router = Router()
router.use(authMiddleware)

/** 安全过滤 HTML，只保留安全标签 */
function clean(html) {
  if (!html) return ''
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','h3','h4','span','pre','code']),
    allowedAttributes: { img: ['src','alt','width','height'], a: ['href','target','rel'] },
  })
}

function toNewsItem(r) {
  return {
    id: r.id, title: r.title, summary: r.summary || '', content: r.content || '',
    category: r.category, coverImage: r.cover_image || '',
    source: r.source || '', author: r.author || '',
    viewCount: r.view_count || 0, isPinned: !!r.is_pinned, isPublished: !!r.is_published,
    publishTime: r.publish_time ? new Date(r.publish_time).toISOString() : '',
    createTime: r.created_at ? new Date(r.created_at).toISOString() : '',
    updateTime: r.updated_at ? new Date(r.updated_at).toISOString() : '',
    tags: Array.isArray(r.tags) ? r.tags : [],
    attachments: Array.isArray(r.attachments) ? r.attachments : [],
  }
}

/** 规范化 tags 为数组：字符串按逗号拆分，已是数组直接返回 */
function normalizeTags(tags) {
  if (!tags) return []
  if (Array.isArray(tags)) return tags.filter(Boolean)
  if (typeof tags === 'string') return tags.split(',').map(s => s.trim()).filter(Boolean)
  return []
}

// GET / — 分页列表（管理端，包含未发布的）
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 10)
    const { category, keyword } = req.query
    let where = 'WHERE 1=1'
    const params = []
    if (category && category !== 'all') { where += ' AND category = ?'; params.push(category) }
    if (keyword) { where += ' AND MATCH(title, summary) AGAINST(? IN BOOLEAN MODE)'; params.push(keyword + '*') }

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM news ${where}`, params)
    const [rows] = await pool.query(
      `SELECT * FROM news ${where} ORDER BY publish_time DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, (page - 1) * pageSize]
    )
    res.json({ code: 0, data: { records: rows.map(toNewsItem), total, page, pageSize, pages: Math.ceil(total / pageSize) }, message: 'ok' })
  } catch (err) { next(err) }
})

// GET /:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ code: 404, data: null, message: '不存在' })
    res.json({ code: 0, data: toNewsItem(rows[0]), message: 'ok' })
  } catch (err) { next(err) }
})

// POST / — 新增
router.post('/', async (req, res, next) => {
  try {
    const { title, summary, content, category, coverImage, source, author, tags, attachments, isPinned, isPublished, publishTime } = req.body
    const [result] = await pool.query(
      `INSERT INTO news (title, summary, content, category, cover_image, source, author, tags, attachments, is_pinned, is_published, publish_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, summary || '', clean(content), category || 'company', coverImage || '',
       source || '本站', author || '', JSON.stringify(tags || []), JSON.stringify(attachments || []),
       isPinned ? 1 : 0, isPublished ? 1 : 0, publishTime || new Date()]
    )
    res.json({ code: 0, data: { id: result.insertId }, message: '新增成功' })
  } catch (err) { next(err) }
})

// PUT /:id — 修改
router.put('/:id', async (req, res, next) => {
  try {
    const { title, summary, content, category, coverImage, source, author, tags, attachments, isPinned, isPublished, publishTime } = req.body
    await pool.query(
      `UPDATE news SET title=?, summary=?, content=?, category=?, cover_image=?, source=?, author=?,
       tags=?, attachments=?, is_pinned=?, is_published=?, publish_time=? WHERE id=?`,
      [title, summary || '', clean(content), category, coverImage || '',
       source || '本站', author || '', JSON.stringify(tags || []), JSON.stringify(attachments || []),
       isPinned ? 1 : 0, isPublished ? 1 : 0, publishTime, req.params.id]
    )
    res.json({ code: 0, data: { success: true }, message: '修改成功' })
  } catch (err) { next(err) }
})

// DELETE /:id
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM news WHERE id = ?', [req.params.id])
    res.json({ code: 0, data: { success: true }, message: '删除成功' })
  } catch (err) { next(err) }
})

export default router
