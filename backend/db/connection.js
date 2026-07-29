// ── MySQL 连接池 ──

import mysql from 'mysql2/promise'
import config from '../config.js'

const pool = mysql.createPool(config.db)

// 测试连接
pool.getConnection()
  .then(conn => {
    console.log(`[DB] MySQL connected → ${config.db.host}:${config.db.port}/${config.db.database}`)
    conn.release()
  })
  .catch(err => {
    console.error('[DB] MySQL connection failed:', err.message)
    // 不退出，让 Docker restart 策略处理
  })

export default pool
