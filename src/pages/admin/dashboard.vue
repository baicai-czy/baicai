<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as contactApi from '@/api/modules/admin/contacts'
import * as newsApi from '@/api/modules/admin/news'
import * as productApi from '@/api/modules/admin/products'
import * as solutionApi from '@/api/modules/admin/solutions'
import type { ContactRecord } from '@/api/modules/admin/contacts'

const router = useRouter()

const stats = ref([
  { label: '新闻总数', value: 0, icon: 'Notebook', color: '#1a5bb3' },
  { label: '产品/服务', value: 0, icon: 'Goods', color: '#00b4d8' },
  { label: '解决方案', value: 0, icon: 'Files', color: '#ff6b35' },
  { label: '待处理咨询', value: 0, icon: 'ChatDotRound', color: '#e74c3c' },
])

const recentConsultations = ref<ContactRecord[]>([])

onMounted(async () => {
  // 并行加载统计数据
  const [newsRes, prodList, solList, contactRes] = await Promise.all([
    newsApi.fetchNewsList({ page: 1, pageSize: 1 }).catch(() => null),
    productApi.fetchProducts().catch(() => null),
    solutionApi.fetchSolutions().catch(() => null),
    contactApi.fetchContacts({ page: 1, pageSize: 5 }).catch(() => null),
  ])
  stats.value[0].value = newsRes?.total || 0
  stats.value[1].value = prodList?.length || 0
  stats.value[2].value = solList?.length || 0
  stats.value[3].value = contactRes?.total || 0
  if (contactRes) recentConsultations.value = contactRes.records
})
</script>

<template>
  <div class="admin-dashboard">
    <h2 class="admin-page-title">仪表盘</h2>

    <!-- 统计卡片 -->
    <div class="dashboard-stats">
      <div v-for="stat in stats" :key="stat.label" class="dashboard-stat-card">
        <div class="dashboard-stat-card__icon" :style="{ background: stat.color }">
          <el-icon :size="24" color="#fff"><component :is="stat.icon" /></el-icon>
        </div>
        <div class="dashboard-stat-card__body">
          <span class="dashboard-stat-card__value">{{ stat.value }}</span>
          <span class="dashboard-stat-card__label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="dashboard-actions">
      <h3>快捷操作</h3>
      <div class="dashboard-actions__grid">
        <el-button type="primary" plain @click="router.push('/admin/news-manage')">
          <el-icon><Plus /></el-icon> 新建新闻
        </el-button>
        <el-button type="success" plain @click="router.push('/admin/products-manage')">
          <el-icon><Plus /></el-icon> 添加产品
        </el-button>
        <el-button type="warning" plain @click="router.push('/admin/banners-manage')">
          <el-icon><Plus /></el-icon> 上传 Banner
        </el-button>
      </div>
    </div>

    <!-- 最新咨询 -->
    <div class="dashboard-consultations">
      <h3>最新咨询</h3>
      <el-table :data="recentConsultations" stripe style="width: 100%">
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="company" label="公司" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="createdAt" label="提交时间" width="160">
          <template #default="{ row }">
            {{ row.createdAt ? new Date(row.createdAt).toLocaleString() : '' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template #default>
            <el-button type="primary" link size="small" @click="router.push('/admin/contacts-manage')">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-page-title {
  font-size: var(--font-size-h2); font-weight: 700;
  color: var(--color-text-primary); margin-bottom: var(--spacing-xl);
}

.dashboard-stats {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md); margin-bottom: var(--spacing-xl);
  @include respond-to(sm) { grid-template-columns: repeat(4, 1fr); }
}

.dashboard-stat-card {
  display: flex; align-items: center; gap: var(--spacing-md);
  padding: var(--spacing-lg); background: var(--color-card-bg);
  border-radius: var(--radius-md); box-shadow: var(--shadow-card);
  &__icon {
    width: 48px; height: 48px; border-radius: var(--radius-md);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  &__body { display: flex; flex-direction: column; }
  &__value { font-size: 24px; font-weight: 700; color: var(--color-text-primary); line-height: 1.2; }
  &__label { font-size: var(--font-size-small); color: var(--color-text-disabled); }
}

.dashboard-actions {
  margin-bottom: var(--spacing-xl);
  h3 { font-size: var(--font-size-h3); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--spacing-md); }
  &__grid { display: flex; flex-wrap: wrap; gap: var(--spacing-md); }
}

.dashboard-consultations {
  h3 { font-size: var(--font-size-h3); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--spacing-md); }
}
</style>
