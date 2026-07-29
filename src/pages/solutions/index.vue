<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import SolutionCard from '@/components/business/SolutionCard.vue'
import type { SolutionItem } from '@/types/components'

const breadcrumb = [{ label: '解决方案' }]
const loading = ref(true)
const solutions = ref<SolutionItem[]>([])

onMounted(async () => {
  try {
    const { fetchSolutions } = await import('@/api/modules/solutions')
    const data = await fetchSolutions()
    if (Array.isArray(data)) solutions.value = data
  } catch { /* ignore */ }
  loading.value = false
})
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div class="page-solutions">
      <h2 class="page-title">解决方案</h2>
      <p class="page-desc">深耕行业场景，提供端到端的定制化云解决方案</p>

      <div v-if="loading" style="text-align:center; padding: 40px;"><el-icon class="is-loading" :size="32"><Loading /></el-icon></div>

      <div v-else class="page-solutions__grid">
        <SolutionCard v-for="sol in solutions" :key="sol.id" :item="sol" />
      </div>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.page-title { font-size: var(--font-size-h2); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--spacing-sm); }
.page-desc { font-size: var(--font-size-body); color: var(--color-text-secondary); margin-bottom: var(--spacing-xl); }

.page-solutions {
  &__grid { display: grid; grid-template-columns: 1fr; gap: var(--spacing-lg);
    @include respond-to(sm) { grid-template-columns: repeat(2, 1fr); }
    @include respond-to(md) { grid-template-columns: repeat(3, 1fr); }
  }
}
</style>
