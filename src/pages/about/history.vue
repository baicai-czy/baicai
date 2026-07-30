<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Timeline from '@/components/common/Timeline.vue'
import type { TimelineNode } from '@/types/components'

const milestones = ref<TimelineNode[]>([])

onMounted(async () => {
  try {
    const { fetchTimeline } = await import('@/api/modules/common')
    const data = await fetchTimeline()
    if (Array.isArray(data)) milestones.value = data
  } catch { /* fallback */ }
})
</script>

<template>
  <div class="page-history">
    <h2 class="page-title">发展历程</h2>
    <p class="page-desc">砥砺前行，铸就辉煌</p>
    <Timeline v-if="milestones.length" :items="milestones" />
    <el-empty v-else description="暂无数据" />
  </div>
</template>
