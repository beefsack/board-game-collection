import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import BoardGameFormPage from './BoardGameFormPage'
import {
  useGetBoardGame,
  useCreateBoardGame,
  useUpdateBoardGame,
  useUploadBoardGameImage,
  useCreateDesigner,
  useCreatePublisher,
  useListDesigners,
  useListPublishers,
} from '../../api/generated'

const mockNavigate = vi.fn()
const mockCreateMutateAsync = vi.fn().mockResolvedValue({ id: 'new-game-id' })

vi.mock('../../api/generated', () => ({
  useGetBoardGame: vi.fn(),
  useCreateBoardGame: vi.fn(),
  useUpdateBoardGame: vi.fn(),
  useUploadBoardGameImage: vi.fn(),
  useCreateDesigner: vi.fn(),
  useCreatePublisher: vi.fn(),
  useListDesigners: vi.fn(),
  useListPublishers: vi.fn(),
}))

vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate, useParams: () => ({}) }
})

const mockDesigners = [{ id: 'd-1', name: 'Uwe Rosenberg' }]
const mockPublishers = [{ id: 'p-1', name: 'Lookout Games' }]

function renderPage() {
  vi.mocked(useGetBoardGame).mockReturnValue({
    data: undefined,
    isLoading: false,
  } as ReturnType<typeof useGetBoardGame>)
  vi.mocked(useCreateBoardGame).mockReturnValue({
    mutateAsync: mockCreateMutateAsync,
    isPending: false,
  } as unknown as ReturnType<typeof useCreateBoardGame>)
  vi.mocked(useUpdateBoardGame).mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useUpdateBoardGame>)
  vi.mocked(useUploadBoardGameImage).mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useUploadBoardGameImage>)
  vi.mocked(useCreateDesigner).mockReturnValue({
    mutateAsync: vi.fn(),
  } as unknown as ReturnType<typeof useCreateDesigner>)
  vi.mocked(useCreatePublisher).mockReturnValue({
    mutateAsync: vi.fn(),
  } as unknown as ReturnType<typeof useCreatePublisher>)
  vi.mocked(useListDesigners).mockReturnValue({
    data: mockDesigners,
  } as ReturnType<typeof useListDesigners>)
  vi.mocked(useListPublishers).mockReturnValue({
    data: mockPublishers,
  } as ReturnType<typeof useListPublishers>)

  const qc = new QueryClient()
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <BoardGameFormPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('BoardGameFormPage - create mode', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the create form heading and required title field', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Add game' })).toBeInTheDocument()
    expect(screen.getByLabelText('Title *')).toBeInTheDocument()
  })

  it('renders all optional fields', () => {
    renderPage()
    expect(screen.getByLabelText('Year')).toBeInTheDocument()
    expect(screen.getByLabelText('Min play time (min)')).toBeInTheDocument()
    expect(screen.getByLabelText('Max play time (min)')).toBeInTheDocument()
    expect(screen.getByLabelText('Min players')).toBeInTheDocument()
    expect(screen.getByLabelText('Max players')).toBeInTheDocument()
    expect(screen.getByLabelText('Weight')).toBeInTheDocument()
    expect(screen.getByLabelText('Rating (0–10)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search designers...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search publishers...')).toBeInTheDocument()
  })

  it('calls createBoardGame with entered data on submit', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText('Title *'), 'Pandemic')
    await user.type(screen.getByLabelText('Year'), '2008')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(mockCreateMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Pandemic', yearPublished: 2008 }),
      }),
    )
  })

  it('allows selecting a designer via combobox', async () => {
    const user = userEvent.setup()
    renderPage()
    const designerInput = screen.getByPlaceholderText('Search designers...')
    // Typing opens the Headless UI combobox dropdown in jsdom
    await user.type(designerInput, 'Uwe')
    const option = await screen.findByRole('option', { name: 'Uwe Rosenberg' })
    await user.click(option)
    expect(screen.getAllByText('Uwe Rosenberg')[0]).toBeInTheDocument()
  })
})
