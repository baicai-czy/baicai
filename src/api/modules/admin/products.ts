// ── 产品管理 API ──

import { adminApi } from '@/api'
import type { ServiceCardItem } from '@/types/components'

export function fetchProducts(): Promise<ServiceCardItem[]> {
  return adminApi.get('/products') as Promise<ServiceCardItem[]>
}

export function createProduct(data: Partial<ServiceCardItem> & { title: string }): Promise<{ id: number }> {
  return adminApi.post('/products', data) as Promise<{ id: number }>
}

export function updateProduct(id: number, data: Partial<ServiceCardItem>): Promise<{ success: boolean }> {
  return adminApi.put(`/products/${id}`, data) as Promise<{ success: boolean }>
}

export function deleteProduct(id: number): Promise<{ success: boolean }> {
  return adminApi.delete(`/products/${id}`) as Promise<{ success: boolean }>
}
