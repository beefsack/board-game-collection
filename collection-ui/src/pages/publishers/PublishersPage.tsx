import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useListPublishers, useCreatePublisher } from '../../api/generated'
import { useAuthStore } from '../../store/auth'
import GameGrid from '../../components/GameGrid'

export default function PublishersPage() {
  const qc = useQueryClient()
  const { data: rawPublishers = [], isLoading } = useListPublishers()
  const publishers = [...rawPublishers].sort((a, b) => (b.gameCount ?? 0) - (a.gameCount ?? 0))
  const isAdmin = useAuthStore((s) => s.role === 'ADMIN')
  const [name, setName] = useState('')
  const { mutate: createPublisher, isPending } = useCreatePublisher({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['/api/publishers'] })
        setName('')
      },
    },
  })

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (name.trim()) createPublisher({ data: { name: name.trim() } })
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Publishers</h1>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6 max-w-lg">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Publisher name"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isPending || !name.trim()}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Add
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : publishers.length === 0 ? (
        <p className="text-sm text-gray-500">No publishers yet.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {publishers.map((p) => (
            <div key={p.id} className="py-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Link
                    to={`/publishers/${p.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-gray-400">{p.gameCount ?? 0} {p.gameCount === 1 ? 'game' : 'games'}</p>
                </div>
                <Link to={`/publishers/${p.id}`} className="text-gray-300">›</Link>
              </div>
              {p.topGames.length > 0 && (
                <GameGrid games={p.topGames} variant="top-games-row" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
