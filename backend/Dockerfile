# ── Backend Dockerfile (开发环境) ──
FROM node:22-alpine

# 安装 nodemon 全局（开发热更新）
RUN npm install -g nodemon

WORKDIR /app

# 依赖层缓存
COPY package.json package-lock.json* ./
RUN npm install

# 源代码通过 volume 挂载，不 COPY（实现热更新）
# 启动时用 nodemon，代码改动自动重启

EXPOSE 8080

CMD ["nodemon", "--legacy-watch", "--watch", ".", "--ext", "js,json", "--delay", "1", "app.js"]
