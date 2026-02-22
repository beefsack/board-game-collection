import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '../../api/auth'
import { ApiError } from '../../api/client'
import { useAuthStore } from '../../store/auth'
import FormField from '../../components/FormField'

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: ({ token, userId, displayName: dn, role }) => {
      setAuth(token, userId, dn, role)
      navigate('/board-games')
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create account</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate({ displayName, email, password })
          }}
          className="space-y-4"
        >
          <FormField id="displayName" label="Display name" type="text" value={displayName} onChange={setDisplayName} required />
          <FormField id="email" label="Email" type="email" value={email} onChange={setEmail} required />
          <FormField id="password" label="Password" type="password" value={password} onChange={setPassword} required minLength={8} />
          {mutation.isError && (
            <p className="text-sm text-red-600">
              {mutation.error instanceof ApiError && mutation.error.status === 409
                ? 'An account with that email already exists.'
                : 'Something went wrong. Please try again.'}
            </p>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {mutation.isPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
