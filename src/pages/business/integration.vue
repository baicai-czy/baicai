<script setup lang="ts">
import type { ServiceCardItem } from '@/types/components'

const phases: ServiceCardItem[] = [
  {
    id: 1,
    icon: 'EditPen',
    title: '咨询规划',
    description: '深入调研客户业务需求与IT现状，制定科学合理的云平台建设规划与迁移策略。',
    features: ['需求调研', '架构设计', '可行性分析', 'TCO评估'],
  },
  {
    id: 2,
    icon: 'Setting',
    title: '建设部署',
    description: '基于成熟的交付方法论，完成云平台的建设、配置、集成与测试验收。',
    features: ['平台搭建', '网络规划', '安全配置', '性能调优'],
  },
  {
    id: 3,
    icon: 'Connection',
    title: '迁移实施',
    description: '提供业务系统从传统架构到云平台的平滑迁移服务，保障业务连续性。',
    features: ['迁移评估', '数据迁移', '应用改造', '业务切换'],
  },
  {
    id: 4,
    icon: 'Service',
    title: '运维管理',
    description: '7×24小时云平台运维服务，涵盖监控告警、故障处理、容量管理与安全运维。',
    features: ['实时监控', '故障处理', '安全运维', '性能优化'],
  },
]
</script>

<template>
  <div class="page-integration">
    <h2 class="page-title">云和智算集成</h2>
    <p class="page-desc">
      提供覆盖云平台全生命周期的集成服务，从咨询规划、建设部署到迁移实施与运维管理，为客户打造端到端的一站式云计算解决方案。
    </p>

    <!-- 服务流程 -->
    <div class="integration-flow">
      <div
        v-for="(phase, idx) in phases"
        :key="phase.id"
        class="integration-card"
      >
        <div class="integration-card__step">
          <span class="integration-card__step-num">{{ idx + 1 }}</span>
          <span v-if="idx < phases.length - 1" class="integration-card__step-line" />
        </div>
        <div class="integration-card__body">
          <div class="integration-card__icon">
            <el-icon :size="28"><component :is="phase.icon" /></el-icon>
          </div>
          <h3>{{ phase.title }}</h3>
          <p>{{ phase.description }}</p>
          <ul class="integration-card__features">
            <li v-for="f in phase.features" :key="f">
              <el-icon><Check /></el-icon>
              {{ f }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="integration-cta">
      <h3>需要专业的技术服务？</h3>
      <p>立即联系我们的技术专家，获取定制化方案</p>
      <el-button type="primary" size="large" @click="$router.push('/contact')">
        联系我们
        <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>
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
  line-height: 1.8;
  margin-bottom: var(--spacing-xl);
}

.integration-flow {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: var(--spacing-2xl);
}

.integration-card {
  display: flex;
  gap: var(--spacing-lg);

  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 40px;

    &-num {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-primary);
      color: #ffffff;
      font-weight: 700;
      font-size: var(--font-size-body);
      flex-shrink: 0;
    }

    &-line {
      width: 2px;
      flex: 1;
      min-height: 40px;
      background: var(--color-border);
      margin: var(--spacing-xs) 0;
    }
  }

  &__body {
    flex: 1;
    padding: var(--spacing-lg);
    padding-top: 0;
    padding-bottom: var(--spacing-xl);
    background: var(--color-card-bg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    margin-bottom: var(--spacing-md);

    h3 {
      font-size: var(--font-size-h3);
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-sm);
    }

    p {
      font-size: var(--font-size-body);
      color: var(--color-text-secondary);
      line-height: 1.7;
      margin-bottom: var(--spacing-md);
    }
  }

  &__icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(26, 91, 179, 0.08);
    border-radius: var(--radius-md);
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }

  &__features {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: var(--font-size-small);
      color: var(--color-text-secondary);

      .el-icon {
        color: var(--color-secondary);
      }
    }
  }
}

.integration-cta {
  text-align: center;
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, rgba(26, 91, 179, 0.04), rgba(0, 180, 216, 0.04));
  border-radius: var(--radius-md);

  h3 {
    font-size: var(--font-size-h3);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
  }

  p {
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
  }
}
</style>
