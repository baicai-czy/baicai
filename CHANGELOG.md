# 城际云门户网站 — 更新日志

> 记录每次代码变更的版本号、时间、改动内容。

---

## 初版1.2.1 — 在线客服状态优化 + Bug修复

**日期**：2026-07-29  
**类型**：功能优化 + 修复

| 改动 | 说明 |
|------|------|
| 在线状态动态判断 | 工作日 9:00-18:00 显示绿色"在线"，其余时间显示灰色"离线" |
| 欢迎语自适应 | 在线时引导产品咨询，离线时引导拨打电话/发邮件/留言 |
| 在线绿点错位修复 | 圆点和文字分离为独立元素，flex 居中对齐 |
| Banner 黑色区域修复 | 占位背景从深色 #0d1b2a → 浅蓝 #e8f0fa |
| 数据亮点黑色区域修复 | 背景从深蓝渐变 → 浅蓝淡色渐变 |
| 99.99% 数字显示修复 | prefix+value+suffix 拼接错误 → decimals 字段精确控制小数 |
| 组织架构重构 | 三层层级：CEO(深蓝渐变) → 部门负责人(左对齐头像卡片) → 团队成员(浅色卡片)；间距 2xl，连线加粗 3px，箭头指示，hover 上浮 + 蓝边 |
| 侧边栏美化 | 新增标题栏(图标+文字+渐变背景)、底部"需要帮助"引导卡片、激活项右箭头指示、sticky粘性跟随滚动、关于我们每项加图标 |

---

---

## 初版1.2 — UI/UX 全面美化

**日期**：2026-07-29  
**类型**：视觉优化

| 组件 | 改动 |
|------|------|
| BannerSwiper | 品牌渐变背景 + 装饰圆形/点阵、CTA 药丸按钮 + 阴影、毛玻璃箭头、指示器展开为长条 |
| QuickEntry | hover 整卡品牌渐变覆盖、图标旋转缩放变白、箭头滑出动画 |
| ServiceCard | hover 底部进度条、图标反色渐变、勾号圆点列表、上浮 8px |
| SolutionCard | 图片区改为品牌渐变占位、毛玻璃圆角标签 |
| NewsCard | 无图品牌色占位、置顶标签圆角药丸 + 阴影、底部分割线 + pill 标签 |
| DataCounter | 每项上方品牌色图标、数字 52px 加粗、字母间距 |
| AppHeader | 毛玻璃背景、立方体色块 Logo、导航圆角 hover、"联系我们"药丸按钮、68px 高度 |
| 首页 | 标题 36px 加粗/字母间距、副标题下方蓝色装饰线、卡片间距 2xl |

---

## 初版1.1 — SOW 合规性完善

**日期**：2026-07-29  
**类型**：功能新增 + 修复

| 改动 | 说明 |
|------|------|
| 首页快捷入口修复 | 调整为 SOW 规定的 4 个（国资云/云和智算集成/解决方案/联系我们） |
| 新增在线客服 | 右下角悬浮按钮（CustomerService.vue），支持自动回复，可对接第三方 |
| 新增合作伙伴管理 | 后台 CRUD 管理页（partners-manage.vue） |
| 新增友情链接管理 | 后台 CRUD 管理页（links-manage.vue） |
| 新增操作日志 | 后台审计日志页（audit-log.vue），支持搜索/日期筛选 |
| 字体更换 | 引入思源黑体（Noto Sans SC），替换系统默认字体 |
| DataCounter 小数支持 | 新增 `decimals` 字段，StatItem 类型扩展 |
| 路由/菜单更新 | 路由表和后台侧边栏新增 3 个管理页面入口 |

---

## 初版1 — 完整前端工程

**日期**：2026-07-29  
**类型**：项目初始化

| 层级 | 内容 |
|------|------|
| 基础设施 | Vite + Vue3 + TS + SCSS + Element Plus 完整配置 |
| API 层 | Axios 双实例（publicApi/adminApi）+ 7 个 API 模块 + 统一拦截器 |
| 状态管理 | Pinia Store 5 个模块（app/news/banner/contact/auth）+ 竞态处理 |
| 路由 | 完整路由表（前台 7 大栏目 + 后台管理）+ 导航守卫 + NProgress |
| 类型系统 | API/News/Components 完整类型定义 + 全局声明 |
| 工具函数 | format（日期/数字/文本）、validate（验证规则）、sanitize（XSS 过滤）、constants |
| Composables | useBanner、usePagination、useSearch、useForm、useResponsive |
| 样式系统 | CSS 变量（品牌色/字体/间距）+ SCSS Mixin（响应式/文本截断）+ Reset + Global |
| 布局组件（4个） | AppHeader、AppFooter、AppLayout、SideNav |
| 通用组件（13个） | BannerSwiper、QuickEntry、NewsCard、DataCounter、SearchBox、Pagination、Skeleton、PartnerWall、Timeline、HonorWall、ContactForm、MapViewer、OrgChart |
| 业务组件（3个） | ServiceCard、SolutionCard、CaseCard |
| 前台页面（14个） | 首页 + 关于我们(6子页) + 业务版块(2子页) + 产品与服务 + 解决方案 + 新闻中心 + 联系我们 + 404 |
| 后台页面（7个） | 登录 + 仪表盘 + 新闻/产品/方案/Banner/咨询管理 + 系统设置 |

---

## V0 — 项目脚手架

**日期**：2026-07-29（之前）  
**提交**：`b62d6dd` — 完成前置工作

| 改动 | 说明 |
|------|------|
| Vite 模板初始化 | Vue 3 + TypeScript + Vite 项目脚手架 |
| 基础依赖安装 | Element Plus、Pinia、Vue Router、Axios、SCSS 等 |
| 配置文件 | tsconfig、vite.config.ts、.env、.prettierrc |
