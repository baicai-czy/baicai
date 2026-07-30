<script setup lang="ts">
import { onMounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import { useResponsive } from '@/composables/useResponsive'

const router = useRouter()
const appStore = useAppStore()
const { isMobile } = useResponsive()

// 同步移动端状态到全局 Store
provide('isMobile', isMobile)

onMounted(() => {
  appStore.fetchSiteConfig()
})
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<style>
/* 页面切换过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Element Plus CSS 变量覆盖 */
:root {
  --el-color-primary: var(--color-primary);
  --el-font-family: var(--font-family);
}
</style>
