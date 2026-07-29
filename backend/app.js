// ── Express 应用入口 ──

import express from 'express'
import cors from 'cors'
import config from './config.js'

// 路由模块
import siteConfigRouter from './routes/site-config.js'
import bannersRouter from './routes/banners.js'
import newsRouter from './routes/news.js'
import productsRouter from './routes/products.js'
import solutionsRouter from './routes/solutions.js'
import partnersRouter from './routes/partners.js'
import statsRouter from './routes/stats.js'
import contactRouter from './routes/contact.js'
import authRouter from './routes/auth.js'

const app = express()

// ── 全局中间件 ──
app.use(cors())
app.use(express.json())

// ── 前台 API ──
app.use('/api/site-config', siteConfigRouter)
app.use('/api/banners', bannersRouter)
app.use('/api/news', newsRouter)
app.use('/api/products', productsRouter)
app.use('/api/solutions', solutionsRouter)
app.use('/api/partners', partnersRouter)
app.use('/api/stats', statsRouter)
app.use('/api/contact', contactRouter)
app.use('/api/auth', authRouter)

// ── 后台 API ──
app.use('/admin-api/auth', authRouter)

// ── 健康检查 ──
app.get('/api/health', (_req, res) => {
  res.json({ code: 0, data: { status: 'ok', uptime: process.uptime() }, message: 'ok' })
})

// ── 全局错误处理 ──
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.stack || err.message)
  res.status(500).json({ code: 500, data: null, message: err.message || '服务器内部错误' })
})

// ── 启动 ──
app.listen(config.port, () => {
  console.log(`[Server] Backend running → http://localhost:${config.port}`)
  console.log(`[Server] Environment → ${config.nodeEnv}`)
})

export default app
