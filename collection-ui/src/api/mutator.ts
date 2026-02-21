import { useAuthStore } from '../store/auth'
import { ApiError } from './client'

/**
 * Custom fetch mutator used by all Orval-generated API calls.
 * Injects the JWT bearer token from the auth store into every request.
 */
export const apiFetch = async <T>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const token = useAuthStore.getState().token
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) throw new ApiError(res.statusText, res.status)
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
