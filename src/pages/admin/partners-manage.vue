<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { PartnerItem } from '@/types/components'

const loading = ref(false)
const list = ref<PartnerItem[]>([])
const dialogVisible = ref(false)
const isEditing = ref(false)
const form = ref<Partial<PartnerItem>>({ name: '', logoUrl: '', website: '' })

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'name', label: '伙伴名称', minWidth: 180 },
  { prop: 'website', label: '官网地址', minWidth: 220 },
  { prop: 'logoUrl', label: 'Logo URL', minWidth: 220 },
]

function openDialog(item?: PartnerItem) {
  isEditing.value = !!item
  form.value = item ? { ...item } : { name: '', logoUrl: '', website: '' }
  dialogVisible.value = true
}
function closeDialog() { dialogVisible.value = false }
function onSubmit() {
  ElMessage.success(isEditing.value ? '更新成功' : '添加成功')
  closeDialog()
}
async function handleDelete(item: PartnerItem) {
  await ElMessageBox.confirm(`确定删除合作伙伴"${item.name}"？`, '确认删除', { type: 'warning' })
  ElMessage.success('已删除')
}
</script>

<template>
  <div class="admin-crud">
    <div class="admin-crud__header">
      <h2>合作伙伴管理</h2>
      <el-button type="primary" @click="openDialog()"><el-icon><Plus /></el-icon> 添加伙伴</el-button>
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

    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑伙伴' : '添加伙伴'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="Logo URL"><el-input v-model="form.logoUrl" /></el-form-item>
        <el-form-item label="官网地址"><el-input v-model="form.website" /></el-form-item>
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
