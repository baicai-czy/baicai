<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

const formRef = ref<FormInstance>()
const saving = ref(false)

const form = reactive({
  siteName: '城际云（江苏）科技有限公司',
  logo: '/logo.png',
  icp: '',
  copyright: 'Copyright © 2026 城际云（江苏）科技有限公司',
  contactPhone: '400-000-0000',
  contactEmail: 'contact@example.com',
  address: '请通过后台配置公司地址',
  workingHours: '周一至周五 9:00-18:00',
  seoTitle: '城际云（江苏）科技有限公司',
  seoDescription: '最懂行业的云服务公司',
  seoKeywords: '城际云,云计算,国资云,政务云,智算服务',
})

async function onSave() {
  saving.value = true
  // 实际调用 API
  await new Promise((resolve) => setTimeout(resolve, 500))
  saving.value = false
  ElMessage.success('设置已保存')
}
</script>

<template>
  <div class="admin-settings">
    <h2 style="font-size: var(--font-size-h2); font-weight: 700; margin-bottom: var(--spacing-lg); color: var(--color-text-primary)">
      系统设置
    </h2>

    <el-form
      ref="formRef"
      :model="form"
      label-width="120px"
      style="max-width: 720px"
    >
      <el-divider content-position="left">基本信息</el-divider>

      <el-form-item label="站点名称">
        <el-input v-model="form.siteName" />
      </el-form-item>
      <el-form-item label="Logo URL">
        <el-input v-model="form.logo" />
      </el-form-item>
      <el-form-item label="ICP 备案号">
        <el-input v-model="form.icp" placeholder="如：苏ICP备XXXXXXXX号" />
      </el-form-item>
      <el-form-item label="版权信息">
        <el-input v-model="form.copyright" type="textarea" :rows="2" />
      </el-form-item>

      <el-divider content-position="left">联系方式</el-divider>

      <el-form-item label="客服电话">
        <el-input v-model="form.contactPhone" />
      </el-form-item>
      <el-form-item label="联系邮箱">
        <el-input v-model="form.contactEmail" />
      </el-form-item>
      <el-form-item label="公司地址">
        <el-input v-model="form.address" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="工作时间">
        <el-input v-model="form.workingHours" />
      </el-form-item>

      <el-divider content-position="left">SEO 设置</el-divider>

      <el-form-item label="SEO 标题">
        <el-input v-model="form.seoTitle" />
      </el-form-item>
      <el-form-item label="SEO 描述">
        <el-input v-model="form.seoDescription" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="SEO 关键词">
        <el-input v-model="form.seoKeywords" type="textarea" :rows="2" placeholder="多个关键词用英文逗号分隔" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="saving" @click="onSave">
          {{ saving ? '保存中...' : '保存设置' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
