// ── /api/contact ──

import { Router } from 'express'
import pool from '../db/connection.js'
import { notifyAdmin } from '../services/mailer.js'

const router = Router()

// POST /api/contact/consult — 在线咨询
router.post('/consult', async (req, res, next) => {
  try {
    const { name, company, phone, email, description } = req.body
    if (!name || !phone) {
      return res.status(400).json({ code: 400, data: null, message: '姓名和电话为必填项' })
    }
    await pool.query(
      `INSERT INTO contacts (type, name, company, phone, email, description) VALUES ('consult', ?, ?, ?, ?, ?)`,
      [name, company || '', phone, email || '', description || '']
    )
    // 异步邮件通知（不阻塞响应）
    notifyAdmin('新的在线咨询', `<p><b>姓名：</b>${name}</p><p><b>公司：</b>${company}</p><p><b>电话：</b>${phone}</p><p><b>邮箱：</b>${email}</p><p><b>描述：</b>${description}</p>`)
    res.json({ code: 0, data: { success: true }, message: '提交成功，我们会尽快联系您' })
  } catch (err) { next(err) }
})

// POST /api/contact/service-request — 服务申请
router.post('/service-request', async (req, res, next) => {
  try {
    const { companyName, contactName, phone, email, serviceType, description } = req.body
    if (!contactName || !phone) {
      return res.status(400).json({ code: 400, data: null, message: '联系人和电话为必填项' })
    }
    await pool.query(
      `INSERT INTO contacts (type, name, company, phone, email, description, service_type) VALUES ('service-request', ?, ?, ?, ?, ?, ?)`,
      [contactName, companyName || '', phone, email || '', description || '', serviceType || '']
    )
    notifyAdmin('新的服务申请', `<p><b>联系人：</b>${contactName}</p><p><b>公司：</b>${companyName}</p><p><b>电话：</b>${phone}</p><p><b>服务类型：</b>${serviceType}</p><p><b>描述：</b>${description}</p>`)
    res.json({ code: 0, data: { success: true }, message: '申请提交成功，我们的销售团队会在一个工作日内联系您' })
  } catch (err) { next(err) }
})

export default router
