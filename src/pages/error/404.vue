<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="page-404">
    <div class="page-404__content">
      <h1 class="page-404__code">404</h1>
      <p class="page-404__title">页面不存在</p>
      <p class="page-404__desc">抱歉，您访问的页面不存在或已被移动</p>
      <div class="page-404__actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="router.back()">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-404 {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--color-bg);
  text-align: center;
  padding: var(--spacing-xl);

  &__content {
    max-width: 480px;
  }

  &__code {
    font-size: 120px;
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1;
    margin-bottom: var(--spacing-md);
    opacity: 0.8;
  }

  &__title {
    font-size: var(--font-size-h2);
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
  }

  &__desc {
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xl);
  }

  &__actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
  }
}
</style>
