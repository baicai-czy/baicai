<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import { contactFormRules, serviceFormRules } from '@/utils/validate'
import { useContactStore } from '@/stores/modules/contact'
import type { ContactFormData, ServiceFormData } from '@/types/components'
import { SITE_DEFAULTS } from '@/utils/constants'
import { serviceTypeOptions } from '@/utils/constants'

const props = withDefaults(
  defineProps<{
    type?: 'consult' | 'service'
  }>(),
  {
    type: 'consult',
  },
)

const contactStore = useContactStore()
const formRef = ref<FormInstance>()

/** 表单数据（从 Store 草稿中恢复） */
const consultForm = reactive<ContactFormData>({ ...contactStore.consultDraft })
const serviceForm = reactive<ServiceFormData>({ ...contactStore.serviceDraft })

const captchaCooldown = ref(0)
const successMsg = ref('')

const rules = props.type === 'consult' ? contactFormRules : serviceFormRules

/** 监听表单变化 → 保存草稿 */
watch(
  () => (props.type === 'consult' ? consultForm : serviceForm),
  (val) => {
    contactStore.saveDraft(props.type, val)
  },
  { deep: true },
)

/** 验证码倒计时 */
function sendCaptcha() {
  if (captchaCooldown.value > 0) return
  captchaCooldown.value = SITE_DEFAULTS.captchaCooldown
  const timer = setInterval(() => {
    captchaCooldown.value--
    if (captchaCooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

async function onSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  const data = props.type === 'consult' ? consultForm : serviceForm
  const success =
    props.type === 'consult'
      ? await contactStore.submitConsult(data as ContactFormData)
      : await contactStore.submitServiceRequest(data as ServiceFormData)

  if (success) {
    successMsg.value = SITE_DEFAULTS.contactSuccessMessage
    formRef.value.resetFields()
  }
}
</script>

<template>
  <div class="contact-form">
    <!-- 成功提示 -->
    <el-alert
      v-if="successMsg"
      :title="successMsg"
      type="success"
      :closable="true"
      show-icon
      @close="successMsg = ''"
    />

    <el-form
      ref="formRef"
      :model="props.type === 'consult' ? consultForm : serviceForm"
      :rules="rules"
      label-position="top"
      :disabled="contactStore.submitting"
    >
      <!-- 咨询表单 -->
      <template v-if="props.type === 'consult'">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="consultForm.name" placeholder="请输入您的姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="company">
              <el-input v-model="consultForm.company" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="consultForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="consultForm.email" placeholder="请输入邮箱地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="咨询内容" prop="description">
          <el-input
            v-model="consultForm.description"
            type="textarea"
            :rows="4"
            placeholder="请描述您的咨询内容（10-500字）"
            :maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="验证码" prop="captchaCode">
              <el-input v-model="consultForm.captchaCode" placeholder="请输入6位验证码" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="contact-form__captcha-btn-col">
            <el-button
              :disabled="captchaCooldown > 0"
              @click="sendCaptcha"
            >
              {{ captchaCooldown > 0 ? `${captchaCooldown}秒后重发` : '获取验证码' }}
            </el-button>
          </el-col>
        </el-row>
      </template>

      <!-- 服务申请表单 -->
      <template v-else>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="serviceForm.companyName" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactName">
              <el-input v-model="serviceForm.contactName" placeholder="请输入联系人姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="serviceForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="serviceForm.email" placeholder="请输入邮箱地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="服务类型" prop="serviceType">
          <el-select v-model="serviceForm.serviceType" placeholder="请选择服务类型" style="width: 100%">
            <el-option
              v-for="opt in serviceTypeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="需求描述" prop="description">
          <el-input
            v-model="serviceForm.description"
            type="textarea"
            :rows="4"
            placeholder="请描述您的需求（10-500字）"
            :maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="验证码" prop="captchaCode">
              <el-input v-model="serviceForm.captchaCode" placeholder="请输入6位验证码" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="contact-form__captcha-btn-col">
            <el-button
              :disabled="captchaCooldown > 0"
              @click="sendCaptcha"
            >
              {{ captchaCooldown > 0 ? `${captchaCooldown}秒后重发` : '获取验证码' }}
            </el-button>
          </el-col>
        </el-row>
      </template>

      <el-form-item>
        <el-button
          type="primary"
          size="large"
          :loading="contactStore.submitting"
          @click="onSubmit"
          style="width: 100%"
        >
          {{ contactStore.submitting ? '提交中...' : '提交' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.contact-form {
  .el-alert {
    margin-bottom: var(--spacing-lg);
  }

  &__captcha-btn-col {
    display: flex;
    align-items: flex-end;
    padding-bottom: 18px;
  }
}
</style>
