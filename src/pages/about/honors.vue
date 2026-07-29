<script setup lang="ts">
import HonorWall from '@/components/common/HonorWall.vue'
import type { HonorItem } from '@/types/components'

const honors: HonorItem[] = [
  { id: 1, name: '高新技术企业证书', category: '企业资质', imageUrl: '', issueDate: '2024-01-01', issuingAuthority: '江苏省科学技术厅' },
  { id: 2, name: 'ISO 27001 信息安全管理体系', category: '体系认证', imageUrl: '', issueDate: '2023-06-01', issuingAuthority: 'BSI' },
  { id: 3, name: '信息系统安全等级保护三级', category: '安全认证', imageUrl: '', issueDate: '2023-03-01', issuingAuthority: '公安部' },
  { id: 4, name: 'CMMI Level 3', category: '体系认证', imageUrl: '', issueDate: '2024-09-01', issuingAuthority: 'CMMI Institute' },
  { id: 5, name: '云计算服务能力认证', category: '行业资质', imageUrl: '', issueDate: '2023-12-01', issuingAuthority: '中国信通院' },
  { id: 6, name: 'AAA级信用企业', category: '企业资质', imageUrl: '', issueDate: '2024-03-01', issuingAuthority: '中国企联' },
]
</script>

<template>
  <div class="page-honors">
    <h2 class="page-title">资质荣誉</h2>
    <p class="page-desc">权威认证，专业实力，值得信赖</p>
    <HonorWall :items="honors" />
  </div>
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
</style>
