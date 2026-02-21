import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react'
import {
  useGetBoardGame,
  useCreateBoardGame,
  useUpdateBoardGame,
  useListDesigners,
  useListPublishers,
  type Designer,
  type Publisher,
} from '../../api/generated'

function MultiCombobox<T extends { id?: string; name?: string }>({
  label,
  items,
  selected,
  onChange,
}: {
  label: string
  items: T[]
  selected: T[]
  onChange: (v: T[]) => void
}) {
  const [query, setQuery] = useState('')
  const filtered =
    query === ''
      ? items
      : items.filter((i) => i.name?.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Combobox value={selected} onChange={onChange} multiple>
        <div className="relative">
          <ComboboxInput
            onChange={(e) => setQuery(e.target.value)}
            displayValue={(items: T[]) => items.map((i) => i.name).join(', ')}
            placeholder={`Search ${label.toLowerCase()}…`}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <ComboboxOptions className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white border border-gray-200 shadow-lg text-sm">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-gray-400">No results</div>
            ) : (
              filtered.map((item) => (
                <ComboboxOption
                  key={item.id}
                  value={item}
                  className={({ focus }) =>
                    `cursor-pointer px-3 py-2 ${focus ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'}`
                  }
                >
                  {({ selected }) => (
                    <span className={selected ? 'font-medium' : ''}>{item.name}</span>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selected.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-700"
              >
                {item.name}
                <button
                  type="button"
                  onClick={() => onChange(selected.filter((s) => s.id !== item.id))}
                  className="hover:text-indigo-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </Combobox>
    </div>
  )
}

export default function BoardGameFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: existing } = useGetBoardGame(id!, { query: { enabled: isEdit } })
  const { data: allDesigners = [] } = useListDesigners()
  const { data: allPublishers = [] } = useListPublishers()

  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [minPlayers, setMinPlayers] = useState('')
  const [maxPlayers, setMaxPlayers] = useState('')
  const [playTime, setPlayTime] = useState('')
  const [weight, setWeight] = useState('')
  const [selectedDesigners, setSelectedDesigners] = useState<Designer[]>([])
  const [selectedPublishers, setSelectedPublishers] = useState<Publisher[]>([])

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title ?? '')
    setYear(existing.yearPublished?.toString() ?? '')
    setMinPlayers(existing.minPlayers?.toString() ?? '')
    setMaxPlayers(existing.maxPlayers?.toString() ?? '')
    setPlayTime(existing.playTimeMinutes?.toString() ?? '')
    setWeight(existing.weight?.toString() ?? '')
    setSelectedDesigners(
      allDesigners.filter((d) => existing.designers?.some((gd) => gd.designerId === d.id)),
    )
    setSelectedPublishers(
      allPublishers.filter((p) => existing.publishers?.some((gp) => gp.publisherId === p.id)),
    )
  }, [existing, allDesigners, allPublishers])

  const { mutate: createGame, isPending: creating } = useCreateBoardGame({
    mutation: {
      onSuccess: (game) => {
        qc.invalidateQueries({ queryKey: ['/api/board-games'] })
        navigate(`/board-games/${game.id}`)
      },
    },
  })

  const { mutate: updateGame, isPending: updating } = useUpdateBoardGame({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['/api/board-games'] })
        navigate(`/board-games/${id}`)
      },
    },
  })

  const isPending = creating || updating

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    const data = {
      title,
      yearPublished: year ? parseInt(year) : undefined,
      minPlayers: minPlayers ? parseInt(minPlayers) : undefined,
      maxPlayers: maxPlayers ? parseInt(maxPlayers) : undefined,
      playTimeMinutes: playTime ? parseInt(playTime) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      designerIds: selectedDesigners.map((d) => d.id!),
      publisherIds: selectedPublishers.map((p) => p.id!),
    }
    if (isEdit) {
      updateGame({ id: id!, data })
    } else {
      createGame({ data })
    }
  }

  const fieldClass =
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEdit ? 'Edit game' : 'Add game'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={fieldClass}
              min={1900}
              max={2100}
            />
          </div>
          <div>
            <label htmlFor="playTime" className="block text-sm font-medium text-gray-700 mb-1">
              Play time (min)
            </label>
            <input
              id="playTime"
              type="number"
              value={playTime}
              onChange={(e) => setPlayTime(e.target.value)}
              className={fieldClass}
              min={1}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="minPlayers" className="block text-sm font-medium text-gray-700 mb-1">Min players</label>
            <input
              id="minPlayers"
              type="number"
              value={minPlayers}
              onChange={(e) => setMinPlayers(e.target.value)}
              className={fieldClass}
              min={1}
            />
          </div>
          <div>
            <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-700 mb-1">Max players</label>
            <input
              id="maxPlayers"
              type="number"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              className={fieldClass}
              min={1}
            />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={fieldClass}
              min={1}
              max={5}
              step={0.1}
            />
          </div>
        </div>

        <MultiCombobox<Designer>
          label="Designers"
          items={allDesigners}
          selected={selectedDesigners}
          onChange={setSelectedDesigners}
        />

        <MultiCombobox<Publisher>
          label="Publishers"
          items={allPublishers}
          selected={selectedPublishers}
          onChange={setSelectedPublishers}
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
