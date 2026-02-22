import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userId: string | null
  displayName: string | null
  role: string | null
  setAuth: (token: string, userId: string, displayName: string, role: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      displayName: null,
      role: null,
      setAuth: (token, userId, displayName, role) => set({ token, userId, displayName, role }),
      clearAuth: () => set({ token: null, userId: null, displayName: null, role: null }),
    }),
    { name: 'auth' },
  ),
)
