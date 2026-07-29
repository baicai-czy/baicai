<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const productType = computed(() => route.params.type as string)

const breadcrumb = [
  { label: '产品与服务', to: '/products' },
  { label: '产品详情' },
]

const productTypeMap: Record<string, { title: string; desc: string }> = {
  compute: { title: '通算云服务器', desc: '弹性可扩展的虚拟服务器' },
  ai: { title: 'GPU智算实例', desc: '高性能GPU计算实例' },
  storage: { title: '对象存储', desc: '海量安全云端存储' },
  lb: { title: '负载均衡', desc: '流量分发与高可用' },
  security: { title: '云安全', desc: '多层次安全防护' },
  bigdata: { title: '大数据平台', desc: '一站式数据处理分析' },
  maintenance: { title: '运维服务', desc: '7×24专业运维保障' },
  integration: { title: '系统集成', desc: '全生命周期云集成' },
}

const info = computed(() => {
  return productTypeMap[productType.value] || { title: '产品详情', desc: '' }
})
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div class="page-product-detail">
      <h2 class="page-title">{{ info.title }}</h2>
      <p class="page-desc">{{ info.desc }}</p>

      <div class="product-detail-banner">
        <el-icon :size="64"><Monitor /></el-icon>
        <p>详细的产品介绍页面将通过后台管理系统配置</p>
      </div>

      <!-- 产品特性（示意） -->
      <section class="product-features">
        <h3>产品特性</h3>
        <div class="product-features__grid">
          <div v-for="i in 4" :key="i" class="product-feature-card">
            <h4>特性 {{ i }}</h4>
            <p>产品特性的详细描述将通过后台内容管理系统进行配置和维护。</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <div class="product-cta">
        <h3>对该产品感兴趣？</h3>
        <p>联系我们获取更详尽的产品资料与技术方案</p>
        <el-button type="primary" size="large" @click="$router.push('/contact')">
          立即咨询
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
  margin-bottom: var(--spacing-sm);
}
.page-desc {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

.product-detail-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 2px dashed var(--color-border);
  color: var(--color-text-disabled);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
}

.product-features {
  margin-bottom: var(--spacing-2xl);

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

.product-feature-card {
  padding: var(--spacing-lg);
  background: var(--color-card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);

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

.product-cta {
  text-align: center;
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, rgba(26, 91, 179, 0.04), rgba(0, 180, 216, 0.04));
  border-radius: var(--radius-md);

  h3 { font-size: var(--font-size-h3); font-weight: 600; margin-bottom: var(--spacing-sm); }
  p { color: var(--color-text-secondary); margin-bottom: var(--spacing-lg); }
}
</style>
