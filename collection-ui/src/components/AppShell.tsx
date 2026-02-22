import { Navigate, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`

export default function AppShell() {
  const token = useAuthStore((s) => s.token)
  const userId = useAuthStore((s) => s.userId)
  const displayName = useAuthStore((s) => s.displayName)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  if (!token) return <Navigate to="/login" replace />

  const collectionsActive =
    pathname.startsWith('/users') && !pathname.startsWith(`/users/${userId}`)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14 gap-6">
          <NavLink to="/board-games" className={navLinkClass}>Board Games</NavLink>
          <NavLink to={`/users/${userId}`} className={navLinkClass}>My Collection</NavLink>
          <NavLink to="/designers" className={navLinkClass}>Designers</NavLink>
          <NavLink to="/publishers" className={navLinkClass}>Publishers</NavLink>
          <NavLink to="/users" className={() => navLinkClass({ isActive: collectionsActive })}>Collections</NavLink>
          <div className="ml-auto flex items-center gap-3">
            {displayName && (
              <span className="text-sm text-gray-600">{displayName}</span>
            )}
            <button
              onClick={() => { clearAuth(); navigate('/login') }}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
