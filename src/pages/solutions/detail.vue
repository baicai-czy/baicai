<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { sanitizeHTML } from '@/utils/sanitize'
import type { SolutionItem } from '@/types/components'

const route = useRoute()
const solutionId = computed(() => route.params.id as string)
const loading = ref(true)
const solution = ref<SolutionItem | null>(null)

const breadcrumb = [{ label: '解决方案', to: '/solutions' }, { label: '方案详情' }]

async function loadData(id: string) {
  loading.value = true
  try {
    const { fetchSolutionById } = await import('@/api/modules/solutions')
    const data = await fetchSolutionById(Number(id))
    if (data) solution.value = data as SolutionItem
  } catch { /* ignore */ }
  loading.value = false
}

onMounted(() => { loadData(solutionId.value) })
watch(solutionId, (id) => { loadData(id) })
</script>

<template>
  <AppLayout :breadcrumb="breadcrumb">
    <div v-if="loading" style="padding: 40px; text-align:center">
      <el-skeleton :rows="6" animated />
    </div>

    <template v-else-if="solution">
      <h2 class="page-title">{{ solution.title }}</h2>

      <section class="solution-section" v-if="solution.targetCustomer">
        <h3>目标客户</h3>
        <p>{{ solution.targetCustomer }}</p>
      </section>

      <section class="solution-section" v-if="solution.description">
        <h3>方案概述</h3>
        <p>{{ solution.description }}</p>
      </section>

      <section class="solution-section" v-if="solution.detail">
        <h3>方案详情</h3>
        <div class="solution-detail-content rich-content" v-html="sanitizeHTML(solution.detail)" />
      </section>

      <div class="solution-cta">
        <el-button type="primary" size="large" @click="$router.push('/contact')">申请方案演示</el-button>
      </div>
    </template>

    <el-empty v-else description="解决方案不存在" />
  </AppLayout>
</template>

<style scoped lang="scss">
.page-title { font-size: var(--font-size-h2); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--spacing-xl); }

.solution-section { margin-bottom: var(--spacing-xl);
  h3 { font-size: var(--font-size-h3); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--spacing-md); padding-bottom: var(--spacing-sm); border-bottom: 2px solid var(--color-border); }
  p { font-size: var(--font-size-body); color: var(--color-text-secondary); line-height: 1.8; }
}

.solution-detail-content { font-size: var(--font-size-body); line-height: 1.8; color: var(--color-text-primary);
  :deep(h2) { font-size: var(--font-size-h3); font-weight: 600; margin: var(--spacing-lg) 0 var(--spacing-md); }
  :deep(h3) { font-size: var(--font-size-body); font-weight: 600; margin: var(--spacing-md) 0 var(--spacing-sm); }
  :deep(p) { margin-bottom: var(--spacing-md); }
  :deep(ul) { padding-left: var(--spacing-lg); margin-bottom: var(--spacing-md); list-style: disc; }
  :deep(li) { margin-bottom: var(--spacing-xs); }
}

.solution-cta { text-align: center; padding: var(--spacing-xl) 0; }
</style>
