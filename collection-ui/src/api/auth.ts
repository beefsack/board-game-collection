import { apiFetch } from './client'

export interface AuthResponse {
  token: string
}

export const registerUser = (body: { email: string; password: string }) =>
  apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) })

export const loginUser = (body: { email: string; password: string }) =>
  apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) })
