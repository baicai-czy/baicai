// ── 操作日志 API ──
import { adminApi } from '@/api'
import type { PaginatedResponse } from '@/types/api'

export interface AuditLogItem {
  id: number
  username: string
  action: string
  module: string
  detail: string
  ip: string
  createTime: string
}

export function fetchAuditLogs(params: {
  page?: number
  pageSize?: number
  keyword?: string
}): Promise<PaginatedResponse<AuditLogItem>> {
  return adminApi.get('/audit-log', { params }) as Promise<PaginatedResponse<AuditLogItem>>
}
