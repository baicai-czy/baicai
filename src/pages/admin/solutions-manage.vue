<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { SolutionItem } from '@/types/components'
import * as solutionApi from '@/api/modules/admin/solutions'

const loading = ref(false)
const list = ref<SolutionItem[]>([])
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const defaultForm = () => ({ title: '', targetCustomer: '', description: '', imageUrl: '' } as Partial<SolutionItem>)
const form = ref<Partial<SolutionItem>>(defaultForm())

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'title', label: '方案名称', minWidth: 200 },
  { prop: 'targetCustomer', label: '目标客户', width: 120 },
  { prop: 'description', label: '描述', minWidth: 250 },
]

onMounted(() => { loadList() })

async function loadList() {
  loading.value = true
  try { list.value = await solutionApi.fetchSolutions() || [] } catch { /* ignore */ }
  loading.value = false
}

function openDialog(item?: SolutionItem) {
  isEditing.value = !!item
  form.value = item ? { ...item } : defaultForm()
  dialogVisible.value = true
}
function closeDialog() { dialogVisible.value = false }

async function onSubmit() {
  if (!form.value.title) { ElMessage.warning('请输入方案名称'); return }
  submitting.value = true
  try {
    if (isEditing.value && form.value.id) {
      await solutionApi.updateSolution(form.value.id, form.value)
      ElMessage.success('修改成功')
    } else {
      await solutionApi.createSolution({ ...form.value, title: form.value.title || '' })
      ElMessage.success('新增成功')
    }
    closeDialog(); loadList()
  } finally { submitting.value = false }
}

async function handleDelete(item: SolutionItem) {
  try {
    await ElMessageBox.confirm(`确定删除"${item.title}"？`, '确认删除', { type: 'warning' })
    await solutionApi.deleteSolution(item.id)
    ElMessage.success('已删除'); loadList()
  } catch { /* 取消或失败 */ }
}
</script>

<template>
  <div class="admin-crud">
    <div class="admin-crud__header">
      <h2>方案管理</h2>
      <el-button type="primary" @click="openDialog()"><el-icon><Plus /></el-icon> 添加方案</el-button>
    </div>

    <el-table :data="list" v-loading="loading" stripe border>
      <el-table-column v-for="col in columns" :key="col.prop" v-bind="col" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openDialog(row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑方案' : '添加方案'" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="目标客户"><el-input v-model="form.targetCustomer" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="onSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.admin-crud {
  &__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-lg);
    h2 { font-size: var(--font-size-h2); font-weight: 700; margin: 0; color: var(--color-text-primary); } }
}
</style>
