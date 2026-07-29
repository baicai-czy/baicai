<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import SideNav from './SideNav.vue'

export interface AppLayoutProps {
  /** 是否显示侧边子导航 */
  showSideNav?: boolean
  /** 子导航项列表 */
  sideNavItems?: { label: string; to: string }[]
  /** 是否显示面包屑 */
  breadcrumb?: { label: string; to?: string }[]
}

const props = withDefaults(defineProps<AppLayoutProps>(), {
  showSideNav: false,
  sideNavItems: () => [],
  breadcrumb: () => [],
})

const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="app-layout">
    <AppHeader v-model:mobileMenuOpen="mobileMenuOpen" />

    <!-- 面包屑导航 -->
    <nav
      v-if="props.breadcrumb.length > 0"
      class="app-layout__breadcrumb container"
      aria-label="面包屑导航"
    >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item
          v-for="item in props.breadcrumb"
          :key="item.label"
          :to="item.to ? { path: item.to } : undefined"
        >
          {{ item.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </nav>

    <!-- 主体区域 -->
    <div class="app-layout__body container">
      <!-- 侧边子导航 -->
      <aside v-if="props.showSideNav && props.sideNavItems.length > 0" class="app-layout__sidebar">
        <SideNav :items="props.sideNavItems" />
      </aside>

      <!-- 主内容 -->
      <main class="app-layout__main" :class="{ 'app-layout__main--full': !props.showSideNav }">
        <slot />
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__breadcrumb {
    padding-top: var(--spacing-md);
    padding-bottom: var(--spacing-md);
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }

  &__body {
    display: flex;
    gap: var(--spacing-xl);
    flex: 1;
    padding-top: var(--spacing-xl);
    padding-bottom: var(--spacing-2xl);

    @include respond-to(sm) {
      padding-top: var(--spacing-2xl);
    }
  }

  &__sidebar {
    display: none;
    width: 240px;
    flex-shrink: 0;

    @include respond-to(sm) {
      display: block;
    }
  }

  &__main {
    flex: 1;
    min-width: 0; // 防止 flex 溢出

    &--full {
      width: 100%;
    }
  }
}
</style>
