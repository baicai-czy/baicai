<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useBannerStore } from '@/stores/modules/banner'
import { useNewsStore } from '@/stores/modules/news'
import { useScrollReveal } from '@/composables/useScrollReveal'
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

// ── 快捷入口（SOW 3.1：国资云、云和智算集成、解决方案、联系我们） ──
const quickEntries: QuickEntryItem[] = [
  { icon: 'Cloudy', title: '国资云', description: '安全合规专属云，为政企客户提供全栈云服务', to: '/business/state-cloud' },
  { icon: 'Connection', title: '云和智算集成', description: '从规划到运维，端到端云集成服务', to: '/business/integration' },
  { icon: 'Document', title: '解决方案', description: '深耕行业场景，提供精准解决方案', to: '/solutions' },
  { icon: 'ChatLineSquare', title: '联系我们', description: '专业顾问为您解答', to: '/contact' },
]

// ── 统计数据（硬编码，可接 API） ──
const statsData: StatItem[] = [
  { id: 1, label: '服务企业', value: 500, suffix: '+', prefix: '' },
  { id: 2, label: '政企客户', value: 80, suffix: '+', prefix: '' },
  { id: 3, label: '平台可用性', value: 99.99, suffix: '%', prefix: '', decimals: 2 },
  { id: 4, label: '运营经验', value: 15, suffix: '年', prefix: '' },
]

// ── 产品服务 ──
const featuredServices: ServiceCardItem[] = [
  {
    id: 1,
    icon: 'Monitor',
    title: '通算云平台',
    description: '高性能、高可用的通用计算云平台，满足企业各类常规业务需求',
    to: '/products/detail/compute',
    features: ['弹性伸缩', '按需付费', '99.99% SLA'],
  },
  {
    id: 2,
    icon: 'Cpu',
    title: '智算平台',
    description: '面向AI训练与推理的高性能GPU计算集群',
    to: '/products/detail/ai',
    features: ['GPU集群', '模型训练', '推理优化'],
  },
  {
    id: 3,
    icon: 'SetUp',
    title: '系统集成',
    description: '端到端的云平台规划、建设、迁移与运维服务',
    to: '/products/detail/integration',
    features: ['架构规划', '平滑迁移', '7×24运维'],
  },
]

// ── 解决方案 ──
const featuredSolutions: SolutionItem[] = [
  {
    id: 1,
    title: '政务云解决方案',
    targetCustomer: '政府机构',
    description: '为政府部门提供安全合规、统一管理的政务云平台，支撑"互联网+政务服务"',
    imageUrl: '',
  },
  {
    id: 2,
    title: '企业数字化转型',
    targetCustomer: '中大型企业',
    description: '提供从IAAS到PAAS的全栈云服务，助力企业快速实现数字化转型升级',
    imageUrl: '',
  },
  {
    id: 3,
    title: '金融行业云',
    targetCustomer: '金融机构',
    description: '满足金融监管要求的专属行业云，保障数据安全与业务连续性',
    imageUrl: '',
  },
]

// ── 合作伙伴 ──
const partners: PartnerItem[] = [
  { id: 1, name: '华为云', logoUrl: '', website: '#' },
  { id: 2, name: '阿里云', logoUrl: '', website: '#' },
  { id: 3, name: '腾讯云', logoUrl: '', website: '#' },
  { id: 4, name: '新华三', logoUrl: '', website: '#' },
  { id: 5, name: '浪潮', logoUrl: '', website: '#' },
  { id: 6, name: '曙光', logoUrl: '', website: '#' },
]

onMounted(() => {
  bannerStore.fetchBanners()
  newsStore.loadList(1, 6)
  useScrollReveal('.reveal', { staggerDelay: 100 })
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
    <section class="section reveal" style="margin-top: -32px">
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
    <section class="section reveal" style="margin-top: -32px">
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
