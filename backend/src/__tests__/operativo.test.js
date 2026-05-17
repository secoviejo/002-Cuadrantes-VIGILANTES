import { jest } from '@jest/globals'

const mockPrisma = {
  horasContratoServicio: {
    findMany: jest.fn(),
  },
  puestoCobertura: {
    findMany: jest.fn(),
  },
  turno: {
    findMany: jest.fn(),
  },
  sustitucion: {
    findMany: jest.fn(),
  },
  servicio: {
    findMany: jest.fn(),
  },
  calendarioLaboral: {
    findMany: jest.fn(),
  },
}

jest.unstable_mockModule('../db/prisma.js', () => ({
  getPrismaClient: () => mockPrisma,
}))

const {
  obtenerCierreMensual,
  obtenerCuadranteMensual,
  obtenerHorasAnuales,
  obtenerResumenOperativo,
} = await import('../services/operativo.service.js')

describe('operativo.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calcula KPIs de mayo 2026 con horas reales recuperadas del HTML original', async () => {
    mockPrisma.horasContratoServicio.findMany.mockResolvedValue([
      { horasPlanificadas: 1488, horasEjecutadas: 1468, servicioId: 1, servicio: servicio('SERV_SF_24H', 'San Francisco', true, 2, '24/7') },
      { horasPlanificadas: 744, horasEjecutadas: 736, servicioId: 2, servicio: servicio('SERV_PAR_24H', 'Paraiso', true, 1, '24/7') },
      { horasPlanificadas: 744, horasEjecutadas: 736, servicioId: 3, servicio: servicio('SERV_VET_24H', 'Veterinaria', true, 1, '24/7') },
      { horasPlanificadas: 744, horasEjecutadas: 736, servicioId: 4, servicio: servicio('SERV_RE_24H', 'Rio Ebro', true, 1, '24/7') },
      { horasPlanificadas: 912, horasEjecutadas: 880, servicioId: 5, servicio: servicio('SERV_CECO_24H', 'CECO', true, 1, '24/7') },
      { horasPlanificadas: 310, horasEjecutadas: 310, servicioId: 6, servicio: servicio('SERV_TER_NOCTURNO', 'Teruel', true, 1, 'NOCTURNO') },
      { horasPlanificadas: 412, horasEjecutadas: 442, servicioId: 7, servicio: servicio('SERV_HUE_VARIABLE', 'Huesca', true, 1, 'VARIABLE') },
      { horasPlanificadas: 40, horasEjecutadas: 0, servicioId: 8, servicio: servicio('SERV_SALAS_ESTUDIO', 'Salas estudio', false, 1, 'A_DEMANDA') },
    ])
    mockPrisma.puestoCobertura.findMany.mockResolvedValue([])
    mockPrisma.turno.findMany.mockResolvedValue([])
    mockPrisma.sustitucion.findMany.mockResolvedValue([])

    const resumen = await obtenerResumenOperativo({ fecha: '2026-05-16', turno: 'N' })

    expect(resumen.kpis.horasPlanificadas).toBe(5394)
    expect(resumen.kpis.horasEjecutadas).toBe(5308)
    expect(resumen.kpis.desviacionHoras).toBe(-86)
    expect(resumen.coberturaCampus).toHaveLength(7)
  })

  it('devuelve cuadrante mensual de mayo con 31 dias y descubiertos esperados', async () => {
    mockPrisma.servicio.findMany.mockResolvedValue([
      { id: 1, codigo: 'SERV_HUE_VARIABLE', nombre: 'Huesca', tipoOperativo: 'Vigilancia', descripcion: 'Variable', modalidad: 'VARIABLE' },
      { id: 2, codigo: 'SERV_CECO_JEFE', nombre: 'CECO Jefe equipo', tipoOperativo: 'Coordinacion', descripcion: 'L-V diurno', modalidad: 'LABORAL_DIURNO' },
    ])
    mockPrisma.calendarioLaboral.findMany.mockResolvedValue([
      { fecha: new Date('2026-05-01T00:00:00.000Z') },
    ])
    mockPrisma.turno.findMany.mockResolvedValue([
      turno(1, 1, '2026-05-10', '14:00', '22:00', 'SIN_CUBRIR'),
      turno(2, 2, '2026-05-06', '08:00', '16:00', 'SIN_CUBRIR'),
      turno(3, 2, '2026-05-14', '08:00', '16:00', 'SIN_CUBRIR'),
    ])

    const cuadrante = await obtenerCuadranteMensual({ anio: 2026, mes: 5 })
    const descubiertos = cuadrante.servicios.flatMap((item) =>
      item.celdas.flatMap((celda) => celda.turnos.filter((entry) => entry.estado === 'DESCUBIERTO')),
    )

    expect(cuadrante.dias).toHaveLength(31)
    expect(cuadrante.servicios).toHaveLength(2)
    expect(descubiertos).toHaveLength(3)
    expect(cuadrante.etiqueta).toBe('Mayo 2026')
    expect(cuadrante.origen).toBe('persistido')
    expect(cuadrante.dias[0].festivo).toBe(true)
    expect(cuadrante.dias[0].tipoDia).toBe('FESTIVO')
  })

  it('genera una planificacion base para meses de 2026 sin turnos persistidos', async () => {
    mockPrisma.servicio.findMany.mockResolvedValue([
      { id: 1, codigo: 'SERV_PAR_24H', nombre: 'Paraiso', tipoOperativo: 'Vigilancia', descripcion: '24/7', modalidad: '24/7' },
      { id: 2, codigo: 'SERV_CECO_JEFE', nombre: 'CECO Jefe equipo', tipoOperativo: 'Coordinacion', descripcion: 'L-V diurno', modalidad: 'LABORAL_DIURNO' },
      { id: 3, codigo: 'SERV_TER_NOCTURNO', nombre: 'Teruel', tipoOperativo: 'Vigilancia', descripcion: '22:00-08:00 sin agosto', modalidad: 'NOCTURNO' },
    ])
    mockPrisma.turno.findMany.mockResolvedValue([])
    mockPrisma.calendarioLaboral.findMany.mockResolvedValue([
      { fecha: new Date('2026-06-24T00:00:00.000Z') },
    ])

    const cuadrante = await obtenerCuadranteMensual({ anio: 2026, mes: 6 })

    expect(cuadrante.dias).toHaveLength(30)
    expect(cuadrante.etiqueta).toBe('Junio 2026')
    expect(cuadrante.origen).toBe('patron')
    expect(cuadrante.dias[23].festivo).toBe(true)
    expect(cuadrante.dias[23].tipoDia).toBe('FESTIVO')
    expect(cuadrante.servicios[0].celdas[0].turnos.map((item) => item.codigo)).toEqual(['M', 'T', 'N'])
    expect(cuadrante.servicios[1].celdas[0].turnos.map((item) => item.codigo)).toEqual(['D'])
    expect(cuadrante.servicios[2].celdas[0].turnos.map((item) => item.codigo)).toEqual(['N'])
  })

  it('marca no lectivos segun calendario academico y aplica el patron variable del PTT', async () => {
    mockPrisma.servicio.findMany.mockResolvedValue([
      { id: 1, codigo: 'SERV_HUE_VARIABLE', nombre: 'Huesca', tipoOperativo: 'Vigilancia', descripcion: 'Variable', modalidad: 'VARIABLE' },
    ])
    mockPrisma.turno.findMany.mockResolvedValue([])
    mockPrisma.calendarioLaboral.findMany.mockResolvedValue([])

    const cuadrante = await obtenerCuadranteMensual({ anio: 2026, mes: 2 })

    expect(cuadrante.dias[1].fecha).toBe('2026-02-02')
    expect(cuadrante.dias[1].tipoDia).toBe('NO_LECTIVO')
    expect(cuadrante.dias[1].tipoDiaLabel).toBe('No lectivo')
    expect(cuadrante.servicios[0].celdas[1].turnos.map((item) => item.codigo)).toEqual(['T', 'N'])
  })

  it('devuelve cierre mensual con totales planificado y ejecutado', async () => {
    mockPrisma.horasContratoServicio.findMany.mockResolvedValue([
      { horasPlanificadas: 1488, horasEjecutadas: 1468, servicioId: 1, servicio: servicio('SERV_SF_24H', 'San Francisco', true, 2, '24/7') },
      { horasPlanificadas: 40, horasEjecutadas: 0, servicioId: 2, servicio: servicio('SERV_SALAS_ESTUDIO', 'Salas estudio', false, 1, 'A_DEMANDA') },
    ])

    const cierre = await obtenerCierreMensual({ anio: 2026, mes: 5 })

    expect(cierre.totales.planificadas).toBe(1528)
    expect(cierre.totales.ejecutadas).toBe(1468)
    expect(cierre.categorias).toHaveLength(4)
  })

  it('devuelve horas anuales con contrato y bolsa variable informativa', async () => {
    mockPrisma.horasContratoServicio.findMany.mockResolvedValue([
      { horasPlanificadas: 1488, horasEjecutadas: 1468, servicioId: 1, servicio: servicio('SERV_SF_24H', 'San Francisco', true, 2, '24/7') },
    ])

    const horas = await obtenerHorasAnuales({ anio: 2026 })

    expect(horas.contratoAnual).toBe(63508)
    expect(horas.acumuladoAnual).toBe(26140)
    expect(horas.variablesAnuales).toBe(2000)
    expect(horas.categorias).toHaveLength(4)
  })
})

function servicio(codigo, nombre, visibleCuadrante, dotacionMinima, modalidad) {
  return {
    codigo,
    nombre,
    descripcion: nombre,
    visibleCuadrante,
    dotacionMinima,
    modalidad,
  }
}

function turno(id, servicioId, fecha, inicio, fin, estado) {
  return {
    id,
    servicioId,
    fecha: new Date(`${fecha}T00:00:00.000Z`),
    horaInicio: new Date(`${fecha}T${inicio}:00.000Z`),
    horaFin: new Date(`${fecha}T${fin}:00.000Z`),
    estado,
  }
}
