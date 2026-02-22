import { test, expect } from '@playwright/test'

const AUTH_STORAGE = JSON.stringify({ state: { token: 'fake-jwt', userId: 'u-1', displayName: 'Test User', role: 'ADMIN' }, version: 0 })

test.beforeEach(async ({ page }) => {
  await page.addInitScript(`localStorage.setItem('auth', ${JSON.stringify(AUTH_STORAGE)})`)
})

test('board games list shows games from API', async ({ page }) => {
  await page.route('**/api/board-games', (route) =>
    route.fulfill({ json: [{ id: 'g-1', title: 'Pandemic', yearPublished: 2008 }] }),
  )

  await page.goto('/board-games')

  await expect(page.getByText('Pandemic')).toBeVisible()
})

test('add game link navigates to create form', async ({ page }) => {
  await page.route('**/api/board-games', (route) => route.fulfill({ json: [] }))

  await page.goto('/board-games')
  await page.getByRole('link', { name: 'Add game' }).click()

  await expect(page).toHaveURL('/board-games/new')
})

test('create form submits new game and redirects to detail', async ({ page }) => {
  await page.route('**/api/designers', (route) => route.fulfill({ json: [] }))
  await page.route('**/api/publishers', (route) => route.fulfill({ json: [] }))
  await page.route('**/api/board-games/*', (route) =>
    route.fulfill({ json: { id: 'g-new', title: 'Wingspan' } }),
  )
  await page.route('**/api/board-games', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({ json: { id: 'g-new', title: 'Wingspan' } })
    } else {
      route.fulfill({ json: [] })
    }
  })

  await page.goto('/board-games/new')
  await page.getByLabel('Title *').fill('Wingspan')
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page).toHaveURL('/board-games/g-new')
})
