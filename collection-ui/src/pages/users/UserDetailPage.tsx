import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react'
import {
  useGetUser,
  useDeleteUser,
  useAddToCollection,
  useListBoardGames,
  type BoardGame,
} from '../../api/generated'
import { useAuthStore } from '../../store/auth'
import GameGrid from '../../components/GameGrid'
import { useOwnedGameIds } from '../../hooks/useOwnedGameIds'

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const isAdmin = useAuthStore((s) => s.role === 'ADMIN')
  const currentUserId = useAuthStore((s) => s.userId)
  const isOwnPage = currentUserId === id
  const ownedGameIds = useOwnedGameIds()

  const [query, setQuery] = useState('')

  const { data, isLoading } = useGetUser(id!)
  const { data: allGames = [] } = useListBoardGames()

  const { mutate: deleteUser } = useDeleteUser({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['/api/users'] })
        navigate('/users')
      },
    },
  })

  const { mutate: addGame } = useAddToCollection({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [`/api/users/${id}`] })
        setQuery('')
      },
    },
  })

  if (isLoading) return <p className="text-sm text-gray-500">Loading…</p>
  if (!data?.user) return <p className="text-sm text-gray-500">Not found.</p>

  const { user, collection = [] } = data

  const collectionIds = new Set(collection.map((g) => g.id))
  const addableGames = allGames.filter(
    (g) =>
      !collectionIds.has(g.id) &&
      (query === '' || g.title?.toLowerCase().includes(query.toLowerCase())),
  )

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

      {isOwnPage && (
        <div className="relative mb-6">
          <Combobox<BoardGame | null>
            value={null}
            onChange={(game) => {
              if (game) addGame({ id: id!, data: { boardGameId: game.id } })
            }}
            onClose={() => setQuery('')}
          >
            <ComboboxInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              displayValue={() => query}
              placeholder="Add a game to your collection…"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <ComboboxOptions className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white border border-gray-200 shadow-lg text-sm">
              {addableGames.length === 0 ? (
                <div className="px-3 py-2 text-gray-400">No results</div>
              ) : (
                addableGames.map((game) => (
                  <ComboboxOption
                    key={game.id}
                    value={game}
                    className={({ focus }) =>
                      `cursor-pointer px-3 py-2 ${focus ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'}`
                    }
                  >
                    {game.title}
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>
          </Combobox>
        </div>
      )}

      <section>
        <h2 className="text-sm font-medium text-gray-500 mb-3">
          Collection ({collection.length})
        </h2>
        <GameGrid games={collection} ownedGameIds={ownedGameIds} />
      </section>
    </div>
  )
}
