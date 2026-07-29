<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/format'
import * as contactApi from '@/api/modules/admin/contacts'
import type { ContactRecord } from '@/api/modules/admin/contacts'

const loading = ref(false)
const list = ref<ContactRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const detailVisible = ref(false)
const detailItem = ref<ContactRecord | null>(null)

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'name', label: '姓名', width: 100 },
  { prop: 'company', label: '公司', minWidth: 180 },
  { prop: 'phone', label: '电话', width: 130 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'type', label: '类型', width: 110 },
  { prop: 'createdAt', label: '提交时间', width: 160 },
]

onMounted(() => { loadList() })

async function loadList() {
  loading.value = true
  try {
    const res = await contactApi.fetchContacts({ page: currentPage.value, pageSize: 10 })
    if (res) { list.value = res.records; total.value = res.total }
  } catch { /* ignore */ }
  loading.value = false
}

function viewDetail(item: ContactRecord) {
  detailItem.value = item
  detailVisible.value = true
}

async function handleDelete(item: ContactRecord) {
  try {
    await ElMessageBox.confirm(`确定删除"${item.name}"的咨询记录？`, '确认删除', { type: 'warning' })
    await contactApi.deleteContact(item.id)
    ElMessage.success('已删除'); loadList()
  } catch { /* 取消或失败 */ }
}

function typeLabel(t: string) {
  return t === 'service-request' ? '服务申请' : '在线咨询'
}
</script>

<template>
  <div class="admin-crud">
    <h2 style="font-size: var(--font-size-h2); font-weight: 700; margin-bottom: var(--spacing-lg); color: var(--color-text-primary)">
      咨询管理
    </h2>

    <el-table :data="list" v-loading="loading" stripe border>
      <el-table-column v-for="col in columns" :key="col.prop" v-bind="col">
        <template v-if="col.prop === 'type'" #default="{ row }">
          <el-tag :type="row.type === 'service-request' ? 'warning' : 'info'" size="small">
            {{ typeLabel(row.type) }}
          </el-tag>
        </template>
        <template v-else-if="col.prop === 'createdAt'" #default="{ row }">
          {{ formatDate(row.createdAt, 'YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="viewDetail(row)">查看</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="total > 10" v-model:current-page="currentPage" :total="total" :page-size="10"
      layout="total, prev, pager, next" style="margin-top: 16px; justify-content: flex-end" @change="loadList"
    />

    <el-dialog v-model="detailVisible" title="咨询详情" width="600px">
      <template v-if="detailItem">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="姓名">{{ detailItem.name }}</el-descriptions-item>
          <el-descriptions-item label="公司">{{ detailItem.company }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ detailItem.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ detailItem.email }}</el-descriptions-item>
          <el-descriptions-item label="类型">
            <el-tag :type="detailItem.type === 'service-request' ? 'warning' : 'info'" size="small">
              {{ typeLabel(detailItem.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="描述">{{ detailItem.description }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">
            {{ formatDate(detailItem.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>
