import { Link } from 'react-router-dom'
import { useListUsers } from '../../api/generated'

export default function UsersPage() {
  const { data: users = [], isLoading } = useListUsers()

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Users</h1>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-500">No users yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {users.map((u) => (
            <li key={u.id}>
              <Link
                to={`/users/${u.id}`}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{u.email}</p>
                  {u.role && (
                    <p className="text-xs text-gray-400 capitalize">{u.role.toLowerCase()}</p>
                  )}
                </div>
                <span className="text-gray-300">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
