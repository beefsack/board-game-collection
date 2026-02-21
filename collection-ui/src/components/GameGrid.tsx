import { Link } from 'react-router-dom'
import type { BoardGame } from '../api/generated'

interface GameGridProps {
  games: BoardGame[]
}

export default function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return <p className="text-sm text-gray-500">No games found.</p>
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {games.map((game) => (
        <li key={game.id}>
          <Link to={`/board-games/${game.id}`} className="group block">
            <div className="aspect-square rounded-lg bg-gray-100 mb-2" />
            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {game.title}
            </p>
            <p className="text-xs text-gray-400">
              {game.yearPublished ?? '—'}
              {game.weight != null ? ` · ${Number(game.weight).toFixed(1)}★` : ''}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
