// ── JWT 鉴权中间件 ──

import jwt from 'jsonwebtoken'
import config from '../config.js'

/**
 * 验证 Bearer Token，解析出用户信息挂载到 req.user
 */
export function authMiddleware(req, res, next) {
  // 从 Authorization 头中提取 Token
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未登录或 Token 已过期', data: null })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded  // { id, username, role, permissions }
    next()
  } catch (err) {
    return res.status(401).json({ code: 401, message: 'Token 无效或已过期', data: null })
  }
}
