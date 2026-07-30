<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isCollapse = ref(false)

interface AdminMenuItem {
  label: string
  icon: string
  path?: string
  children?: AdminMenuItem[]
}

const menuItems: AdminMenuItem[] = [
  { label: '仪表盘', icon: 'Odometer', path: '/admin/dashboard' },
  {
    label: '内容管理',
    icon: 'EditPen',
    children: [
      { label: '关于我们', icon: 'OfficeBuilding', path: '/admin/about-manage' },
      { label: '发展历程', icon: 'Clock', path: '/admin/timeline-manage' },
      { label: '资质荣誉', icon: 'Medal', path: '/admin/honors-manage' },
      { label: '新闻管理', icon: 'Notebook', path: '/admin/news-manage' },
      { label: '产品管理', icon: 'Goods', path: '/admin/products-manage' },
      { label: '方案管理', icon: 'Files', path: '/admin/solutions-manage' },
      { label: 'Banner管理', icon: 'Picture', path: '/admin/banners-manage' },
    ],
  },
  { label: '咨询管理', icon: 'ChatDotRound', path: '/admin/contacts-manage' },
  {
    label: '系统管理',
    icon: 'Tools',
    children: [
      { label: '合作伙伴', icon: 'Connection', path: '/admin/partners-manage' },
      { label: '友情链接', icon: 'Link', path: '/admin/links-manage' },
      { label: '数据指标', icon: 'DataAnalysis', path: '/admin/stats-manage' },
      { label: '用户管理', icon: 'User', path: '/admin/users-manage' },
      { label: '操作日志', icon: 'DocumentChecked', path: '/admin/audit-log' },
      { label: '系统设置', icon: 'Setting', path: '/admin/settings' },
      { label: '用户管理', icon: 'User', path: '/admin/users-manage' },
    ],
  },
]

/** 当前激活菜单 */
const activeMenu = computed(() => route.path)

function handleMenuClick(path: string) {
  router.push(path)
}

async function handleLogout() {
  await authStore.logout()
  router.push('/admin/login')
}

function toggleCollapse() {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="admin-sidebar" :class="{ 'admin-sidebar--collapsed': isCollapse }">
      <div class="admin-sidebar__header">
        <span v-if="!isCollapse" class="admin-sidebar__title">城际云管理</span>
        <span v-else class="admin-sidebar__title-short">云</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#1a2332"
        text-color="#c0c6cf"
        active-text-color="#ffffff"
        class="admin-sidebar__menu"
        @select="handleMenuClick"
      >
        <template v-for="item in menuItems" :key="item.label">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="item.children" :index="item.label">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.label"
              :index="child.path!"
            >
              <el-icon><component :is="child.icon" /></el-icon>
              <span>{{ child.label }}</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 无子菜单 -->
          <el-menu-item v-else :index="item.path!">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </aside>

    <!-- 主内容区 -->
    <div class="admin-main">
      <!-- 顶栏 -->
      <header class="admin-header">
        <div class="admin-header__left">
          <el-button :icon="isCollapse ? Expand : Fold" text @click="toggleCollapse" />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理后台</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title as string }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="admin-header__right">
          <span class="admin-header__user">
            <el-icon><UserFilled /></el-icon>
            {{ authStore.userInfo?.nickname || authStore.userInfo?.username || '管理员' }}
          </span>
          <el-button type="danger" text size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 220px;
  background: #1a2332;
  display: flex;
  flex-direction: column;
  transition: width var(--transition-base) ease;
  flex-shrink: 0;

  &--collapsed {
    width: 64px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  &__title {
    font-size: var(--font-size-h3);
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
  }

  &__title-short {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-secondary);
  }

  &__menu {
    border-right: none !important;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--color-bg);
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 var(--spacing-lg);
  background: var(--color-card-bg);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;

  &__left {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  &__right {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  &__user {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
  }
}

.admin-content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
}
</style>
