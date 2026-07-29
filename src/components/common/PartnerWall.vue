<script setup lang="ts">
import { computed } from 'vue'
import type { PartnerItem } from '@/types/components'

const props = defineProps<{
  items: PartnerItem[]
  loading?: boolean
}>()

/** 有 Logo 的伙伴 */
const validItems = computed(() => props.items.filter((p) => p.logoUrl))

/** 没有 Logo 但有名字的伙伴（显示文字占位） */
const textOnlyItems = computed(() => props.items.filter((p) => !p.logoUrl && p.name))

/** 是否显示完全占位提示 */
const showPlaceholder = computed(() => !props.loading && props.items.length === 0)
</script>

<template>
  <div class="partner-wall">
    <!-- 有 Logo 的正常展示 -->
    <div
      v-for="item in validItems"
      :key="item.id"
      class="partner-wall__item"
      :title="item.name"
    >
      <a
        v-if="item.website && item.website !== '#'"
        :href="item.website"
        target="_blank"
        rel="noopener noreferrer"
        class="partner-wall__link"
      >
        <img
          :src="item.logoUrl"
          :alt="item.name"
          class="partner-wall__logo"
          loading="lazy"
        />
      </a>
      <img
        v-else
        :src="item.logoUrl"
        :alt="item.name"
        class="partner-wall__logo"
        loading="lazy"
      />
    </div>

    <!-- 无 Logo 但有名字：显示文字占位 -->
    <div
      v-for="item in textOnlyItems"
      :key="item.id"
      class="partner-wall__item partner-wall__item--text"
    >
      <a
        v-if="item.website && item.website !== '#'"
        :href="item.website"
        target="_blank"
        rel="noopener noreferrer"
        class="partner-wall__text"
      >
        {{ item.name }}
      </a>
      <span v-else class="partner-wall__text">{{ item.name }}</span>
    </div>

    <!-- 完全无数据占位 -->
    <div v-if="showPlaceholder" class="partner-wall__placeholder">
      <el-icon :size="36"><Connection /></el-icon>
      <p class="partner-wall__placeholder-title">合作伙伴</p>
      <p class="partner-wall__placeholder-desc">Logo 将在后台"合作伙伴管理"中上传展示</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.partner-wall {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-2xl);

  &__item {
    flex: 0 0 auto;
  }

  &__link {
    display: block;
  }

  &__logo {
    height: 48px;
    width: auto;
    filter: grayscale(100%);
    opacity: 0.6;
    transition: all var(--transition-base) ease;

    &:hover {
      filter: grayscale(0%);
      opacity: 1;
      transform: scale(1.1);
    }
  }

  &__item--text {
    padding: 10px 24px;
    background: var(--color-bg);
    border-radius: 50px;
    border: 1px dashed var(--color-border);
    transition: all var(--transition-base) ease;

    &:hover {
      border-color: var(--color-primary);
      background: rgba(26,91,179,0.04);
    }
  }

  &__text {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-secondary);
    white-space: nowrap;
    transition: color var(--transition-fast) ease;

    &:hover {
      color: var(--color-primary);
    }
  }

  &__placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-2xl);
    color: var(--color-text-disabled);
    text-align: center;

    .el-icon {
      opacity: 0.4;
    }

    &-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-text-secondary);
    }

    &-desc {
      font-size: 13px;
      color: var(--color-text-disabled);
    }
  }
}
</style>
