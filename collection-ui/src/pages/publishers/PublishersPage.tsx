import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useListPublishers, useCreatePublisher } from '../../api/generated'

export default function PublishersPage() {
  const qc = useQueryClient()
  const { data: publishers = [], isLoading } = useListPublishers()
  const [name, setName] = useState('')
  const { mutate: createPublisher, isPending } = useCreatePublisher({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['/api/publishers'] })
        setName('')
      },
    },
  })

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (name.trim()) createPublisher({ data: { name: name.trim() } })
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Publishers</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Publisher name"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isPending || !name.trim()}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          Add
        </button>
      </form>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : publishers.length === 0 ? (
        <p className="text-sm text-gray-500">No publishers yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {publishers.map((p) => (
            <li key={p.id}>
              <Link
                to={`/publishers/${p.id}`}
                className="flex items-center justify-between py-3 hover:text-indigo-600 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">{p.name}</span>
                <span className="text-gray-300">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
