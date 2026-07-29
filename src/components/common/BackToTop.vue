<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <Transition name="bt-fade">
    <button
      v-if="visible"
      class="back-to-top"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <el-icon :size="22"><ArrowUpBold /></el-icon>
    </button>
  </Transition>
</template>

<script lang="ts">
import { ArrowUpBold } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 100px;
  z-index: 1490;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--color-card-bg);
  color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base) ease;

  &:hover {
    background: var(--color-primary);
    color: #ffffff;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(26, 91, 179, 0.3);
  }
}

.bt-fade-enter-active,
.bt-fade-leave-active {
  transition: all 0.3s ease;
}
.bt-fade-enter-from,
.bt-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
