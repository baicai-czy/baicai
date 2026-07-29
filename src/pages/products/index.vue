<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ServiceCard from '@/components/business/ServiceCard.vue'
import SearchBox from '@/components/common/SearchBox.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import type { ServiceCardItem } from '@/types/components'

const breadcrumb = [{ label: '产品与服务' }]

const loading = ref(true)
const keyword = ref('')
const products = ref<ServiceCardItem[]>([
  // 通算服务
  { id: 1, icon: 'Monitor', title: '弹性计算', description: '可弹性伸缩的虚拟服务器', to: '/products/compute', features: ['多规格可选', '弹性伸缩', '按量付费'], category: 'compute' },
  { id: 2, icon: 'FolderOpened', title: '云存储', description: '海量安全的云端存储服务', to: '/products/storage', features: ['企业级可靠性', '无限扩容', 'CDN加速'], category: 'compute' },
  { id: 3, icon: 'Connection', title: '云网络', description: '流量分发与网络隔离', to: '/products/network', features: ['负载均衡', '私有网络', '专线接入'], category: 'compute' },
  { id: 4, icon: 'Lock', title: '云安全', description: '多层次安全防护体系', to: '/products/security', features: ['DDoS防护', 'WAF防火墙', '漏洞扫描'], category: 'compute' },
  // 智算服务
  { id: 5, icon: 'Cpu', title: 'GPU云服务器', description: '高性能GPU计算实例', to: '/products/ai', features: ['A100/H100', 'RDMA网络', '分布式训练'], category: 'ai' },
  { id: 6, icon: 'DataAnalysis', title: 'AI训练平台', description: '一站式AI模型训练平台', to: '/products/ai-train', features: ['PyTorch/TensorFlow', '自动调参', '训练可视化'], category: 'ai' },
  { id: 7, icon: 'Box', title: '模型服务', description: '大模型部署与推理服务', to: '/products/ml-service', features: ['模型托管', '弹性推理', 'API网关'], category: 'ai' },
  // 云集成服务
  { id: 8, icon: 'EditPen', title: '规划设计', description: '云计算战略规划与架构设计', to: '/products/planning', features: ['需求调研', '架构设计', 'TCO评估'], category: 'integration' },
  { id: 9, icon: 'Setting', title: '建设实施', description: '云平台搭建与系统集成', to: '/products/implementation', features: ['平台搭建', '系统集成', '验收测试'], category: 'integration' },
  { id: 10, icon: 'Upload', title: '迁移服务', description: '应用系统平滑迁移上云', to: '/products/migration', features: ['迁移评估', '数据迁移', '业务切换'], category: 'integration' },
  // 运维服务
  { id: 11, icon: 'Monitor', title: '7×24 监控', description: '全天候基础设施监控告警', to: '/products/monitoring', features: ['实时监控', '智能告警', '可视化大屏'], category: 'ops' },
  { id: 12, icon: 'WarningFilled', title: '故障处理', description: '快速故障定位与恢复', to: '/products/fault', features: ['自动诊断', '快速响应', '根因分析'], category: 'ops' },
  { id: 13, icon: 'TrendCharts', title: '优化建议', description: '性能调优与成本优化', to: '/products/optimization', features: ['性能调优', '成本分析', '架构优化'], category: 'ops' },
])

const groupedProducts = computed(() => {
  const groups: Record<string, ServiceCardItem[]> = {}
  products.value.forEach((p) => {
    const cat = p.category || 'other'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(p)
  })
  return groups
})

const categoryLabels: Record<string, string> = {
  compute: '通算服务', ai: '智算服务', integration: '云集成服务', ops: '运维服务',
  cloud: '云服务', data: '数据服务', gov: '政务产品', test: '测试',
}

onMounted(async () => {
  if (import.meta.env.VITE_USE_API === 'true') {
    try {
      const { fetchProducts } = await import('@/api/modules/products')
      const data = await fetchProducts({ page: 1, pageSize: 50 })
      if (data) {
        products.value = (data as any).records || (Array.isArray(data) ? data : [])
      }
    } catch { /* ignore */ }
  }
  loading.value = false
})

async function onSearch(val: string) {
  keyword.value = val
  if (import.meta.env.VITE_USE_API !== 'true') return
  loading.value = true
  try {
    const { fetchProducts } = await import('@/api/modules/products')
    const data = await fetchProducts({ page: 1, pageSize: 50, keyword: val })
    if (data) {
      products.value = (data as any).records || (Array.isArray(data) ? data : [])
    }
  } catch { /* ignore */ }
  loading.value = false
}
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div class="page-products">
      <div class="page-products__toolbar">
        <SearchBox v-model="keyword" placeholder="搜索产品..." @search="onSearch" />
      </div>

      <Skeleton v-if="loading" :count="6" card />

      <div v-else class="page-products__list">
        <template v-for="(items, cat) in groupedProducts" :key="cat">
          <h3 class="page-products__category">{{ categoryLabels[cat] || cat }}</h3>
          <div class="page-products__grid">
            <ServiceCard v-for="p in items" :key="p.id" :item="p" />
          </div>
        </template>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.page-title { font-size: var(--font-size-h2); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--spacing-sm); }
.page-desc { font-size: var(--font-size-body); color: var(--color-text-secondary); margin-bottom: var(--spacing-xl); }

.page-products {
  &__list { display: flex; flex-direction: column; gap: var(--spacing-2xl); }
  &__category { font-size: var(--font-size-h3); font-weight: 700; color: var(--color-text-primary); padding-bottom: var(--spacing-sm); border-bottom: 2px solid var(--color-border); margin: 0; }
  &__toolbar { display: flex; justify-content: flex-end; margin-bottom: var(--spacing-lg); }
  &__grid { display: grid; grid-template-columns: 1fr; gap: var(--spacing-lg);
    @include respond-to(sm) { grid-template-columns: repeat(2, 1fr); }
    @include respond-to(md) { grid-template-columns: repeat(3, 1fr); }
  }
}
</style>
