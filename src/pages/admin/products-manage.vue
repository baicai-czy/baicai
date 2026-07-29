<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const isEditing = ref(false)
const form = ref({ title: '', icon: '', description: '', features: '', category: '' })

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'title', label: '名称', minWidth: 180 },
  { prop: 'category', label: '分类', width: 120 },
  { prop: 'description', label: '描述', minWidth: 200 },
]

onMounted(() => { loadList() })
function loadList() { loading.value = true; setTimeout(() => loading.value = false, 500) }
function openDialog(item?: any) {
  isEditing.value = !!item
  form.value = item ? { ...item } : { title: '', icon: '', description: '', features: '', category: '' }
  dialogVisible.value = true
}
function closeDialog() { dialogVisible.value = false }
function onSubmit() { ElMessage.success(isEditing.value ? '更新成功' : '创建成功'); closeDialog(); loadList() }
async function handleDelete(item: any) {
  await ElMessageBox.confirm(`确定删除"${item.title}"？`, '确认删除', { type: 'warning' })
  ElMessage.success('已删除'); loadList()
}
</script>

<template>
  <div class="admin-crud">
    <div class="admin-crud__header">
      <h2>产品管理</h2>
      <el-button type="primary" @click="openDialog()"><el-icon><Plus /></el-icon> 添加产品</el-button>
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

    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑产品' : '添加产品'" width="600px" @closed="closeDialog">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称" prop="title"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="分类" prop="category"><el-input v-model="form.category" /></el-form-item>
        <el-form-item label="图标" prop="icon"><el-input v-model="form.icon" placeholder="Element Plus 图标名" /></el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.admin-crud {
  &__header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: var(--spacing-lg);
    h2 { font-size: var(--font-size-h2); font-weight: 700; margin: 0; color: var(--color-text-primary); }
  }
}
</style>
