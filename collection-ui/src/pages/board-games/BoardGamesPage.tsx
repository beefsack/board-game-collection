import { Link } from 'react-router-dom'
import { useListBoardGames } from '../../api/generated'
import GameGrid from '../../components/GameGrid'

export default function BoardGamesPage() {
  const { data: games = [], isLoading } = useListBoardGames()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Board Games</h1>
        <Link
          to="/board-games/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Add game
        </Link>
      </div>
      {isLoading ? <p className="text-sm text-gray-500">Loading…</p> : <GameGrid games={games} />}
    </div>
  )
}
