// ── API 通用响应类型 ──

/** 后端统一响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

/** 分页请求参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 分页响应结构 */
export interface PaginatedResponse<T> {
  records: T[]
  total: number
  page: number
  pageSize: number
  pages: number
}

/** 分类查询参数 */
export interface CategoryQuery extends PaginationParams {
  category?: string
  keyword?: string
}
