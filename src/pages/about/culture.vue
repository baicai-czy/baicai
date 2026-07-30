<script setup lang="ts">
import { ref, onMounted } from 'vue'

const meta = ref<Record<string,any>>({})

onMounted(async () => {
  try {
    const { fetchCmsPage } = await import('@/api/modules/common')
    const data = await fetchCmsPage('about-culture')
    if (data?.meta) meta.value = data.meta
  } catch { /* fallback */ }
})
</script>

<template>
  <div class="page-culture">
    <h2 class="page-title">企业文化</h2>
    <div class="culture-cards">
      <div class="culture-card">
        <div class="culture-card__icon"><el-icon :size="36"><Aim /></el-icon></div>
        <h3>企业使命</h3>
        <p>{{ meta.mission || '以领先的云计算技术赋能千行百业' }}</p>
      </div>
      <div class="culture-card">
        <div class="culture-card__icon"><el-icon :size="36"><Flag /></el-icon></div>
        <h3>企业愿景</h3>
        <p>{{ meta.vision || '成为最懂行业的云服务公司' }}</p>
      </div>
      <div class="culture-card">
        <div class="culture-card__icon"><el-icon :size="36"><Star /></el-icon></div>
        <h3>核心价值观</h3>
        <p>{{ meta.values || '自主可控 · 集约高效 · 安全可靠' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-title { font-size: var(--font-size-h2); font-weight: 700; margin-bottom: var(--spacing-xl); text-align: center; }
.culture-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--spacing-xl); @media(max-width:768px){grid-template-columns:1fr} }
.culture-card { text-align: center; padding: var(--spacing-2xl) var(--spacing-lg); background: var(--color-card-bg); border-radius: var(--radius-md); box-shadow: var(--shadow-card);
  &__icon { width: 72px; height: 72px; border-radius: 50%; background: rgba(26,91,179,.08); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-md); color: var(--color-primary); }
  h3 { font-size: 20px; font-weight: 700; margin-bottom: var(--spacing-sm); color: var(--color-text-primary); }
  p { font-size: 15px; line-height: 1.8; color: var(--color-text-secondary); }
}
</style>
