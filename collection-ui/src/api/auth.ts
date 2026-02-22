import { apiFetch } from './client'

export interface AuthResponse {
  token: string
  userId: string
  displayName: string
  role: string
}

export const registerUser = (body: { displayName: string; email: string; password: string }) =>
  apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) })

export const loginUser = (body: { email: string; password: string }) =>
  apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) })
