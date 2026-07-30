<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HonorWall from '@/components/common/HonorWall.vue'
import type { HonorItem } from '@/types/components'

const honors = ref<HonorItem[]>([])

onMounted(async () => {
  try {
    const { fetchHonors } = await import('@/api/modules/common')
    const data = await fetchHonors()
    if (Array.isArray(data)) honors.value = data
  } catch { /* fallback */ }
})
</script>

<template>
  <div class="page-honors">
    <h2 class="page-title">资质荣誉</h2>
    <p class="page-desc">权威认证，专业实力，值得信赖</p>
    <HonorWall v-if="honors.length" :items="honors" />
    <el-empty v-else description="暂无数据" />
  </div>
</template>

<style scoped>
.page-title { font-size: var(--font-size-h2); font-weight: 700; text-align: center; margin-bottom: var(--spacing-sm); }
.page-desc { text-align: center; color: var(--color-text-secondary); margin-bottom: var(--spacing-xl); }
</style>
