<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface OrgNode { id: number; name: string; title?: string; children?: OrgNode[] }

const orgData = ref<OrgNode | null>(null)

onMounted(async () => {
  try {
    const { fetchCmsPage } = await import('@/api/modules/common')
    const data = await fetchCmsPage('about-structure')
    if (data?.meta?.tree?.[0]) orgData.value = data.meta.tree[0]
  } catch { /* fallback */ }
})
</script>

<template>
  <div class="page-structure">
    <h2 class="page-title">组织架构</h2>
    <p class="page-desc">高效协同，专业分工</p>

    <div v-if="orgData" class="org-tree">
      <div class="org-node org-root">
        <div class="org-node__card">{{ orgData.name }}</div>
        <div v-if="orgData.children" class="org-children">
          <div v-for="child in orgData.children" :key="child.name" class="org-node">
            <div class="org-node__card">{{ typeof child === 'string' ? child : child.name }}</div>
            <div v-if="typeof child !== 'string' && child.children" class="org-children">
              <div v-for="grand in child.children" :key="typeof grand === 'string' ? grand : grand.name" class="org-node" style="flex:1">
                <div class="org-node__card org-node__card--leaf">{{ typeof grand === 'string' ? grand : grand.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无数据" />
  </div>
</template>

<style scoped>
.page-title { font-size: var(--font-size-h2); font-weight: 700; text-align: center; margin-bottom: var(--spacing-sm); }
.page-desc { text-align: center; color: var(--color-text-secondary); margin-bottom: var(--spacing-xl); }
.org-tree { display: flex; justify-content: center; padding: var(--spacing-xl) 0; }
.org-root { text-align: center; }
.org-node__card { display: inline-block; padding: 10px 20px; background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 8px; font-weight: 600; font-size: 15px; margin: 6px; box-shadow: var(--shadow-card); }
.org-node__card--leaf { background: var(--color-bg); font-weight: 400; font-size: 14px; }
.org-children { display: flex; justify-content: center; gap: 8px; margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--color-border); position: relative; flex-wrap: wrap; }
</style>
