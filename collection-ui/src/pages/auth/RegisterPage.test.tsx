import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from './RegisterPage'
import { register } from '../../api/generated'
import { ApiError } from '../../api/client'

const mockNavigate = vi.fn()

vi.mock('../../api/generated', () => ({ register: vi.fn() }))

vi.mock('../../store/auth', () => ({
  useAuthStore: vi.fn((selector: (s: unknown) => unknown) =>
    selector({ token: null, setAuth: vi.fn(), clearAuth: vi.fn() }),
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
        <RegisterPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('RegisterPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders email, password fields and submit button', () => {
    renderPage()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument()
  })

  it('calls register with entered credentials on submit', async () => {
    vi.mocked(register).mockResolvedValue({ token: 'test-token', userId: 'u-1', displayName: 'Alice', role: 'USER' })
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText('Display name'), 'Alice')
    await user.type(screen.getByLabelText('Email'), 'new@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(register).toHaveBeenCalledWith(
      { displayName: 'Alice', email: 'new@example.com', password: 'password123' },
    )
  })

  it('navigates to /board-games on successful registration', async () => {
    vi.mocked(register).mockResolvedValue({ token: 'test-token', userId: 'u-1', displayName: 'Alice', role: 'USER' })
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText('Display name'), 'Alice')
    await user.type(screen.getByLabelText('Email'), 'new@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/board-games'))
  })

  it('shows error message on 409 duplicate email', async () => {
    vi.mocked(register).mockRejectedValue(new ApiError('Conflict', 409))
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText('Display name'), 'Alice')
    await user.type(screen.getByLabelText('Email'), 'existing@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(
      await screen.findByText('An account with that email already exists.'),
    ).toBeInTheDocument()
  })
})
