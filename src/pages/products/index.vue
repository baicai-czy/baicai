<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ServiceCard from '@/components/business/ServiceCard.vue'
import SearchBox from '@/components/common/SearchBox.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import type { ServiceCardItem } from '@/types/components'

const breadcrumb = [{ label: '产品与服务' }]

const loading = ref(false)
const keyword = ref('')

/** 按分类分组 */
const groupedProducts = computed(() => {
  const groups: Record<string, ServiceCardItem[]> = {}
  products.forEach((p) => {
    const cat = p.category || 'other'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(p)
  })
  return groups
})

/** 产品分类标签 */
const categoryLabels: Record<string, string> = {
  compute: '通算服务',
  ai: '智算服务',
  integration: '云集成服务',
  ops: '运维服务',
}

// 实际从 API 获取，此处按 SOW 3.4 四大类别组织示例数据
const products: ServiceCardItem[] = [
  // ── 通算服务 ──
  { id: 1, icon: 'Monitor', title: '弹性计算', description: '可弹性伸缩的虚拟服务器，按需创建释放，支持多种规格', to: '/products/compute', features: ['多规格可选', '弹性伸缩', '按量付费'], category: 'compute' },
  { id: 2, icon: 'FolderOpened', title: '云存储', description: '海量、安全、低成本的云端存储服务，支持对象/块/文件存储', to: '/products/storage', features: ['企业级数据可靠性', '无限弹性扩容', 'CDN加速分发'], category: 'compute' },
  { id: 3, icon: 'Connection', title: '云网络', description: '实现流量分发与网络隔离，提升应用可用性与安全性', to: '/products/network', features: ['负载均衡', '私有网络', '专线接入'], category: 'compute' },
  { id: 4, icon: 'Lock', title: '云安全', description: '多层次安全防护体系，全面保障云上资产安全', to: '/products/security', features: ['DDoS防护', 'WAF防火墙', '漏洞扫描'], category: 'compute' },
  // ── 智算服务 ──
  { id: 5, icon: 'Cpu', title: 'GPU云服务器', description: '高性能GPU计算实例，适用于AI训练与推理场景', to: '/products/ai', features: ['A100/H100', 'RDMA高速网络', '分布式训练'], category: 'ai' },
  { id: 6, icon: 'MagicStick', title: 'AI训练平台', description: '一站式AI模型训练平台，支持主流深度学习框架', to: '/products/ai-train', features: ['PyTorch/TensorFlow', '自动调参', '训练可视化'], category: 'ai' },
  { id: 7, icon: 'Box', title: '模型服务', description: '大模型部署与推理服务，提供标准化API接口', to: '/products/ml-service', features: ['模型托管', '弹性推理', 'API网关'], category: 'ai' },
  // ── 云集成服务 ──
  { id: 8, icon: 'EditPen', title: '规划设计', description: '云计算战略规划、架构设计与技术选型咨询服务', to: '/products/planning', features: ['需求调研', '架构设计', 'TCO评估'], category: 'integration' },
  { id: 9, icon: 'Setting', title: '建设实施', description: '云平台搭建、系统集成与部署实施服务', to: '/products/implementation', features: ['平台搭建', '系统集成', '验收测试'], category: 'integration' },
  { id: 10, icon: 'Promotion', title: '迁移服务', description: '应用系统从传统架构到云平台的平滑迁移', to: '/products/migration', features: ['迁移评估', '数据迁移', '业务切换'], category: 'integration' },
  // ── 运维服务 ──
  { id: 11, icon: 'Monitor', title: '7×24 监控', description: '全天候基础设施监控告警，实时掌握平台运行状态', to: '/products/monitoring', features: ['实时监控', '智能告警', '可视化大屏'], category: 'ops' },
  { id: 12, icon: 'WarnTriangleFilled', title: '故障处理', description: '快速故障定位与恢复服务，保障业务连续性', to: '/products/fault', features: ['自动诊断', '快速响应', '根因分析'], category: 'ops' },
  { id: 13, icon: 'TrendCharts', title: '优化建议', description: '性能调优、成本优化与架构改进建议', to: '/products/optimization', features: ['性能调优', '成本分析', '架构优化'], category: 'ops' },
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
  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
  }

  &__category {
    font-size: var(--font-size-h3);
    font-weight: 700;
    color: var(--color-text-primary);
    padding-bottom: var(--spacing-sm);
    border-bottom: 2px solid var(--color-border);
    margin: 0;
  }

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
