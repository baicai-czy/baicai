<script setup lang="ts">
import { computed } from 'vue'
import type { NewsItem } from '@/types/news'
import { timeAgo } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    item: NewsItem
    /** 是否显示摘要 */
    showSummary?: boolean
    /** 是否显示图片 */
    showImage?: boolean
    /** 布局模式 */
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

/** 格式化发布时间 */
const formattedTime = computed(() => {
  return props.item.publishTime ? timeAgo(props.item.publishTime) : ''
})

/** 去处 HTML 标签的纯文本摘要 */
const plainSummary = computed(() => {
  if (!props.item.summary) return ''
  return props.item.summary.replace(/<[^>]*>/g, '')
})

/** 分类标签颜色映射 */
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
      <img
        :src="props.item.coverImage"
        :alt="props.item.title"
        class="news-card__image"
        loading="lazy"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
      <!-- 置顶标记 -->
      <span v-if="props.item.isPinned" class="news-card__pin-badge">置顶</span>
    </div>

    <!-- 内容区 -->
    <div class="news-card__body">
      <!-- 分类 + 时间 -->
      <div class="news-card__meta">
        <span
          class="news-card__category"
          :style="{ color: categoryColorMap[props.item.category] }"
        >
          {{ categoryLabelMap[props.item.category] || props.item.category }}
        </span>
        <span class="news-card__time">{{ formattedTime }}</span>
      </div>

      <!-- 标题 -->
      <h3 class="news-card__title">
        <router-link
          :to="`/news/${props.item.id}`"
          @click.stop
        >
          {{ props.item.title }}
        </router-link>
      </h3>

      <!-- 摘要 -->
      <p v-if="props.showSummary" class="news-card__summary">
        {{ plainSummary }}
      </p>

      <!-- 底部信息 -->
      <div class="news-card__footer">
        <span v-if="props.item.viewCount !== undefined" class="news-card__views">
          <el-icon><View /></el-icon>
          {{ props.item.viewCount }}
        </span>
        <span v-if="props.item.tags?.length" class="news-card__tags">
          <el-tag
            v-for="tag in props.item.tags.slice(0, 3)"
            :key="tag"
            size="small"
            type="info"
          >
            {{ tag }}
          </el-tag>
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.news-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base) ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

    .news-card__title a {
      color: var(--color-primary);
    }
  }

  &--vertical {
    display: flex;
    flex-direction: column;
  }

  &--horizontal {
    display: flex;
    flex-direction: row;

    .news-card__image-wrap {
      width: 280px;
      flex-shrink: 0;
    }
  }

  &__image-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-base) ease;
  }

  &:hover &__image {
    transform: scale(1.05);
  }

  &__pin-badge {
    position: absolute;
    top: var(--spacing-sm);
    left: var(--spacing-sm);
    padding: 2px 10px;
    font-size: var(--font-size-small);
    color: #ffffff;
    background: var(--color-accent);
    border-radius: var(--radius-sm);
    font-weight: 600;
  }

  &__body {
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    flex: 1;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--font-size-small);
  }

  &__category {
    font-weight: 600;
  }

  &__time {
    color: var(--color-text-disabled);
  }

  &__title {
    font-size: var(--font-size-body);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
    @include text-ellipsis;

    a {
      color: inherit;
      transition: color var(--transition-fast) ease;

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  &__summary {
    font-size: var(--font-size-small);
    color: var(--color-text-secondary);
    line-height: 1.6;
    @include text-clamp(2);
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: var(--spacing-xs);
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
    gap: var(--spacing-xs);
  }
}
</style>
