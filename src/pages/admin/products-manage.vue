<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ServiceCardItem } from '@/types/components'
import * as productApi from '@/api/modules/admin/products'

/** 预置图标选项（Element Plus 常用业务图标） */
const ICON_OPTIONS = [
  'Monitor','Cpu','FolderOpened','Coin','Connection','Lock','Setting',
  'DataAnalysis','Odometer','Histogram','TrendCharts','Platform',
  'Stamp','OfficeBuilding','Location','Picture','Notebook','Goods',
  'Files','EditPen','Promotion','MagicStick','Box','ChatDotRound',
  'PhoneFilled','Message','Clock','User','Star','TrophyBase','Medal',
]

const loading = ref(false)
const list = ref<ServiceCardItem[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)

const defaultForm = () => ({ title: '', icon: '', description: '', features: [] as string[], category: '' } as Partial<ServiceCardItem>)
const form = ref<Partial<ServiceCardItem>>(defaultForm())

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'title', label: '名称', minWidth: 180 },
  { prop: 'category', label: '分类', width: 120 },
  { prop: 'description', label: '描述', minWidth: 200 },
]

onMounted(() => { loadList() })

async function loadList() {
  loading.value = true
  try {
    const res = await productApi.fetchProducts()
    if (res) { list.value = res; total.value = res.length }
  } catch { /* ignore */ }
  loading.value = false
}

function openDialog(item?: ServiceCardItem) {
  isEditing.value = !!item
  form.value = item ? { ...item, features: item.features || [] } : defaultForm()
  dialogVisible.value = true
}
function closeDialog() { dialogVisible.value = false }

async function onSubmit() {
  if (!form.value.title) { ElMessage.warning('请输入产品名称'); return }
  submitting.value = true
  try {
    if (isEditing.value && form.value.id) {
      await productApi.updateProduct(form.value.id, form.value)
      ElMessage.success('修改成功')
    } else {
      await productApi.createProduct({ ...form.value, title: form.value.title || '' })
      ElMessage.success('新增成功')
    }
    closeDialog(); loadList()
  } finally { submitting.value = false }
}

async function handleDelete(item: ServiceCardItem) {
  try {
    await ElMessageBox.confirm(`确定删除"${item.title}"？`, '确认删除', { type: 'warning' })
    await productApi.deleteProduct(item.id)
    ElMessage.success('已删除'); loadList()
  } catch { /* 取消或失败 */ }
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
        <el-form-item label="图标" prop="icon">
          <el-select v-model="form.icon" placeholder="选择图标" style="width:100%" filterable>
            <el-option v-for="name in ICON_OPTIONS" :key="name" :label="name" :value="name">
              <el-icon style="vertical-align:middle;margin-right:8px"><component :is="name" /></el-icon>
              <span>{{ name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
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
