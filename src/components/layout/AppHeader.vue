<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const navItems = computed(() => appStore.navItems)
const isScrolled = ref(false)

const activeNavId = computed(() => {
  return (route.meta.activeNav as string) || 'home'
})

const mobileMenuOpen = defineModel<boolean>('mobileMenuOpen', { default: false })

function onScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function navigateTo(path: string) {
  router.push(path)
  mobileMenuOpen.value = false
}

function onLogoClick() {
  router.push('/')
}
</script>

<template>
  <header class="app-header" :class="{ 'app-header--scrolled': isScrolled }">
    <div class="app-header__inner container">
      <!-- Logo -->
      <div class="app-header__logo" @click="onLogoClick">
        <span class="app-header__logo-dot" />
        <span class="app-header__logo-text">{{ appStore.siteConfig.siteName }}</span>
      </div>

      <!-- 桌面导航 -->
      <nav class="app-header__nav" aria-label="主导航">
        <router-link
          v-for="item in navItems"
          :key="item.id"
          :to="item.path"
          class="app-header__nav-item"
          :class="{ 'is-active': activeNavId === item.id }"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <!-- 右侧操作 -->
      <div class="app-header__actions">
        <router-link to="/contact" class="app-header__contact-btn">
          <el-icon><Phone /></el-icon>
          <span class="app-header__contact-text">联系我们</span>
        </router-link>

        <!-- 移动端汉堡按钮 -->
        <button
          class="app-header__hamburger"
          aria-label="切换菜单"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <Transition name="slide-down">
      <nav v-if="mobileMenuOpen" class="app-header__mobile-nav" aria-label="移动端导航">
        <router-link
          v-for="item in navItems"
          :key="item.id"
          :to="item.path"
          class="app-header__mobile-item"
          :class="{ 'is-active': activeNavId === item.id }"
          @click="mobileMenuOpen = false"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;

  &--scrolled {
    background: rgba(255,255,255,0.97);
    border-bottom-color: var(--color-border);
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 68px;
  }

  /* ── Logo ── */
  &__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;

    &-dot {
      width: 12px;
      height: 12px;
      border-radius: 4px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    }

    &-text {
      font-size: 20px;
      font-weight: 800;
      color: var(--color-text-primary);
      letter-spacing: 0.5px;
    }
  }

  /* ── 导航 ── */
  &__nav {
    display: none;
    align-items: center;

    @include respond-to(sm) {
      display: flex;
    }
  }

  &__nav-item {
    position: relative;
    padding: 8px 20px;
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-secondary);
    border-radius: 8px;
    transition: all var(--transition-fast) ease;
    white-space: nowrap;

    &:hover {
      color: var(--color-primary);
      background: rgba(26,91,179,0.05);
    }

    &.is-active {
      color: var(--color-primary);
      font-weight: 700;
      background: rgba(26,91,179,0.06);
    }
  }

  /* ── 右侧 ── */
  &__actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  &__contact-btn {
    display: none;
    align-items: center;
    gap: 6px;
    padding: 8px 20px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    background: var(--color-primary);
    border-radius: 50px;
    transition: all var(--transition-fast) ease;

    &:hover {
      background: var(--color-accent);
      color: #ffffff;
    }

    @include respond-to(sm) {
      display: inline-flex;
    }
  }

  &__contact-text {
    @include respond-to(md) {
      display: inline;
    }
  }

  /* ── 汉堡按钮 ── */
  &__hamburger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;

    @include respond-to(sm) {
      display: none;
    }

    span {
      display: block;
      width: 100%;
      height: 2px;
      border-radius: 2px;
      background: var(--color-text-primary);
      transition: all var(--transition-fast) ease;
    }
  }

  /* ── 移动端菜单 ── */
  &__mobile-nav {
    display: flex;
    flex-direction: column;
    background: rgba(255,255,255,0.98);
    backdrop-filter: blur(12px);
    border-top: 1px solid var(--color-border);
    padding: var(--spacing-sm) 0;

    @include respond-to(sm) {
      display: none;
    }
  }

  &__mobile-item {
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: 15px;
    font-weight: 500;
    color: var(--color-text-primary);
    transition: all var(--transition-fast) ease;

    &:hover,
    &.is-active {
      color: var(--color-primary);
      background: rgba(26,91,179,0.05);
    }
  }
}

/* 下拉动画 */
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
