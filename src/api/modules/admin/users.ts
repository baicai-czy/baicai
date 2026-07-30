// ── 用户管理 API ──
import { adminApi } from '@/api'

export interface AdminUser { id: number; username: string; avatar: string; role: string; permissions: string[] }

export function fetchUsers(): Promise<AdminUser[]> { return adminApi.get('/users') as Promise<AdminUser[]> }
export function createUser(data: { username: string; password: string; role: string; permissions: string[] }): Promise<{ success: boolean }> { return adminApi.post('/users', data) as Promise<{ success: boolean }> }
export function updateUser(id: number, data: Partial<{ username: string; password: string; role: string; permissions: string[] }>): Promise<{ success: boolean }> { return adminApi.put('/users/' + id, data) as Promise<{ success: boolean }> }
export function deleteUser(id: number): Promise<{ success: boolean }> { return adminApi.delete('/users/' + id) as Promise<{ success: boolean }> }
