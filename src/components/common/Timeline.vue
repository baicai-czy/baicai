<script setup lang="ts">
import type { TimelineNode } from '@/types/components'

defineProps<{
  items: TimelineNode[]
}>()
</script>

<template>
  <div class="timeline">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="timeline__item"
      :class="{
        'timeline__item--left': index % 2 === 0,
        'timeline__item--right': index % 2 === 1,
      }"
    >
      <!-- 桌面端：左右交替布局 -->
      <div class="timeline__content">
        <div class="timeline__dot">
          <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
          <span v-else class="timeline__dot-inner" />
        </div>
        <div class="timeline__card">
          <span class="timeline__date">{{ item.year }}{{ item.month ? `.${item.month}` : '' }}</span>
          <h4 class="timeline__title">{{ item.title }}</h4>
          <p class="timeline__desc">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.timeline {
  position: relative;
  padding: var(--spacing-lg) 0;

  /* 中线 */
  &::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--color-border);

    @include respond-to(sm) {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &__item {
    position: relative;
    padding-left: 48px;
    padding-bottom: var(--spacing-xl);

    &:last-child {
      padding-bottom: 0;
    }

    @include respond-to(sm) {
      padding-left: 0;
      width: 50%;

      &--left {
        padding-right: 48px;
        text-align: right;
      }

      &--right {
        margin-left: 50%;
        padding-left: 48px;
      }
    }
  }

  &__content {
    position: relative;
  }

  &__dot {
    position: absolute;
    left: -34px;
    top: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-primary);
    border: 3px solid var(--color-card-bg);
    box-shadow: 0 0 0 3px var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 10px;
    z-index: 1;

    @include respond-to(sm) {
      .timeline__item--left & {
        left: auto;
        right: -8px;
      }

      .timeline__item--right & {
        left: -8px;
      }
    }

    &-inner {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ffffff;
    }
  }

  &__card {
    background: var(--color-card-bg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    padding: var(--spacing-md);
    transition: box-shadow var(--transition-fast) ease;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }
  }

  &__date {
    display: inline-block;
    font-size: var(--font-size-small);
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: var(--spacing-xs);
  }

  &__title {
    font-size: var(--font-size-body);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
  }

  &__desc {
    font-size: var(--font-size-small);
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
}
</style>
