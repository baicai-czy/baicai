<script setup lang="ts">
import type { CaseItem } from '@/types/components'

defineProps<{
  item: CaseItem
}>()
</script>

<template>
  <article class="case-card">
    <div class="case-card__image-wrap">
      <img
        :src="item.imageUrl"
        :alt="item.title"
        class="case-card__image"
        loading="lazy"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
    </div>
    <div class="case-card__body">
      <div class="case-card__meta">
        <span class="case-card__customer">{{ item.customer }}</span>
        <el-tag size="small" type="info">{{ item.industry }}</el-tag>
      </div>
      <h3 class="case-card__title">{{ item.title }}</h3>
      <p class="case-card__desc">{{ item.description }}</p>
      <div class="case-card__results">
        <strong>项目成果：</strong>{{ item.results }}
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.case-card {
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
    transform: scale(1.05);
  }

  &__body {
    padding: var(--spacing-lg);
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-sm);
  }

  &__customer {
    font-size: var(--font-size-small);
    color: var(--color-text-disabled);
    font-weight: 500;
  }

  &__title {
    font-size: var(--font-size-h3);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
  }

  &__desc {
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
    @include text-clamp(3);
  }

  &__results {
    font-size: var(--font-size-small);
    color: var(--color-text-secondary);
    line-height: 1.6;
    padding: var(--spacing-sm);
    background: var(--color-bg);
    border-radius: var(--radius-sm);
    border-left: 3px solid var(--color-secondary);

    strong {
      color: var(--color-primary);
    }
  }
}
</style>
