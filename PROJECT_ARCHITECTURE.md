# 城际云门户网站 — 前端架构文档

> **文档版本**：V1.0  
> **编制日期**：2026-07-29  
> **适用范围**：城际云（江苏）科技有限公司官方门户网站前端工程  

---

## 目录

- [一、项目概述](#一项目概述)
- [二、技术栈总览](#二技术栈总览)
- [三、目录结构详解](#三目录结构详解)
- [四、路由体系设计](#四路由体系设计)
- [五、API 请求层规范](#五api-请求层规范)
- [六、状态管理规范](#六状态管理规范)
- [七、样式编写规范](#七样式编写规范)
- [八、组件架构与划分](#八组件架构与划分)
- [九、关键业务逻辑与注意事项](#九关键业务逻辑与注意事项)
- [十、安全与防御性编程](#十安全与防御性编程)
- [十一、编码约定速查表](#十一编码约定速查表)

---

## 一、项目概述

本项目为城际云（江苏）科技有限公司官方门户网站的前端工程。网站包含 **7 个一级栏目**（首页、关于我们、业务版块、产品与服务、解决方案、新闻中心、联系我们），整体采用一级导航 + 二级子页面的层级结构。

### 核心目标

| 目标 | 说明 |
|------|------|
| 品牌展示 | 全面展示企业形象、发展理念、业务实力 |
| 业务推广 | 清晰呈现国资云、云和智算集成两大业务版块 |
| 信息发布 | 新闻动态、行业资讯、通知公告的发布与检索 |
| 客户服务 | 在线咨询、服务申请、工单提交等互动功能 |
| 自主可控 | 采用国产开源技术栈，部署于城际云自有云平台 |

### 关键性能指标

| 指标 | 目标值 |
|------|--------|
| 首页首屏加载 | ≤ 3 秒 |
| 内页加载 | ≤ 2 秒 |
| 并发用户 | ≥ 500 |
| 可用性 | ≥ 99.9% |
| 浏览器兼容 | Chrome/Edge/Safari/Firefox（最近 2 个版本）+ 移动端 |

---

## 二、技术栈总览

### 核心依赖

| 层级 | 技术 | 版本 | 职责 |
|------|------|------|------|
| 框架 | **Vue 3** | 3.4+ | 渐进式前端框架，Composition API |
| 类型系统 | **TypeScript** | 5.x | 静态类型检查 |
| UI 组件库 | **Element Plus** | 2.x | 企业级 UI 组件（按需引入） |
| 状态管理 | **Pinia** | 2.x | Vue 3 官方状态管理 |
| 路由 | **Vue Router** | 4.x | SPA 路由，支持懒加载与导航守卫 |
| 构建工具 | **Vite** | 5.x | 极速 HMR + ESBuild 预构建 |
| HTTP 客户端 | **Axios** | 1.x | 请求/响应拦截、Token 注入 |

### 辅助依赖

| 层级 | 技术 | 用途 |
|------|------|------|
| CSS 预处理 | **SCSS** | 变量/Mixin/嵌套，辅助样式编写 |
| CSS 令牌 | **CSS Custom Properties** | 主题色、字体、间距统一管理 |
| 图标 | **@element-plus/icons-vue** | 全局图标注册 |
| 富文本渲染 | **DOMPurify** | 新闻正文等富文本 XSS 过滤 |
| 代码规范 | **ESLint + Prettier** | 代码风格统一 |
| Git 提交 | **Husky + lint-staged** | 提交前自动检查 |
| 头部管理 | **@vueuse/head** | 动态设置页面 title/meta |
| 状态持久化 | **pinia-plugin-persistedstate** | 关键 store 写入 localStorage |

### 环境变量

```bash
# .env.development
VITE_API_BASE_URL=/api          # 前台公开接口
VITE_API_ADMIN_URL=/admin-api    # 后台管理接口
VITE_APP_TITLE=城际云门户网站

# .env.production
VITE_API_BASE_URL=/api
VITE_API_ADMIN_URL=/admin-api
VITE_APP_TITLE=城际云（江苏）科技有限公司
```

---

## 三、目录结构详解

```
Portal/                          # 项目根目录
├── .vscode/                     # VSCode 编辑器配置
│   ├── settings.json            #   工作区设置
│   └── extensions.json          #   推荐插件列表
├── public/                      # 不经过构建的静态资源
│   ├── favicon.ico              #   网站图标
│   └── images/
│       └── placeholder.png      #   图片加载失败的默认占位图
├── src/
│   ├── assets/                  # ❯ 构建时处理的静态资源
│   │   ├── images/              #    图片（Logo/Banner/图标）
│   │   ├── fonts/               #    字体文件（思源黑体等）
│   │   └── styles/              #    全局样式文件
│   │       ├── variables.scss   #      SCSS 变量 / CSS 自定义属性
│   │       ├── mixins.scss      #      SCSS 混入（响应式断点/文字截断等）
│   │       ├── reset.scss       #      浏览器默认样式重置
│   │       └── global.scss      #      全局基础样式（body/h1-h6/a 等）
│   │
│   ├── components/              # ❯ 公共组件
│   │   ├── layout/              #    布局组件
│   │   │   ├── AppHeader.vue    #      顶部导航栏（7个一级栏目 + Logo）
│   │   │   ├── AppFooter.vue    #      底部信息栏（备案/链接/版权）
│   │   │   ├── AppLayout.vue    #      通用页面布局容器
│   │   │   └── SideNav.vue      #      侧边二级子导航
│   │   ├── common/              #    通用功能组件
│   │   │   ├── BannerSwiper.vue #      全宽轮播图（≥5张，响应式）
│   │   │   ├── QuickEntry.vue   #      快捷入口卡片组
│   │   │   ├── NewsCard.vue     #      新闻摘要卡片
│   │   │   ├── PartnerWall.vue  #      合作伙伴 Logo 墙（悬停效果）
│   │   │   ├── DataCounter.vue  #      数字动态增长动画
│   │   │   ├── ContactForm.vue  #      通用联系表单（咨询/申请复用）
│   │   │   ├── Timeline.vue     #      时间轴组件（发展历程）
│   │   │   ├── HonorWall.vue    #      资质证书展示墙（分类/放大）
│   │   │   ├── OrgChart.vue     #      组织架构树形图
│   │   │   ├── MapViewer.vue    #      地图展示（高德/百度 API，懒加载）
│   │   │   ├── SearchBox.vue    #      搜索框（300ms 防抖）
│   │   │   ├── Pagination.vue   #      分页组件
│   │   │   └── Skeleton.vue     #      骨架屏加载占位
│   │   └── business/            #    业务专属组件
│   │       ├── ServiceCard.vue  #      产品/服务卡片
│   │       ├── SolutionCard.vue #      解决方案卡片
│   │       └── CaseCard.vue     #      成功案例卡片
│   │
│   ├── pages/                   # ❯ 页面组件（按路由一一对应）
│   │   ├── home/
│   │   │   └── index.vue        #      首页（Banner+入口+业务+新闻+数据+合作）
│   │   ├── about/
│   │   │   ├── index.vue        #      关于我们首页（重定向到公司简介）
│   │   │   ├── profile.vue      #      公司简介（富文本）
│   │   │   ├── history.vue      #      发展历程（时间轴）
│   │   │   ├── culture.vue      #      企业文化（使命/愿景/价值观）
│   │   │   ├── honors.vue       #      资质荣誉（证书墙）
│   │   │   └── structure.vue    #      组织架构（树形图）
│   │   ├── business/
│   │   │   ├── state-cloud.vue  #      国资云（通算/智算/行业云）
│   │   │   └── integration.vue  #      云和智算集成（规划/建设/运维/迁移）
│   │   ├── products/
│   │   │   ├── index.vue        #      产品与服务总览
│   │   │   └── detail.vue       #      产品详情（通算/智算/集成/运维）
│   │   ├── solutions/
│   │   │   ├── index.vue        #      解决方案列表
│   │   │   └── detail.vue       #      解决方案详情
│   │   ├── news/
│   │   │   ├── index.vue        #      新闻列表（分页/筛选/搜索）
│   │   │   └── detail.vue       #      新闻详情（富文本/附件/热门推荐）
│   │   └── contact/
│   │       └── index.vue        #      联系我们（地图/方式/咨询/申请）
│   │
│   ├── router/                  # ❯ 路由配置
│   │   ├── index.ts             #    路由实例 + 全局导航守卫
│   │   └── routes.ts            #    路由表定义（嵌套路由 + 懒加载）
│   │
│   ├── stores/                  # ❯ Pinia 状态管理
│   │   ├── index.ts             #    Pinia 实例创建
│   │   └── modules/
│   │       ├── app.ts           #    全局站点配置/导航状态
│   │       ├── news.ts          #    新闻列表/分类/搜索
│   │       ├── banner.ts        #    首页 Banner 列表
│   │       ├── contact.ts       #    联系表单草稿
│   │       └── auth.ts          #    后台管理登录态/Token/角色
│   │
│   ├── api/                     # ❯ API 接口层
│   │   ├── index.ts             #    Axios 双实例创建 + 拦截器
│   │   ├── modules/
│   │   │   ├── news.ts          #    新闻相关接口
│   │   │   ├── products.ts      #    产品相关接口
│   │   │   ├── solutions.ts     #    解决方案接口
│   │   │   ├── contact.ts       #    联系/咨询/申请接口
│   │   │   ├── banner.ts        #    Banner 管理接口
│   │   │   ├── auth.ts          #    登录/Token 刷新接口
│   │   │   └── common.ts        #    站点配置等通用接口
│   │   └── types.ts             #    API 通用响应类型
│   │
│   ├── composables/             # ❯ 组合式函数（Hooks）
│   │   ├── useBanner.ts         #    Banner 轮播与预加载逻辑
│   │   ├── usePagination.ts     #    分页逻辑
│   │   ├── useForm.ts           #    表单验证与提交
│   │   ├── useSearch.ts         #    搜索防抖与竞态处理
│   │   └── useResponsive.ts     #    响应式断点检测
│   │
│   ├── utils/                   # ❯ 工具函数
│   │   ├── request.ts           #    Axios 实例封装
│   │   ├── format.ts            #    日期/数字/文本格式化
│   │   ├── validate.ts          #    表单验证规则集
│   │   ├── sanitize.ts          #    富文本 XSS 过滤
│   │   └── constants.ts         #    全局常量（分类枚举/色彩映射等）
│   │
│   ├── types/                   # ❯ 全局 TypeScript 类型
│   │   ├── global.d.ts          #    环境变量/模块声明
│   │   ├── news.ts              #    新闻相关类型
│   │   ├── api.ts               #    API 通用响应/分页类型
│   │   └── components.ts        #    组件 Props 类型
│   │
│   ├── App.vue                  # 根组件
│   └── main.ts                  # 项目入口文件
│
├── .env.development             # 开发环境变量
├── .env.production              # 生产环境变量
├── .eslintrc.cjs                # ESLint 配置
├── .prettierrc                  # Prettier 配置
├── index.html                   # HTML 入口模板
├── package.json
├── tsconfig.json                # TypeScript 配置
├── vite.config.ts               # Vite 构建配置
└── PROJECT_ARCHITECTURE.md      # 本文件
```

---

## 四、路由体系设计

### 4.1 路由表结构

```
/                           →  pages/home/index.vue              首页
/about                      →  pages/about/index.vue             关于我们
  /about/profile            →    pages/about/profile.vue           公司简介（默认）
  /about/history            →    pages/about/history.vue           发展历程
  /about/culture            →    pages/about/culture.vue           企业文化
  /about/honors             →    pages/about/honors.vue            资质荣誉
  /about/structure          →    pages/about/structure.vue         组织架构
/business                   →  pages/business/state-cloud.vue    业务版块（默认国资云）
  /business/state-cloud     →    pages/business/state-cloud.vue   国资云
  /business/integration     →    pages/business/integration.vue   云和智算集成
/products                   →  pages/products/index.vue          产品与服务
  /products/detail/:type    →    pages/products/detail.vue         产品详情
/solutions                  →  pages/solutions/index.vue         解决方案
  /solutions/detail/:id     →    pages/solutions/detail.vue        方案详情
/news                       →  pages/news/index.vue              新闻中心
  /news/detail/:id          →    pages/news/detail.vue             新闻详情
/contact                    →  pages/contact/index.vue           联系我们
/admin/login                →  pages/admin/login.vue             后台登录（独立布局）
/admin/*                    →  pages/admin/...                   后台管理（独立布局）
/404                        →  pages/error/404.vue               404 页面
```

### 4.2 路由配置约定

```typescript
// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

// ✅ 全量路由懒加载
// ✅ 嵌套路由使用 children + redirect
// ✅ 每个路由携带 meta（title / activeNav / breadcrumb）
// ✅ 404 捕获放在最后，使用 catch-all 语法

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/home/index.vue'),
    meta: { title: '首页 - 城际云', activeNav: 'home' },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/about/index.vue'),
    redirect: '/about/profile',
    meta: { title: '关于我们 - 城际云', activeNav: 'about' },
    children: [
      { path: 'profile',  name: 'AboutProfile',  component: () => import('@/pages/about/profile.vue'),  meta: { title: '公司简介' } },
      { path: 'history',  name: 'AboutHistory',  component: () => import('@/pages/about/history.vue'),  meta: { title: '发展历程' } },
      { path: 'culture',  name: 'AboutCulture',  component: () => import('@/pages/about/culture.vue'),  meta: { title: '企业文化' } },
      { path: 'honors',   name: 'AboutHonors',   component: () => import('@/pages/about/honors.vue'),   meta: { title: '资质荣誉' } },
      { path: 'structure',name: 'AboutStructure',component: () => import('@/pages/about/structure.vue'),meta: { title: '组织架构' } },
    ],
  },
  // ... 其余路由同理
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/error/404.vue') },
]
```

### 4.3 导航守卫职责

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(),          // HTML5 History 模式（需 Nginx try_files 配合）
  routes,
  scrollBehavior: () => ({ top: 0 }),   // 每次路由切换回到顶部
})

// ── 前置守卫 ──
router.beforeEach((to, from) => {
  NProgress.start()                     // 进度条
  document.title = to.meta.title        // 动态标题
  // 后台路由额外校验 Token
  if (to.path.startsWith('/admin') && !localStorage.getItem('admin_token')) {
    return { path: '/admin/login', query: { redirect: to.fullPath } }
  }
})

// ── 后置钩子 ──
router.afterEach(() => {
  NProgress.done()
})

export default router
```

---

## 五、API 请求层规范

### 5.1 三层架构

```
┌────────────────────────────────────────────────────────┐
│  页面组件（.vue）                                         │
│    ↓ 调用 action                                         │
│  Pinia Store（stores/modules/*.ts）                      │
│    ↓ 调用 API 函数                                       │
│  API 模块（api/modules/*.ts）                            │
│    ↓ 使用 Axios 实例                                      │
│  传输层（api/index.ts → Axios Instance）                  │
│    ↓ HTTP                                                │
│  后端服务                                                │
└────────────────────────────────────────────────────────┘

职责分离：
  · 页面组件 → 只负责渲染和触发 action，不直接 import axios
  · Store    → 管理请求状态（loading/error/data），缓存与去重
  · API 模块 → 定义请求的 URL、参数类型、返回值类型
  · Axios 实例 → 处理传输层通用逻辑（baseURL/超时/拦截器）
```

### 5.2 双实例设计

项目维护两个 Axios 实例，各自有不同的拦截逻辑：

| 实例 | 用途 | Token | 超时 | baseURL |
|------|------|-------|------|---------|
| `publicApi` | 前台公开接口（Banner/新闻/产品/表单提交等） | 无 | 15s | `/api` |
| `adminApi` | 后台管理接口（内容管理/审核/系统设置等） | Bearer Token | 30s | `/admin-api` |

```typescript
// src/api/index.ts — 核心封装
import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'

// ── 创建实例 ──
export const publicApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

export const adminApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ADMIN_URL,
  timeout: 30000,
})

// ── 请求拦截 ──
publicApi.interceptors.request.use((config) => {
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  return config
})

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── 响应成功拦截（剥壳） ──
function onFulfilled(res: AxiosResponse) {
  const { code, data, message } = res.data
  if (code === 0 || code === 200) return data          // 成功，返回 payload
  ElMessage.error(message || '请求失败')                 // 业务错误，统一提示
  return Promise.reject(new Error(message))
}

// ── 响应失败拦截（分类处理） ──
function onRejected(err: AxiosError) {
  if (err.response?.status === 401) {
    localStorage.removeItem('admin_token')
    window.location.href = '/admin/login'               // Token 过期，强制重新登录
    return
  }
  const msg = err.code === 'ERR_NETWORK'
    ? '网络连接失败，请检查网络'
    : err.code === 'ECONNABORTED'
      ? '请求超时，请稍后重试'
      : '服务器繁忙，请稍后重试'
  ElMessage.error(msg)
  return Promise.reject(err)
}

publicApi.interceptors.response.use(onFulfilled, onRejected)
adminApi.interceptors.response.use(onFulfilled, onRejected)
```

### 5.3 Token 刷新机制

```
登录成功
  ↓
localStorage.setItem('admin_token', token)
localStorage.setItem('admin_refresh', refreshToken)
  ↓
每次请求 → adminApi 拦截器自动附加 Authorization: Bearer <token>
  ↓
收到 401
  ├── 有 refreshToken → 静默调用 /auth/refresh 换新 Token
  │   ├── 成功 → 更新 localStorage → 重放原请求（队列等待）
  │   └── 失败 → 清除 Token → 跳转登录页
  └── 无 refreshToken → 清除 Token → 跳转登录页
```

### 5.4 跨域处理

| 环境 | 方案 | 配置位置 |
|------|------|---------|
| 本地开发 | Vite Proxy 代理 | `vite.config.ts` → `server.proxy` |
| 生产环境 | Nginx 反向代理（同源部署） | Nginx `location /api` 配置 |

```typescript
// vite.config.ts — 开发代理
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api':        { target: 'http://localhost:8080', changeOrigin: true },
      '/admin-api':  { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
```

### 5.5 API 模块编写规范

```typescript
// src/api/modules/news.ts
import { publicApi } from '@/api'
import type { NewsItem, NewsQuery, PaginatedResponse } from '@/types'

// ✅ 命名：动词 + 资源名
// ✅ 返回值：明确的 Promise<类型>
// ✅ 参数：用 interface 约束，不用 any
export function fetchNewsList(params: NewsQuery): Promise<PaginatedResponse<NewsItem>> {
  return publicApi.get('/news', { params })
}

export function fetchNewsById(id: number): Promise<NewsItem> {
  return publicApi.get(`/news/${id}`)
}
```

### 5.6 请求调用规范

```typescript
// ❌ 错误：页面组件直接调 axios
fetch('/api/news').then(res => res.json()).then(data => list.value = data)

// ❌ 错误：try-catch 中忽略异常
try { await fetchNewsList() } catch {}

// ✅ 正确：通过 Store 调用，finally 中结束 loading
async function loadList() {
  loading.value = true
  try {
    const res = await fetchNewsList({ page: currentPage.value })
    list.value = res.records
    total.value = res.total
  } catch {
    // 错误已在拦截器中统一提示，这里不需要再次弹窗
    list.value = []               // 出错时清空列表，避免展示脏数据
  } finally {
    loading.value = false
  }
}
```

---

## 六、状态管理规范

### 6.1 存储分层决策

```
第 0 层 — URL / 路由参数
  适用于：分页页码、筛选条件、文章 ID
  原则：刷新不丢失、可分享
  示例：/news?category=company&page=3

第 1 层 — Pinia Store
  适用于：≥2 个组件需要读写的数据
  示例：导航高亮、站点配置、用户登录态
  原则：不在组件间通过 props 层层传递

第 2 层 — Composable
  适用于：单个页面/组件簇内的共享状态
  示例：Banner 轮播索引、页面级表单 loading
  原则：作用域局限在当前路由

第 3 层 — 组件 ref / reactive
  适用于：组件私有状态
  示例：弹窗开关、hover 态、input 值
  原则：永远别暴露给父组件
```

### 6.2 Pinia Store 模块

| 文件 | 状态内容 | 特征 |
|------|---------|------|
| `app.ts` | 站点配置（联系方式/备案号/SEO 信息）、当前导航选中项 | 全局单例，`App.vue` mounted 时请求一次 |
| `news.ts` | 新闻列表、总数、当前分类、搜索关键词、loading | 分页数据按 `(分类, 页码)` 缓存 |
| `banner.ts` | 首页 Banner 图片列表 | 低频变更，可缓存 5 分钟 |
| `contact.ts` | 在线咨询/服务申请表单未提交的草稿 | 页面切换保留草稿 |
| `auth.ts` | 管理员登录态、角色、权限列表 | 仅后台管理页面使用 |

### 6.3 Store 编码规范

```typescript
// src/stores/modules/news.ts
import { defineStore } from 'pinia'
import { fetchNewsList } from '@/api/modules/news'
import type { NewsItem } from '@/types'

// 统一使用 setup 语法（Composition API 风格）
export const useNewsStore = defineStore('news', () => {
  // ═══ state ═══
  const list = ref<NewsItem[]>([])
  const total = ref(0)
  const category = ref<'all' | 'company' | 'industry' | 'notice'>('all')
  const loading = ref(false)
  const currentPage = ref(1)

  // ═══ getters ═══
  const isEmpty = computed(() => list.value.length === 0 && !loading.value)
  const hasMore   = computed(() => list.value.length < total.value)

  // ═══ actions ═══
  async function loadList(page = 1, pageSize = 10) {
    loading.value = true
    try {
      const res = await fetchNewsList({
        page,
        pageSize,
        category: category.value,
      })
      list.value = res.records
      total.value = res.total
      currentPage.value = page
    } finally {
      loading.value = false
    }
  }

  function switchCategory(cat: string) {
    if (cat === category.value) return        // 同一分类不重复请求
    category.value = cat as typeof category.value
    loadList(1)                               // 切换分类 → 回到第一页
  }

  return { list, total, category, loading, currentPage, isEmpty, hasMore, loadList, switchCategory }
})
```

### 6.4 竞态条件处理

```typescript
// 用户快速切换分类时，旧请求的响应可能覆盖新数据
let requestSeq = 0

async function loadList(page: number) {
  const seq = ++requestSeq
  loading.value = true
  const res = await fetchNewsList({ page })
  // 只有最新的请求结果才生效
  if (seq !== requestSeq) return
  list.value = res.records
  total.value = res.total
  loading.value = false
}
```

---

## 七、样式编写规范

### 7.1 CSS 变量 → 设计令牌

```scss
// src/assets/styles/variables.scss
// 所有色值来源于 SOW 6.2 色彩方案，此处定义为唯一数据源

:root {
  /* ═══ 品牌色 ═══ */
  --color-primary:       #1A5BB3;   // 科技蓝 — 导航/标题/按钮/主要元素
  --color-primary-light: #3A7FD4;   // 浅科技蓝 — hover 态
  --color-secondary:     #00B4D8;   // 亮蓝色 — 图标/高亮/点缀
  --color-accent:        #FF6B35;   // 活力橙 — CTA 按钮/重要提示
  --color-accent-light:  #FF8A60;   // 浅活力橙 — hover 态

  /* ═══ 中性色 ═══ */
  --color-bg:            #F5F7FA;   // 页面主背景
  --color-card-bg:       #FFFFFF;   // 卡片/模块背景
  --color-text-primary:  #333333;   // 正文文字
  --color-text-secondary:#666666;   // 辅助文字
  --color-text-disabled: #999999;   // 禁用/占位文字
  --color-border:        #E5E7EB;   // 分割线/边框

  /* ═══ 字体（SOW 6.3） ═══ */
  --font-family:     'Source Han Sans CN', 'Microsoft YaHei', -apple-system, sans-serif;
  --font-size-h1:    36px;
  --font-size-h2:    24px;
  --font-size-h3:    18px;
  --font-size-body:  14px;
  --font-size-small: 12px;

  /* ═══ 间距 ═══ */
  --spacing-xs:  4px;
  --spacing-sm:  8px;
  --spacing-md:  16px;
  --spacing-lg:  24px;
  --spacing-xl:  32px;
  --spacing-2xl: 48px;

  /* ═══ 响应式断点 ═══ */
  --bp-xl:  1920px;
  --bp-lg:  1440px;
  --bp-md:  1280px;
  --bp-sm:  768px;
  --bp-xs:  375px;

  /* ═══ 阴影 ═══ */
  --shadow-card:    0 2px 12px rgba(0, 0, 0, 0.08);
  --shadow-header:  0 1px 4px rgba(0, 0, 0, 0.06);
  --shadow-modal:   0 8px 32px rgba(0, 0, 0, 0.16);

  /* ═══ 圆角 ═══ */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* ═══ 过渡 ═══ */
  --transition-fast: 0.15s ease;
  --transition-base: 0.3s ease;
}
```

### 7.2 SCSS Mixin

```scss
// src/assets/styles/mixins.scss

// 响应式断点
@mixin respond-to($bp) {
  @if $bp == xs { @media (max-width: 767px) { @content; } }
  @else if $bp == sm { @media (min-width: 768px) { @content; } }
  @else if $bp == md { @media (min-width: 1280px) { @content; } }
  @else if $bp == lg { @media (min-width: 1440px) { @content; } }
  @else if $bp == xl { @media (min-width: 1920px) { @content; } }
}

// 多行文本截断
@mixin text-clamp($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

// 单行省略
@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 7.3 组件样式规则

```vue
<!-- ✅ 正确示例 -->
<template>
  <div class="news-card" :class="{ 'news-card--pinned': pinned }">
    <h3 class="news-card__title">{{ title }}</h3>
    <p class="news-card__desc">{{ description }}</p>
  </div>
</template>

<style scoped lang="scss">
// 全部使用 scoped 隔离
// 优先用 CSS 变量，不硬编码色值

.news-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--transition-fast);

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }

  &--pinned {
    border-left: 3px solid var(--color-accent);
  }

  &__title {
    color: var(--color-text-primary);
    font-size: var(--font-size-h3);
    @include text-ellipsis;
  }

  &__desc {
    color: var(--color-text-secondary);
    font-size: var(--font-size-body);
    margin-top: var(--spacing-sm);
    @include text-clamp(2);
  }
}
</style>
```

### 7.4 样式规则速查

| 规则 | 说明 |
|------|------|
| 全部使用 `<style scoped>` | 样式隔离，防止全局污染 |
| 优先使用 `var(--xxx)` | 不硬编码色值/字号/间距 |
| 禁止 `!important` | 覆盖 Element Plus 走 CSS 变量 |
| 穿透用 `:deep()` | 仅用于修改 Element Plus 默认样式 |
| BEM 命名 | `.block__element--modifier` |
| 禁止裸写 `@media` | 统一使用 `@include respond-to()` |
| 链接/按钮必须 hover 态 | 过渡动画用 `var(--transition-fast)` |
| 不写内联样式 | `<div style="...">` 禁止 |

---

## 八、组件架构与划分

### 8.1 三级分类

```
src/components/
├── layout/          ← 布局通用组件
│   └── 规则：只控制页面骨架（Header/Footer/Sidebar/Container）
│        不包含业务数据获取逻辑，通过 props 接收数据
│
├── common/          ← 功能通用组件
│   └── 规则：在 ≥2 个页面中出现
│        不包含特定业务文案，交互逻辑通用
│        通过 props 和 slots 提供扩展能力
│
└── business/        ← 业务专属组件
    └── 规则：包含特定业务领域的数据结构或交互逻辑
           对外暴露明确的 props 接口
           可以有自己的内部状态
```

### 8.2 提取判断流程

```
是否 ≥2 个页面中使用？
  ├── 否 → 放在页面目录下，不提取
  └── 是 → 包含特定业务逻辑/文案？
        ├── 是 → src/components/business/
        └── 否 → src/components/common/
```

### 8.3 Props 与 Emits 规范

```typescript
// ✅ 正确：清晰的 Props 接口 + JSDoc
interface ServiceCardProps {
  /** 服务图标（Element Plus 图标名） */
  icon: string
  /** 服务标题 */
  title: string
  /** 服务简介，最多 120 字 */
  description: string
  /** 详情跳转链接 */
  to: string | RouteLocationRaw
  /** 骨架屏占位 */
  loading?: boolean
}

const props = withDefaults(defineProps<ServiceCardProps>(), {
  loading: false,
})

// ✅ Emits 类型化
const emit = defineEmits<{
  /** 点击"了解更多"时触发，传服务名称供埋点 */
  'learn-more': [serviceName: string]
}>()

// ❌ 错误：无类型的 props
// defineProps(['icon', 'title', 'description'])
```

### 8.4 页面组件结构模板

```vue
<script setup lang="ts">
// ═══ 1. imports ═══
import { useNewsStore } from '@/stores/modules/news'
import NewsCard from '@/components/common/NewsCard.vue'
import Pagination from '@/components/common/Pagination.vue'

// ═══ 2. store ═══
const newsStore = useNewsStore()

// ═══ 3. state ═══
const currentPage = ref(1)

// ═══ 4. lifecycle ═══
onMounted(() => {
  newsStore.loadList()
})

// ═══ 5. methods ═══
function onPageChange(page: number) {
  currentPage.value = page
  newsStore.loadList(page)
}
</script>

<template>
  <AppLayout>
    <!-- ═══ Hero / 页面标题区 ═══ -->
    <section class="page-hero">
      <h2>新闻中心</h2>
      <p>了解城际云最新动态与行业资讯</p>
    </section>

    <!-- ═══ 主要内容区 ═══ -->
    <section class="page-content">
      <!-- 加载态 -->
      <Skeleton v-if="newsStore.loading" :count="6" />

      <!-- 空状态 -->
      <el-empty v-else-if="newsStore.isEmpty" description="暂无新闻" />

      <!-- 正常列表 -->
      <template v-else>
        <NewsCard v-for="item in newsStore.list" :key="item.id" v-bind="item" />
        <Pagination :total="newsStore.total" :current="currentPage" @change="onPageChange" />
      </template>
    </section>
  </AppLayout>
</template>

<style scoped lang="scss">
// 使用 BEM 命名 + CSS 变量
.page-hero { /* ... */ }
.page-content { /* ... */ }
</style>
```

---

## 九、关键业务逻辑与注意事项

### 9.1 Banner 轮播

```
业务要求：至少 5 张 Banner，自动轮播 + 手动切换
关键要点：
  ├── 图片预加载：首屏只加载第 1 张，其余在 slide 切换间隙预加载
  ├── 移动端：监听 touchstart / touchend，实现左滑/右滑
  ├── 键盘可访问性：焦点在轮播区域时，← → 键切换
  ├── ⚠️ Fallback：管理员将所有 Banner 下架时，展示 1 张默认占位图
  ├── ⚠️ 缓存：Banner 图片 URL 带上版本号参数，防止浏览器缓存旧图
  └── 实现：使用 Element Plus 的 el-carousel 组件封装
```

### 9.2 数字增长动画

```
业务要求：首页数据亮点数字动态增长效果
关键要点：
  ├── IntersectionObserver 检测元素进入视口 → 触发动画
  ├── requestAnimationFrame + easeOutCubic → 1.5 秒内从 0 增长到目标值
  ├── ⚠️ 只播放一次：用 WeakSet 记录已触发元素，滚动回来不再重复
  └── 目标值从后台配置获取（支持管理员修改）
```

### 9.3 新闻全文检索

```
业务要求：关键词搜索新闻，全文检索
交互要点：
  ├── 搜索框 300ms 防抖 → 发请求
  ├── 搜索中显示骨架屏
  ├── 关键词高亮（后端返回 `<em>` 标签 或 前端高亮）
  ├── "暂无新闻"（列表为空）vs "未找到相关内容"（搜索无结果）← 两种提示
  └── ⚠️ ES 中文分词：需后端启用 IK 分词器，否则中文搜索效果差
```

### 9.4 富文本内容安全

```
⚠️ 高风险点：公司简介、新闻正文等内容通过富文本编辑器录入，前端 v-html 渲染

防护措施：
  ├── 后端存储前：HTML 白名单过滤（只允许安全标签）
  ├── 前端渲染前：DOMPurify.sanitize(html) 二次过滤
  ├── CSP 头：限制 script-src，防止 XSS
  └── 禁止直接 v-html 后端返回的原始 HTML
```

### 9.5 表单提交流程

```
防垃圾提交三层策略：
  第一层（前端 UI）：滑块验证码 → 防脚本
  第二层（前端逻辑）：提交后按钮禁用 3 秒 → 防连点
  第三层（后端）：IP 频率限制 + 内容校验 → 防绕过前端

在线咨询表单 → 提交 → 后端发邮件通知管理员
服务申请表单 → 提交 → 后端创建工单 → 状态可跟踪

⚠️ 不要信任前端验证，后端必须二次校验所有字段
```

### 9.6 地图懒加载

```
⚠️ 高德/百度地图 API 按调用次数计费

优化策略：
  ├── 地图组件做懒加载：IntersectionObserver 检测"联系我们"区域
  │   进入视口才动态加载地图 SDK
  ├── 在加载完成前展示静态占位图（显示公司地址文字信息）
  └── 地图 SDK 加载失败 → 展示文字地址 + "查看地图"外部超链接
```

---

## 十、安全与防御性编程

### 10.1 XSS 防御

```typescript
// src/utils/sanitize.ts
import DOMPurify from 'dompurify'

// 富文本内容渲染前必须过滤
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li',
                    'h2', 'h3', 'h4', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'td'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target'],
  })
}
```

### 10.2 请求中断

```typescript
// 用户离开页面时中断所有进行中的请求
import { onBeforeUnmount } from 'vue'

const controller = new AbortController()

async function loadData() {
  const res = await publicApi.get('/data', { signal: controller.signal })
  // ...
}

onBeforeUnmount(() => {
  controller.abort()        // 组件卸载 → 中断请求
})
```

### 10.3 防御清单

| 场景 | 防御措施 |
|------|---------|
| 图片加载失败 | `<img @error="fallback">` → 替换为默认图片 |
| 列表为空 | `<el-empty>` 展示引导，区分"暂无数据"与"搜索无结果" |
| 超长文本 | CSS 截断 + `title` 属性展示全文 |
| JS 被禁用 | `<noscript>` 提示开启 JavaScript |
| 接口无响应 | Axios 15s 超时 + 错误提示 |
| Token 过期 | 401 → 清除登录态 → 跳转登录页 |
| 并发请求 | requestSeq 序号去重，只取最新响应 |
| 快速切换路由 | 组件卸载时 abort 请求 |
| 敏感数据 | 不在 URL 或 localStorage 中明文存储 |
| 键盘操作 | 轮播/导航/表单/弹窗支持 Tab/Enter/Esc |

### 10.4 可预见的潜在技术债

| 序号 | 技术债 | 说明 | 影响 | 建议 |
|------|--------|------|------|------|
| 1 | Element Plus 体积 | 全量引入约 1MB+，影响首屏 | 首页 ≤3s 目标 | 按需引入 `unplugin-vue-components` |
| 2 | SSR 迁移成本 | 如首期纯 SPA，后续 SSR 需大量改造 | SEO 效果 | 若 SEO 是刚需，建议起步用 Nuxt 3 |
| 3 | 组织架构图 | Element Plus 无内置树形图组件 | 自研或引入 @antv/g6 | 预留额外开发时间 |
| 4 | 地图 API 计费 | 每次加载地图 SDK 计一次调用 | 运营成本 | 懒加载 + 点击后再初始化 |
| 5 | 静态资源缓存 | Banner 更换后浏览器缓存旧图 | 内容更新延迟 | 图片 URL 加版本号查询参数 |
| 6 | ES 中文分词 | 不配置 IK 分词器 → 搜中文效果差 | 搜索体验 | 与后端确认 ES 分词方案 |
| 7 | 富文本 XSS | v-html 直接渲染后端返回的 HTML | 安全漏洞 | DOMPurify + 后端白名单过滤 |

---

## 十一、编码约定速查表

```
┌──────────────────┬────────────────────────────────────────────────┐
│ 关注点            │ 约定                                            │
├──────────────────┼────────────────────────────────────────────────┤
│ 语言              │ TypeScript 严格模式，禁止 any（特殊场景需注释说明）  │
│ API 实例          │ 双实例：publicApi（前台/无Token） adminApi（后台/Bearer）│
│ 响应处理          │ code===0 → 自动剥壳返回 data；其他 → 统一弹窗      │
│ 401 处理          │ 刷新 Token → 重放请求；失败 → 跳登录              │
│ 跨域              │ 开发：Vite proxy；生产：Nginx 同源               │
│ 状态管理          │ URL > Pinia > Composable > 组件 ref             │
│ 竞态              │ 递增序号模式：只取最新请求结果                     │
│ 样式              │ scoped + CSS 变量 + BEM 命名；禁用 !important    │
│ 组件划分          │ layout/ → common/ → business/                  │
│ Props             │ 必须 interface + JSDoc + withDefaults          │
│ Emits             │ 必须类型化定义                                  │
│ 路由              │ 全量懒加载；嵌套路由 + redirect；meta 约定       │
│ 富文本            │ DOMPurify 过滤后才可用 v-html                    │
│ 表单              │ 验证码 + 按钮禁用 + 后端二次校验                   │
│ 图片              │ @error fallback + alt 属性 + URL 版本号         │
│ 空状态            │ 必须有 el-empty 或骨架屏                         │
│ 错误提示          │ 网络错误 / 超时 / 服务端错误 三类分别提示         │
│ 地图              │ 懒加载 + 加载失败降级为文字地址                    │
│ 键盘              │ Tab/Enter/Esc 可操作所有交互                     │
│ Git               │ feat/fix/chore 分支命名；commit 前 lint         │
└──────────────────┴────────────────────────────────────────────────┘
```

---

> **本文档随项目持续迭代更新。所有开发者在新需求启动前必须先阅读本文档，并在开发过程中严格遵循约定的规范。如有规范调整需求，需通过团队评审后更新本文档。**
