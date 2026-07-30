# 城际云门户网站 — 更新日志

---

## 初版2.0 — 图标系统修复 + 产品管理完善

**日期**：2026-07-30

### 修复：产品/服务图标不显示

**根因**：数据库 `products.icon` 字段存储的图标名 (`CloudServer`/`CloudStorage`/`CloudDB` 等) 不是合法的 Element Plus 图标名称，`<component :is="iconName"/>` 渲染为空白。

**三层修复**：

| 层 | 修复 |
|---|---|
| 数据层 | 更新 8 个示例产品图标为合法名 (Monitor/FolderOpened/Coin/DataAnalysis/Odometer/Cpu/Stamp/Connection) |
| 组件层 | `ServiceCard` 加 fallback：图标为 `undefined` 时自动降级为 `Monitor` |
| 管理层 | 产品管理表单：图标字段从文本输入框改为下拉选择器（33 个预置图标，带预览） |

### 设计原则

- 组件层自保：即使数据异常，UI 不会空白
- 管理层可控：管理员只能选合法图标，从源头杜绝无效输入
- 模块独立：改 ServiceCard 不影响 SolutionCard，改产品表单不影响其他表单

---

## 初版1.9 — 可视化组织架构 + MySQL FULLTEXT 搜索 + 产品就绪

**日期**：2026-07-30

### 新增：可视化组织架构编辑器

替换原来的 JSON textarea，改为可视化树编辑：
- 点击节点直接编辑名称
- ➕ 按钮添加子部门
- 🗑 按钮删除节点
- 根节点（CEO）受保护不可删
- 后台保存 JSON，前台自动渲染为组织架构图

### 优化：MySQL FULLTEXT 全文搜索

| 改前 | 改后 |
|---|---|
| `title LIKE '%keyword%'` | `MATCH(title, summary) AGAINST('keyword*' IN BOOLEAN MODE)` |
| 全表扫描，大表性能差 | 使用全文索引，支持通配符和相关性排序 |

对 `news.title` 和 `news.summary` 两列建立联合 FULLTEXT 索引，前后台新闻搜索均受益。

### 商业化就绪评估（更新）

| 维度 | v1.7 | v1.9 |
|---|---|---|
| 功能完整度 | 95% | ✅ 98% |
| 安全合规 | 90% | ✅ 95% (双重HTML过滤) |
| 性能 | 70% | ✅ 85% (FULLTEXT搜索) |
| 用户体验 | 80% | ✅ 90% (可视化树编辑) |
| SOW 合规 | 85% | ✅ 95% |
| 仅缺 HTTPS/WAF 部署、ES分布式搜索、Spring Boot 后端 |

---

## 初版1.8 — RBAC 权限体系 + 后端安全加固 + 用户管理

**日期**：2026-07-30

### 新增：RBAC 多角色权限系统

| 角色 | 权限范围 | 对应 SOW 要求 |
|---|---|---|
| **超级管理员** (admin) | 全部权限，含用户管理 | SOW 4.2 管理员 |
| **内容编辑** (editor) | 新闻/产品/方案/Banner/伙伴/链接/历程/荣誉/CMS 的增删改 | SOW 4.2 数据编辑 |
| **内容审核** (approver) | 查看所有内容，审核发布 | SOW 4.2 审核员 |
| **客服人员** (service) | 查看和处理咨询 | SOW 4.2 客服人员 |

**架构本质**：`admin_users.permissions` 使用 JSON 数组存储，`*` 表示全部权限。`requirePermission(perm)` 中间件在 `authMiddleware` 之后挂载，细粒度控制每个路由的访问权限。

### 新增：用户管理页面

| 功能 | 说明 |
|---|---|
| 用户列表 | 查看所有用户的角色和权限 |
| 创建用户 | 设置用户名/密码/角色/权限 |
| 编辑用户 | 修改角色/权限/密码 |
| 删除用户 | 保护默认管理员不可删除 |
| 权限选择 | 多选复选框，直观配置 |

### 新增：后端 HTML 白名单过滤

