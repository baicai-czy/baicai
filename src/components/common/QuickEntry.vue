<script setup lang="ts">
import type { QuickEntryItem } from '@/types/components'

defineProps<{
  items: QuickEntryItem[]
}>()
</script>

<template>
  <div class="quick-entry">
    <router-link
      v-for="item in items"
      :key="item.title"
      :to="item.to"
      class="quick-entry__item"
    >
      <div class="quick-entry__icon-wrap">
        <el-icon :size="30"><component :is="item.icon" /></el-icon>
      </div>
      <div class="quick-entry__info">
        <span class="quick-entry__title">{{ item.title }}</span>
        <span class="quick-entry__desc">{{ item.description }}</span>
      </div>
      <div class="quick-entry__arrow">
        <el-icon :size="14"><ArrowRight /></el-icon>
      </div>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.quick-entry {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);

  @include respond-to(sm) {
    grid-template-columns: repeat(4, 1fr);
  }

  &__item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-xl);
    background: var(--color-card-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    border: 1px solid transparent;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      opacity: 0;
      transition: opacity 0.35s ease;
      z-index: 0;
    }

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 40px rgba(26,91,179,0.18);
      border-color: rgba(26,91,179,0.12);

      .quick-entry__icon-wrap {
        background: rgba(255,255,255,0.2);
        color: #ffffff;
        transform: scale(1.08) rotate(-5deg);
      }

      .quick-entry__title,
      .quick-entry__desc {
        color: #ffffff;
      }

      .quick-entry__arrow {
        opacity: 1;
        transform: translateX(0);
        color: #ffffff;
      }

      &::before {
        opacity: 1;
      }
    }
  }

  &__icon-wrap {
    position: relative;
    z-index: 1;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(26,91,179,0.08), rgba(0,180,216,0.1));
    border-radius: var(--radius-md);
    color: var(--color-primary);
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__info {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-size: var(--font-size-body);
    font-weight: 700;
    color: var(--color-text-primary);
    transition: color 0.35s ease;
  }

  &__desc {
    font-size: var(--font-size-small);
    color: var(--color-text-disabled);
    line-height: 1.5;
    transition: color 0.35s ease;
  }

  &__arrow {
    position: relative;
    z-index: 1;
    margin-top: auto;
    align-self: flex-end;
    opacity: 0;
    transform: translateX(-8px);
    color: var(--color-primary);
    transition: all 0.35s ease;
  }
}
</style>
