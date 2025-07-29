import { beforeAll, vi } from 'vitest'

// Global test setup
beforeAll(() => {
  // Mock crypto.randomUUID globally
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: vi.fn(() => 'test-uuid-global')
    }
  })

  // Mock console methods to avoid noise in tests (unless testing them specifically)
  vi.spyOn(console, 'warn').mockImplementation(() => { })
  vi.spyOn(console, 'log').mockImplementation(() => { })
  vi.spyOn(console, 'error').mockImplementation(() => { })
})

// Cleanup after each test
import { afterEach } from 'vitest'
afterEach(() => {
  vi.clearAllMocks()
})
