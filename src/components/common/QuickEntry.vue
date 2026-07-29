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
        <el-icon :size="28"><component :is="item.icon" /></el-icon>
      </div>
      <div class="quick-entry__info">
        <span class="quick-entry__title">{{ item.title }}</span>
        <span class="quick-entry__desc">{{ item.description }}</span>
      </div>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.quick-entry {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);

  @include respond-to(sm) {
    grid-template-columns: repeat(3, 1fr);
  }

  @include respond-to(md) {
    grid-template-columns: repeat(6, 1fr);
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg) var(--spacing-md);
    background: var(--color-card-bg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    transition: all var(--transition-base) ease;
    text-align: center;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      color: var(--color-primary);
    }
  }

  &__icon-wrap {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(26, 91, 179, 0.08), rgba(0, 180, 216, 0.08));
    border-radius: var(--radius-lg);
    color: var(--color-primary);
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__title {
    font-size: var(--font-size-body);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  &__desc {
    font-size: var(--font-size-small);
    color: var(--color-text-disabled);
  }
}
</style>
