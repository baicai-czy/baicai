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
      <el-icon v-if="item.icon" :size="34" class="service-card__icon">
        <component :is="item.icon" />
      </el-icon>
    </div>
    <h3 class="service-card__title">{{ item.title }}</h3>
    <p class="service-card__desc">{{ item.description }}</p>
    <ul v-if="item.features?.length" class="service-card__features">
      <li v-for="(feat, idx) in item.features" :key="idx">
        <span class="service-card__check">
          <el-icon :size="14"><Check /></el-icon>
        </span>
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
  position: relative;
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background: var(--color-primary);
    border-radius: 3px;
    transition: width 0.35s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 48px rgba(26,91,179,0.14);
    border-color: rgba(26,91,179,0.1);

    &::after {
      width: 60%;
    }

    .service-card__icon-wrap {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));

      .service-card__icon {
        color: #ffffff;
        transform: scale(1.05);
      }
    }

    .service-card__link {
      gap: 8px;
      color: var(--color-accent);
    }
  }

  &__icon-wrap {
    width: 68px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(26,91,179,0.06), rgba(0,180,216,0.08));
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-lg);
    transition: all 0.35s ease;
  }

  &__icon {
    color: var(--color-primary);
    transition: all 0.35s ease;
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
    flex: 1;
  }

  &__features {
    list-style: none;
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    background: var(--color-bg);
    border-radius: var(--radius-sm);

    li {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-small);
      color: var(--color-text-secondary);
      padding: 5px 0;

      &:not(:last-child) {
        border-bottom: 1px dashed var(--color-border);
      }
    }
  }

  &__check {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(0,180,216,0.12);
    color: var(--color-secondary);
    flex-shrink: 0;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: var(--font-size-body);
    font-weight: 700;
    color: var(--color-primary);
    transition: all var(--transition-base) ease;
    margin-top: auto;
  }
}
</style>
