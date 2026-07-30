// ── /admin-api/users (需鉴权 + admin 权限) ──

import { Router } from 'express'
import bcrypt from 'bcryptjs'
import pool from '../../db/connection.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/permission.js'

const router = Router()
router.use(authMiddleware)

// GET / — 用户列表
router.get('/', requirePermission('*'), async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, username, avatar, role, permissions FROM admin_users ORDER BY id')
    res.json({ code: 0, data: rows.map(u => ({
      id: u.id, username: u.username, avatar: u.avatar || '',
      role: u.role, permissions: Array.isArray(u.permissions) ? u.permissions : [],
    })), message: 'ok' })
  } catch (err) { next(err) }
})

// POST / — 创建用户
router.post('/', requirePermission('*'), async (req, res, next) => {
  try {
    const { username, password, role, permissions } = req.body
    if (!username || !password) return res.status(400).json({ code: 400, data: null, message: '用户名和密码不能为空' })
    const hash = await bcrypt.hash(password, 10)
    await pool.query(
      'INSERT INTO admin_users (username, password, role, permissions) VALUES (?, ?, ?, ?)',
      [username, hash, role || 'editor', JSON.stringify(permissions || [])]
    )
    res.json({ code: 0, data: { success: true }, message: '用户创建成功' })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ code: 400, data: null, message: '用户名已存在' })
    next(err)
  }
})

// PUT /:id — 修改用户（角色/权限/密码）
router.put('/:id', requirePermission('*'), async (req, res, next) => {
  try {
    const { username, password, role, permissions } = req.body
    const updates = ['role = ?', 'permissions = ?']
    const values = [role || 'editor', JSON.stringify(permissions || [])]
    if (username) { updates.push('username = ?'); values.push(username) }
    if (password) { const hash = await bcrypt.hash(password, 10); updates.push('password = ?'); values.push(hash) }
    values.push(req.params.id)
    await pool.query(`UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`, values)
    res.json({ code: 0, data: { success: true }, message: '用户信息已更新' })
  } catch (err) { next(err) }
})

// DELETE /:id
router.delete('/:id', requirePermission('*'), async (req, res, next) => {
  try {
    if (parseInt(req.params.id) === 1) return res.status(400).json({ code: 400, data: null, message: '不能删除默认管理员' })
    await pool.query('DELETE FROM admin_users WHERE id = ?', [req.params.id])
    res.json({ code: 0, data: { success: true }, message: '用户已删除' })
  } catch (err) { next(err) }
})

export default router
