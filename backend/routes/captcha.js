// ── /api/auth/captcha ──

import { Router } from 'express'
import svgCaptcha from 'svg-captcha'
import Redis from 'ioredis'
import config from '../config.js'

const router = Router()
const redis = new Redis(config.redis)

// 验证码有效期 5 分钟
const CAPTCHA_TTL = 300

router.get('/', async (_req, res) => {
  try {
    const { text, data } = svgCaptcha.create({ size: 4, noise: 2, ignoreChars: '0o1il', width: 120, height: 40 })
    const uuid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    await redis.setex(`captcha:${uuid}`, CAPTCHA_TTL, text.toLowerCase())
    res.json({ code: 0, data: { uuid, svg: data }, message: 'ok' })
  } catch (err) {
    res.status(500).json({ code: 500, data: null, message: '验证码生成失败' })
  }
})

// 验证 captcha 是否正确的工具函数
export async function verifyCaptcha(uuid, code) {
  if (!uuid || !code) return false
  try {
    const stored = await redis.get(`captcha:${uuid}`)
    if (!stored) return false
    await redis.del(`captcha:${uuid}`) // 一次性的
    return stored === String(code).toLowerCase()
  } catch { return false }
}

export default router
