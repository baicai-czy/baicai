<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { PartnerItem } from '@/types/components'
import * as partnerApi from '@/api/modules/admin/partners'

const loading = ref(false)
const list = ref<PartnerItem[]>([])
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const defaultForm = () => ({ name: '', logoUrl: '', website: '' } as Partial<PartnerItem>)
const form = ref<Partial<PartnerItem>>(defaultForm())

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'name', label: '伙伴名称', minWidth: 180 },
  { prop: 'website', label: '官网地址', minWidth: 220 },
  { prop: 'logoUrl', label: 'Logo URL', minWidth: 220 },
]

onMounted(() => { loadList() })

async function loadList() {
  loading.value = true
  try { list.value = await partnerApi.fetchPartners() || [] } catch { /* ignore */ }
  loading.value = false
}

function openDialog(item?: PartnerItem) {
  isEditing.value = !!item
  form.value = item ? { ...item } : defaultForm()
  dialogVisible.value = true
}
function closeDialog() { dialogVisible.value = false }

async function onSubmit() {
  if (!form.value.name) { ElMessage.warning('请输入伙伴名称'); return }
  submitting.value = true
  try {
    if (isEditing.value && form.value.id) {
      await partnerApi.updatePartner(form.value.id, form.value)
      ElMessage.success('修改成功')
    } else {
      await partnerApi.createPartner({ ...form.value, name: form.value.name || '' })
      ElMessage.success('新增成功')
    }
    closeDialog(); loadList()
  } finally { submitting.value = false }
}

async function handleDelete(item: PartnerItem) {
  try {
    await ElMessageBox.confirm(`确定删除"${item.name}"？`, '确认删除', { type: 'warning' })
    await partnerApi.deletePartner(item.id)
    ElMessage.success('已删除'); loadList()
  } catch { /* 取消或失败 */ }
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
