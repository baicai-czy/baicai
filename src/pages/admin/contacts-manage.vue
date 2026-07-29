<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/format'

const loading = ref(false)
const list = ref<any[]>([])
const detailVisible = ref(false)
const detailItem = ref<any>(null)

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'name', label: '姓名', width: 100 },
  { prop: 'company', label: '公司', minWidth: 180 },
  { prop: 'phone', label: '电话', width: 130 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'type', label: '类型', width: 100 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'createTime', label: '提交时间', width: 160 },
]

function viewDetail(item: any) {
  detailItem.value = item
  detailVisible.value = true
}
function markProcessed(item: any) {
  item.status = '已处理'
  ElMessage.success('已标记为已处理')
}
async function handleDelete(item: any) {
  await ElMessageBox.confirm(`确定删除"${item.name}"的咨询记录？`, '确认删除', { type: 'warning' })
  ElMessage.success('已删除')
}
</script>

<template>
  <div class="admin-crud">
    <h2 style="font-size: var(--font-size-h2); font-weight: 700; margin-bottom: var(--spacing-lg); color: var(--color-text-primary)">
      咨询管理
    </h2>

    <el-table :data="list" v-loading="loading" stripe border>
      <el-table-column v-for="col in columns" :key="col.prop" v-bind="col">
        <template v-if="col.prop === 'status'" #default="{ row }">
          <el-tag :type="row.status === '待处理' ? 'warning' : 'success'" size="small">{{ row.status }}</el-tag>
        </template>
        <template v-else-if="col.prop === 'type'" #default="{ row }">
          <el-tag size="small">{{ row.type || '在线咨询' }}</el-tag>
        </template>
        <template v-else-if="col.prop === 'createTime'" #default="{ row }">
          {{ formatDate(row.createTime, 'YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="viewDetail(row)">查看</el-button>
          <el-button
            v-if="row.status !== '已处理'"
            type="success"
            link
            size="small"
            @click="markProcessed(row)"
          >
            标记已处理
          </el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="咨询详情" width="600px">
      <template v-if="detailItem">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="姓名">{{ detailItem.name }}</el-descriptions-item>
          <el-descriptions-item label="公司">{{ detailItem.company }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ detailItem.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ detailItem.email }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ detailItem.type || '在线咨询' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="detailItem.status === '待处理' ? 'warning' : 'success'" size="small">
              {{ detailItem.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="描述">{{ detailItem.description }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">
            {{ formatDate(detailItem.createTime, 'YYYY-MM-DD HH:mm:ss') }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>
