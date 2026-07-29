<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import SolutionCard from '@/components/business/SolutionCard.vue'
import type { SolutionItem } from '@/types/components'

const breadcrumb = [{ label: '解决方案' }]

const solutions: SolutionItem[] = [
  { id: 1, title: '政务云解决方案', targetCustomer: '政府机构', description: '为政府部门提供安全合规、统一管理的政务云平台，支撑"互联网+政务服务"与数据共享交换。', imageUrl: '' },
  { id: 2, title: '企业数字化转型', targetCustomer: '中大型企业', description: '提供从IaaS到PaaS的全栈云服务，助力企业快速实现IT基础设施现代化转型。', imageUrl: '' },
  { id: 3, title: '金融行业云', targetCustomer: '金融机构', description: '满足金融监管合规要求的专属行业云，保障数据安全与业务连续性。', imageUrl: '' },
  { id: 4, title: '医疗健康云', targetCustomer: '医疗机构', description: '为医疗机构提供影像存储、AI辅助诊断、患者数据管理等专业云服务。', imageUrl: '' },
  { id: 5, title: '智慧教育云', targetCustomer: '教育机构', description: '在线教学、科研计算、校园管理的综合教育云平台解决方案。', imageUrl: '' },
  { id: 6, title: '能源行业云', targetCustomer: '能源企业', description: '面向能源行业的数据采集、分析、预测与调度的云化解决方案。', imageUrl: '' },
]
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div class="page-solutions">
      <h2 class="page-title">解决方案</h2>
      <p class="page-desc">深耕行业场景，提供端到端的定制化云解决方案</p>

      <div class="page-solutions__grid">
        <SolutionCard v-for="sol in solutions" :key="sol.id" :item="sol" />
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

.page-solutions {
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
