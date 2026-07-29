<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

/** 7 个一级导航项 */
const navItems = computed(() => appStore.navItems)

/** 当前激活的导航 ID，基于 route.meta.activeNav */
const activeNavId = computed(() => {
  return (route.meta.activeNav as string) || 'home'
})

/** 移动端菜单开关 */
const mobileMenuOpen = defineModel<boolean>('mobileMenuOpen', { default: false })

function navigateTo(path: string) {
  router.push(path)
  mobileMenuOpen.value = false
}

function onLogoClick() {
  router.push('/')
}
</script>

<template>
  <header class="app-header" :class="{ 'app-header--scrolled': false }">
    <div class="app-header__inner container">
      <!-- Logo 区域 -->
      <div class="app-header__logo" @click="onLogoClick">
        <span class="app-header__logo-icon">
          <el-icon :size="28"><Cloudy /></el-icon>
        </span>
        <span class="app-header__logo-text">{{ appStore.siteConfig.title }}</span>
      </div>

      <!-- 桌面端导航 -->
      <nav class="app-header__nav" aria-label="主导航">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="app-header__nav-item"
          :class="{ 'is-active': activeNavId === item.id }"
          @click="navigateTo(item.path)"
        >
          {{ item.label }}
        </button>
      </nav>

      <!-- 移动端汉堡按钮 -->
      <button
        class="app-header__hamburger"
        aria-label="切换菜单"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- 移动端下拉菜单 -->
    <Transition name="slide-down">
      <nav v-if="mobileMenuOpen" class="app-header__mobile-nav" aria-label="移动端导航">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="app-header__mobile-item"
          :class="{ 'is-active': activeNavId === item.id }"
          @click="navigateTo(item.path)"
        >
          {{ item.label }}
        </button>
      </nav>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--color-card-bg);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-header);
  transition: box-shadow var(--transition-base) ease;

  &--scrolled {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    user-select: none;

    &-icon {
      color: var(--color-primary);
      display: flex;
      align-items: center;
    }

    &-text {
      font-size: var(--font-size-h3);
      font-weight: 700;
      color: var(--color-primary);
      white-space: nowrap;
    }
  }

  &__nav {
    display: none;
    align-items: center;
    gap: var(--spacing-xs);
    height: 100%;

    @include respond-to(sm) {
      display: flex;
    }
  }

  &__nav-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 0 var(--spacing-md);
    font-size: var(--font-size-body);
    color: var(--color-text-primary);
    background: none;
    border: none;
    cursor: pointer;
    transition: color var(--transition-fast) ease;
    white-space: nowrap;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 3px;
      border-radius: 2px 2px 0 0;
      background: var(--color-primary);
      transition: width var(--transition-fast) ease;
    }

    &:hover {
      color: var(--color-primary);
    }

    &.is-active {
      color: var(--color-primary);
      font-weight: 600;

      &::after {
        width: 100%;
      }
    }
  }

  &__hamburger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacing-xs);

    @include respond-to(sm) {
      display: none;
    }

    span {
      display: block;
      width: 100%;
      height: 2px;
      border-radius: 2px;
      background: var(--color-text-primary);
      transition: transform var(--transition-fast) ease;
    }
  }

  &__mobile-nav {
    display: flex;
    flex-direction: column;
    background: var(--color-card-bg);
    border-top: 1px solid var(--color-border);
    padding: var(--spacing-sm) 0;
    overflow: hidden;

    @include respond-to(sm) {
      display: none;
    }
  }

  &__mobile-item {
    width: 100%;
    padding: var(--spacing-md) var(--spacing-lg);
    text-align: left;
    font-size: var(--font-size-body);
    color: var(--color-text-primary);
    background: none;
    border: none;
    cursor: pointer;
    transition: background var(--transition-fast) ease;

    &:hover,
    &.is-active {
      color: var(--color-primary);
      background: rgba(26, 91, 179, 0.05);
    }
  }
}

/* 移动端菜单过渡动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 400px;
}
</style>
