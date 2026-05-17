import { jest } from '@jest/globals'

const mockTx = {
  contratoAnual: {
    upsert: jest.fn(),
    findUnique: jest.fn(),
  },
  contratoCategoriaHora: {
    upsert: jest.fn(),
  },
  auditoria: {
    create: jest.fn(),
  },
}

const mockPrisma = {
  contratoAnual: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
}

jest.unstable_mockModule('../db/prisma.js', () => ({
  getPrismaClient: () => mockPrisma,
}))

const {
  actualizarContratoAnual,
  prepararContratoPayload,
} = await import('../services/contratoAnual.service.js')

describe('contratoAnual.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPrisma.$transaction.mockImplementation((callback) => callback(mockTx))
    mockPrisma.contratoAnual.findUnique.mockResolvedValue(null)
    mockTx.contratoAnual.upsert.mockResolvedValue({ id: 7, anio: 2026 })
    mockTx.contratoAnual.findUnique.mockResolvedValue(contratoRecord())
  })

  it('valida bolsa y categorias exactas del contrato', () => {
    const payload = prepararContratoPayload(2026, {
      bolsaVariableHoras: 2000,
      categorias: [
        { codigo: 'LABORAL_DIURNO', contratoHoras: 27656 },
        { codigo: 'LABORAL_NOCTURNO', contratoHoras: 15944 },
        { codigo: 'FESTIVO_DIURNO', contratoHoras: 12740 },
        { codigo: 'FESTIVO_NOCTURNO', contratoHoras: 7168 },
      ],
      observaciones: 'PTT vigente',
    })

    expect(payload.anio).toBe(2026)
    expect(payload.bolsaVariableHoras).toBe(2000)
    expect(payload.categorias).toHaveLength(4)
    expect(payload.categorias[0]).toMatchObject({
      codigo: 'LABORAL_DIURNO',
      nombre: 'Laboral diurno',
      contratoHoras: 27656,
    })
  })

  it('rechaza categorias incompletas o valores negativos', () => {
    expect(() => prepararContratoPayload(2026, {
      bolsaVariableHoras: -1,
      categorias: [],
    })).toThrow('bolsaVariableHoras debe ser un numero entero no negativo')

    expect(() => prepararContratoPayload(2026, {
      bolsaVariableHoras: 2000,
      categorias: [
        { codigo: 'LABORAL_DIURNO', contratoHoras: 27656 },
      ],
    })).toThrow('categorias debe incluir exactamente las categorias del contrato')
  })

  it('actualiza contrato y registra auditoria', async () => {
    const contrato = await actualizarContratoAnual({
      anio: 2026,
      usuarioId: 3,
      payload: {
        bolsaVariableHoras: 2000,
        categorias: [
          { codigo: 'LABORAL_DIURNO', contratoHoras: 27656 },
          { codigo: 'LABORAL_NOCTURNO', contratoHoras: 15944 },
          { codigo: 'FESTIVO_DIURNO', contratoHoras: 12740 },
          { codigo: 'FESTIVO_NOCTURNO', contratoHoras: 7168 },
        ],
        observaciones: 'PTT vigente',
      },
    })

    expect(contrato.contratoAnual).toBe(63508)
    expect(mockTx.contratoCategoriaHora.upsert).toHaveBeenCalledTimes(4)
    expect(mockTx.auditoria.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        usuarioId: 3,
        accion: 'UPDATE',
        entidad: 'ContratoAnual',
        entidadId: '2026',
      }),
    })
  })
})

function contratoRecord() {
  return {
    id: 7,
    anio: 2026,
    bolsaVariableHoras: 2000,
    observaciones: 'PTT vigente',
    categorias: [
      { codigo: 'LABORAL_DIURNO', nombre: 'Laboral diurno', contratoHoras: 27656, orden: 1 },
      { codigo: 'LABORAL_NOCTURNO', nombre: 'Laboral nocturno', contratoHoras: 15944, orden: 2 },
      { codigo: 'FESTIVO_DIURNO', nombre: 'Festivo diurno', contratoHoras: 12740, orden: 3 },
      { codigo: 'FESTIVO_NOCTURNO', nombre: 'Festivo nocturno', contratoHoras: 7168, orden: 4 },
    ],
  }
}
