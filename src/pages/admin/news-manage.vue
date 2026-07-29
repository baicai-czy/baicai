<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { NewsItem, NewsCategory } from '@/types/news'
import { formatDate } from '@/utils/format'
import * as newsApi from '@/api/modules/admin/news'

const loading = ref(false)
const list = ref<NewsItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const keyword = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('新建新闻')
const formRef = ref<FormInstance>()
const isEditing = ref(false)
const submitting = ref(false)

const defaultForm = () => ({
  title: '', category: 'company' as NewsCategory, summary: '',
  content: '', isPinned: false, isPublished: false, tags: [],
} as Partial<NewsItem>)
const form = ref<Partial<NewsItem>>(defaultForm())

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'title', label: '标题', minWidth: 200 },
  { prop: 'category', label: '分类', width: 100 },
  { prop: 'viewCount', label: '浏览量', width: 80 },
  { prop: 'isPinned', label: '置顶', width: 70 },
  { prop: 'isPublished', label: '发布', width: 70 },
  { prop: 'publishTime', label: '发布时间', width: 160 },
]

onMounted(() => { loadList() })

async function loadList() {
  loading.value = true
  try {
    const res = await newsApi.fetchNewsList({ page: currentPage.value, pageSize: 10, keyword: keyword.value || undefined })
    if (res) { list.value = res.records; total.value = res.total }
  } catch { /* ignore */ }
  loading.value = false
}

function openDialog(item?: NewsItem) {
  if (item) {
    isEditing.value = true; dialogTitle.value = '编辑新闻'
    form.value = { ...item }
  } else {
    isEditing.value = false; dialogTitle.value = '新建新闻'
    form.value = defaultForm()
  }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

async function onSubmit() {
  if (!formRef.value) return
  try { await formRef.value.validate() } catch { return }
  submitting.value = true
  try {
    if (isEditing.value && form.value.id) {
      await newsApi.updateNews(form.value.id, form.value)
      ElMessage.success('修改成功')
    } else {
      await newsApi.createNews({ ...form.value, title: form.value.title || '' })
      ElMessage.success('创建成功')
    }
    closeDialog(); loadList()
  } finally { submitting.value = false }
}

async function handleDelete(item: NewsItem) {
  try {
    await ElMessageBox.confirm(`确定删除"${item.title}"？`, '确认删除', { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' })
    if (item.id) await newsApi.deleteNews(item.id)
    ElMessage.success('已删除'); loadList()
  } catch { /* 取消或失败 */ }
}

async function togglePublish(item: NewsItem) {
  try {
    await newsApi.updateNews(item.id, { ...item, isPublished: !item.isPublished })
    item.isPublished = !item.isPublished
    ElMessage.success(item.isPublished ? '已发布' : '已下架')
  } catch { /* ignore */ }
}

function onSearch() { currentPage.value = 1; loadList() }
</script>

<template>
  <div class="admin-crud">
    <div class="admin-crud__header">
      <h2>新闻管理</h2>
      <el-button type="primary" @click="openDialog()"><el-icon><Plus /></el-icon> 新建新闻</el-button>
    </div>

    <div class="admin-crud__toolbar">
      <el-input v-model="keyword" placeholder="搜索标题..." clearable style="width: 300px" @clear="onSearch" @keyup.enter="onSearch">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
    </div>

    <el-table :data="list" v-loading="loading" stripe border style="width: 100%">
      <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width" :min-width="col.minWidth">
        <template v-if="col.prop === 'isPinned'" #default="{ row }">
          <el-tag :type="row.isPinned ? 'warning' : 'info'" size="small">{{ row.isPinned ? '是' : '否' }}</el-tag>
        </template>
        <template v-else-if="col.prop === 'isPublished'" #default="{ row }">
          <el-switch :model-value="row.isPublished" size="small" @change="togglePublish(row)" />
        </template>
        <template v-else-if="col.prop === 'publishTime'" #default="{ row }">
          {{ formatDate(row.publishTime, 'YYYY-MM-DD HH:mm') }}
        </template>
        <template v-else-if="col.prop === 'category'" #default="{ row }">
          <el-tag size="small">{{ { company: '公司新闻', industry: '行业动态', notice: '通知公告' }[row.category] || row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openDialog(row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="total > 10" v-model:current-page="currentPage" :total="total" :page-size="10"
      layout="total, prev, pager, next" style="margin-top: 16px; justify-content: flex-end" @change="loadList"
    />

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px" :close-on-click-modal="false" @closed="closeDialog">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请输入标题' }]">
          <el-input v-model="form.title" placeholder="请输入新闻标题" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-select v-model="form.category" style="width: 100%">
                <el-option label="公司新闻" value="company" />
                <el-option label="行业动态" value="industry" />
                <el-option label="通知公告" value="notice" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签" prop="tags">
              <el-input v-model="form.tags" placeholder="用逗号分隔多个标签" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" :rows="2" placeholder="请输入新闻摘要" />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入新闻正文（支持HTML）" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="置顶"><el-switch v-model="form.isPinned" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布"><el-switch v-model="form.isPublished" /></el-form-item>
          </el-col>
        </el-row>
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
    h2 { font-size: var(--font-size-h2); font-weight: 700; color: var(--color-text-primary); margin: 0; } }
  &__toolbar { margin-bottom: var(--spacing-md); }
}
</style>
