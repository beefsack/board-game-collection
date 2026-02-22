import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import BoardGameDetailPage from './BoardGameDetailPage'
import {
  useGetBoardGame,
  useDeleteBoardGame,
  useListDesigners,
  useListPublishers,
} from '../../api/generated'

const mockNavigate = vi.fn()
const mockDeleteMutate = vi.fn()

vi.mock('../../api/generated', () => ({
  useGetBoardGame: vi.fn(),
  useDeleteBoardGame: vi.fn(),
  useListDesigners: vi.fn(),
  useListPublishers: vi.fn(),
}))

vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate, useParams: () => ({ id: 'game-1' }) }
})

const mockGame = {
  id: 'game-1',
  title: 'Wingspan',
  yearPublished: 2019,
  minPlayers: 1,
  maxPlayers: 5,
  minPlayTimeMinutes: 70,
  weight: 2.4,
  designers: [{ designerId: 'designer-1' }],
  publishers: [{ publisherId: 'publisher-1' }],
}

function renderPage() {
  vi.mocked(useGetBoardGame).mockReturnValue({
    data: mockGame,
    isLoading: false,
  } as ReturnType<typeof useGetBoardGame>)
  vi.mocked(useDeleteBoardGame).mockReturnValue({
    mutate: mockDeleteMutate,
  } as unknown as ReturnType<typeof useDeleteBoardGame>)
  vi.mocked(useListDesigners).mockReturnValue({
    data: [{ id: 'designer-1', name: 'Elizabeth Hargrave' }],
  } as ReturnType<typeof useListDesigners>)
  vi.mocked(useListPublishers).mockReturnValue({
    data: [{ id: 'publisher-1', name: 'Stonemaier Games' }],
  } as ReturnType<typeof useListPublishers>)

  const qc = new QueryClient()
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <BoardGameDetailPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('BoardGameDetailPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the game title and meta fields', () => {
    renderPage()
    expect(screen.getByText('Wingspan')).toBeInTheDocument()
    expect(screen.getByText('2019')).toBeInTheDocument()
    expect(screen.getByText('1–5')).toBeInTheDocument()
    expect(screen.getByText('70 min')).toBeInTheDocument()
    expect(screen.getByText('2.40 / 5')).toBeInTheDocument()
  })

  it('renders resolved designer and publisher names as links', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Elizabeth Hargrave' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Stonemaier Games' })).toBeInTheDocument()
  })

  it('calls deleteBoardGame mutation on confirmed delete', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(mockDeleteMutate).toHaveBeenCalledWith({ id: 'game-1' })
  })
})
