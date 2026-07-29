<script setup lang="ts">
import { computed } from 'vue'
import type { NewsItem } from '@/types/news'
import { timeAgo } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    item: NewsItem
    showSummary?: boolean
    showImage?: boolean
    layout?: 'vertical' | 'horizontal'
  }>(),
  {
    showSummary: true,
    showImage: true,
    layout: 'vertical',
  },
)

const emit = defineEmits<{
  click: [item: NewsItem]
}>()

const formattedTime = computed(() => {
  return props.item.publishTime ? timeAgo(props.item.publishTime) : ''
})

const plainSummary = computed(() => {
  if (!props.item.summary) return ''
  return props.item.summary.replace(/<[^>]*>/g, '')
})

const categoryColorMap: Record<string, string> = {
  company: 'var(--color-primary)',
  industry: 'var(--color-secondary)',
  notice: 'var(--color-accent)',
}

const categoryLabelMap: Record<string, string> = {
  company: '公司新闻',
  industry: '行业动态',
  notice: '通知公告',
}
</script>

<template>
  <article
    class="news-card"
    :class="`news-card--${props.layout}`"
    @click="emit('click', props.item)"
  >
    <!-- 封面图 -->
    <div v-if="props.showImage && props.item.coverImage" class="news-card__image-wrap">
      <img :src="props.item.coverImage" :alt="props.item.title" class="news-card__image" loading="lazy" />
      <span v-if="props.item.isPinned" class="news-card__pin-badge">置顶</span>
    </div>

    <!-- 无图时用品牌色块 -->
    <div v-else-if="props.showImage" class="news-card__image-wrap news-card__image-wrap--placeholder">
      <el-icon :size="32"><Notebook /></el-icon>
      <span v-if="props.item.isPinned" class="news-card__pin-badge">置顶</span>
    </div>

    <!-- 内容区 -->
    <div class="news-card__body">
      <div class="news-card__meta">
        <span class="news-card__category" :style="{ color: categoryColorMap[props.item.category] }">
          {{ categoryLabelMap[props.item.category] || props.item.category }}
        </span>
        <span class="news-card__divider">·</span>
        <span class="news-card__time">{{ formattedTime }}</span>
      </div>

      <h3 class="news-card__title">
        <router-link :to="`/news/${props.item.id}`" @click.stop>
          {{ props.item.title }}
        </router-link>
      </h3>

      <p v-if="props.showSummary" class="news-card__summary">{{ plainSummary }}</p>

      <div class="news-card__footer">
        <span v-if="props.item.viewCount !== undefined" class="news-card__views">
          <el-icon :size="14"><View /></el-icon>
          {{ props.item.viewCount }}
        </span>
        <div v-if="props.item.tags?.length" class="news-card__tags">
          <span v-for="tag in props.item.tags.slice(0, 2)" :key="tag" class="news-card__tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.news-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(26,91,179,0.12);
    border-color: rgba(26,91,179,0.08);
  }

  &--horizontal {
    flex-direction: row;

    .news-card__image-wrap {
      width: 240px;
      flex-shrink: 0;
      min-height: 100%;
    }
  }

  &__image-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--color-bg);

    &--placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(26,91,179,0.06), rgba(0,180,216,0.1));
      color: var(--color-primary);
      opacity: 0.6;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover &__image {
    transform: scale(1.08);
  }

  &__pin-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 3px 12px;
    font-size: 11px;
    color: #ffffff;
    background: var(--color-accent);
    border-radius: 50px;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(255,107,53,0.3);
  }

  &__body {
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: var(--spacing-sm);
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--font-size-small);
  }

  &__category {
    font-weight: 700;
  }

  &__divider {
    color: var(--color-border);
  }

  &__time {
    color: var(--color-text-disabled);
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: 1.5;
    margin: 0;
    @include text-clamp(2);

    a {
      color: inherit;
      transition: color var(--transition-fast) ease;

      &:hover { color: var(--color-primary); }
    }
  }

  &__summary {
    font-size: var(--font-size-small);
    color: var(--color-text-secondary);
    line-height: 1.7;
    @include text-clamp(2);
    flex: 1;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: var(--spacing-sm);
    border-top: 1px solid var(--color-border);
  }

  &__views {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: var(--font-size-small);
    color: var(--color-text-disabled);
  }

  &__tags {
    display: flex;
    gap: 6px;
  }

  &__tag {
    padding: 2px 10px;
    font-size: 11px;
    background: var(--color-bg);
    border-radius: 50px;
    color: var(--color-text-disabled);
  }
}
</style>
