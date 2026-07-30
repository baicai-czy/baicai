<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { StatItem } from '@/types/components'
import * as statApi from '@/api/modules/admin/stats'

const loading = ref(false)
const list = ref<StatItem[]>([])
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const defaultForm = () => ({ label: '', value: 0, suffix: '', prefix: '', decimals: 0, sortOrder: 0 } as Partial<StatItem>)
const form = ref<Partial<StatItem>>(defaultForm())

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'label', label: '指标名称', minWidth: 150 },
  { prop: 'value', label: '数值', width: 120 },
  { prop: 'prefix', label: '前缀', width: 80 },
  { prop: 'suffix', label: '后缀', width: 80 },
  { prop: 'decimals', label: '小数位', width: 80 },
  { prop: 'sortOrder', label: '排序', width: 70 },
]

onMounted(() => { loadList() })

async function loadList() {
  loading.value = true
  try { list.value = await statApi.fetchStats() || [] } catch { /* ignore */ }
  loading.value = false
}

function openDialog(item?: StatItem) {
  isEditing.value = !!item
  form.value = item ? { ...item } : defaultForm()
  dialogVisible.value = true
}
function closeDialog() { dialogVisible.value = false }

async function onSubmit() {
  if (!form.value.label) { ElMessage.warning('请输入指标名称'); return }
  submitting.value = true
  try {
    if (isEditing.value && form.value.id) {
      await statApi.updateStat(form.value.id, form.value)
      ElMessage.success('修改成功')
    } else {
      await statApi.createStat({ ...form.value, label: form.value.label || '', value: form.value.value || 0 })
      ElMessage.success('新增成功')
    }
    closeDialog(); loadList()
  } finally { submitting.value = false }
}

async function handleDelete(item: StatItem) {
  try {
    await ElMessageBox.confirm(`确定删除指标"${item.label}"？`, '确认删除', { type: 'warning' })
    await statApi.deleteStat(item.id)
    ElMessage.success('已删除'); loadList()
  } catch { /* 取消或失败 */ }
}
</script>

<template>
  <div class="admin-crud">
    <div class="admin-crud__header">
      <h2>数据指标管理</h2>
      <el-button type="primary" @click="openDialog()"><el-icon><Plus /></el-icon> 添加指标</el-button>
    </div>

    <el-alert
      title="提示：此处配置的指标将展示在首页「数据亮点」区块，支持数值动画效果"
      type="info" show-icon :closable="false" style="margin-bottom: 16px"
    />

    <el-table :data="list" v-loading="loading" stripe border>
      <el-table-column v-for="col in columns" :key="col.prop" v-bind="col">
        <template v-if="col.prop === 'value'" #default="{ row }">
          {{ row.prefix }}{{ row.decimals > 0 ? row.value.toFixed(row.decimals) : row.value }}{{ row.suffix }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openDialog(row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑指标' : '添加指标'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.label" placeholder="如：服务企业" /></el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="数值"><el-input-number v-model="form.value" :min="0" style="width:100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小数位"><el-input-number v-model="form.decimals" :min="0" :max="4" style="width:100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="前缀"><el-input v-model="form.prefix" placeholder="如：$" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="后缀"><el-input v-model="form.suffix" placeholder="如：+" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" :max="99" /></el-form-item>
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
  &__header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: var(--spacing-lg);
    h2 { font-size: var(--font-size-h2); font-weight: 700; margin: 0; color: var(--color-text-primary); }
  }
}
</style>
