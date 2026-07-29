<script setup lang="ts">
import Timeline from '@/components/common/Timeline.vue'
import type { TimelineNode } from '@/types/components'

/** 发展历程数据（实际从 API 获取） */
const milestones: TimelineNode[] = [
  { id: 1, year: '2010', month: '', title: '公司成立', description: '城际云科技有限公司在江苏正式注册成立，初始团队15人，专注于云计算技术研发。' },
  { id: 2, year: '2012', month: '', title: '首个云平台上线', description: '自主知识产权的云计算平台V1.0正式发布，获得首批3家政企客户。' },
  { id: 3, year: '2014', month: '', title: '通过等保三级认证', description: '平台通过国家信息安全等级保护三级认证，安全能力得到权威认可。' },
  { id: 4, year: '2016', month: '', title: '国资云业务突破', description: '成功中标省内首个国资云项目，服务国企数字化转型，团队突破100人。' },
  { id: 5, year: '2018', month: '', title: '布局智算业务', description: '启动智算中心建设，引进GPU集群，正式进入AI算力服务领域。' },
  { id: 6, year: '2020', month: '', title: '服务客户超500家', description: '累计服务企业客户突破500家，成为区域领先的云服务提供商。' },
  { id: 7, year: '2023', month: '', title: '新一代平台发布', description: '发布CloudMatrix 3.0平台，全面支持混合云、多云管理与AI算力调度。' },
  { id: 8, year: '2025', month: '', title: '战略升级', description: '完成战略融资，加速全国市场布局，打造行业云服务标杆。' },
]
</script>

<template>
  <div class="page-history">
    <h2 class="page-title">发展历程</h2>
    <p class="page-desc">十余年深耕，持续创新，与客户共同成长</p>
    <Timeline :items="milestones" />
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
