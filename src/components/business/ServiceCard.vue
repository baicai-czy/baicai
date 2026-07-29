<script setup lang="ts">
import type { ServiceCardItem } from '@/types/components'

defineProps<{
  item: ServiceCardItem
  loading?: boolean
}>()

const emit = defineEmits<{
  'learn-more': [item: ServiceCardItem]
}>()
</script>

<template>
  <div class="service-card">
    <div class="service-card__icon-wrap">
      <el-icon v-if="item.icon" :size="32" class="service-card__icon">
        <component :is="item.icon" />
      </el-icon>
    </div>
    <h3 class="service-card__title">{{ item.title }}</h3>
    <p class="service-card__desc">{{ item.description }}</p>
    <ul v-if="item.features?.length" class="service-card__features">
      <li v-for="(feat, idx) in item.features" :key="idx">
        <el-icon><Check /></el-icon>
        {{ feat }}
      </li>
    </ul>
    <router-link
      v-if="item.to"
      :to="item.to"
      class="service-card__link"
      @click="emit('learn-more', item)"
    >
      了解更多
      <el-icon><ArrowRight /></el-icon>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.service-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all var(--transition-base) ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    border-color: var(--color-primary);
  }

  &__icon-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-md);
  }

  &__icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(26, 91, 179, 0.08);
    border-radius: var(--radius-lg);
    color: var(--color-primary);
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
  }

  &__features {
    list-style: none;
    text-align: left;
    padding: 0;
    margin-bottom: var(--spacing-md);

    li {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: var(--font-size-small);
      color: var(--color-text-secondary);
      padding: var(--spacing-xs) 0;

      .el-icon {
        color: var(--color-secondary);
        flex-shrink: 0;
      }
    }
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
