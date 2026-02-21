import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`

export default function AppShell() {
  const token = useAuthStore((s) => s.token)
  const clearToken = useAuthStore((s) => s.clearToken)
  const navigate = useNavigate()

  if (!token) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14 gap-6">
          <span className="font-semibold text-gray-900 mr-2">Board Games</span>
          <NavLink to="/board-games" className={navLinkClass}>Collection</NavLink>
          <NavLink to="/designers" className={navLinkClass}>Designers</NavLink>
          <NavLink to="/publishers" className={navLinkClass}>Publishers</NavLink>
          <NavLink to="/users" className={navLinkClass}>Users</NavLink>
          <button
            onClick={() => { clearToken(); navigate('/login') }}
            className="ml-auto text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
