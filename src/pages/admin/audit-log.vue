<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatDate } from '@/utils/format'
import { fetchAuditLogs } from '@/api/modules/admin/audit-log'
import type { AuditLogItem } from '@/api/modules/admin/audit-log'

const loading = ref(false)
const list = ref<AuditLogItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const keyword = ref('')

onMounted(() => { loadList() })

async function loadList() {
  loading.value = true
  try {
    const res = await fetchAuditLogs({ page: currentPage.value, pageSize: 10, keyword: keyword.value || undefined })
    if (res) { list.value = res.records; total.value = res.total }
  } catch { /* ignore */ }
  loading.value = false
}

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'username', label: '操作人', width: 120 },
  { prop: 'action', label: '操作', width: 100 },
  { prop: 'module', label: '模块', width: 120 },
  { prop: 'detail', label: '详情', minWidth: 200 },
  { prop: 'ip', label: 'IP 地址', width: 140 },
  { prop: 'createTime', label: '操作时间', width: 170 },
]

const actionMap: Record<string, string> = {
  CREATE: '创建',
  UPDATE: '更新',
  DELETE: '删除',
  LOGIN: '登录',
  LOGOUT: '登出',
  PUBLISH: '发布',
  UNPUBLISH: '下架',
}

const actionTypeMap: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'danger',
  LOGIN: 'info',
  LOGOUT: 'info',
  PUBLISH: 'success',
  UNPUBLISH: 'warning',
}

function onSearch() { currentPage.value = 1; loadList() }
function onPageChange() { loadList() }
</script>

<template>
  <div class="admin-crud">
    <h2 style="font-size: var(--font-size-h2); font-weight: 700; margin-bottom: var(--spacing-lg); color: var(--color-text-primary)">
      操作日志
    </h2>

    <div class="admin-crud__toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索操作人/详情..."
        clearable
        style="width: 280px"
        @clear="onSearch"
        @keyup.enter="onSearch"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button style="margin-left: auto" @click="loadList">刷新</el-button>
    </div>

    <el-table :data="list" v-loading="loading" stripe border>
      <el-table-column v-for="col in columns" :key="col.prop" v-bind="col">
        <template v-if="col.prop === 'action'" #default="{ row }">
          <el-tag :type="actionTypeMap[row.action] || 'info'" size="small">
            {{ actionMap[row.action] || row.action }}
          </el-tag>
        </template>
        <template v-else-if="col.prop === 'createTime'" #default="{ row }">
          {{ formatDate(row.createTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="total > 10"
      v-model:current-page="currentPage"
      :total="total"
      :page-size="10"
      layout="total, prev, pager, next"
      style="margin-top: 16px; justify-content: flex-end"
      @change="onPageChange"
    />

    <el-empty v-if="!loading && list.length === 0" description="暂无操作日志" />
  </div>
</template>

<style scoped lang="scss">
.admin-crud {
  &__toolbar {
    display: flex;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }
}
</style>
