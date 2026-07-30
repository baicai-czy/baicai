<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/modules/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const errorMsg = ref('')

const form = reactive({
  username: '',
  password: '',
  captcha: '',
  captchaUuid: '',
})

/** 验证码 SVG */
const captchaSvg = ref('')

async function loadCaptcha() {
  try {
    const { publicApi } = await import('@/api/index')
    const res = await (publicApi.get('/auth/captcha') as Promise<{ uuid: string; svg: string }>)
    captchaSvg.value = res.svg
    form.captchaUuid = res.uuid
    form.captcha = ''
  } catch { /* ignore */ }
}
loadCaptcha()

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
}

async function onSubmit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true
  errorMsg.value = ''

  const success = await authStore.login({
    username: form.username,
    password: form.password,
    captcha: form.captcha || undefined,
  })

  loading.value = false

  if (success) {
    const redirect = (route.query.redirect as string) || '/admin/dashboard'
    router.push(redirect)
  } else {
    errorMsg.value = '用户名或密码错误，请重试'
  }
}
</script>

<template>
  <div class="admin-login">
    <div class="admin-login__card">
      <div class="admin-login__header">
        <h1>城际云</h1>
        <p>后台管理系统</p>
      </div>

      <el-alert
        v-if="errorMsg"
        :title="errorMsg"
        type="error"
        show-icon
        :closable="true"
        @close="errorMsg = ''"
      />

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
        @submit.prevent="onSubmit"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            autocomplete="username"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            autocomplete="current-password"
            @keyup.enter="onSubmit"
          />
        </el-form-item>

        <el-form-item label="验证码" prop="captcha">
          <div style="display:flex;gap:8px;align-items:center">
            <div v-html="captchaSvg" style="cursor:pointer;min-width:120px;height:40px" @click="loadCaptcha" title="点击刷新" />
            <el-input v-model="form.captcha" placeholder="请输入验证码" maxlength="4" style="width:120px" @keyup.enter="onSubmit" />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="width: 100%"
            @click="onSubmit"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.admin-login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 50%, #1a5bb3 100%);
  padding: var(--spacing-xl);

  &__card {
    width: 100%;
    max-width: 420px;
    padding: var(--spacing-2xl);
    background: var(--color-card-bg);
    border-radius: var(--radius-lg);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  }

  &__header {
    text-align: center;
    margin-bottom: var(--spacing-xl);

    h1 {
      font-size: 28px;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: var(--spacing-xs);
    }

    p {
      font-size: var(--font-size-body);
      color: var(--color-text-disabled);
    }
  }

  .el-alert {
    margin-bottom: var(--spacing-md);
  }
}
</style>
