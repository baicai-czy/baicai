<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { sanitizeHTML } from '@/utils/sanitize'
import { formatDate } from '@/utils/format'
import type { NewsItem, NewsCategory } from '@/types/news'

const route = useRoute()
const newsId = computed(() => Number(route.params.id))

const breadcrumb = [
  { label: '新闻中心', to: '/news' },
  { label: '新闻详情' },
]

const news = ref<NewsItem | null>(null)
const loading = ref(false)

/** 热门推荐 TOP5 */
const hotArticles = ref<{ id: number; title: string; publishTime: string }[]>([])

const categoryMap: Record<string, string> = {
  company: '公司新闻',
  industry: '行业动态',
  notice: '通知公告',
}

/** 模拟根据 ID 加载新闻 */
onMounted(async () => {
  loading.value = true
  // 实际通过 useNewsStore().loadDetail(newsId.value) 获取
  // 此处模拟一条新闻数据
  news.value = {
    id: newsId.value,
    title: '城际云发布CloudMatrix 3.0平台',
    summary: '新一代云管理平台正式发布，全面支持混合云与多云管理，为企业数字化转型提供更强大的云基座能力。',
    content: `
      <p>2026年7月25日，城际云（江苏）科技有限公司在南京正式发布了新一代云管理平台——CloudMatrix 3.0。该平台在原有的多云管理能力基础上，深度融合了AI智能运维、自动化资源编排、全链路监控等核心能力。</p>
      <h3>核心升级</h3>
      <p>CloudMatrix 3.0实现了以下重大升级：</p>
      <ul>
        <li><strong>AI智能运维：</strong>基于大语言模型的智能故障诊断与自动修复能力，故障平均恢复时间缩短80%。</li>
        <li><strong>多云统一纳管：</strong>支持主流公有云、私有云及国产化平台的统一管理与可视化编排。</li>
        <li><strong>FinOps成本优化：</strong>智能化资源推荐与成本分析，帮助企业平均降低云资源成本30%以上。</li>
        <li><strong>安全合规中心：</strong>内置等保三级、GDPR等合规检查规则，一键生成合规报告。</li>
      </ul>
      <h3>应用场景</h3>
      <p>CloudMatrix 3.0已在政务、金融、医疗等行业的多个项目中落地应用，服务客户包括多家省级政务平台和大型国有企业，获得了客户的高度认可。</p>
    `,
    category: 'company' as NewsCategory,
    coverImage: '',
    source: '本站原创',
    author: '城际云产品团队',
    viewCount: 1280,
    isPinned: true,
    isPublished: true,
    publishTime: '2026-07-25T14:30:00',
    createTime: '',
    updateTime: '',
    tags: ['云平台', '产品发布', 'AI'],
    attachments: [
      { name: 'CloudMatrix 3.0 产品白皮书.pdf', url: '#', size: 5120000, type: 'pdf' },
    ],
  }
  loading.value = false

  // 热门推荐 TOP5（实际从 API fetchHotNews(5) 获取）
  hotArticles.value = [
    { id: 2, title: '城际云获评2026年度最佳云服务商', publishTime: '2026-07-20' },
    { id: 3, title: '云计算行业规模预计突破万亿', publishTime: '2026-07-18' },
    { id: 4, title: '关于系统升级维护的通知', publishTime: '2026-07-28' },
    { id: 5, title: '城际云与多家企业达成战略合作', publishTime: '2026-07-15' },
    { id: 6, title: 'AI智算平台助力科研创新', publishTime: '2026-07-10' },
  ]
})
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div v-if="loading" class="page-news-detail-loading">
      <el-skeleton :rows="10" animated />
    </div>

    <article v-else-if="news" class="page-news-detail">
      <!-- 标题区 -->
      <header class="news-detail-header">
        <span class="news-detail-category">{{ categoryMap[news.category] || news.category }}</span>
        <h1>{{ news.title }}</h1>
        <div class="news-detail-meta">
          <span>{{ news.source }}</span>
          <span>{{ news.author }}</span>
          <span>{{ formatDate(news.publishTime, 'YYYY-MM-DD HH:mm') }}</span>
          <span>
            <el-icon><View /></el-icon>
            {{ news.viewCount }}
          </span>
        </div>
      </header>

      <!-- 正文（DOMPurify 过滤后渲染） -->
      <div class="news-detail-content rich-content" v-html="sanitizeHTML(news.content)" />

      <!-- 标签 -->
      <div v-if="news.tags?.length" class="news-detail-tags">
        <el-tag v-for="tag in news.tags" :key="tag" class="news-detail-tag">{{ tag }}</el-tag>
      </div>

      <!-- 附件下载 -->
      <div v-if="news.attachments?.length" class="news-detail-attachments">
        <h4>附件下载</h4>
        <div v-for="att in news.attachments" :key="att.name" class="news-detail-attachment">
          <el-icon><Document /></el-icon>
          <span>{{ att.name }}</span>
          <span class="news-detail-attachment-size">({{ (att.size / 1024 / 1024).toFixed(1) }} MB)</span>
          <el-button type="primary" link size="small">下载</el-button>
        </div>
      </div>

      <!-- 热门推荐（SOW 3.6） -->
      <div v-if="hotArticles.length" class="news-detail-related">
        <h4>热门推荐</h4>
        <div class="news-detail-related__list">
          <router-link
            v-for="item in hotArticles"
            :key="item.id"
            :to="`/news/${item.id}`"
            class="news-detail-related__item"
          >
            <span class="news-detail-related__title">{{ item.title }}</span>
            <span class="news-detail-related__time">{{ item.publishTime }}</span>
          </router-link>
        </div>
      </div>

      <!-- 返回按钮 -->
      <div class="news-detail-back">
        <el-button @click="$router.push('/news')">
          <el-icon><ArrowLeft /></el-icon>
          返回新闻列表
        </el-button>
      </div>
    </article>

    <el-empty v-else description="新闻不存在或已被删除" />
  </AppLayout>
