import { test, expect } from '@playwright/test'

test('login page renders sign-in form', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Password')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
})

test('successful login redirects to /board-games', async ({ page }) => {
  await page.route('**/api/auth/login', (route) =>
    route.fulfill({ json: { token: 'fake-jwt', userId: 'u-1', displayName: 'Alice', role: 'USER' } }),
  )
  await page.route('**/api/board-games', (route) => route.fulfill({ json: [] }))

  await page.goto('/login')
  await page.getByLabel('Email').fill('user@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL('/board-games')
})

test('failed login shows error message', async ({ page }) => {
  await page.route('**/api/auth/login', (route) => route.fulfill({ status: 401 }))

  await page.goto('/login')
  await page.getByLabel('Email').fill('user@example.com')
  await page.getByLabel('Password').fill('wrongpassword')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page.getByText('Invalid email or password.')).toBeVisible()
})

test('register page renders create-account form', async ({ page }) => {
  await page.goto('/register')
  await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Password')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible()
})

test('successful registration redirects to /board-games', async ({ page }) => {
  await page.route('**/api/auth/register', (route) =>
    route.fulfill({ json: { token: 'fake-jwt', userId: 'u-1', displayName: 'Alice', role: 'USER' } }),
  )
  await page.route('**/api/board-games', (route) => route.fulfill({ json: [] }))

  await page.goto('/register')
  await page.getByLabel('Display name').fill('Alice')
  await page.getByLabel('Email').fill('newuser@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL('/board-games')
})
