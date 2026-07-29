// ── 应用配置（从环境变量读取，docker-compose 注入） ──

export default {
  port: parseInt(process.env.PORT, 10) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'portal-jwt-secret-dev',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
}
