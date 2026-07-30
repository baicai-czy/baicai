// ── 邮件通知服务 ──
// 只有配置 SMTP 后才真正发送，否则静默跳过

import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (transporter) return transporter
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST) return null
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10) || 465,
    secure: true,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  })
  return transporter
}

/**
 * 异步发送通知邮件给管理员（不抛异常，不阻塞响应）
 */
export function notifyAdmin(subject, body) {
  const { SMTP_HOST, SMTP_TO } = process.env
  if (!SMTP_HOST || !SMTP_TO) return // SMTP 未配置时静默跳过

  const tp = getTransporter()
  if (!tp) return

  tp.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: SMTP_TO,
    subject: `[城际云门户] ${subject}`,
    html: body,
  }).catch(err => console.error('[Mailer] Failed:', err.message))
}
