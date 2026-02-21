import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import AppShell from './components/AppShell'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import BoardGamesPage from './pages/board-games/BoardGamesPage'
import BoardGameDetailPage from './pages/board-games/BoardGameDetailPage'
import BoardGameFormPage from './pages/board-games/BoardGameFormPage'
import DesignersPage from './pages/designers/DesignersPage'
import DesignerDetailPage from './pages/designers/DesignerDetailPage'
import PublishersPage from './pages/publishers/PublishersPage'
import PublisherDetailPage from './pages/publishers/PublisherDetailPage'
import UsersPage from './pages/users/UsersPage'
import UserDetailPage from './pages/users/UserDetailPage'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/board-games" replace /> },
      { path: '/board-games', element: <BoardGamesPage /> },
      { path: '/board-games/new', element: <BoardGameFormPage /> },
      { path: '/board-games/:id', element: <BoardGameDetailPage /> },
      { path: '/board-games/:id/edit', element: <BoardGameFormPage /> },
      { path: '/designers', element: <DesignersPage /> },
      { path: '/designers/:id', element: <DesignerDetailPage /> },
      { path: '/publishers', element: <PublishersPage /> },
      { path: '/publishers/:id', element: <PublisherDetailPage /> },
      { path: '/users', element: <UsersPage /> },
      { path: '/users/:id', element: <UserDetailPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
