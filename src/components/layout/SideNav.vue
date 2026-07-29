<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRoute } from 'vue-router'

export interface SideNavItem {
  label: string
  to: string
  icon?: string
  desc?: string
}

const props = defineProps<{
  title?: string
  items: SideNavItem[]
}>()

const route = useRoute()

/** 当前激活的 SideNav 项 */
const activePath = computed(() => route.path)
const isMobile = inject('isMobile', false)
</script>

<template>
  <div class="side-nav-wrap">
    <nav class="side-nav" aria-label="侧边导航">
      <!-- 标题栏 -->
      <div v-if="props.title" class="side-nav__header">
        <span class="side-nav__header-icon">
          <el-icon :size="16"><List /></el-icon>
        </span>
        <span class="side-nav__header-text">{{ props.title }}</span>
      </div>

      <ul class="side-nav__list">
        <li v-for="item in props.items" :key="item.to">
          <router-link
            :to="item.to"
            class="side-nav__item"
            :class="{ 'is-active': activePath === item.to }"
          >
            <el-icon v-if="item.icon" class="side-nav__item-icon"><component :is="item.icon" /></el-icon>
            <span class="side-nav__item-label">{{ item.label }}</span>
            <el-icon v-if="activePath === item.to" class="side-nav__item-arrow" :size="14">
              <ArrowRight />
            </el-icon>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- 底部引导卡片 -->
    <div class="side-nav-cta">
      <el-icon :size="28"><Service /></el-icon>
      <p class="side-nav-cta__text">需要帮助？</p>
      <router-link to="/contact" class="side-nav-cta__link">
        联系我们
        <el-icon :size="14"><ArrowRight /></el-icon>
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.side-nav-wrap {
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.side-nav {
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    background: linear-gradient(135deg, rgba(26,91,179,0.04), rgba(0,180,216,0.04));
    border-bottom: 1px solid var(--color-border);
    font-size: 15px;
    font-weight: 700;
    color: var(--color-text-primary);

    &-icon {
      color: var(--color-primary);
      display: flex;
    }
  }

  &__list {
    padding: var(--spacing-xs) 0;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px var(--spacing-lg);
    font-size: 14px;
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
    position: relative;

    &:hover {
      color: var(--color-primary);
      background: rgba(26, 91, 179, 0.04);
      border-left-color: rgba(26, 91, 179, 0.2);
    }

    &.is-active {
      color: var(--color-primary);
      font-weight: 700;
      background: linear-gradient(90deg, rgba(26,91,179,0.06), transparent);
      border-left-color: var(--color-primary);
    }

    &-icon {
      font-size: 16px;
      flex-shrink: 0;
      width: 20px;
      text-align: center;
      color: var(--color-text-disabled);

      .is-active & {
        color: var(--color-primary);
      }
    }

    &-label {
      flex: 1;
    }

    &-arrow {
      flex-shrink: 0;
      color: var(--color-primary);
    }
  }
}

/* ── 底部 CTA 卡片 ── */
.side-nav-cta {
  background: linear-gradient(135deg, rgba(26,91,179,0.04), rgba(0,180,216,0.06));
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  border: 1px solid rgba(26, 91, 179, 0.06);

  .el-icon {
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }

  &__text {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-sm);
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 700;
    color: var(--color-primary);
    transition: all var(--transition-fast) ease;

    &:hover {
      color: var(--color-accent);
      gap: 6px;
    }
  }
}
</style>
