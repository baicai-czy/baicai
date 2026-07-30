// ── 资质荣誉管理 API ──
import { adminApi } from '@/api'
import type { HonorItem } from '@/types/components'

export function fetchHonors(): Promise<HonorItem[]> { return adminApi.get('/honors') as Promise<HonorItem[]> }
export function createHonor(data: Partial<HonorItem> & { name: string }): Promise<{ id: number }> { return adminApi.post('/honors', data) as Promise<{ id: number }> }
export function updateHonor(id: number, data: Partial<HonorItem>): Promise<{ success: boolean }> { return adminApi.put('/honors/' + id, data) as Promise<{ success: boolean }> }
export function deleteHonor(id: number): Promise<{ success: boolean }> { return adminApi.delete('/honors/' + id) as Promise<{ success: boolean }> }
