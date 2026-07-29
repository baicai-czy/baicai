<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const solutionId = computed(() => route.params.id as string)

const breadcrumb = [
  { label: '解决方案', to: '/solutions' },
  { label: '方案详情' },
]
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div class="page-solution-detail">
      <h2 class="page-title">解决方案详情</h2>

      <div class="solution-detail-placeholder">
        <el-icon :size="48"><Document /></el-icon>
        <p>解决方案 ID：{{ solutionId }}</p>
        <p>详细方案内容将通过后台管理系统配置与展示</p>
      </div>

      <!-- 方案内容骨架 -->
      <section class="solution-section">
        <h3>方案概述</h3>
        <p>本方案针对特定行业场景，提供端到端的云计算解决方案，涵盖基础设施、平台服务、安全合规与运维保障等多个维度。</p>
      </section>

      <section class="solution-section">
        <h3>方案架构</h3>
        <div class="solution-architecture">
          <el-icon :size="64"><Picture /></el-icon>
          <p>架构图将通过后台管理系统上传展示</p>
        </div>
      </section>

      <section class="solution-section">
        <h3>方案优势</h3>
        <div class="solution-advantages">
          <div v-for="a in ['安全合规', '弹性扩展', '成本优化', '快速交付']" :key="a" class="solution-adv-item">
            <el-icon><Check /></el-icon>
            <span>{{ a }}</span>
          </div>
        </div>
      </section>

      <div class="solution-cta">
        <el-button type="primary" size="large" @click="$router.push('/contact')">
          申请方案演示
        </el-button>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.page-title {
  font-size: var(--font-size-h2);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xl);
}

.solution-detail-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xl);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.solution-section {
  margin-bottom: var(--spacing-xl);

  h3 {
    font-size: var(--font-size-h3);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 2px solid var(--color-border);
  }

  p {
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
    line-height: 1.8;
  }
}

.solution-architecture {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-2xl);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 2px dashed var(--color-border);
  color: var(--color-text-disabled);
  gap: var(--spacing-md);
}

.solution-advantages {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.solution-adv-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-body);
  font-weight: 500;
  color: var(--color-primary);

  .el-icon {
    color: var(--color-secondary);
  }
}

.solution-cta {
  text-align: center;
  padding: var(--spacing-xl) 0;
}
</style>
