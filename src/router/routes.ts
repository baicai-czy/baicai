// ── 路由表 —— 按架构文档 4.1 路由表结构 ──

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // ===========================
  // 前台页面
  // ===========================

  // 首页
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/home/index.vue'),
    meta: { title: '首页', activeNav: 'home' },
  },

  // 关于我们（嵌套路由）
  {
    path: '/about',
    name: 'About',
    redirect: '/about/profile',
    component: () => import('@/pages/about/index.vue'),
    meta: { title: '关于我们', activeNav: 'about' },
    children: [
      {
        path: 'profile',
        name: 'AboutProfile',
        component: () => import('@/pages/about/profile.vue'),
        meta: { title: '公司简介', activeNav: 'about' },
      },
      {
        path: 'history',
        name: 'AboutHistory',
        component: () => import('@/pages/about/history.vue'),
        meta: { title: '发展历程', activeNav: 'about' },
      },
      {
        path: 'culture',
        name: 'AboutCulture',
        component: () => import('@/pages/about/culture.vue'),
        meta: { title: '企业文化', activeNav: 'about' },
      },
      {
        path: 'honors',
        name: 'AboutHonors',
        component: () => import('@/pages/about/honors.vue'),
        meta: { title: '资质荣誉', activeNav: 'about' },
      },
      {
        path: 'structure',
        name: 'AboutStructure',
        component: () => import('@/pages/about/structure.vue'),
        meta: { title: '组织架构', activeNav: 'about' },
      },
    ],
  },

  // 业务版块（嵌套路由）
  {
    path: '/business',
    name: 'Business',
    redirect: '/business/state-cloud',
    component: () => import('@/pages/business/index.vue'),
    meta: { title: '业务版块', activeNav: 'business' },
    children: [
      {
        path: 'state-cloud',
        name: 'BusinessStateCloud',
        component: () => import('@/pages/business/state-cloud.vue'),
        meta: { title: '国资云服务', activeNav: 'business' },
      },
      {
        path: 'integration',
        name: 'BusinessIntegration',
        component: () => import('@/pages/business/integration.vue'),
        meta: { title: '系统集成', activeNav: 'business' },
      },
    ],
  },

  // 产品与服务
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/pages/products/index.vue'),
    meta: { title: '产品与服务', activeNav: 'products' },
  },
  {
    path: '/products/:type',
    name: 'ProductDetail',
    component: () => import('@/pages/products/detail.vue'),
    meta: { title: '产品详情', activeNav: 'products' },
  },

  // 解决方案
  {
    path: '/solutions',
    name: 'Solutions',
    component: () => import('@/pages/solutions/index.vue'),
    meta: { title: '解决方案', activeNav: 'solutions' },
  },
  {
    path: '/solutions/:id',
    name: 'SolutionDetail',
    component: () => import('@/pages/solutions/detail.vue'),
    meta: { title: '方案详情', activeNav: 'solutions' },
  },

  // 新闻中心
  {
    path: '/news',
    name: 'News',
    component: () => import('@/pages/news/index.vue'),
    meta: { title: '新闻中心', activeNav: 'news' },
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('@/pages/news/detail.vue'),
    meta: { title: '新闻详情', activeNav: 'news' },
  },

  // 联系我们
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/pages/contact/index.vue'),
    meta: { title: '联系我们', activeNav: 'contact' },
  },

  // ===========================
  // 后台管理页面
  // ===========================

  // 后台登录（独立页面，无布局）
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/pages/admin/login.vue'),
    meta: { title: '后台登录', activeNav: '' },
  },

  // 后台管理（通配路由，包含布局 + 子页面）
  {
    path: '/admin',
    component: () => import('@/pages/admin/index.vue'),
    meta: { title: '后台管理', activeNav: '', requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/dashboard.vue'),
        meta: { title: '仪表盘', activeNav: '' },
      },
      {
        path: 'news-manage',
        name: 'AdminNewsManage',
        component: () => import('@/pages/admin/news-manage.vue'),
        meta: { title: '新闻管理', activeNav: '', requiredPermission: 'news:manage' },
      },
      {
        path: 'products-manage',
        name: 'AdminProductsManage',
        component: () => import('@/pages/admin/products-manage.vue'),
        meta: { title: '产品管理', activeNav: '', requiredPermission: 'products:manage' },
      },
      {
        path: 'solutions-manage',
        name: 'AdminSolutionsManage',
        component: () => import('@/pages/admin/solutions-manage.vue'),
        meta: { title: '方案管理', activeNav: '', requiredPermission: 'solutions:manage' },
      },
      {
        path: 'about-manage',
        name: 'AdminAboutManage',
        component: () => import('@/pages/admin/about-manage.vue'),
        meta: { title: '关于我们管理', activeNav: '', requiredPermission: 'cms:manage' },
      },
      {
        path: 'timeline-manage',
        name: 'AdminTimelineManage',
        component: () => import('@/pages/admin/timeline-manage.vue'),
        meta: { title: '发展历程管理', activeNav: '', requiredPermission: 'timeline:manage' },
      },
      {
        path: 'honors-manage',
        name: 'AdminHonorsManage',
        component: () => import('@/pages/admin/honors-manage.vue'),
        meta: { title: '资质荣誉管理', activeNav: '', requiredPermission: 'honors:manage' },
      },
      {
        path: 'banners-manage',
        name: 'AdminBannersManage',
        component: () => import('@/pages/admin/banners-manage.vue'),
        meta: { title: 'Banner 管理', activeNav: '', requiredPermission: 'banners:manage' },
      },
      {
        path: 'contacts-manage',
        name: 'AdminContactsManage',
        component: () => import('@/pages/admin/contacts-manage.vue'),
        meta: { title: '咨询管理', activeNav: '', requiredPermission: 'contacts:view' },
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/pages/admin/settings.vue'),
        meta: { title: '系统设置', activeNav: '', requiredPermission: 'site-config:manage' },
      },
      {
        path: 'partners-manage',
        name: 'AdminPartnersManage',
        component: () => import('@/pages/admin/partners-manage.vue'),
        meta: { title: '合作伙伴管理', activeNav: '', requiredPermission: 'partners:manage' },
      },
      {
        path: 'stats-manage',
        name: 'AdminStatsManage',
        component: () => import('@/pages/admin/stats-manage.vue'),
        meta: { title: '数据指标管理', activeNav: '', requiredPermission: 'stats:manage' },
      },
      {
        path: 'links-manage',
        name: 'AdminLinksManage',
        component: () => import('@/pages/admin/links-manage.vue'),
        meta: { title: '友情链接管理', activeNav: '', requiredPermission: 'links:manage' },
      },
      {
        path: 'audit-log',
        name: 'AdminAuditLog',
        component: () => import('@/pages/admin/audit-log.vue'),
        meta: { title: '操作日志', activeNav: '', requiredPermission: 'audit:view' },
      },
      {
        path: 'users-manage',
        name: 'AdminUsersManage',
        component: () => import('@/pages/admin/users-manage.vue'),
        meta: { title: '用户管理', activeNav: '' },  // 仅超级管理员, 路由守卫中特殊处理
      },
      // 后台其他子路由兜底
      {
        path: ':pathMatch(.*)*',
        name: 'AdminNotFound',
        component: () => import('@/pages/error/404.vue'),
        meta: { title: '页面不存在', activeNav: '' },
      },
    ],
  },

  // ===========================
  // 404 兜底
  // ===========================
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/error/404.vue'),
    meta: { title: '页面不存在', activeNav: '' },
  },
]

export default routes
