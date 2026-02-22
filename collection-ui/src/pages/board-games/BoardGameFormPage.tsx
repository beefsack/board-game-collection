import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react'
import {
  useGetBoardGame,
  useCreateBoardGame,
  useUpdateBoardGame,
  useUploadBoardGameImage,
  useCreateDesigner,
  useCreatePublisher,
  useListDesigners,
  useListPublishers,
  type DesignerResponse,
  type PublisherResponse,
} from '../../api/generated'

function MultiCombobox<T extends { id?: string; name?: string }>({
  label,
  items,
  selected,
  onChange,
  onCreate,
}: {
  label: string
  items: T[]
  selected: T[]
  onChange: (v: T[]) => void
  onCreate?: (name: string) => Promise<T>
}) {
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)

  const trimmed = query.trim()
  const filtered = items.filter(
    (i) =>
      !selected.some((s) => s.id === i.id) &&
      (query === '' || i.name?.toLowerCase().includes(query.toLowerCase())),
  )
  const showCreate =
    !!onCreate &&
    trimmed !== '' &&
    !items.some((i) => i.name?.toLowerCase() === trimmed.toLowerCase())

  const handleChange = async (item: T | null) => {
    if (!item) return
    if (item.id === '__create__') {
      setCreating(true)
      try {
        const created = await onCreate!(trimmed)
        onChange([...selected, created])
      } finally {
        setCreating(false)
      }
    } else {
      onChange([...selected, item])
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Combobox value={null} onChange={handleChange} disabled={creating} onClose={() => setQuery('')}>
        <div className="relative">
          <ComboboxInput
            onChange={(e) => setQuery(e.target.value)}
            displayValue={() => ''}
            placeholder={`Search ${label.toLowerCase()}…`}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <ComboboxOptions className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white border border-gray-200 shadow-lg text-sm">
            {filtered.length === 0 && !showCreate ? (
              <div className="px-3 py-2 text-gray-400">No results</div>
            ) : (
              <>
                {filtered.map((item) => (
                  <ComboboxOption
                    key={item.id}
                    value={item}
                    className={({ focus }) =>
                      `cursor-pointer px-3 py-2 ${focus ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'}`
                    }
                  >
                    {item.name}
                  </ComboboxOption>
                ))}
                {showCreate && (
                  <ComboboxOption
                    value={{ id: '__create__', name: trimmed } as unknown as T}
                    className={({ focus }) =>
                      `cursor-pointer px-3 py-2 italic ${focus ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500'}`
                    }
                  >
                    Create "{trimmed}"
                  </ComboboxOption>
                )}
              </>
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
  const [minPlayTime, setMinPlayTime] = useState('')
  const [maxPlayTime, setMaxPlayTime] = useState('')
  const [weight, setWeight] = useState('')
  const [rating, setRating] = useState('')
  const [selectedDesigners, setSelectedDesigners] = useState<DesignerResponse[]>([])
  const [selectedPublishers, setSelectedPublishers] = useState<PublisherResponse[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title ?? '')
    setYear(existing.yearPublished?.toString() ?? '')
    setMinPlayers(existing.minPlayers?.toString() ?? '')
    setMaxPlayers(existing.maxPlayers?.toString() ?? '')
    setMinPlayTime(existing.minPlayTimeMinutes?.toString() ?? '')
    setMaxPlayTime(existing.maxPlayTimeMinutes?.toString() ?? '')
    setWeight(existing.weight?.toString() ?? '')
    setRating(existing.rating?.toString() ?? '')
    setSelectedDesigners(
      allDesigners.filter((d) => existing.designers?.some((gd) => gd.designerId === d.id)),
    )
    setSelectedPublishers(
      allPublishers.filter((p) => existing.publishers?.some((gp) => gp.publisherId === p.id)),
    )
  }, [existing, allDesigners, allPublishers])

  const { mutateAsync: createGame, isPending: creating } = useCreateBoardGame()
  const { mutateAsync: updateGame, isPending: updating } = useUpdateBoardGame()
  const { mutateAsync: uploadImage, isPending: uploading } = useUploadBoardGameImage()
  const { mutateAsync: createDesigner } = useCreateDesigner()
  const { mutateAsync: createPublisher } = useCreatePublisher()

  const isPending = creating || updating || uploading

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    const data = {
      title,
      yearPublished: year ? parseInt(year) : undefined,
      minPlayers: minPlayers ? parseInt(minPlayers) : undefined,
      maxPlayers: maxPlayers ? parseInt(maxPlayers) : undefined,
      minPlayTimeMinutes: minPlayTime ? parseInt(minPlayTime) : undefined,
      maxPlayTimeMinutes: maxPlayTime ? parseInt(maxPlayTime) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      rating: rating ? parseFloat(rating) : undefined,
      designerIds: selectedDesigners.map((d) => d.id!),
      publisherIds: selectedPublishers.map((p) => p.id!),
    }
    const gameId = isEdit
      ? (await updateGame({ id: id!, data }), id!)
      : (await createGame({ data })).id!
    if (imageFile) {
      await uploadImage({ id: gameId, data: { file: imageFile } })
    }
    qc.invalidateQueries({ queryKey: ['/api/board-games'] })
    navigate(`/board-games/${gameId}`)
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
            />
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating (0–10)</label>
            <input
              id="rating"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className={fieldClass}
              min={0}
              max={10}
              step={0.1}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="minPlayTime" className="block text-sm font-medium text-gray-700 mb-1">Min play time (min)</label>
            <input
              id="minPlayTime"
              type="number"
              value={minPlayTime}
              onChange={(e) => setMinPlayTime(e.target.value)}
              className={fieldClass}
              min={1}
            />
          </div>
          <div>
            <label htmlFor="maxPlayTime" className="block text-sm font-medium text-gray-700 mb-1">Max play time (min)</label>
            <input
              id="maxPlayTime"
              type="number"
              value={maxPlayTime}
              onChange={(e) => setMaxPlayTime(e.target.value)}
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
              step={0.01}
            />
          </div>
        </div>

        <MultiCombobox<DesignerResponse>
          label="Designers"
          items={allDesigners}
          selected={selectedDesigners}
          onChange={setSelectedDesigners}
          onCreate={async (name) => {
            const designer = await createDesigner({ data: { name } })
            qc.invalidateQueries({ queryKey: ['/api/designers'] })
            return designer
          }}
        />

        <MultiCombobox<PublisherResponse>
          label="Publishers"
          items={allPublishers}
          selected={selectedPublishers}
          onChange={setSelectedPublishers}
          onCreate={async (name) => {
            const publisher = await createPublisher({ data: { name } })
            qc.invalidateQueries({ queryKey: ['/api/publishers'] })
            return publisher
          }}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          {isEdit && existing?.hasImage && (
            <img src={`/images/board-games/${id}`} alt="" className="h-32 w-32 object-cover rounded mb-2" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer"
          />
        </div>

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
