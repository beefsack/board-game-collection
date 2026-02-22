import { Link } from 'react-router-dom'
import type { BoardGame } from '../api/generated'

interface GameGridProps {
  games: BoardGame[]
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

export default function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return <p className="text-sm text-gray-500">No games found.</p>
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {games.map((game) => {
        const [line1, line2] = compactStats(game)
        return (
          <li key={game.id}>
            <Link to={`/board-games/${game.id}`} className="group block">
              <div className="aspect-square rounded-lg bg-gray-100 mb-2 overflow-hidden">
                {game.hasImage && (
                  <img src={`/images/board-games/${game.id}`} alt="" className="h-full w-full object-cover" />
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
