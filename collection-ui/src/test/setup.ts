import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { expect, afterEach } from 'vitest'

expect.extend(matchers)
afterEach(cleanup)

// jsdom does not implement ResizeObserver; Headless UI's combobox requires it.
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
