<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import type { ServiceCardItem } from '@/types/components'

const route = useRoute()
const productType = computed(() => route.params.type as string)
const loading = ref(true)
const product = ref<ServiceCardItem | null>(null)
const products = ref<ServiceCardItem[]>([])

const breadcrumb = [{ label: '产品与服务', to: '/products' }, { label: '产品详情' }]

onMounted(async () => {
  try {
    const { fetchProductByType } = await import('@/api/modules/products')
    const data = await fetchProductByType(productType.value)
    if (Array.isArray(data) && data.length > 0) {
      product.value = data[0]
    }
    // 同时拉推荐列表
    const { fetchProducts } = await import('@/api/modules/products')
    const list = await fetchProducts({ page: 1, pageSize: 4 })
    if (list) {
      products.value = (list as any).records?.slice(0, 4) || (Array.isArray(list) ? list.slice(0, 4) : [])
    }
  } catch { /* ignore */ }
  loading.value = false
})
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div v-if="loading" style="padding: 40px; text-align:center">
      <el-skeleton :rows="6" animated />
    </div>

    <template v-else-if="product">
      <h2 class="page-title">{{ product.title }}</h2>
      <p class="page-desc">{{ product.description }}</p>

      <section class="product-features" v-if="product.features?.length">
        <h3>产品特性</h3>
        <div class="product-features__grid">
          <div v-for="(feat, i) in product.features" :key="i" class="product-feature-card">
            <h4>{{ feat }}</h4>
          </div>
        </div>
      </section>

      <section class="product-related" v-if="products.length > 1">
        <h3>更多产品</h3>
        <div class="product-related__grid">
          <div v-for="p in products.filter(p => p.id !== product.id).slice(0,3)" :key="p.id" class="product-related__card"
               @click="$router.push(`/products/${p.category || 'detail'}`)">
            <h4>{{ p.title }}</h4>
            <p>{{ p.description }}</p>
          </div>
        </div>
      </section>

      <div class="product-cta">
        <h3>对该产品感兴趣？</h3>
        <p>联系我们获取更详尽的产品资料与技术方案</p>
        <el-button type="primary" size="large" @click="$router.push('/contact')">立即咨询</el-button>
      </div>
    </template>

    <el-empty v-else description="产品不存在" />
  </AppLayout>
</template>

<style scoped lang="scss">
.page-title { font-size: var(--font-size-h2); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--spacing-sm); }
.page-desc { font-size: var(--font-size-body); color: var(--color-text-secondary); margin-bottom: var(--spacing-xl); }

.product-features { margin-bottom: var(--spacing-2xl);
  h3 { font-size: var(--font-size-h3); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--spacing-lg); }
  &__grid { display: grid; grid-template-columns: 1fr; gap: var(--spacing-md);
    @include respond-to(sm) { grid-template-columns: repeat(2, 1fr); }
  }
}
.product-feature-card {
  padding: var(--spacing-lg); background: var(--color-card-bg); border-radius: var(--radius-md); box-shadow: var(--shadow-card);
  h4 { font-size: var(--font-size-body); font-weight: 600; color: var(--color-primary); margin-bottom: var(--spacing-xs); }
}

.product-related { margin-bottom: var(--spacing-2xl);
  h3 { font-size: var(--font-size-h3); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--spacing-md); }
  &__grid { display: grid; grid-template-columns: 1fr; gap: var(--spacing-md);
    @include respond-to(sm) { grid-template-columns: repeat(3, 1fr); }
  }
  &__card { padding: var(--spacing-md); background: var(--color-bg); border-radius: var(--radius-sm); cursor: pointer; transition: box-shadow var(--transition-fast) ease;
    &:hover { box-shadow: var(--shadow-card); }
    h4 { font-size: var(--font-size-body); font-weight: 600; margin-bottom: var(--spacing-xs); }
    p { font-size: var(--font-size-small); color: var(--color-text-secondary); @include text-clamp(2); }
  }
}

.product-cta { text-align: center; padding: var(--spacing-2xl); background: linear-gradient(135deg, rgba(26,91,179,0.04), rgba(0,180,216,0.04)); border-radius: var(--radius-md);
  h3 { font-size: var(--font-size-h3); font-weight: 600; margin-bottom: var(--spacing-sm); }
  p { color: var(--color-text-secondary); margin-bottom: var(--spacing-lg); }
}
</style>
