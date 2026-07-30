<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { sanitizeHTML } from '@/utils/sanitize'

const content = ref('')

onMounted(async () => {
  try {
    const { fetchCmsPage } = await import('@/api/modules/common')
    const data = await fetchCmsPage('about-profile')
    if (data?.content) content.value = data.content
  } catch { /* fallback to empty */ }
})
</script>

<template>
  <div class="page-about-profile">
    <h2 class="page-title">公司简介</h2>
    <div v-if="content" class="rich-content" v-html="sanitizeHTML(content)" />
    <el-empty v-else description="暂无内容" />
  </div>
</template>
