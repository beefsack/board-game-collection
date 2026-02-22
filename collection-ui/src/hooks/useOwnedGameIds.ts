import { useGetUser } from '../api/generated'
import { useAuthStore } from '../store/auth'

export function useOwnedGameIds(): Set<string> {
  const userId = useAuthStore((s) => s.userId)
  const { data } = useGetUser(userId!, { query: { enabled: !!userId } })
  return new Set(data?.collection?.map((g) => g.id) ?? [])
}
