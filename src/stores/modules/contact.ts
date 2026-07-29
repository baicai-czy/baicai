// ── 联系表单状态管理 Store ──
// 架构规范：第6章 — setup 语法、草案草稿暂存

import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ContactFormData, ServiceFormData } from '@/types/components'
import { SITE_DEFAULTS } from '@/utils/constants'

// ── 草稿持久化 Key ──
const CONSULT_DRAFT_KEY = 'portal_consult_draft'
const SERVICE_DRAFT_KEY = 'portal_service_draft'

// ── 默认空草案 ──

function createEmptyConsultDraft(): ContactFormData {
  return {
    name: '',
    company: '',
    phone: '',
    email: '',
    description: '',
    captchaCode: '',
  }
}

function createEmptyServiceDraft(): ServiceFormData {
  return {
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    serviceType: '',
    description: '',
    captchaCode: '',
  }
}

/** 从 localStorage 恢复草稿 */
function loadDraft<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      return JSON.parse(raw) as T
    }
  } catch {
    // 解析失败则丢弃
    localStorage.removeItem(key)
  }
  return fallback
}

// ── Store 定义 ──

export const useContactStore = defineStore('contact', () => {
  // ═══════════════════════════ state ═══════════════════════════

  /** 咨询表单草稿 */
  const consultDraft = ref<ContactFormData>(
    loadDraft<ContactFormData>(CONSULT_DRAFT_KEY, createEmptyConsultDraft()),
  )

  /** 服务申请表单草稿 */
  const serviceDraft = ref<ServiceFormData>(
    loadDraft<ServiceFormData>(SERVICE_DRAFT_KEY, createEmptyServiceDraft()),
  )

  /** 提交状态（防重复提交） */
  const submitting = ref<boolean>(false)

  // ═══════════════════════════ actions ═══════════════════════════

  /**
   * 提交咨询表单
   * @param data - 咨询表单数据
   * @returns 是否提交成功
   */
  async function submitConsult(data: ContactFormData): Promise<boolean> {
    if (submitting.value) return false

    submitting.value = true
    try {
      const { submitConsult: submitContact } = await import('@/api/modules/contact')
      const res = await submitContact(data)
      if (res?.code === 0 || res?.code === 200) {
        clearDraft('consult')
        return true
      }
      return false
    } catch {
      console.warn('[useContactStore] submitConsult failed.')
      return false
    } finally {
      submitting.value = false
    }
  }

  /**
   * 提交服务申请表单
   * @param data - 服务申请表单数据
   * @returns 是否提交成功
   */
  async function submitServiceRequest(data: ServiceFormData): Promise<boolean> {
    if (submitting.value) return false

    submitting.value = true
    try {
      const { submitServiceRequest: submitService } = await import('@/api/modules/contact')
      const res = await submitService(data)
      if (res?.code === 0 || res?.code === 200) {
        clearDraft('service')
        return true
      }
      return false
    } catch {
      console.warn('[useContactStore] submitServiceRequest failed.')
      return false
    } finally {
      submitting.value = false
    }
  }

  /**
   * 保存表单草稿到 localStorage
   * 用户在表单中输入时调用，防止页面刷新丢失数据
   * @param type - 草稿类型
   * @param data - 草稿数据
   */
  function saveDraft(
    type: 'consult' | 'service',
    data: ContactFormData | ServiceFormData,
  ): void {
    const key = type === 'consult' ? CONSULT_DRAFT_KEY : SERVICE_DRAFT_KEY
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch {
      console.warn('[useContactStore] saveDraft failed: localStorage may be full.')
    }
  }

  /**
   * 清除表单草稿
   * @param type - 草稿类型，不传则清除全部
   */
  function clearDraft(type?: 'consult' | 'service'): void {
    if (!type || type === 'consult') {
      consultDraft.value = createEmptyConsultDraft()
      localStorage.removeItem(CONSULT_DRAFT_KEY)
    }
    if (!type || type === 'service') {
      serviceDraft.value = createEmptyServiceDraft()
      localStorage.removeItem(SERVICE_DRAFT_KEY)
    }
  }

  // ═══════════════════════════ return ═══════════════════════════

  return {
    // state
    consultDraft,
    serviceDraft,
    submitting,
    // actions
    submitConsult,
    submitServiceRequest,
    saveDraft,
    clearDraft,
  }
})
