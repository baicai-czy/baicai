// ── 表单验证与提交 ──
import { ref, type Ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

export function useForm<T extends object>(
  formRef: Ref<FormInstance | undefined>,
  submitFn: (data: T) => Promise<unknown>,
  rules: FormRules = {},
) {
  const submitting = ref(false)
  const success = ref(false)

  function reset() {
    formRef.value?.resetFields()
    success.value = false
  }

  async function submit(data: T) {
    if (!formRef.value) return false
    try {
      await formRef.value.validate()
    } catch {
      ElMessage.warning('请完善表单信息后再提交')
      return false
    }

    submitting.value = true
    try {
      await submitFn(data)
      success.value = true
      ElMessage.success('提交成功，我们会尽快与您联系')
      return true
    } catch {
      // 错误在拦截器已提示
      return false
    } finally {
      submitting.value = false
    }
  }

  return { submitting, success, reset, submit }
}
