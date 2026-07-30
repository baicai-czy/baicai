// ── 文件上传 API ──

import { adminApi } from '@/api'

export function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData()
  formData.append('file', file)
  return adminApi.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }) as Promise<{ url: string; filename: string }>
}
