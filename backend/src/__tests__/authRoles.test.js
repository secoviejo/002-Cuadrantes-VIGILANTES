import { describe, expect, it, jest } from '@jest/globals'
import { requireRole } from '../middleware/auth.js'

function runMiddleware(middleware, req) {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  }
  const next = jest.fn()

  middleware(req, res, next)

  return { res, next }
}

describe('requireRole', () => {
  it('permite roles autorizados', () => {
    const { res, next } = runMiddleware(
      requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'),
      { user: { rol: { nombre: 'ADMIN' } } },
    )

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('bloquea roles no autorizados', () => {
    const { res, next } = runMiddleware(
      requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'),
      { user: { rol: { nombre: 'CONTRATA' } } },
    )

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(403)
  })
})
