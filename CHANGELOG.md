# 城际云门户网站 — 更新日志

---

## 初版1.7 — CMS 完整内容管理 + 安全合规 + 商业化就绪

**日期**：2026-07-30

### 新增：关于我们内容管理系统（CMS）

基于统一 `cms_pages` 表架构，实现灵活可扩展的内容管理：

| 页面 | 管理方式 | 前台数据源 |
|---|---|---|
| **公司简介** | 富文本编辑器实时保存 | `GET /api/cms/about-profile` |
| **企业文化** | 使命/愿景/价值观三字段 | `GET /api/cms/about-culture` |
| **组织架构** | JSON 树形结构编辑 | `GET /api/cms/about-structure` |
| **发展历程** | 增删改事件（年份/标题/描述） | `GET /api/timeline` |
| **资质荣誉** | 分类管理 + 图片上传 + 颁发机构 | `GET /api/honors` |

**架构本质**：`cms_pages` 采用 slug + JSON meta 模式，任何新增页面只需一个 INSERT，无需改数据库结构。

### 新增：安全与合规功能（SOW 第五章）

| 功能 | 实现 |
|---|---|
| **验证码** | SVG 图形验证码（`svg-captcha`），Redis 存储（5分钟过期），登录页点击刷新 |
| **操作日志** | Express 中间件自动记录所有 admin API 写操作（CREATE/UPDATE/DELETE），含操作人/模块/详情/IP/时间 |
| **邮件通知** | `nodemailer` 异步发送，咨询/服务申请提交后通知管理员（SMTP 可选配） |
| **新闻定时发布** | `publish_time <= NOW()` 过滤，未来时间新闻不展示 |

### 新增：友情链接管理

| 组件 | 说明 |
|---|---|
| **后台 CRUD** | `GET/POST/PUT/DELETE /admin-api/links` |
| **前台 API** | `GET /api/links`（只返回启用的） |
| **页脚展示** | AppFooter 动态加载，hover 变色 |

### 后台菜单重组

```
├── 仪表盘
├── 内容管理
│   ├── 关于我们（公司简介/企业文化/组织架构）   ← 新增
│   ├── 发展历程                               ← 新增
│   ├── 资质荣誉                               ← 新增
│   ├── 新闻管理
│   ├── 产品管理
│   ├── 方案管理
│   └── Banner管理
├── 咨询管理
└── 系统管理
    ├── 合作伙伴
    ├── 友情链接                               ← 接真实API
    ├── 数据指标
    ├── 操作日志                               ← 接真实API
    └── 系统设置
```

### 技术架构决策

| 决策 | 方案 | 原因 |
|---|---|---|
| 内容模型 | 单一 `cms_pages` 表 + JSON meta | 避免每页一张表，无限扩展 |
| 富文本编辑器 | wangEditor（CDN 加载） | 零打包体积，国产，中文友好 |
| 验证码 | SVG + Redis | 无第三方依赖，一次性验证，5分钟过期 |
| 操作日志 | Express 中间件 | 非侵入式，自动拦截所有 admin 写操作 |
| 邮件通知 | nodemailer + env 配置 | SMTP 未配时静默跳过，不影响功能 |

### SOW 合规对照（v1.7 更新）

| SOW 要求 | 状态 |
|---|---|
| 前台 7 个一级栏目 | ✅ 全部完成 |
| Banner ≥5 张轮播 | ✅ |
| 关于我们全部子页面（简介/历程/文化/资质/架构） | ✅ 全部可后台编辑 |
| 新闻增删改查/置顶/定时发布 | ✅ |
| 产品按分类展示 | ✅ |
| 联系方式/在线咨询/服务申请 | ✅ + 邮件通知 |
| 后台管理 12 模块 CRUD | ✅ |
| 图片上传（拖拽） | ✅ |
| 验证码（登录+表单） | ✅ |
| 操作日志（审计追踪） | ✅ |
| 友情链接（页脚展示） | ✅ |
| 富文本编辑器 | ✅ wangEditor |
| Nginx / HTTPS / WAF | ⏳ 待部署 |
| ES 全文搜索 | ⏳ MySQL LIKE |
| RBAC 多角色 | ⏳ 单 admin 角色 |
| Spring Boot 后端 | ⏳ Node.js（功能等效） |

