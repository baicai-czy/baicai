<script setup lang="ts">
import OrgChart from '@/components/common/OrgChart.vue'
import type { OrgNode } from '@/components/common/OrgChart.vue'

const orgData: OrgNode = {
  id: 1,
  name: '总经理',
  title: 'CEO',
  children: [
    {
      id: 2,
      name: '技术研发中心',
      title: 'CTO',
      departmentDesc: '负责公司云平台技术架构设计、产品研发与质量管理。下设云平台研发部、AI研发部、测试与质量部。',
      children: [
        { id: 5, name: '云平台研发部', title: '研发总监' },
        { id: 6, name: 'AI研发部', title: 'AI总监' },
        { id: 7, name: '测试与质量部', title: '质量总监' },
      ],
    },
    {
      id: 3,
      name: '市场运营中心',
      title: 'CMO',
      departmentDesc: '负责公司市场推广、销售管理、解决方案与品牌建设。下设销售部、解决方案部、品牌市场部。',
      children: [
        { id: 8, name: '销售部', title: '销售总监' },
        { id: 9, name: '解决方案部', title: '方案总监' },
        { id: 10, name: '品牌市场部', title: '品牌总监' },
      ],
    },
    {
      id: 4,
      name: '综合管理中心',
      title: 'COO',
      departmentDesc: '负责公司日常运营管理，包括运维服务、人力资源与财务行政。下设运维服务部、人力资源部、财务行政部。',
      children: [
        { id: 11, name: '运维服务部', title: '运维总监' },
        { id: 12, name: '人力资源部', title: 'HR总监' },
        { id: 13, name: '财务行政部', title: '财务总监' },
      ],
    },
  ],
}
</script>

<template>
  <div class="page-structure">
    <h2 class="page-title">组织架构</h2>
    <p class="page-desc">专业团队，高效协同 — 点击节点查看详情</p>
    <OrgChart :data="orgData" />
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
