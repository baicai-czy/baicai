<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { HonorItem } from '@/types/components'
import * as api from '@/api/modules/admin/honors'
import ImageUploader from '@/components/common/ImageUploader.vue'

const loading = ref(false)
const list = ref<HonorItem[]>([])
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const form = ref<Partial<HonorItem>>({ name: '', category: '', imageUrl: '', issueDate: '', issuingAuthority: '', sortOrder: 0 })

const categoryOptions = ['资质', '专利', '奖项', '认证', '其他']

onMounted(() => { loadList() })
async function loadList() { loading.value = true; try { list.value = await api.fetchHonors() || [] } catch { /* ignore */ } loading.value = false }

function openDialog(item?: HonorItem) {
  isEditing.value = !!item; form.value = item ? { ...item } : { name: '', category: '', imageUrl: '', issueDate: '', issuingAuthority: '', sortOrder: 0 }; dialogVisible.value = true
}
function closeDialog() { dialogVisible.value = false }

async function onSubmit() {
  if (!form.value.name) { ElMessage.warning('请输入名称'); return }
  submitting.value = true
  try {
    if (isEditing.value && form.value.id) { await api.updateHonor(form.value.id, form.value); ElMessage.success('修改成功') }
    else { await api.createHonor({ ...form.value, name: form.value.name || '' }); ElMessage.success('新增成功') }
    closeDialog(); loadList()
  } finally { submitting.value = false }
}

async function handleDelete(item: HonorItem) {
  try { await ElMessageBox.confirm('确定删除"' + item.name + '"？', '确认删除', { type: 'warning' }); await api.deleteHonor(item.id); ElMessage.success('已删除'); loadList() }
  catch { /* 取消 */ }
}
</script>

<template>
  <div class="admin-crud">
    <div class="admin-crud__header"><h2>资质荣誉</h2><el-button type="primary" @click="openDialog()"><el-icon><Plus /></el-icon> 添加荣誉</el-button></div>
    <el-table :data="list" v-loading="loading" stripe border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" minWidth="200" />
      <el-table-column prop="category" label="分类" width="100"><template #default="{row}"><el-tag size="small">{{row.category||'其他'}}</el-tag></template></el-table-column>
      <el-table-column prop="issuingAuthority" label="颁发机构" minWidth="180" />
      <el-table-column prop="issueDate" label="颁发日期" width="110" />
      <el-table-column label="操作" width="150"><template #default="{row}"><el-button type="primary" link size="small" @click="openDialog(row)">编辑</el-button><el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="isEditing?'编辑荣誉':'添加荣誉'" width="550px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="分类"><el-select v-model="form.category" style="width:100%"><el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="颁发日期"><el-input v-model="form.issueDate" placeholder="如 2024-06" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="颁发机构"><el-input v-model="form.issuingAuthority" placeholder="如 江苏省科技厅" /></el-form-item>
        <el-form-item label="证书图片"><ImageUploader v-model="form.imageUrl" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" :max="99" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="closeDialog">取消</el-button><el-button type="primary" :loading="submitting" @click="onSubmit">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">.admin-crud{&__header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;h2{font-size:24px;font-weight:700;margin:0;color:var(--color-text-primary)}}}</style>
