import { Link } from 'react-router-dom'
import type { BoardGame } from '../api/generated'

interface GameGridProps {
  games: BoardGame[]
  ownedGameIds?: Set<string>
  variant?: 'default' | 'compact' | 'top-games-row'
}

function compactStats(game: BoardGame): [string, string] {
  const players =
    game.minPlayers != null || game.maxPlayers != null
      ? [game.minPlayers, game.maxPlayers].filter((v) => v != null).join('–') + 'p'
      : null
  const time =
    game.minPlayTimeMinutes != null || game.maxPlayTimeMinutes != null
      ? '⏱ ' + [game.minPlayTimeMinutes, game.maxPlayTimeMinutes].filter((v) => v != null).join('–') + ' min'
      : null
  const rating = game.rating != null ? `★ ${Number(game.rating).toFixed(1)}` : null

  const line1 = [game.yearPublished, players].filter((v) => v != null).join(' · ')
  const line2 = [time, rating].filter((v) => v != null).join(' · ')
  return [line1, line2]
}

export default function GameGrid({ games, ownedGameIds, variant = 'default' }: GameGridProps) {
  if (games.length === 0) {
    return <p className="text-sm text-gray-500">No games found.</p>
  }

  const gridClasses: Record<NonNullable<typeof variant>, string> = {
    'default': 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4',
    'compact': 'grid grid-cols-3 sm:grid-cols-5 gap-2 max-w-2xl',
    'top-games-row': 'grid grid-cols-5 gap-2 max-w-2xl',
  }
  const gridClass = gridClasses[variant ?? 'default']

  return (
    <ul className={gridClass}>
      {games.map((game) => {
        const [line1, line2] = compactStats(game)
        return (
          <li key={game.id}>
            <Link to={`/board-games/${game.id}`} className="group block">
              <div className="relative aspect-square rounded-lg bg-gray-100 mb-2 overflow-hidden">
                {game.hasImage && (
                  <img src={`/images/board-games/${game.id}`} alt="" className="h-full w-full object-cover" />
                )}
                {ownedGameIds?.has(game.id) && (
                  <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                {game.title}
              </p>
              {line1 && <p className="text-xs text-gray-400 truncate">{line1}</p>}
              {line2 && <p className="text-xs text-gray-400 truncate">{line2}</p>}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
