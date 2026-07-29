// ── /api/auth + /admin-api/auth ──

import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pool from '../db/connection.js'
import config from '../config.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// ────────────────────────────────────
// 公开接口
// ────────────────────────────────────

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ code: 400, data: null, message: '用户名和密码不能为空' })
    }

    const [rows] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username])
    if (!rows.length) {
      return res.status(401).json({ code: 401, data: null, message: '用户名或密码错误' })
    }

    const user = rows[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ code: 401, data: null, message: '用户名或密码错误' })
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      permissions: Array.isArray(user.permissions) ? user.permissions : [],
    }

    const token = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
    const refreshToken = jwt.sign(payload, config.jwt.secret, { expiresIn: '30d' })

    res.json({
      code: 0,
      data: {
        token,
        refreshToken,
        expiresIn: 7 * 24 * 3600, // 7天 = 604800 秒
      },
      message: '登录成功',
    })
  } catch (err) { next(err) }
})

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    // 从 Authorization 头获取 refreshToken
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ code: 401, data: null, message: '请提供 refreshToken' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.jwt.secret)
    const payload = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      permissions: decoded.permissions,
    }

    const newToken = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
    const newRefreshToken = jwt.sign(payload, config.jwt.secret, { expiresIn: '30d' })

    res.json({
      code: 0,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: 7 * 24 * 3600,
      },
      message: 'ok',
    })
  } catch (err) {
    return res.status(401).json({ code: 401, data: null, message: 'Token 无效或已过期' })
  }
})

// ────────────────────────────────────
// 需鉴权接口（挂载在 /admin-api/auth）
// ────────────────────────────────────

// POST /admin-api/auth/logout
router.post('/logout', authMiddleware, async (_req, res, next) => {
  try {
    // 简单注销：客户端删除 Token 即可。若需要 Token 黑名单，可在此将 Token 写入 Redis。
    res.json({ code: 0, data: { success: true }, message: '退出成功' })
  } catch (err) { next(err) }
})

// GET /admin-api/auth/user-info
router.get('/user-info', authMiddleware, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, avatar, role, permissions FROM admin_users WHERE id = ?',
      [req.user.id]
    )
    if (!rows.length) {
      return res.status(404).json({ code: 404, data: null, message: '用户不存在' })
    }

    const user = rows[0]
    res.json({
      code: 0,
      data: {
        id: user.id,
        username: user.username,
        avatar: user.avatar || '',
        role: user.role,
        permissions: Array.isArray(user.permissions) ? user.permissions : [],
      },
      message: 'ok',
    })
  } catch (err) { next(err) }
})

export default router
