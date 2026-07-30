// ── /admin-api/upload (需鉴权) ──

import { Router } from 'express'
import multer from 'multer'
import { extname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { authMiddleware } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/permission.js'

const router = Router()
router.use(authMiddleware)

// 上传目录
const UPLOAD_DIR = join(process.cwd(), 'uploads')
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true })

// 存储配置
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname) || '.png'
    const name = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`
    cb(null, name)
  },
})

// 只允许图片
function fileFilter(_req, file, cb) {
  if (file.mimetype.startsWith('image/')) cb(null, true)
  else cb(new Error('只允许上传图片文件'), false)
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })

// POST / — 上传单张图片，返回可访问 URL
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ code: 400, data: null, message: '请选择图片文件' })
  const url = `/uploads/${req.file.filename}`
  res.json({ code: 0, data: { url, filename: req.file.filename }, message: '上传成功' })
})

export default router
