<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useNewsStore } from '@/stores/modules/news'
import { sanitizeHTML } from '@/utils/sanitize'
import { formatDate } from '@/utils/format'

const route = useRoute()
const newsStore = useNewsStore()
const newsId = computed(() => Number(route.params.id))

const breadcrumb = [{ label: '新闻中心', to: '/news' }, { label: '新闻详情' }]
const loading = ref(true)

const categoryMap: Record<string, string> = {
  company: '公司新闻', industry: '行业动态', notice: '通知公告',
}

const hotArticles = ref<{ id: number; title: string; publishTime: string }[]>([])

async function loadData(id: number) {
  loading.value = true
  try {
    await newsStore.loadDetail(id)
    const { fetchHotNews } = await import('@/api/modules/news')
    const hot = await fetchHotNews(5)
    if (Array.isArray(hot)) {
      hotArticles.value = hot.map((h: any) => ({
        id: h.id, title: h.title,
        publishTime: h.publishTime ? formatDate(h.publishTime, 'YYYY-MM-DD') : '',
      }))
    }
  } catch { /* ignore */ }
  loading.value = false
}

onMounted(() => { loadData(newsId.value) })
watch(newsId, (id) => { loadData(id) })
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div v-if="loading" class="page-news-detail-loading">
      <el-skeleton :rows="10" animated />
    </div>

    <article v-else-if="newsStore.detail" class="page-news-detail">
      <header class="news-detail-header">
        <span class="news-detail-category">{{ categoryMap[newsStore.detail.category] || newsStore.detail.category }}</span>
        <h1>{{ newsStore.detail.title }}</h1>
        <div class="news-detail-meta">
          <span>{{ newsStore.detail.source }}</span>
          <span>{{ newsStore.detail.author }}</span>
          <span>{{ formatDate(newsStore.detail.publishTime, 'YYYY-MM-DD HH:mm') }}</span>
          <span><el-icon><View /></el-icon> {{ newsStore.detail.viewCount }}</span>
        </div>
      </header>

      <div class="news-detail-content rich-content" v-html="sanitizeHTML(newsStore.detail.content)" />

      <div v-if="newsStore.detail.tags?.length" class="news-detail-tags">
        <el-tag v-for="tag in newsStore.detail.tags" :key="tag" class="news-detail-tag">{{ tag }}</el-tag>
      </div>

      <div v-if="newsStore.detail.attachments?.length" class="news-detail-attachments">
        <h4>附件下载</h4>
        <div v-for="att in newsStore.detail.attachments" :key="att.name" class="news-detail-attachment">
          <el-icon><Document /></el-icon>
          <span>{{ att.name }}</span>
          <span class="news-detail-attachment-size">({{ (att.size / 1024 / 1024).toFixed(1) }} MB)</span>
          <el-button type="primary" link size="small">下载</el-button>
        </div>
      </div>

      <div v-if="hotArticles.length" class="news-detail-related">
        <h4>热门推荐</h4>
        <div class="news-detail-related__list">
          <router-link v-for="item in hotArticles" :key="item.id" :to="`/news/${item.id}`" class="news-detail-related__item">
            <span class="news-detail-related__title">{{ item.title }}</span>
            <span class="news-detail-related__time">{{ item.publishTime }}</span>
          </router-link>
        </div>
      </div>

      <div class="news-detail-back">
        <el-button @click="$router.push('/news')"><el-icon><ArrowLeft /></el-icon> 返回新闻列表</el-button>
      </div>
    </article>

    <el-empty v-else description="新闻不存在或已被删除" />
  </AppLayout>
</template>

<style scoped lang="scss">
.page-news-detail-loading { padding: var(--spacing-xl) 0; }

.news-detail-header {
  margin-bottom: var(--spacing-xl); padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}
.news-detail-category {
  display: inline-block; padding: 2px 12px; font-size: var(--font-size-small);
  color: var(--color-primary); background: rgba(26,91,179,0.08);
  border-radius: var(--radius-sm); margin-bottom: var(--spacing-sm);
}
.news-detail-header h1 { font-size: var(--font-size-h1); font-weight: 700; color: var(--color-text-primary); line-height: 1.4; margin-bottom: var(--spacing-md); }
.news-detail-meta {
  display: flex; flex-wrap: wrap; align-items: center; gap: var(--spacing-md);
  font-size: var(--font-size-small); color: var(--color-text-disabled);
  span { display: flex; align-items: center; gap: 4px; }
}
.news-detail-content { font-size: var(--font-size-body); line-height: 1.8; color: var(--color-text-primary); margin-bottom: var(--spacing-xl);
  :deep(h3) { font-size: var(--font-size-h3); font-weight: 600; margin: var(--spacing-lg) 0 var(--spacing-md); }
  :deep(p) { margin-bottom: var(--spacing-md); }
  :deep(ul) { padding-left: var(--spacing-lg); margin-bottom: var(--spacing-md); list-style: disc; }
  :deep(li) { margin-bottom: var(--spacing-xs); }
}
.news-detail-tags { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); margin-bottom: var(--spacing-lg); padding-bottom: var(--spacing-lg); border-bottom: 1px solid var(--color-border); }
.news-detail-attachments { margin-bottom: var(--spacing-xl);
  h4 { font-size: var(--font-size-body); font-weight: 600; margin-bottom: var(--spacing-md); }
}
.news-detail-attachment {
  display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg); border-radius: var(--radius-sm); margin-bottom: var(--spacing-xs);
  &-size { font-size: var(--font-size-small); color: var(--color-text-disabled); }
}
.news-detail-related {
  margin-bottom: var(--spacing-xl); padding: var(--spacing-lg); background: var(--color-bg); border-radius: var(--radius-md);
  h4 { font-size: var(--font-size-body); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--spacing-md); }
  &__list { display: flex; flex-direction: column; gap: 2px; }
  &__item { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; font-size: 14px; color: var(--color-text-secondary); transition: color var(--transition-fast) ease; border-bottom: 1px dashed var(--color-border);
    &:last-child { border-bottom: none; }
    &:hover { color: var(--color-primary); }
  }
  &__title { @include text-ellipsis; flex: 1; margin-right: var(--spacing-md); }
  &__time { font-size: 12px; color: var(--color-text-disabled); flex-shrink: 0; }
}
.news-detail-back { padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border); }
</style>
