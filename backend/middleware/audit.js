// ── 操作日志中间件 ──
// 自动记录所有 /admin-api/* 的写操作到 audit_log 表

import jwt from 'jsonwebtoken'
import pool from '../db/connection.js'
import config from '../config.js'

/** HTTP 方法 → 操作类型映射 */
const ACTION_MAP = { POST: 'CREATE', PUT: 'UPDATE', PATCH: 'UPDATE', DELETE: 'DELETE' }

export function auditMiddleware(req, _res, next) {
  // 只记录写操作，GET 请求跳过
  if (req.method === 'GET' || req.method === 'OPTIONS' || req.method === 'HEAD') return next()

  // 提取模块名：/admin-api/news/1 → news
  const url = req.originalUrl || req.baseUrl || ''
  const segments = url.replace(/^\/admin-api\//, '').split('/')
  const module = segments[0] || (segments[1] || 'unknown')
  const action = ACTION_MAP[req.method] || req.method
  const ip = req.ip || req.socket?.remoteAddress || ''
  let username = 'unknown'

  // 从 JWT 解析用户名
  const auth = req.headers.authorization
  if (auth?.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(auth.split(' ')[1], config.jwt.secret)
      username = decoded.username || 'unknown'
    } catch { /* token invalid, leave as unknown */ }
  }

  // 生成操作详情
  const detail = `${action} ${module}`
    + (req.params?.id ? ` #${req.params.id}` : '')
    + (req.body?.title ? ` 「${req.body.title}」` : '')

  // 异步记录，不阻塞响应
  pool.query(
    'INSERT INTO audit_log (username, action, module, detail, ip) VALUES (?, ?, ?, ?, ?)',
    [username, action, module, detail.slice(0, 500), ip]
  ).catch(err => console.error('[Audit] Log failed:', err.message))

  next()
}
