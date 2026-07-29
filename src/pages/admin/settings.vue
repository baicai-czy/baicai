<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/stores/modules/app'
import * as cfgApi from '@/api/modules/admin/site-config'

const appStore = useAppStore()
const formRef = ref<FormInstance>()
const saving = ref(false)

const form = reactive({
  siteName: '',
  logo: '',
  icp: '',
  copyright: '',
  contactPhone: '',
  contactEmail: '',
  address: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
})

onMounted(async () => {
  // 从 app store 加载当前站点配置填充表单
  if (appStore.siteConfig) {
    Object.assign(form, {
      siteName: appStore.siteConfig.siteName || '',
      logo: appStore.siteConfig.logo || '',
      icp: appStore.siteConfig.icp || '',
      copyright: appStore.siteConfig.copyright || '',
      contactPhone: appStore.siteConfig.contactPhone || '',
      contactEmail: appStore.siteConfig.contactEmail || '',
      address: appStore.siteConfig.address || '',
      seoTitle: appStore.siteConfig.seoTitle || '',
      seoDescription: appStore.siteConfig.seoDescription || '',
      seoKeywords: appStore.siteConfig.seoKeywords || '',
    })
  }
})

async function onSave() {
  saving.value = true
  try {
    await cfgApi.updateSiteConfig(form)
    await appStore.fetchSiteConfig() // 刷新全局配置
    ElMessage.success('设置已保存')
  } catch {
    ElMessage.error('保存失败')
  }
  saving.value = false
}
</script>

<template>
  <div class="admin-settings">
    <h2 style="font-size: var(--font-size-h2); font-weight: 700; margin-bottom: var(--spacing-lg); color: var(--color-text-primary)">
      系统设置
    </h2>

    <el-form ref="formRef" :model="form" label-width="120px" style="max-width: 720px">
      <el-divider content-position="left">基本信息</el-divider>
      <el-form-item label="站点名称"><el-input v-model="form.siteName" /></el-form-item>
      <el-form-item label="Logo URL"><el-input v-model="form.logo" /></el-form-item>
      <el-form-item label="ICP 备案号"><el-input v-model="form.icp" placeholder="如：苏ICP备XXXXXXXX号" /></el-form-item>
      <el-form-item label="版权信息"><el-input v-model="form.copyright" type="textarea" :rows="2" /></el-form-item>

      <el-divider content-position="left">联系方式</el-divider>
      <el-form-item label="客服电话"><el-input v-model="form.contactPhone" /></el-form-item>
      <el-form-item label="联系邮箱"><el-input v-model="form.contactEmail" /></el-form-item>
      <el-form-item label="公司地址"><el-input v-model="form.address" type="textarea" :rows="2" /></el-form-item>

      <el-divider content-position="left">SEO 设置</el-divider>
      <el-form-item label="SEO 标题"><el-input v-model="form.seoTitle" /></el-form-item>
      <el-form-item label="SEO 描述"><el-input v-model="form.seoDescription" type="textarea" :rows="2" /></el-form-item>
      <el-form-item label="SEO 关键词"><el-input v-model="form.seoKeywords" type="textarea" :rows="2" placeholder="多个关键词用英文逗号分隔" /></el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="saving" @click="onSave">
          {{ saving ? '保存中...' : '保存设置' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
