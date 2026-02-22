import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetDesigner,
  useUpdateDesigner,
  useDeleteDesigner,
  useListBoardGames,
} from '../../api/generated'
import { useAuthStore } from '../../store/auth'
import GameGrid from '../../components/GameGrid'
import { useOwnedGameIds } from '../../hooks/useOwnedGameIds'
import EntityStatsSidebar from '../../components/EntityStatsSidebar'

export default function DesignerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const isAdmin = useAuthStore((s) => s.role === 'ADMIN')
  const ownedGameIds = useOwnedGameIds()

  const { data: designer, isLoading } = useGetDesigner(id!)
  const { data: allGames = [] } = useListBoardGames()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')

  const { mutate: updateDesigner, isPending: updating } = useUpdateDesigner({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [`/api/designers/${id}`] })
        setEditing(false)
      },
    },
  })

  const { mutate: deleteDesigner } = useDeleteDesigner({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['/api/designers'] })
        navigate('/designers')
      },
    },
  })

  if (isLoading) return <p className="text-sm text-gray-500">Loading…</p>
  if (!designer) return <p className="text-sm text-gray-500">Not found.</p>

  const games = allGames.filter((g) =>
    g.designers?.some((d) => d.designerId === id),
  )

  const gameLabels = games.map((g) => g.title ?? '')

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 min-w-0 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (name.trim()) updateDesigner({ id: id!, data: { name: name.trim() } })
            }}
            className="flex gap-2 flex-1 mr-4"
          >
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={updating}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </form>
        ) : (
          <h1 className="text-2xl font-semibold text-gray-900">{designer.name}</h1>
        )}
        {isAdmin && !editing && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => { setName(designer.name ?? ''); setEditing(true) }}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() =>
                window.confirm('Delete this designer?') && deleteDesigner({ id: id! })
              }
              className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {games.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-gray-500 mb-3">Games</h2>
          <GameGrid games={games} ownedGameIds={ownedGameIds} />
        </section>
      )}
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <EntityStatsSidebar entityId={id!} gameCount={games.length} gameLabels={gameLabels} />
      </div>
    </div>
  )
}
