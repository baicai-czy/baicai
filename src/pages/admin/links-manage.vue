<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as api from '@/api/modules/admin/links'
import type { LinkItem } from '@/api/modules/admin/links'

const loading = ref(false)
const list = ref<LinkItem[]>([])
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const form = ref<Partial<LinkItem>>({ name: '', url: '', sortOrder: 0, isActive: true })

onMounted(() => { loadList() })
async function loadList() { loading.value = true; try { list.value = await api.fetchLinks() || [] } catch { /* ignore */ } loading.value = false }

function openDialog(item?: LinkItem) {
  isEditing.value = !!item; form.value = item ? { ...item } : { name: '', url: '', sortOrder: 0, isActive: true }; dialogVisible.value = true
}
function closeDialog() { dialogVisible.value = false }

async function onSubmit() {
  if (!form.value.name) { ElMessage.warning('请输入名称'); return }
  submitting.value = true
  try {
    if (isEditing.value && form.value.id) { await api.updateLink(form.value.id, form.value); ElMessage.success('修改成功') }
    else { await api.createLink({ ...form.value, name: form.value.name || '' }); ElMessage.success('新增成功') }
    closeDialog(); loadList()
  } finally { submitting.value = false }
}

async function toggleActive(item: LinkItem) {
  try { await api.updateLink(item.id, { name: item.name, url: item.url, sortOrder: item.sortOrder, isActive: !item.isActive }); item.isActive = !item.isActive; ElMessage.success(item.isActive ? '已启用' : '已禁用') }
  catch { /* ignore */ }
}

async function handleDelete(item: LinkItem) {
  try { await ElMessageBox.confirm('确定删除"' + item.name + '"？', '确认删除', { type: 'warning' }); await api.deleteLink(item.id); ElMessage.success('已删除'); loadList() }
  catch { /* 取消 */ }
}
</script>

<template>
  <div class="admin-crud">
    <div class="admin-crud__header"><h2>友情链接</h2><el-button type="primary" @click="openDialog()"><el-icon><Plus /></el-icon> 添加链接</el-button></div>
    <el-table :data="list" v-loading="loading" stripe border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" minWidth="160" />
      <el-table-column prop="url" label="URL" minWidth="250" />
      <el-table-column prop="isActive" label="启用" width="80"><template #default="{row}"><el-switch :model-value="row.isActive" size="small" @change="toggleActive(row)" /></template></el-table-column>
      <el-table-column label="操作" width="150"><template #default="{row}"><el-button type="primary" link size="small" @click="openDialog(row)">编辑</el-button><el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="isEditing?'编辑链接':'添加链接'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="URL"><el-input v-model="form.url" placeholder="https://" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" :max="99" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="form.isActive" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="closeDialog">取消</el-button><el-button type="primary" :loading="submitting" @click="onSubmit">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">.admin-crud{&__header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;h2{font-size:24px;font-weight:700;margin:0;color:var(--color-text-primary)}}}</style>
