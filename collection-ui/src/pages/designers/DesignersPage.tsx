import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useListDesigners, useCreateDesigner } from '../../api/generated'
import { useAuthStore } from '../../store/auth'
import GameGrid from '../../components/GameGrid'

export default function DesignersPage() {
  const qc = useQueryClient()
  const { data: rawDesigners = [], isLoading } = useListDesigners()
  const designers = [...rawDesigners].sort((a, b) => (b.gameCount ?? 0) - (a.gameCount ?? 0))
  const isAdmin = useAuthStore((s) => s.role === 'ADMIN')
  const [name, setName] = useState('')
  const { mutate: createDesigner, isPending } = useCreateDesigner({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['/api/designers'] })
        setName('')
      },
    },
  })

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (name.trim()) createDesigner({ data: { name: name.trim() } })
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Designers</h1>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6 max-w-lg">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Designer name"
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
        <p className="text-sm text-gray-500">Loading...</p>
      ) : designers.length === 0 ? (
        <p className="text-sm text-gray-500">No designers yet.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {designers.map((d) => (
            <div key={d.id} className="py-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Link
                    to={`/designers/${d.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                  >
                    {d.name}
                  </Link>
                  <p className="text-xs text-gray-400">{d.gameCount ?? 0} {d.gameCount === 1 ? 'game' : 'games'}</p>
                </div>
                <Link to={`/designers/${d.id}`} className="text-gray-300">›</Link>
              </div>
              {d.topGames.length > 0 && (
                <GameGrid games={d.topGames} variant="top-games-row" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
