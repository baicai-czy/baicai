<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ServiceCard from '@/components/business/ServiceCard.vue'
import SearchBox from '@/components/common/SearchBox.vue'
import Pagination from '@/components/common/Pagination.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import type { ServiceCardItem } from '@/types/components'

const breadcrumb = [{ label: '产品与服务' }]

const loading = ref(false)
const keyword = ref('')
const currentPage = ref(1)
const total = ref(8)

// 实际从 API 获取，此处硬编码示例数据
const products: ServiceCardItem[] = [
  { id: 1, icon: 'Platform', title: '通算云服务器', description: '弹性可扩展的虚拟服务器，支持按需创建与释放', to: '/products/compute', features: ['弹性计算', '多规格可选', '按量付费'], category: 'compute' },
  { id: 2, icon: 'Cpu', title: 'GPU智算实例', description: '高性能GPU计算实例，适用于AI训练与推理场景', to: '/products/ai', features: ['A100/H100', 'RDMA网络', '分布式训练'], category: 'ai' },
  { id: 3, icon: 'FolderOpened', title: '对象存储', description: '海量、安全、低成本的云端存储服务', to: '/products/storage', features: ['11个9数据持久性', '无限弹性扩容', 'CDN加速分发'], category: 'storage' },
  { id: 4, icon: 'Connection', title: '负载均衡', description: '实现流量分发，提升应用可用性与扩展能力', to: '/products/lb', features: ['四/七层', '健康检查', '会话保持'], category: 'network' },
  { id: 5, icon: 'Lock', title: '云安全', description: '多层次安全防护体系，全面保障云上资产安全', to: '/products/security', features: ['DDoS防护', 'WAF', '漏洞扫描'], category: 'security' },
  { id: 6, icon: 'DataAnalysis', title: '大数据平台', description: '一站式大数据处理与分析平台', to: '/products/bigdata', features: ['实时计算', '离线分析', '可视化'], category: 'data' },
]

function onSearch(val: string) {
  keyword.value = val
  currentPage.value = 1
  // 触发 API 搜索
}
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div class="page-products">
      <h2 class="page-title">产品与服务</h2>
      <p class="page-desc">覆盖 IaaS / PaaS / SaaS 全栈云服务</p>

      <!-- 搜索栏 -->
      <div class="page-products__toolbar">
        <SearchBox v-model="keyword" placeholder="搜索产品..." @search="onSearch" />
      </div>

      <Skeleton v-if="loading" :count="6" card />

      <div v-else class="page-products__grid">
        <ServiceCard v-for="p in products" :key="p.id" :item="p" />
      </div>

      <Pagination
        v-if="total > 6"
        :total="total"
        :current-page="currentPage"
        :page-size="6"
        @change="(p: number) => currentPage = p"
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

.page-products {
  &__toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: var(--spacing-lg);
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
</style>