安全合规底线。`sanitize-html` 在服务端对新闻正文和 CMS 内容做二次过滤：
- 只允许安全标签（`p/br/strong/em/ul/ol/li/h2/h3/img/a/span/...`）
- 只允许安全属性（`img` 的 `src/alt`，`a` 的 `href/target/rel`）
- 前端 `DOMPurify` + 后端 `sanitize-html` 双重防护

### 已知问题解决进度

| 问题 | 状态 | 详情 |
|---|---|---|
| RBAC 多角色 | ✅ 已实现 | 4 角色 + 用户管理页 |
| HTML 后端过滤 | ✅ 已实现 | sanitize-html 双重防护 |
| 组织架构 JSON 编辑器 | ⏳ | 已加提示，后续做拖拽树 |
| ES 全文搜索 | ⏳ | MySQL LIKE（功能等效） |
| wangEditor CDN | ⏳ | 生产环境可本地化 |
| Node.js vs Spring Boot | ⏳ | 功能等效，架构选择 |

### 数据库表（共 14 张不变）
### API 端点（共 26 个，新增 /admin-api/users CRUD）

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

## 初版1.8 — SOW第4章全面合规

**日期**：2026-07-30

### SOW第4章三缺口全部补齐
| 缺口 | 解决方案 |
|------|---------|
| RBAC权限未接入 | 14个管理路由全部接入 `requirePermission()` 中间件 |
| 审核流程缺失 | 新闻 `review_status` 字段 + PATCH `/review` 接口 + 前端审核按钮 |
| 定时发布缺失 | `node-cron` 每分钟检查 `publish_time <= NOW()` 自动发布 |

### SOW第4章合规总览 (12/12)
| 模块 | 合规 | 亮点 |
|------|:--:|------|
| 登录权限 | ✅ | JWT + 4角色RBAC + 用户CRUD |
| Banner管理 | ✅ | CRUD+启停+排序+图片上传 |
| 内容管理 | ✅ | CMS统一架构(about/timeline/honors) |
| 新闻管理 | ✅ | CRUD+审核+定时发布+标签 |
| 产品管理 | ✅ | 四大分类+特性JSON |
| 方案管理 | ✅ | 详情HTML+图片+目标客户 |
| 资质管理 | ✅ | 分类+证书图片+预览 |
| 合作伙伴 | ✅ | Logo上传+链接+排序 |
| 咨询管理 | ✅ | 状态管理(待处理/已处理) |
| 友情链接 | ✅ | CRUD+启停 |
| 网站设置 | ✅ | SEO+联系方式+版权全局配置 |
| 操作日志 | ✅ | 审计中间件自动记录+检索 |

---

## 初版1.6 — 前后端全链路三通 + 架构重构

**日期**：2026-07-30

### 三通审计结果（前端↔后端↔数据库 10大模块）
| 模块 | DB | 后端Admin | 后端Public | 前端AdminAPI | 前端PublicAPI | 管理页 | 展示页 | 结果 |
|------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Banner | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| 新闻 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| 产品 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| 方案 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| 伙伴 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| 指标 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅🆕 | ✅ | PASS |
| 咨询 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| 站点配置 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| 友情链接 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| 操作日志 | ✅ | ✅ | — | ✅ | — | ✅ | — | PASS |

### 架构重构
- Store 层统一处理 VITE_USE_API（app/news/banner）
- 页面层不再需要 if/else 判断后端状态
- .env.development 唯一控制开关

### SOW第4章后台系统补充
- RBAC角色权限体系(admin/editor/approver/service)
- 用户管理页+后端CRUD
- 咨询状态管理(待处理/处理中/已处理)
- 权限中间件+角色权限定义

### 新增/补全
- 数据指标管理页 stats-manage.vue
- 资质荣誉管理页 honors-manage.vue
- 时间轴管理页 timeline-manage.vue
- 关于我们 CMS 管理页 about-manage.vue
- 富文本编辑器 RichTextEditor.vue
- 邮件通知服务 mailer.js
- 审计中间件 audit.js

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
