import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetBoardGame,
  useDeleteBoardGame,
  useListDesigners,
  useListPublishers,
} from '../../api/generated'
import { useAuthStore } from '../../store/auth'

export default function BoardGameDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const isAdmin = useAuthStore((s) => s.role === 'ADMIN')

  const { data: game, isLoading } = useGetBoardGame(id!)
  const { data: designers = [] } = useListDesigners()
  const { data: publishers = [] } = useListPublishers()
  const { mutate: deleteGame } = useDeleteBoardGame({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['/api/board-games'] })
        navigate('/board-games')
      },
    },
  })

  if (isLoading) return <p className="text-sm text-gray-500">Loading…</p>
  if (!game) return <p className="text-sm text-gray-500">Not found.</p>

  const gameDesigners = designers.filter((d) =>
    game.designers?.some((gd) => gd.designerId === d.id),
  )
  const gamePublishers = publishers.filter((p) =>
    game.publishers?.some((gp) => gp.publisherId === p.id),
  )

  const playTime = game.minPlayTimeMinutes != null || game.maxPlayTimeMinutes != null
    ? [game.minPlayTimeMinutes, game.maxPlayTimeMinutes].filter(Boolean).join('–') + ' min'
    : null

  const meta: Array<[string, string | number | null | undefined]> = [
    ['Year', game.yearPublished],
    ['Players', game.minPlayers != null && game.maxPlayers != null
      ? `${game.minPlayers}–${game.maxPlayers}`
      : (game.minPlayers ?? game.maxPlayers)],
    ['Play time', playTime],
    ['Weight', game.weight != null ? `${Number(game.weight).toFixed(2)} / 5` : null],
    ['Rating', game.rating != null ? `${Number(game.rating).toFixed(1)} / 10` : null],
  ]

  return (
    <div className="max-w-2xl">
      {game.hasImage && (
        <img src={`/images/board-games/${id}`} alt="" className="rounded-xl max-w-full mb-6" />
      )}

      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{game.title}</h1>
        {isAdmin && (
          <div className="flex gap-2 shrink-0 ml-4">
            <Link
              to={`/board-games/${id}/edit`}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() =>
                window.confirm('Delete this game?') && deleteGame({ id: id! })
              }
              className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {meta.map(([label, value]) =>
          value != null ? (
            <div key={label} className="bg-gray-50 rounded-lg p-3">
              <dt className="text-xs text-gray-500 mb-0.5">{label}</dt>
              <dd className="text-sm font-medium text-gray-900">{value}</dd>
            </div>
          ) : null,
        )}
      </dl>

      {gameDesigners.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Designers</h2>
          <div className="flex flex-wrap gap-2">
            {gameDesigners.map((d) => (
              <Link
                key={d.id}
                to={`/designers/${d.id}`}
                className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                {d.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {gamePublishers.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Publishers</h2>
          <div className="flex flex-wrap gap-2">
            {gamePublishers.map((p) => (
              <Link
                key={p.id}
                to={`/publishers/${p.id}`}
                className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
