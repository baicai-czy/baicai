// ── 定时任务调度 ──
import cron from 'node-cron'
import pool from '../db/connection.js'

/** 每分钟检查一次：自动发布到达 publish_time 的已审核新闻 */
export function startScheduler() {
  cron.schedule('* * * * *', async () => {
    try {
      const [result] = await pool.query(
        'UPDATE news SET is_published = 1 WHERE is_published = 0 AND review_status = \'approved\' AND publish_time <= NOW()'
      )
      if (result.affectedRows > 0) {
        console.log(`[Scheduler] 自动发布了 ${result.affectedRows} 篇新闻`)
      }
    } catch (err) {
      console.error('[Scheduler] 定时发布失败:', err.message)
    }
  })

  console.log('[Scheduler] 定时发布调度器已启动（每分钟检查）')
}
