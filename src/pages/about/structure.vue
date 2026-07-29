<script setup lang="ts">
import OrgChart from '@/components/common/OrgChart.vue'

const orgData = {
  id: 1,
  name: '总经理',
  title: 'CEO',
  children: [
    {
      id: 2,
      name: '技术研发中心',
      title: 'CTO',
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
    <p class="page-desc">专业团队，高效协同</p>
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
