// ── 联系我们 API ──

import { publicApi } from '@/api'
import type { ConsultFormData, ServiceRequestData } from '@/api/types'

/**
 * 提交在线咨询
 */
export function submitConsult(data: ConsultFormData): Promise<{ success: boolean }> {
  return publicApi.post('/contact/consult', data) as Promise<{ success: boolean }>
}

/**
 * 提交服务申请
 */
export function submitServiceRequest(data: ServiceRequestData): Promise<{ success: boolean }> {
  return publicApi.post('/contact/service-request', data) as Promise<{ success: boolean }>
}
