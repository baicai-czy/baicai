<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBannerStore } from '@/stores/modules/banner'
import { useNewsStore } from '@/stores/modules/news'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useSEO } from '@/composables/useSEO'
import AppLayout from '@/components/layout/AppLayout.vue'
import BannerSwiper from '@/components/common/BannerSwiper.vue'
import QuickEntry from '@/components/common/QuickEntry.vue'
import NewsCard from '@/components/common/NewsCard.vue'
import ServiceCard from '@/components/business/ServiceCard.vue'
import SolutionCard from '@/components/business/SolutionCard.vue'
import DataCounter from '@/components/common/DataCounter.vue'
import PartnerWall from '@/components/common/PartnerWall.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import type { QuickEntryItem, StatItem, PartnerItem, ServiceCardItem, SolutionItem } from '@/types/components'

// ── Stores ──
const bannerStore = useBannerStore()
const newsStore = useNewsStore()

// ── 快捷入口（固定） ──
const quickEntries: QuickEntryItem[] = [
  { icon: 'Cloudy', title: '国资云', description: '安全合规专属云，为政企客户提供全栈云服务', to: '/business/state-cloud' },
  { icon: 'Connection', title: '云和智算集成', description: '从规划到运维，端到端云集成服务', to: '/business/integration' },
  { icon: 'Document', title: '解决方案', description: '深耕行业场景，提供精准解决方案', to: '/solutions' },
  { icon: 'ChatLineSquare', title: '联系我们', description: '专业顾问为您解答', to: '/contact' },
]

// ── 动态数据 ──
const statsData = ref<StatItem[]>([
  { id: 1, label: '服务企业', value: 500, suffix: '+', prefix: '' },
  { id: 2, label: '政企客户', value: 80, suffix: '+', prefix: '' },
  { id: 3, label: '平台可用性', value: 99.99, suffix: '%', prefix: '', decimals: 2 },
  { id: 4, label: '运营经验', value: 15, suffix: '年', prefix: '' },
])

const featuredServices = ref<ServiceCardItem[]>([
  { id: 1, icon: 'Monitor', title: '通算云服务器', description: '弹性可扩展的虚拟服务器', to: '/products/compute', features: ['弹性伸缩', '多规格可选', '按量付费'] },
  { id: 2, icon: 'FolderOpened', title: '对象存储', description: '海量安全的云端存储服务', to: '/products/storage', features: ['企业级可靠性', '无限扩容', 'CDN加速'] },
  { id: 3, icon: 'Cpu', title: '云数据库', description: '高性能、高可用的数据库服务', to: '/products/database', features: ['MySQL/PostgreSQL', '自动备份', '读写分离'] },
])

const featuredSolutions = ref<SolutionItem[]>([
  { id: 1, title: '政务云解决方案', targetCustomer: '政府机构', description: '安全合规的政务云平台，支撑互联网+政务服务', imageUrl: '' },
  { id: 2, title: '企业数字化转型', targetCustomer: '中大型企业', description: 'IaaS到PaaS全栈云服务，助力企业数字化升级', imageUrl: '' },
  { id: 3, title: '金融行业云', targetCustomer: '金融机构', description: '满足金融监管要求的专属行业云', imageUrl: '' },
])

const partners = ref<PartnerItem[]>([
  { id: 1, name: '华为云', logoUrl: '', website: '#' },
  { id: 2, name: '阿里云', logoUrl: '', website: '#' },
  { id: 3, name: '腾讯云', logoUrl: '', website: '#' },
  { id: 4, name: '新华三', logoUrl: '', website: '#' },
  { id: 5, name: '浪潮', logoUrl: '', website: '#' },
  { id: 6, name: '曙光', logoUrl: '', website: '#' },
])

onMounted(async () => {
  // 并行加载所有数据
  const [
    bannerPromise,
    newsPromise,
    statsPromise,
    servicesPromise,
    solutionsPromise,
    partnersPromise,
  ] = [
    bannerStore.fetchBanners(),
    newsStore.loadList(1, 6),
    import('@/api/modules/common').then(m => m.fetchStats().catch(() => [])),
    import('@/api/modules/products').then(m => m.fetchProducts({ page: 1, pageSize: 6 }).catch(() => null)),
    import('@/api/modules/solutions').then(m => m.fetchSolutions().catch(() => [])),
    import('@/api/modules/common').then(m => m.fetchPartners().catch(() => [])),
  ]

  const [stats, svcRes, sols, parts] = await Promise.all([statsPromise, servicesPromise, solutionsPromise, partnersPromise])

  if (stats) statsData.value = stats
  if (svcRes) featuredServices.value = (svcRes as any).records || (Array.isArray(svcRes) ? svcRes : [])
  if (sols) featuredSolutions.value = sols
  if (parts) partners.value = parts

  useScrollReveal('.reveal', { staggerDelay: 100 })
})

