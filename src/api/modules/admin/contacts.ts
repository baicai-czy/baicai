// ── 咨询管理 API ──

import { adminApi } from '@/api'
import type { PaginatedResponse } from '@/types/api'

export interface ContactRecord {
  id: number
  type: 'consult' | 'service-request'
  name: string
  company: string
  phone: string
  email: string
  description: string
  serviceType: string
  createdAt: string
}

export function fetchContacts(params: { page: number; pageSize?: number; type?: string }): Promise<PaginatedResponse<ContactRecord>> {
  return adminApi.get('/contacts', { params }) as Promise<PaginatedResponse<ContactRecord>>
}

export function deleteContact(id: number): Promise<{ success: boolean }> {
  return adminApi.delete(`/contacts/${id}`) as Promise<{ success: boolean }>
}
