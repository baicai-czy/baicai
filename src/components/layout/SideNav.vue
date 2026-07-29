<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export interface SideNavItem {
  label: string
  to: string
  icon?: string
}

const props = defineProps<{
  items: SideNavItem[]
}>()

const route = useRoute()

/** 当前激活的 SideNav 项 */
const activePath = computed(() => route.path)
</script>

<template>
  <nav class="side-nav" aria-label="侧边导航">
    <ul class="side-nav__list">
      <li v-for="item in props.items" :key="item.to">
        <router-link
          :to="item.to"
          class="side-nav__item"
          :class="{ 'is-active': activePath === item.to }"
        >
          <el-icon v-if="item.icon" class="side-nav__item-icon"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.side-nav {
  background: var(--color-card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  overflow: hidden;

  &__list {
    padding: var(--spacing-sm) 0;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-body);
    color: var(--color-text-primary);
    transition: all var(--transition-fast) ease;
    border-left: 3px solid transparent;

    &:hover {
      color: var(--color-primary);
      background: rgba(26, 91, 179, 0.04);
    }

    &.is-active {
      color: var(--color-primary);
      font-weight: 600;
      background: rgba(26, 91, 179, 0.06);
      border-left-color: var(--color-primary);
    }

    &-icon {
      font-size: 16px;
      flex-shrink: 0;
    }
  }
}
</style>
