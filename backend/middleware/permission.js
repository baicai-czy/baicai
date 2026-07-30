// ── 权限检查中间件 ──
// 在 authMiddleware 之后使用：router.put('/:id', authMiddleware, requirePermission('news:manage'), handler)

/**
 * 检查当前用户是否拥有指定权限
 * @param {string} permission - 权限标识，如 'news:manage'，'*' 表示超级管理员
 */
export function requirePermission(permission) {
  return (req, res, next) => {
    const perms = req.user?.permissions || []
    // 超级管理员拥有所有权限
    if (perms.includes('*')) return next()
    if (perms.includes(permission)) return next()
    return res.status(403).json({ code: 403, data: null, message: '权限不足，请联系管理员' })
  }
}

/** 预定义角色权限 */
export const ROLE_PERMISSIONS = {
  admin: ['*'],
  editor: ['news:manage','products:manage','solutions:manage','banners:manage','partners:manage','stats:manage','links:manage','timeline:manage','honors:manage','cms:manage','contacts:view','upload:manage'],
  approver: ['news:approve','products:approve','solutions:approve','contacts:view'],
  service: ['contacts:manage','contacts:view'],
}

/** 角色中文名 */
export const ROLE_LABELS = { admin: '超级管理员', editor: '内容编辑', approver: '内容审核', service: '客服人员' }