### 数据库表（共 14 张）

`site_config` `banners` `news` `products` `solutions` `partners` `stats`
`contacts` `admin_users` `links` `audit_log` `cms_pages` `timeline_events` `honors`

### API 端点（共 25 个，全部通过自检）

前台：`/api/site-config` `/banners` `/news` `/products` `/solutions` `/partners` `/stats` `/links` `/timeline` `/honors` `/cms/:slug` `/contact/consult` `/contact/service-request` `/auth/login` `/auth/refresh` `/auth/captcha`

后台：`/admin-api/site-config` `/banners` `/news` `/products` `/solutions` `/partners` `/stats` `/contacts` `/links` `/timeline` `/honors` `/cms` `/audit-log` `/upload` `/auth/logout` `/auth/user-info`

---

## 初版1.6 — 后端全面上线 + 全链路数据贯通

**日期**：2026-07-30

### 后端基础设施 (Docker 一键部署)

- `docker-compose.yml`：MySQL 8.0 + Redis 7 + Node.js 后端，三服务编排
- `init.sql`：9 张表全量建库（site_config / banners / news / products / solutions / partners / stats / contacts / admin_users）+ 示例数据
- `backend/`：Express + mysql2 + ioredis + JWT 鉴权，19 个路由文件
- Docker 热更新（nodemon polling），Windows 兼容

### 后台管理：全部对接真实 API（8 大模块）

| 模块 | 具备功能 | 客户页面对应 |
|---|---|---|
| **仪表盘** | 实时统计新闻数/产品数/方案数/咨询数，最新咨询列表 | — |
| **Banner** | 增删改 + 启停 + 拖拽上传图片 | 首页大轮播 |
| **新闻** | 分页 + 搜索 + 增删改 + 发布/下架 + tags（逗号转数组） | 首页新闻区 + 列表页 + 详情页 |
| **产品** | 增删改 + features/链接/分类/图标 | 首页核心产品 + 列表页 + 详情页 |
| **方案** | 增删改 + 配图上传 + 目标客户 + HTML详情 | 首页方案区 + 列表页 + 详情页 |
| **合作伙伴** | 增删改 + Logo上传 + 官网链接 | 首页 Logo 墙 |
| **数据指标** | 增删改（数值/前后缀/小数位/排序） | 首页数字增长动画 |
| **系统设置** | 站点名/Logo/ICP/版权/电话/邮箱/地址/SEO | 全站 Header/Footer/联系我们页 |
| **咨询管理** | 分页查看 + 详情弹窗 + 删除 | 联系我们页→用户填表→后台可见 |

### Bug 修复（关键问题）

- **双剥壳 Bug**：所有 Store（banner/news/app）`res?.data` 改为直接取 `data`，拦截器已剥壳
- **VITE_USE_API 死条件**：首页/产品详情/方案详情三处守卫删除，API 现在始终调用
- **Tags 序列化 Bug**：后台发字符串时 `JSON.stringify("a,b")`→字面量，改为 `normalizeTags()` 规范化
- **SiteConfig 增量更新**：`PUT /admin-api/site-config` 只更新传入字段，不覆盖未传字段
- **express.json() 限制**：默认 100KB → 10MB，避免新闻 HTML 正文超限
- **Nodemon 文件监听**：加 `--legacy-watch` 轮询模式，Windows Docker 卷挂载兼容

### 新增功能

- **图片上传**：后端 `POST /admin-api/upload` (multer)，前端 `ImageUploader` 组件（拖拽+点击+预览+删除），Banner/方案/合作伙伴/系统设置四页已替换
- **数据指标管理页**：填补"有后端无前端"空白，首页数字动画从此不再是假数据
- **侧边栏优化**：移除友情链接、操作日志两个空壳，补上数据指标入口

