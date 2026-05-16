import { jest } from '@jest/globals'

const mockPrisma = {
  calendarioLaboral: {
    findMany: jest.fn(),
    upsert: jest.fn(),
  },
}

jest.unstable_mockModule('../db/prisma.js', () => ({
  getPrismaClient: () => mockPrisma,
}))

const { obtenerCalendarioLaboral } = await import('../services/calendario.service.js')

describe('calendario.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('devuelve festivos y periodos academicos 2026', async () => {
    mockPrisma.calendarioLaboral.findMany.mockResolvedValue([
      {
        id: 1,
        codigo: 'CAL_2026_0501_TRABAJO',
        fecha: new Date('2026-05-01T00:00:00.000Z'),
        descripcion: 'Dia del Trabajo',
        tipo: 'FESTIVO',
        campusId: null,
        campus: null,
      },
    ])

    const calendario = await obtenerCalendarioLaboral({ anio: 2026 })

    expect(calendario.festivos).toHaveLength(1)
    expect(calendario.festivos[0].fechaCorta).toBe('01/05')
    expect(calendario.periodosAcademicos).toHaveLength(8)
  })
})
