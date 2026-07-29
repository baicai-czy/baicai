<script setup lang="ts">
import OrgChart from '@/components/common/OrgChart.vue'
import type { OrgNode } from '@/components/common/OrgChart.vue'

const orgData: OrgNode = {
  id: 1,
  name: '张云峰',
  title: '总经理 / CEO',
  bio: '张云峰先生拥有20年云计算行业经验，曾任职于多家头部云服务企业。主导了公司多个大型国资云项目的规划与交付，带领团队成为区域领先的云服务提供商。',
  children: [
    {
      id: 2,
      name: '技术研发中心',
      title: '李明远 / CTO',
      departmentDesc: '负责公司云平台技术架构设计、产品研发与质量管理。下设云平台研发部、AI研发部、测试与质量部。',
      bio: '李明远博士，前阿里巴巴云高级架构师，拥有15年分布式系统研发经验。主导设计了CloudMatrix云管理平台架构。',
      children: [
        {
          id: 5,
          name: '云平台研发部',
          title: '王建国 / 研发总监',
          bio: '负责通算云、存储、网络等基础云产品的研发与迭代。',
        },
        {
          id: 6,
          name: 'AI研发部',
          title: '陈思宇 / AI总监',
          bio: '负责GPU智算平台、AI训练推理引擎、大模型部署优化。',
        },
        {
          id: 7,
          name: '测试与质量部',
          title: '赵晓琳 / 质量总监',
          bio: '负责全平台质量保障、自动化测试、性能压测与安全测试。',
        },
      ],
    },
    {
      id: 3,
      name: '市场运营中心',
      title: '周雅文 / CMO',
      departmentDesc: '负责公司市场推广、销售管理、解决方案与品牌建设。下设销售部、解决方案部、品牌市场部。',
      bio: '周雅文女士拥有12年B2B科技市场营销经验，擅长政企客户关系管理与行业解决方案营销。',
      children: [
        {
          id: 8,
          name: '销售部',
          title: '刘志强 / 销售总监',
          bio: '负责全国区域市场开拓与政企大客户销售管理。',
        },
        {
          id: 9,
          name: '解决方案部',
          title: '林晓峰 / 方案总监',
          bio: '负责行业解决方案的设计、包装与售前支持。',
        },
        {
          id: 10,
          name: '品牌市场部',
          title: '吴佳怡 / 品牌总监',
          bio: '负责公司品牌策略、市场活动、数字营销与公关传播。',
        },
      ],
    },
    {
      id: 4,
      name: '综合管理中心',
      title: '孙磊 / COO',
      departmentDesc: '负责公司日常运营管理，包括运维服务、人力资源与财务行政。下设运维服务部、人力资源部、财务行政部。',
      bio: '孙磊先生拥有18年企业运营管理经验，曾管理超过200人的技术服务团队。',
      children: [
        {
          id: 11,
          name: '运维服务部',
          title: '何志远 / 运维总监',
          bio: '负责7×24小时云平台运维监控、故障处理与性能优化。',
        },
        {
          id: 12,
          name: '人力资源部',
          title: '郑晓燕 / HR总监',
          bio: '负责公司人才招聘、培训发展、薪酬福利与企业文化建设。',
        },
        {
          id: 13,
          name: '财务行政部',
          title: '黄伟明 / 财务总监',
          bio: '负责公司财务管理、预算控制、行政后勤与合规事务。',
        },
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
