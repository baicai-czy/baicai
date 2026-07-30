// ── 发展历程管理 API ──
import { adminApi } from '@/api'
import type { TimelineNode } from '@/types/components'

export function fetchTimeline(): Promise<TimelineNode[]> { return adminApi.get('/timeline') as Promise<TimelineNode[]> }
export function createEvent(data: Partial<TimelineNode> & { year: string; title: string }): Promise<{ id: number }> { return adminApi.post('/timeline', data) as Promise<{ id: number }> }
export function updateEvent(id: number, data: Partial<TimelineNode>): Promise<{ success: boolean }> { return adminApi.put('/timeline/' + id, data) as Promise<{ success: boolean }> }
export function deleteEvent(id: number): Promise<{ success: boolean }> { return adminApi.delete('/timeline/' + id) as Promise<{ success: boolean }> }
