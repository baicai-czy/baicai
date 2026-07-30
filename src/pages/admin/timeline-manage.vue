<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { TimelineNode } from '@/types/components'
import * as api from '@/api/modules/admin/timeline'

const loading = ref(false)
const list = ref<TimelineNode[]>([])
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const form = ref<Partial<TimelineNode>>({ year: '', month: '', title: '', description: '', sortOrder: 0 })

onMounted(() => { loadList() })

async function loadList() { loading.value = true; try { list.value = await api.fetchTimeline() || [] } catch { /* ignore */ } loading.value = false }

function openDialog(item?: TimelineNode) {
  isEditing.value = !!item; form.value = item ? { ...item } : { year: '', month: '', title: '', description: '', sortOrder: 0 }; dialogVisible.value = true
}
function closeDialog() { dialogVisible.value = false }

async function onSubmit() {
  if (!form.value.year || !form.value.title) { ElMessage.warning('年份和标题为必填项'); return }
  submitting.value = true
  try {
    if (isEditing.value && form.value.id) { await api.updateEvent(form.value.id, form.value); ElMessage.success('修改成功') }
    else { await api.createEvent({ ...form.value, year: form.value.year || '', title: form.value.title || '' }); ElMessage.success('新增成功') }
    closeDialog(); loadList()
  } finally { submitting.value = false }
}

async function handleDelete(item: TimelineNode) {
  try { await ElMessageBox.confirm('确定删除"' + item.title + '"？', '确认删除', { type: 'warning' }); await api.deleteEvent(item.id); ElMessage.success('已删除'); loadList() }
  catch { /* 取消 */ }
}
</script>

<template>
  <div class="admin-crud">
    <div class="admin-crud__header"><h2>发展历程</h2><el-button type="primary" @click="openDialog()"><el-icon><Plus /></el-icon> 添加事件</el-button></div>
    <el-table :data="list" v-loading="loading" stripe border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="year" label="年份" width="80" />
      <el-table-column prop="month" label="月份" width="80" />
      <el-table-column prop="title" label="事件" minWidth="200" />
      <el-table-column label="操作" width="150"><template #default="{row}"><el-button type="primary" link size="small" @click="openDialog(row)">编辑</el-button><el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="isEditing?'编辑事件':'添加事件'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-row :gutter="16"><el-col :span="12"><el-form-item label="年份"><el-input v-model="form.year" placeholder="如 2024" /></el-form-item></el-col><el-col :span="12"><el-form-item label="月份"><el-input v-model="form.month" placeholder="如 12" /></el-form-item></el-col></el-row>
        <el-form-item label="标题"><el-input v-model="form.title" placeholder="事件标题" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" :max="99" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="closeDialog">取消</el-button><el-button type="primary" :loading="submitting" @click="onSubmit">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">.admin-crud{&__header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;h2{font-size:24px;font-weight:700;margin:0;color:var(--color-text-primary)}}}</style>
