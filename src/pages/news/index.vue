<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import NewsCard from '@/components/common/NewsCard.vue'
import SearchBox from '@/components/common/SearchBox.vue'
import Pagination from '@/components/common/Pagination.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import { useNewsStore } from '@/stores/modules/news'
import { categoryMap } from '@/utils/constants'
import type { NewsItem, NewsCategory } from '@/types/news'

const route = useRoute()
const newsStore = useNewsStore()

const breadcrumb = [{ label: '新闻中心' }]

const categories = computed(() => {
  return Object.entries(categoryMap).map(([key, label]) => ({
    key: key as NewsCategory | 'all',
    label,
  }))
})

const categoryTabs = [
  { key: 'all' as const, label: '全部' },
  { key: 'company' as const, label: '公司新闻' },
  { key: 'industry' as const, label: '行业动态' },
  { key: 'notice' as const, label: '通知公告' },
]

onMounted(() => {
  newsStore.loadList()
})

function onTabChange(tab: 'all' | NewsCategory) {
  newsStore.switchCategory(tab)
}

function onSearch(keyword: string) {
  newsStore.search(keyword)
}

function onPageChange(page: number) {
  newsStore.loadList(page)
}

function onNewsClick(item: NewsItem) {
  // vue-router 会自动处理 /news/:id
}

/** Mock 数据（API 未就绪时使用） */
const mockNews: NewsItem[] = [
  {
    id: 1,
    title: '城际云发布CloudMatrix 3.0平台',
    summary: '新一代云管理平台正式发布，全面支持混合云与多云管理...',
    content: '',
    category: 'company' as NewsCategory,
    coverImage: '',
    source: '本站',
    author: '城际云',
    viewCount: 1280,
    isPinned: true,
    isPublished: true,
    publishTime: '2026-07-25',
    createTime: '',
    updateTime: '',
    tags: ['云平台', '产品发布'],
    attachments: [],
  },
  {
    id: 2,
    title: '城际云获评2026年度最佳云服务商',
    summary: '在2026中国云计算大会上，城际云荣获"年度最佳云服务商"称号...',
    content: '',
    category: 'company' as NewsCategory,
    coverImage: '',
    source: '本站',
    author: '城际云',
    viewCount: 960,
    isPinned: false,
    isPublished: true,
    publishTime: '2026-07-20',
    createTime: '',
    updateTime: '',
    tags: ['获奖', '企业荣誉'],
    attachments: [],
  },
  {
    id: 3,
    title: '云计算行业规模预计突破万亿',
    summary: '据工信部最新报告，2026年中国云计算市场规模将突破万亿...',
    content: '',
    category: 'industry' as NewsCategory,
    coverImage: '',
    source: '行业资讯',
    author: '转载',
    viewCount: 850,
    isPinned: false,
    isPublished: true,
    publishTime: '2026-07-18',
    createTime: '',
    updateTime: '',
    tags: ['行业动态', '市场趋势'],
    attachments: [],
  },
  {
    id: 4,
    title: '关于系统升级维护的通知',
    summary: '为提升平台服务稳定性，计划于7月30日凌晨进行系统升级维护...',
    content: '',
    category: 'notice' as NewsCategory,
    coverImage: '',
    source: '本站',
    author: '运维团队',
    viewCount: 520,
    isPinned: true,
    isPublished: true,
    publishTime: '2026-07-28',
    createTime: '',
    updateTime: '',
    tags: ['运维通知'],
    attachments: [],
  },
]

// 合并 API 数据与 Mock 数据
const displayList = computed(() => {
  return newsStore.list.length > 0 ? newsStore.list : mockNews
})
const displayTotal = computed(() => {
  return newsStore.total > 0 ? newsStore.total : mockNews.length
})
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div class="page-news">
      <h2 class="page-title">新闻中心</h2>
      <p class="page-desc">了解城际云最新动态与行业资讯</p>

      <!-- 工具栏：分类 Tab + 搜索框 -->
      <div class="page-news__toolbar">
        <div class="page-news__tabs">
          <button
            v-for="tab in categoryTabs"
            :key="tab.key"
            class="news-tab"
            :class="{ 'news-tab--active': newsStore.category === tab.key }"
            @click="onTabChange(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>
        <SearchBox
          :model-value="newsStore.keyword"
          placeholder="搜索新闻..."
          @search="onSearch"
        />
      </div>

      <!-- 加载态 -->
      <Skeleton v-if="newsStore.loading" :count="6" card />

      <!-- 搜索结果为空 -->
      <el-empty
        v-else-if="newsStore.keyword && newsStore.isEmpty"
        description="未找到相关内容，换个关键词试试"
      />

      <!-- 无新闻 -->
      <el-empty
        v-else-if="newsStore.isEmpty"
        description="暂无新闻"
      />

      <!-- 新闻列表 -->
      <div v-else class="page-news__grid">
        <NewsCard
          v-for="item in displayList"
          :key="item.id"
          :item="item"
        />
      </div>

      <Pagination
        v-if="displayTotal > newsStore.pageSize"
        :total="displayTotal"
        :current-page="newsStore.currentPage"
        :page-size="newsStore.pageSize"
        @change="onPageChange"
      />
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.page-title {
  font-size: var(--font-size-h2);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}
.page-desc {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

.page-news {
  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
  }

  &__tabs {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);

    @include respond-to(sm) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to(md) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

.news-tab {
  padding: 6px 16px;
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast) ease;

  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
  }

  &--active {
    color: #ffffff;
    background: var(--color-primary);
    border-color: var(--color-primary);
  }
}
</style>
