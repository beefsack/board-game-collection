import { Link } from 'react-router-dom'
import { useListUsers } from '../../api/generated'
import GameGrid from '../../components/GameGrid'

export default function UsersPage() {
  const { data: users = [], isLoading } = useListUsers()

  const sorted = [...users].sort((a, b) => (b.gameCount ?? 0) - (a.gameCount ?? 0))

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Collections</h1>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-gray-500">No users yet.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {sorted.map((u) => (
            <div key={u.id} className="py-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Link
                    to={`/users/${u.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                  >
                    {u.displayName}
                  </Link>
                  <p className="text-xs text-gray-400">{u.gameCount ?? 0} {u.gameCount === 1 ? 'game' : 'games'}</p>
                </div>
                <Link to={`/users/${u.id}`} className="text-gray-300">›</Link>
              </div>
              {(u.topGames ?? []).length > 0 && (
                <GameGrid games={u.topGames!} variant="top-games-row" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