</template>

<style scoped lang="scss">
.page-news-detail-loading {
  padding: var(--spacing-xl) 0;
}

.news-detail-header {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.news-detail-category {
  display: inline-block;
  padding: 2px 12px;
  font-size: var(--font-size-small);
  color: var(--color-primary);
  background: rgba(26, 91, 179, 0.08);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.news-detail-header h1 {
  font-size: var(--font-size-h1);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.4;
  margin-bottom: var(--spacing-md);
}

.news-detail-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-small);
  color: var(--color-text-disabled);

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.news-detail-content {
  font-size: var(--font-size-body);
  line-height: 1.8;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xl);

  :deep(h3) {
    font-size: var(--font-size-h3);
    font-weight: 600;
    margin: var(--spacing-lg) 0 var(--spacing-md);
  }

  :deep(p) {
    margin-bottom: var(--spacing-md);
  }

  :deep(ul) {
    padding-left: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    list-style: disc;
  }

  :deep(li) {
    margin-bottom: var(--spacing-xs);
  }
}

.news-detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.news-detail-attachments {
  margin-bottom: var(--spacing-xl);

  h4 {
    font-size: var(--font-size-body);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
  }
}

.news-detail-attachment {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-xs);

  &-size {
    font-size: var(--font-size-small);
    color: var(--color-text-disabled);
  }
}

.news-detail-related {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg);
  border-radius: var(--radius-md);

  h4 {
    font-size: var(--font-size-body);
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 14px;
    color: var(--color-text-secondary);
    transition: color var(--transition-fast) ease;
    border-bottom: 1px dashed var(--color-border);

    &:last-child { border-bottom: none; }

    &:hover {
      color: var(--color-primary);
    }
  }

  &__title {
    @include text-ellipsis;
    flex: 1;
    margin-right: var(--spacing-md);
  }

  &__time {
    font-size: 12px;
    color: var(--color-text-disabled);
    flex-shrink: 0;
  }
}

.news-detail-back {
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}
</style>
