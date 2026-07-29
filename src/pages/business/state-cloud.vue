<script setup lang="ts">
import type { ServiceCardItem } from '@/types/components'

const services: ServiceCardItem[] = [
  {
    id: 1,
    icon: 'Monitor',
    title: '通用计算云',
    description: '提供弹性可扩展的虚拟服务器、对象存储、负载均衡等基础云服务，满足企业常规业务系统的云化部署需求。',
    features: ['弹性伸缩', '多AZ高可用', '按需付费', '99.99% SLA保障'],
    category: 'state-cloud',
  },
  {
    id: 2,
    icon: 'Cpu',
    title: '智算云平台',
    description: '面向AI大模型训练与推理场景，提供高性能GPU集群、分布式存储和高速网络互联的智算基础设施。',
    features: ['NVIDIA GPU集群', '分布式训练', '模型推理优化', 'RDMA高速网络'],
    category: 'state-cloud',
  },
  {
    id: 3,
    icon: 'Monitor',
    title: '行业专属云',
    description: '为政务、金融、医疗等特定行业提供符合监管要求的专属云环境，实现物理隔离与安全合规。',
    features: ['物理隔离', '等保三级', '行业合规', '定制化服务'],
    category: 'state-cloud',
  },
  {
    id: 4,
    icon: 'DataAnalysis',
    title: '数据中台',
    description: '提供数据汇聚、治理、分析与可视化的一站式数据平台，帮助企业释放数据价值。',
    features: ['数据集成', '数据治理', 'BI分析', '数据安全'],
    category: 'state-cloud',
  },
]
</script>

<template>
  <div class="page-state-cloud">
    <h2 class="page-title">国资云服务</h2>
    <p class="page-desc">
      面向国有企业与政府客户，提供安全合规、自主可控的云计算全栈服务。从基础IaaS到行业PaaS，覆盖通算、智算、行业云全场景。
    </p>

    <!-- 服务列表 -->
    <div class="state-cloud-services">
      <div
        v-for="svc in services"
        :key="svc.id"
        class="state-cloud-card"
      >
        <div class="state-cloud-card__icon">
          <el-icon :size="32"><component :is="svc.icon" /></el-icon>
        </div>
        <div class="state-cloud-card__body">
          <h3>{{ svc.title }}</h3>
          <p>{{ svc.description }}</p>
          <ul class="state-cloud-card__features">
            <li v-for="f in svc.features" :key="f">
              <el-icon><Check /></el-icon>
              {{ f }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 优势区域 -->
    <section class="state-cloud-advantages">
      <h3>为什么选择城际云国资云？</h3>
      <div class="state-cloud-advantages__grid">
        <div v-for="adv in advantages" :key="adv.title" class="state-cloud-adv-card">
          <h4>{{ adv.title }}</h4>
          <p>{{ adv.desc }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
const advantages = [
  { title: '安全合规', desc: '等保三级认证，满足国资监管要求，数据不出境，全程可审计' },
  { title: '自主可控', desc: '基于国产化技术栈建设，支持信创环境部署，核心组件自主研发' },
  { title: '深耕行业', desc: '具备政务、金融、医疗等行业Know-How，提供场景化解决方案' },
  { title: '贴身服务', desc: '本地化服务团队，7×24小时运维保障，15分钟响应机制' },
]
</script>

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

.state-cloud-services {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.state-cloud-card {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: var(--color-card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-base) ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &__icon {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(26, 91, 179, 0.08);
    border-radius: var(--radius-md);
    color: var(--color-primary);
  }

  &__body {
    flex: 1;

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

.state-cloud-advantages {
  h3 {
    font-size: var(--font-size-h3);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-lg);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-md);

    @include respond-to(sm) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.state-cloud-adv-card {
  padding: var(--spacing-lg);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-primary);

  h4 {
    font-size: var(--font-size-body);
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: var(--spacing-xs);
  }

  p {
    font-size: var(--font-size-body);
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
}
</style>
