<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import SideNav from './SideNav.vue'
import CustomerService from '@/components/common/CustomerService.vue'
import BackToTop from '@/components/common/BackToTop.vue'

export interface AppLayoutProps {
  /** 是否显示侧边子导航 */
  showSideNav?: boolean
  /** 侧边导航标题 */
  sideNavTitle?: string
  /** 子导航项列表 */
  sideNavItems?: { label: string; to: string; icon?: string }[]
  /** 是否显示面包屑 */
  breadcrumb?: { label: string; to?: string }[]
}

const props = withDefaults(defineProps<AppLayoutProps>(), {
  showSideNav: false,
  sideNavTitle: '',
  sideNavItems: () => [],
  breadcrumb: () => [],
})

const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="app-layout">
    <AppHeader v-model:mobileMenuOpen="mobileMenuOpen" />

    <!-- 页面标题区 Hero -->
    <div v-if="props.breadcrumb.length > 0" class="app-layout__hero">
      <div class="app-layout__hero-bg" />
      <div class="app-layout__hero-content container">
        <h1 class="app-layout__hero-title">
          {{ props.breadcrumb[props.breadcrumb.length - 1]?.label }}
        </h1>
        <div class="app-layout__hero-breadcrumb">
          <router-link to="/">首页</router-link>
          <template v-for="(item, idx) in props.breadcrumb" :key="item.label">
            <span class="app-layout__hero-sep">/</span>
            <router-link v-if="item.to && idx < props.breadcrumb.length - 1" :to="item.to">
              {{ item.label }}
            </router-link>
            <span v-else class="app-layout__hero-current">{{ item.label }}</span>
          </template>
        </div>
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="app-layout__body container">
      <!-- 侧边子导航 -->
      <aside v-if="props.showSideNav && props.sideNavItems.length > 0" class="app-layout__sidebar">
        <SideNav :title="props.sideNavTitle" :items="props.sideNavItems" />
      </aside>

      <!-- 主内容 -->
      <main class="app-layout__main" :class="{ 'app-layout__main--full': !props.showSideNav }">
        <slot />
      </main>
    </div>

    <AppFooter />

    <!-- 在线客服悬浮按钮（SOW 3.7） -->
    <CustomerService />
    <!-- 回到顶部 -->
    <BackToTop />
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  /* ── Hero 标题区 ── */
  &__hero {
    position: relative;
    padding: 40px 0;
    overflow: hidden;
    background: linear-gradient(135deg, #0a2540 0%, #13294b 40%, #1a5bb3 100%);

    &-bg {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 20% 50%, rgba(0,180,216,0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 30%, rgba(255,107,53,0.08) 0%, transparent 40%);
      pointer-events: none;
    }

    &-content {
      position: relative;
      z-index: 1;
    }

    &-title {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 10px;
      letter-spacing: 1px;

      @include respond-to(sm) {
        font-size: 34px;
      }
    }

    &-breadcrumb {
      font-size: 13px;
      color: rgba(255,255,255,0.5);

      a {
        color: rgba(255,255,255,0.65);
        transition: color var(--transition-fast) ease;

        &:hover { color: #ffffff; }
      }
    }

    &-sep {
      margin: 0 8px;
      color: rgba(255,255,255,0.3);
    }

    &-current {
      color: rgba(255,255,255,0.85);
      font-weight: 600;
    }
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
