<script setup lang="ts">
import type { SolutionItem } from '@/types/components'

defineProps<{
  item: SolutionItem
}>()
</script>

<template>
  <article class="solution-card">
    <div class="solution-card__image-wrap">
      <div class="solution-card__icon">
        <el-icon :size="40"><Monitor /></el-icon>
      </div>
      <div class="solution-card__overlay">
        <span class="solution-card__target">{{ item.targetCustomer }}</span>
      </div>
    </div>
    <div class="solution-card__body">
      <h3 class="solution-card__title">{{ item.title }}</h3>
      <p class="solution-card__desc">{{ item.description }}</p>
      <router-link :to="`/solutions/${item.id}`" class="solution-card__link">
        查看方案详情
        <el-icon><ArrowRight /></el-icon>
      </router-link>
    </div>
  </article>
</template>

<style scoped lang="scss">
.solution-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 44px rgba(26,91,179,0.14);
    border-color: rgba(26,91,179,0.1);

    .solution-card__icon {
      transform: scale(1.1);
      background: rgba(255,255,255,0.15);
    }
  }

  &__image-wrap {
    position: relative;
    width: 100%;
    height: 150px;
    background: linear-gradient(135deg, #1a5bb3 0%, #0d3b7a 50%, #00b4d8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    color: rgba(255,255,255,0.8);
    transition: all 0.35s ease;
  }

  &__overlay {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
  }

  &__target {
    padding: 4px 14px;
    font-size: var(--font-size-small);
    color: #ffffff;
    background: rgba(0,0,0,0.35);
    border-radius: 50px;
    backdrop-filter: blur(8px);
    font-weight: 500;
  }

  &__body {
    padding: var(--spacing-lg);
  }

  &__title {
    font-size: var(--font-size-h3);
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
  }

  &__desc {
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
    line-height: 1.7;
    margin-bottom: var(--spacing-md);
    @include text-clamp(3);
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: var(--font-size-body);
    font-weight: 700;
    color: var(--color-primary);
    transition: all var(--transition-base) ease;

    &:hover {
      gap: 8px;
      color: var(--color-accent);
    }
  }
}
</style>
