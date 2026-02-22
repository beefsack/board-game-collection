import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useGetUser, useDeleteUser, useRemoveFromCollection } from '../../api/generated'
import { useAuthStore } from '../../store/auth'
import { Link } from 'react-router-dom'

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const isAdmin = useAuthStore((s) => s.role === 'ADMIN')
  const currentUserId = useAuthStore((s) => s.userId)
  const isOwnPage = currentUserId === id

  const { data, isLoading } = useGetUser(id!)

  const { mutate: deleteUser } = useDeleteUser({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['/api/users'] })
        navigate('/users')
      },
    },
  })

  const { mutate: removeGame } = useRemoveFromCollection({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: [`/api/users/${id}`] }),
    },
  })

  if (isLoading) return <p className="text-sm text-gray-500">Loading…</p>
  if (!data?.user) return <p className="text-sm text-gray-500">Not found.</p>

  const { user, collection = [] } = data

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{user.displayName}</h1>
          {user.role && (
            <p className="text-sm text-gray-400 mt-0.5 capitalize">{user.role.toLowerCase()}</p>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={() =>
              window.confirm('Delete this user?') && deleteUser({ id: id! })
            }
            className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors shrink-0"
          >
            Delete
          </button>
        )}
      </div>

      <section>
        <h2 className="text-sm font-medium text-gray-500 mb-3">
          Collection ({collection.length})
        </h2>
        {collection.length === 0 ? (
          <p className="text-sm text-gray-500">No games in collection.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {collection.map((game) => (
              <li key={game.id} className="group relative">
                <Link to={`/board-games/${game.id}`} className="block">
                  <div className="aspect-square rounded-lg bg-gray-100 mb-2" />
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {game.title}
                  </p>
                  <p className="text-xs text-gray-400">{game.yearPublished ?? '—'}</p>
                </Link>
                {(isAdmin || isOwnPage) && (
                  <button
                    onClick={() => removeGame({ id: id!, gameId: game.id! })}
                    className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-white shadow text-gray-400 hover:text-red-500 text-xs transition-colors"
                    title="Remove from collection"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
