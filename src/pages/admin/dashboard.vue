<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stats = ref([
  { label: '新闻总数', value: 128, icon: 'Notebook', color: '#1a5bb3' },
  { label: '产品/服务', value: 36, icon: 'Goods', color: '#00b4d8' },
  { label: '解决方案', value: 24, icon: 'Files', color: '#ff6b35' },
  { label: '待处理咨询', value: 15, icon: 'ChatDotRound', color: '#e74c3c' },
])

const recentConsultations = ref([
  { id: 1, name: '张三', company: '某科技有限公司', phone: '138****5678', time: '2026-07-29 14:30', status: '待处理' },
  { id: 2, name: '李四', company: '某集团', phone: '139****1234', time: '2026-07-29 11:20', status: '已处理' },
  { id: 3, name: '王五', company: '某银行', phone: '137****9876', time: '2026-07-28 16:45', status: '待处理' },
])

onMounted(() => {
  // 实际从 API 获取统计数据
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
        <el-button type="primary" plain @click="$router.push('/admin/news-manage')">
          <el-icon><Plus /></el-icon> 新建新闻
        </el-button>
        <el-button type="success" plain @click="$router.push('/admin/products-manage')">
          <el-icon><Plus /></el-icon> 添加产品
        </el-button>
        <el-button type="warning" plain @click="$router.push('/admin/banners-manage')">
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
        <el-table-column prop="time" label="提交时间" width="160" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '待处理' ? 'warning' : 'success'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default>
            <el-button type="primary" link size="small">查看</el-button>
            <el-button type="danger" link size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-page-title {
  font-size: var(--font-size-h2);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xl);
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);

  @include respond-to(sm) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.dashboard-stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
  }

  &__value {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: 1.2;
  }

  &__label {
    font-size: var(--font-size-small);
    color: var(--color-text-disabled);
  }
}

.dashboard-actions {
  margin-bottom: var(--spacing-xl);

  h3 {
    font-size: var(--font-size-h3);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
}

.dashboard-consultations {
  h3 {
    font-size: var(--font-size-h3);
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
  }
}
</style>
