// ── 产品 API ──

import { publicApi } from '@/api'
import type { ServiceCardItem } from '@/types/components'
import type { PaginatedResponse } from '@/types/api'
import type { ProductQueryParams } from '@/api/types'

/**
 * 分页获取产品 / 服务列表
 */
export function fetchProducts(
  params: ProductQueryParams,
): Promise<PaginatedResponse<ServiceCardItem>> {
  return publicApi.get('/products', { params }) as Promise<PaginatedResponse<ServiceCardItem>>
}

/**
 * 按业务类型获取产品列表（如 state-cloud, integration）
 */
export function fetchProductByType(
  type: string,
): Promise<ServiceCardItem[]> {
  return publicApi.get(`/products/${type}`) as Promise<ServiceCardItem[]>
}
