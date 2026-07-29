<script setup lang="ts">
import { ref } from 'vue'
import type { HonorItem } from '@/types/components'
import { formatDate } from '@/utils/format'

defineProps<{
  items: HonorItem[]
}>()

/** 当前放大预览的荣誉 */
const previewItem = ref<HonorItem | null>(null)

function openPreview(item: HonorItem) {
  previewItem.value = item
}

function closePreview() {
  previewItem.value = null
}

/** 按分类分组 */
function groupByCategory(items: HonorItem[]): Record<string, HonorItem[]> {
  return items.reduce(
    (acc, item) => {
      const cat = item.category || '其他'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    },
    {} as Record<string, HonorItem[]>,
  )
}
</script>

<template>
  <div class="honor-wall">
    <!-- 空状态 -->
    <div v-if="items.length === 0" class="honor-wall__empty">
      <el-icon :size="40"><Medal /></el-icon>
      <p class="honor-wall__empty-title">资质荣誉</p>
      <p class="honor-wall__empty-desc">证书与荣誉信息将在后台管理系统中上传展示</p>
    </div>

    <div
      v-for="(groupItems, category) in groupByCategory(items)"
      :key="category"
      class="honor-wall__group"
    >
      <h3 class="honor-wall__group-title">{{ category }}</h3>
      <div class="honor-wall__grid">
        <div
          v-for="item in groupItems"
          :key="item.id"
          class="honor-wall__item"
          @click="openPreview(item)"
        >
          <div class="honor-wall__image-wrap">
            <img
              :src="item.imageUrl"
              :alt="item.name"
              class="honor-wall__image"
              loading="lazy"
            />
          </div>
          <div class="honor-wall__info">
            <span class="honor-wall__name">{{ item.name }}</span>
            <span class="honor-wall__date">{{ formatDate(item.issueDate, 'YYYY年MM月') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <Teleport to="body">
      <Transition name="honor-zoom">
        <div
          v-if="previewItem"
          class="honor-wall__preview-overlay"
          @click.self="closePreview"
        >
          <button class="honor-wall__close" @click="closePreview" aria-label="关闭">
            <el-icon :size="24"><Close /></el-icon>
          </button>
          <img :src="previewItem.imageUrl" :alt="previewItem.name" class="honor-wall__preview-img" />
          <div class="honor-wall__preview-info">
            <h4>{{ previewItem.name }}</h4>
            <p>颁发单位：{{ previewItem.issuingAuthority }}</p>
            <p>颁发日期：{{ formatDate(previewItem.issueDate, 'YYYY年MM月DD日') }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.honor-wall {
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-2xl);
    color: var(--color-text-disabled);
    text-align: center;

    .el-icon { opacity: 0.4; }

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

  &__group {
    margin-bottom: var(--spacing-xl);

    &-title {
      font-size: var(--font-size-h3);
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-md);
      padding-left: var(--spacing-sm);
      border-left: 3px solid var(--color-primary);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);

    @include respond-to(sm) {
      grid-template-columns: repeat(3, 1fr);
    }

    @include respond-to(md) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__item {
    background: var(--color-card-bg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--transition-base) ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
  }

  &__image-wrap {
    width: 100%;
    aspect-ratio: 3 / 2;
    overflow: hidden;
    background: var(--color-bg);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: var(--spacing-md);
  }

  &__info {
    padding: var(--spacing-sm) var(--spacing-md) var(--spacing-md);
    text-align: center;
  }

  &__name {
    display: block;
    font-size: var(--font-size-body);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 2px;
    @include text-ellipsis;
  }

  &__date {
    font-size: var(--font-size-small);
    color: var(--color-text-disabled);
  }

  /* 预览弹窗 */
  &__preview-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
  }

  &__close {
    position: absolute;
    top: var(--spacing-lg);
    right: var(--spacing-lg);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background var(--transition-fast) ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  &__preview-img {
    max-width: 90%;
    max-height: 60vh;
    object-fit: contain;
    border-radius: var(--radius-md);
  }

  &__preview-info {
    margin-top: var(--spacing-lg);
    text-align: center;
    color: #ffffff;

    h4 {
      font-size: var(--font-size-h3);
      margin-bottom: var(--spacing-sm);
    }

    p {
      font-size: var(--font-size-body);
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.8;
    }
  }
}

/* 缩放过渡 */
.honor-zoom-enter-active,
.honor-zoom-leave-active {
  transition: opacity 0.25s ease;
}
.honor-zoom-enter-from,
.honor-zoom-leave-to {
  opacity: 0;
}
</style>