useSEO({
  title: '城际云（江苏）科技有限公司 — 最懂行业的云服务公司',
  description: '城际云提供国资云、云和智算集成等专业云服务，涵盖通算、智算、云集成与运维全栈解决方案。',
  keywords: '城际云,云计算,国资云,政务云,智算服务,云集成',
})
</script>

<template>
  <AppLayout>
    <!-- ========== Banner 轮播 ========== -->
    <BannerSwiper :banners="bannerStore.activeBanners" :interval="5000" :height="'520px'" />

    <!-- ========== 快捷入口 ========== -->
    <section class="section">
      <div class="container">
        <QuickEntry :items="quickEntries" />
      </div>
    </section>

    <!-- ========== 业务简介 ========== -->
    <section class="section" style="background: var(--color-card-bg)">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">核心产品与服务</h2>
          <p class="section-subtitle">提供全方位的云计算产品与专业服务</p>
        </div>
        <div class="home-services">
          <ServiceCard
            v-for="svc in featuredServices"
            :key="svc.id"
            :item="svc"
          />
        </div>
        <div class="section-footer">
          <el-button type="primary" plain size="large" @click="$router.push('/products')">
            查看全部产品与服务
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </section>

    <!-- ========== 解决方案 ========== -->
    <section class="section" style="margin-top: -32px">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">行业解决方案</h2>
          <p class="section-subtitle">深耕行业场景，提供精准解决方案</p>
        </div>
        <div class="home-solutions">
          <SolutionCard
            v-for="sol in featuredSolutions"
            :key="sol.id"
            :item="sol"
          />
        </div>
        <div class="section-footer">
          <el-button type="primary" plain size="large" @click="$router.push('/solutions')">
            查看全部解决方案
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </section>

    <!-- ========== 数据亮点 ========== -->
    <section class="section" style="background: linear-gradient(135deg, rgba(26,91,179,0.06), rgba(0,180,216,0.08)); margin-top: -32px">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">数据亮点</h2>
          <p class="section-subtitle">用数字见证我们的实力</p>
        </div>
        <DataCounter :items="statsData" :duration="1800" />
      </div>
    </section>

    <!-- ========== 新闻动态 ========== -->
    <section class="section" style="margin-top: -32px">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">新闻动态</h2>
          <p class="section-subtitle">了解城际云最新资讯</p>
        </div>

        <Skeleton v-if="newsStore.loading" :count="3" card />

        <div v-else-if="newsStore.isEmpty" class="home-empty">
          <el-empty description="暂无新闻" />
        </div>

        <div v-else class="home-news">
          <NewsCard
            v-for="item in newsStore.list.slice(0, 6)"
            :key="item.id"
            :item="item"
          />
        </div>

        <div class="section-footer">
          <el-button type="primary" plain size="large" @click="$router.push('/news')">
            查看全部新闻
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </section>

    <!-- ========== 合作伙伴 ========== -->
    <section class="section" style="background: var(--color-card-bg); margin-top: -32px">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">合作伙伴</h2>
          <p class="section-subtitle">携手行业领先伙伴，共建云生态</p>
        </div>
        <PartnerWall :items="partners" />
      </div>
    </section>
  </AppLayout>
</template>

<style scoped lang="scss">
.section-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  letter-spacing: 1px;

  @include respond-to(sm) {
    font-size: 36px;
  }
}

.section-subtitle {
  font-size: 16px;
  color: var(--color-text-secondary);
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    display: block;
    width: 40px;
    height: 3px;
    border-radius: 3px;
    background: var(--color-primary);
    margin: var(--spacing-md) auto 0;
  }
}

.section-footer {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

// ── 产品网格 ──
.home-services {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-2xl);

  @include respond-to(sm) {
    grid-template-columns: repeat(3, 1fr);
  }
}

// ── 方案网格 ──
.home-solutions {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-2xl);

  @include respond-to(sm) {
    grid-template-columns: repeat(3, 1fr);
  }
}

// ── 新闻网格 ──
.home-news {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);

  @include respond-to(sm) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(md) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.home-empty {
  padding: var(--spacing-2xl) 0;
}
</style>
