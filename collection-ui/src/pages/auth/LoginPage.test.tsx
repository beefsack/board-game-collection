import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'
import { loginUser } from '../../api/auth'
import { ApiError } from '../../api/client'

const mockNavigate = vi.fn()

vi.mock('../../api/auth', () => ({ loginUser: vi.fn() }))

vi.mock('../../store/auth', () => ({
  useAuthStore: vi.fn((selector: (s: unknown) => unknown) =>
    selector({ token: null, setToken: vi.fn(), clearToken: vi.fn() }),
  ),
}))

vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderPage() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders email, password fields and submit button', () => {
    renderPage()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('calls loginUser with entered credentials on submit', async () => {
    vi.mocked(loginUser).mockResolvedValue({ token: 'test-token' })
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    // TanStack Query v5 passes a context object as a second arg to mutationFn
    expect(loginUser).toHaveBeenCalledWith(
      { email: 'test@example.com', password: 'password123' },
      expect.any(Object),
    )
  })

  it('navigates to /board-games on successful login', async () => {
    vi.mocked(loginUser).mockResolvedValue({ token: 'test-token' })
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/board-games'))
  })

  it('shows error message on 401', async () => {
    vi.mocked(loginUser).mockRejectedValue(new ApiError('Unauthorized', 401))
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument()
  })
})
