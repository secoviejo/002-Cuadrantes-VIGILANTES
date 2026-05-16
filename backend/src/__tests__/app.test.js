import { describe, expect, it } from '@jest/globals'

describe('Express app', () => {
  it('debe importar createApp sin romper el registro de rutas', async () => {
    const { createApp } = await import('../app.js')
    const app = createApp()

    expect(typeof createApp).toBe('function')
    expect(app).toBeDefined()
  })
})
