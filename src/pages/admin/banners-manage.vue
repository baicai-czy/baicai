<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { BannerItem } from '@/types/components'
import * as bannerApi from '@/api/modules/admin/banners'

const loading = ref(false)
const list = ref<BannerItem[]>([])
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)

const defaultForm = () => ({ title: '', subtitle: '', imageUrl: '', link: '', sortOrder: 0, isActive: true } as Partial<BannerItem>)
const form = ref<Partial<BannerItem>>(defaultForm())

onMounted(() => { loadList() })

async function loadList() {
  loading.value = true
  try { list.value = await bannerApi.fetchBanners() || [] } catch { /* 错误已由拦截器处理 */ }
  loading.value = false
}

function openDialog(item?: BannerItem) {
  isEditing.value = !!item
  form.value = item ? { ...item } : defaultForm()
  dialogVisible.value = true
}
function closeDialog() { dialogVisible.value = false }

async function onSubmit() {
  submitting.value = true
  try {
    if (isEditing.value && form.value.id) {
      await bannerApi.updateBanner(form.value.id, form.value)
      ElMessage.success('修改成功')
    } else {
      await bannerApi.createBanner(form.value)
      ElMessage.success('新增成功')
    }
    closeDialog()
    loadList()
  } finally { submitting.value = false }
}

async function toggleActive(item: BannerItem) {
  try {
    await bannerApi.updateBanner(item.id, { isActive: !item.isActive, title: item.title, subtitle: item.subtitle, imageUrl: item.imageUrl, link: item.link, sortOrder: item.sortOrder })
    item.isActive = !item.isActive
    ElMessage.success(item.isActive ? '已启用' : '已禁用')
  } catch { /* ignore */ }
}

async function handleDelete(item: BannerItem) {
  try {
    await ElMessageBox.confirm(`确定删除"${item.title}"？`, '确认删除', { type: 'warning' })
    await bannerApi.deleteBanner(item.id)
    ElMessage.success('已删除')
    loadList()
  } catch { /* 用户取消或失败 */ }
}
</script>

<template>
  <div class="admin-crud">
    <div class="admin-crud__header">
      <h2>Banner 管理</h2>
      <el-button type="primary" @click="openDialog()"><el-icon><Plus /></el-icon> 添加 Banner</el-button>
    </div>

    <el-alert
      title="提示：Banner 图片建议尺寸为 1920×520px，支持 JPG/PNG/WebP 格式"
      type="info" show-icon :closable="false" style="margin-bottom: 16px"
    />

    <el-table :data="list" v-loading="loading" stripe border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="标题" minWidth="200" />
      <el-table-column prop="subtitle" label="副标题" minWidth="200" />
      <el-table-column prop="sortOrder" label="排序" width="70" />
      <el-table-column prop="isActive" label="启用" width="70">
        <template #default="{ row }">
          <el-switch :model-value="row.isActive" size="small" @change="toggleActive(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openDialog(row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑 Banner' : '添加 Banner'" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题"><el-input v-model="form.title" placeholder="Banner 主标题" /></el-form-item>
        <el-form-item label="副标题"><el-input v-model="form.subtitle" placeholder="Banner 副标题" /></el-form-item>
        <el-form-item label="图片URL"><el-input v-model="form.imageUrl" placeholder="图片链接地址" /></el-form-item>
        <el-form-item label="跳转链接"><el-input v-model="form.link" placeholder="点击跳转的页面路径" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" :max="99" /></el-form-item>
        <el-form-item label="启用"><el-switch v-model="form.isActive" /></el-form-item>
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