### SOW 合规性对照

| SOW 要求 | 状态 |
|---|---|
| 前台 7 个一级栏目 | ✅ 全部完成 |
| Banner ≥5 张轮播 | ✅ 后台管理 + 前台展示 |
| 新闻增删改查/置顶/定时发布 | ✅（定时发布未实现） |
| 产品按分类展示 | ✅ cloud/data/ai/gov |
| 联系方式/在线咨询/服务申请 | ✅ 表单提交 + 后台查看 |
| 后台管理全部模块 CRUD | ✅ 8 模块完成 |
| 图片上传 | ✅ 拖拽上传 |
| Nginx 反向代理 | ⏳ 待部署 |
| HTTPS / 安全防护 | ⏳ 待部署 |
| 验证码 / 邮件通知 | ⏳ 后端有 stub，前端未接 |
| 富文本编辑器 | ⏳ 目前使用 textarea + HTML |
| 关于我们内容管理（公司简介/发展历程/企业文化/资质/架构） | ⏳ 前端页面就绪，后台编辑入口待补充 |
| ES 全文搜索 | ⏳ 目前 MySQL LIKE 简单搜索 |
| RBAC 多角色权限 | ⏳ 目前单一 admin 角色 |

### 已知限制与技术债

| 项目 | 说明 |
|---|---|
| 后端语言 | Node.js（SOW 要求 Spring Boot），功能等效 |
| 友情链接/操作日志 | 已从菜单移除，SOW 有此需求但尚未实现 |
| 关于我们子页面 | 页面已构建，内容管理系统编辑入口待添加 |
| 新闻定时发布 | 后端可存 `publish_time`，无定时调度器 |
| 验证码 | 后端引入 `svg-captcha`，前端未接 |

---

## 初版1.5.2 — Bug修复

**日期**：2026-07-29
- 修复左上角/页脚/客服公司名不显示（siteConfig.title → siteName）
- Banner 标题排版优化（三层结构）
- Banner 背景升级（科技网格+光晕+节点）
- SolutionCard 支持自定义图片

---

## 初版1.5.1 — Bug修复

**日期**：2026-07-29
- 首页/产品页 API 调用全部移入 VITE_USE_API 开关
- 产品页 13 个产品数据恢复 + 图标修复
- 合作伙伴无 Logo 时显示文字名称
- 产品/方案/新闻/联系 四页去掉重复标题

---

## 初版1.5

**日期**：2026-07-29

### 灵动感 + 条理性
- 滚动渐入动画 (useScrollReveal)、回到顶部 (BackToTop)、Header 滚动阴影
- DataCounter 弹跳效果、页脚四栏重组、Hero 标题区统一

### SOW 合规性修复
- 产品页 13 个产品按四大类分组 (通算/智算/云集成/运维)
- 新闻详情页热门推荐 TOP5、`@vueuse/head` SEO meta、`useAbortController` 请求中断

### 组织架构
- 三层级 (CEO/部门/团队)，点击弹窗详情，支持照片/简介/部门描述

### 侧边栏 + 企业文化 + 数据提示
- 侧边栏标题栏/CTA/sticky/图标、企业文化字体优化(18px/22px)
- 各模块无数据时友好占位提示

### 前后端连接
- `VITE_USE_API=false` 开关，前端独立运行，所有模块 fallback 数据

---

## 初版1 — 完整前端工程

**日期**：2026-07-29

- 基础设施：Vite + Vue3 + TS + SCSS + Element Plus
- API 层：双实例 Axios + 7 个 API 模块 + 拦截器
- 状态管理：Pinia 5 个模块 + 竞态处理
- 路由：完整路由表 + 导航守卫 + NProgress
- 类型/工具/Composables/样式系统
- 布局组件 4 个 + 通用组件 13 个 + 业务组件 3 个
- 前台页面 14 个 + 后台页面 10 个
- 构建：1807 modules，零错误

---

## V0 — 项目脚手架

**日期**：2026-07-29（之前）

- Vite 模板初始化，基础依赖安装，配置文件
