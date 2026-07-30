<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import * as cmsApi from '@/api/modules/admin/cms'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import OrgTreeEditor from '@/components/common/OrgTreeEditor.vue'

const saving = ref(false)
const tab = ref<'profile'|'culture'|'structure'>('profile')

// 公司简介
const profile = ref({ content: '' })
// 企业文化
const culture = ref({ mission: '', vision: '', values: '' })
// 组织架构（可视化树编辑器的 JSON 序列化结果）
const structure = ref('[]')

onMounted(async () => {
  try {
    const [p, c, s] = await Promise.all([
      cmsApi.fetchCmsPage('about-profile'),
      cmsApi.fetchCmsPage('about-culture'),
      cmsApi.fetchCmsPage('about-structure'),
    ])
    if (p) profile.value.content = p.content || ''
    if (c && c.meta) {
      culture.value.mission = c.meta.mission || ''
      culture.value.vision = c.meta.vision || ''
      culture.value.values = c.meta.values || ''
    }
    if (s && s.meta?.tree) structure.value = JSON.stringify(s.meta.tree)
  } catch { /* ignore */ }
})

async function saveProfile() {
  saving.value = true
  try { await cmsApi.saveCmsPage({ slug: 'about-profile', title: '公司简介', content: profile.value.content }); ElMessage.success('公司简介已保存') }
  finally { saving.value = false }
}

async function saveCulture() {
  saving.value = true
  try {
    await cmsApi.saveCmsPage({ slug: 'about-culture', title: '企业文化', content: '', meta: { mission: culture.value.mission, vision: culture.value.vision, values: culture.value.values } })
    ElMessage.success('企业文化已保存')
  } finally { saving.value = false }
}

async function saveStructure() {
  saving.value = true
  try {
    const tree = JSON.parse(structure.value)
    await cmsApi.saveCmsPage({ slug: 'about-structure', title: '组织架构', content: '', meta: { tree } })
    ElMessage.success('组织架构已保存')
  } catch { ElMessage.warning('组织架构数据异常，请重试'); saving.value = false; return }
  finally { saving.value = false }
}
</script>

<template>
  <div class="about-manage">
    <h2>关于我们 — 内容管理</h2>
    <el-tabs v-model="tab" style="margin-top:16px">
      <el-tab-pane label="公司简介" name="profile">
        <p style="color:var(--color-text-secondary);margin-bottom:12px">编辑公司简介的富文本内容，显示在"关于我们→公司简介"页面。</p>
        <RichTextEditor v-model="profile.content" height="400px" />
        <el-button type="primary" :loading="saving" style="margin-top:16px" @click="saveProfile">保存公司简介</el-button>
      </el-tab-pane>

      <el-tab-pane label="企业文化" name="culture">
        <el-form label-width="80px" style="max-width:600px">
          <el-form-item label="使命"><el-input v-model="culture.mission" type="textarea" :rows="2" placeholder="企业使命" /></el-form-item>
          <el-form-item label="愿景"><el-input v-model="culture.vision" type="textarea" :rows="2" placeholder="企业愿景" /></el-form-item>
          <el-form-item label="价值观"><el-input v-model="culture.values" type="textarea" :rows="3" placeholder="核心价值观，换行分隔" /></el-form-item>
          <el-form-item><el-button type="primary" :loading="saving" @click="saveCulture">保存企业文化</el-button></el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="组织架构" name="structure">
        <p style="color:var(--color-text-secondary);margin-bottom:12px">点击节点上的按钮进行编辑、添加子部门或删除。修改后点击保存。</p>
        <OrgTreeEditor v-model="structure" />
        <el-button type="primary" :loading="saving" style="margin-top:16px" @click="saveStructure">保存组织架构</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.about-manage h2 { font-size: var(--font-size-h2); font-weight: 700; color: var(--color-text-primary); }
</style>
