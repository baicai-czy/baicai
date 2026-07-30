<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface AdminUser { id: number; username: string; avatar: string; role: string; permissions: string[] }

const loading = ref(false)
const list = ref<AdminUser[]>([])
const dialogVisible = ref(false)
const isEditing = ref(false)
const form = ref({ id: 0, username: '', password: '', role: 'editor', permissions: [] as string[] })

const roles = [
  { value: 'admin', label: '超级管理员' },
  { value: 'editor', label: '内容编辑' },
  { value: 'approver', label: '内容审核' },
  { value: 'service', label: '客服人员' },
]

const permOptions = [
  { v: 'news:manage', l: '新闻管理' }, { v: 'products:manage', l: '产品管理' },
  { v: 'solutions:manage', l: '方案管理' }, { v: 'banners:manage', l: 'Banner管理' },
  { v: 'partners:manage', l: '合作伙伴' }, { v: 'stats:manage', l: '数据指标' },
  { v: 'links:manage', l: '友情链接' }, { v: 'timeline:manage', l: '发展历程' },
  { v: 'honors:manage', l: '资质荣誉' }, { v: 'cms:manage', l: '内容管理' },
  { v: 'contacts:manage', l: '咨询管理' }, { v: 'contacts:view', l: '咨询查看' },
  { v: 'upload:manage', l: '文件上传' },
]

const roleLabel: Record<string,string> = { admin:'超级管理员', editor:'内容编辑', approver:'内容审核', service:'客服人员' }

onMounted(() => loadList())

async function loadList() {
  loading.value = true
  try { const { adminApi } = await import('@/api/index'); const r = await adminApi.get('/users') as any; list.value = Array.isArray(r) ? r : (r.records || []) } catch {}
  loading.value = false
}

function openDialog(item?: AdminUser) {
  isEditing.value = !!item
  form.value = item ? { ...item, password: '' } : { id: 0, username: '', password: '', role: 'editor', permissions: [] }
  dialogVisible.value = true
}
function closeDialog() { dialogVisible.value = false }

async function onSubmit() {
  if (!form.value.username) { ElMessage.warning('请输入用户名'); return }
  if (!isEditing.value && !form.value.password) { ElMessage.warning('请输入密码'); return }
  try {
    const { adminApi } = await import('@/api/index')
    if (isEditing.value) {
      await adminApi.put('/users/' + form.value.id, { role: form.value.role, permissions: form.value.permissions, password: form.value.password || undefined })
      ElMessage.success('修改成功')
    } else {
      await adminApi.post('/users', { username: form.value.username, password: form.value.password, role: form.value.role, permissions: form.value.permissions })
      ElMessage.success('创建成功')
    }
    closeDialog(); loadList()
  } catch {}
}

async function handleDelete(item: AdminUser) {
  try {
    await ElMessageBox.confirm('确定删除用户"' + item.username + '"？', '确认删除', { type: 'warning' })
    const { adminApi } = await import('@/api/index')
    await adminApi.delete('/users/' + item.id)
    ElMessage.success('已删除'); loadList()
  } catch {}
}
</script>

<template>
  <div class="admin-crud">
    <div class="admin-crud__header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="openDialog()"><el-icon><Plus /></el-icon> 创建用户</el-button>
    </div>

    <el-table :data="list" v-loading="loading" stripe border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户名" minWidth="140" />
      <el-table-column label="角色" width="120">
        <template #default="{ row }">
          <el-tag :type="row.role==='admin'?'danger':row.role==='editor'?'primary':row.role==='approver'?'warning':'info'" size="small">{{ roleLabel[row.role] || row.role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="权限" minWidth="220">
        <template #default="{ row }">
          <template v-if="row.permissions?.includes('*')"><el-tag type="danger" size="small">全部权限</el-tag></template>
          <template v-else><el-tag v-for="p in row.permissions" :key="p" size="small" style="margin:1px">{{ p }}</el-tag></template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openDialog(row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑用户' : '创建用户'" width="550px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名"><el-input v-model="form.username" :disabled="isEditing" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="form.password" type="password" :placeholder="isEditing ? '留空则不修改' : ''" /></el-form-item>
        <el-form-item label="角色"><el-select v-model="form.role" style="width:100%"><el-option v-for="r in roles" :key="r.value" :label="r.label" :value="r.value" /></el-select></el-form-item>
        <el-form-item label="权限"><el-checkbox-group v-model="form.permissions"><el-checkbox v-for="p in permOptions" :key="p.v" :label="p.v">{{ p.l }}</el-checkbox></el-checkbox-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="closeDialog">取消</el-button><el-button type="primary" @click="onSubmit">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.admin-crud {
  &__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-lg);
    h2 { font-size: var(--font-size-h2); font-weight: 700; margin: 0; color: var(--color-text-primary); } }
}
</style>
