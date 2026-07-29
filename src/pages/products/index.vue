<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ServiceCard from '@/components/business/ServiceCard.vue'
import SearchBox from '@/components/common/SearchBox.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import type { ServiceCardItem } from '@/types/components'

const breadcrumb = [{ label: '产品与服务' }]

const loading = ref(true)
const keyword = ref('')
const products = ref<ServiceCardItem[]>([])

const groupedProducts = computed(() => {
  const groups: Record<string, ServiceCardItem[]> = {}
  products.value.forEach((p) => {
    const cat = p.category || 'other'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(p)
  })
  return groups
})

const categoryLabels: Record<string, string> = {
  compute: '通算服务', ai: '智算服务', integration: '云集成服务', ops: '运维服务',
  cloud: '云服务', data: '数据服务', gov: '政务产品', test: '测试',
}

onMounted(async () => {
  try {
    const { fetchProducts } = await import('@/api/modules/products')
    const data = await fetchProducts({ page: 1, pageSize: 50 })
    // 拦截器已剥壳，data 可能是 { records } 或直接数组
    if (data) {
      products.value = (data as any).records || (Array.isArray(data) ? data : [])
    }
  } catch { /* ignore */ }
  loading.value = false
})

async function onSearch(val: string) {
  keyword.value = val
  loading.value = true
  try {
    const { fetchProducts } = await import('@/api/modules/products')
    const data = await fetchProducts({ page: 1, pageSize: 50, keyword: val })
    if (data) {
      products.value = (data as any).records || (Array.isArray(data) ? data : [])
    }
  } catch { /* ignore */ }
  loading.value = false
}
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div class="page-products">
      <h2 class="page-title">产品与服务</h2>
      <p class="page-desc">覆盖 IaaS / PaaS / SaaS 全栈云服务</p>

      <div class="page-products__toolbar">
        <SearchBox v-model="keyword" placeholder="搜索产品..." @search="onSearch" />
      </div>

      <Skeleton v-if="loading" :count="6" card />

      <div v-else class="page-products__list">
        <template v-for="(items, cat) in groupedProducts" :key="cat">
          <h3 class="page-products__category">{{ categoryLabels[cat] || cat }}</h3>
          <div class="page-products__grid">
            <ServiceCard v-for="p in items" :key="p.id" :item="p" />
          </div>
        </template>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.page-title { font-size: var(--font-size-h2); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--spacing-sm); }
.page-desc { font-size: var(--font-size-body); color: var(--color-text-secondary); margin-bottom: var(--spacing-xl); }

.page-products {
  &__list { display: flex; flex-direction: column; gap: var(--spacing-2xl); }
  &__category { font-size: var(--font-size-h3); font-weight: 700; color: var(--color-text-primary); padding-bottom: var(--spacing-sm); border-bottom: 2px solid var(--color-border); margin: 0; }
  &__toolbar { display: flex; justify-content: flex-end; margin-bottom: var(--spacing-lg); }
  &__grid { display: grid; grid-template-columns: 1fr; gap: var(--spacing-lg);
    @include respond-to(sm) { grid-template-columns: repeat(2, 1fr); }
    @include respond-to(md) { grid-template-columns: repeat(3, 1fr); }
  }
}
</style>
