<script setup lang="ts">
import type { SolutionItem } from '@/types/components'

defineProps<{
  item: SolutionItem
}>()
</script>

<template>
  <article class="solution-card">
    <div class="solution-card__image-wrap">
      <img
        :src="item.imageUrl"
        :alt="item.title"
        class="solution-card__image"
        loading="lazy"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
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
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: all var(--transition-base) ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  }

  &__image-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-base) ease;
  }

  &:hover &__image {
    transform: scale(1.08);
  }

  &__overlay {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
  }

  &__target {
    padding: 4px 12px;
    font-size: var(--font-size-small);
    color: #ffffff;
    background: rgba(0, 0, 0, 0.6);
    border-radius: var(--radius-sm);
    backdrop-filter: blur(4px);
  }

  &__body {
    padding: var(--spacing-lg);
  }

  &__title {
    font-size: var(--font-size-h3);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
    @include text-ellipsis;
  }

  &__desc {
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
    @include text-clamp(2);
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-body);
    font-weight: 600;
    color: var(--color-primary);
    transition: gap var(--transition-fast) ease;

    &:hover {
      gap: var(--spacing-sm);
      color: var(--color-accent);
    }
  }
}
</style>
