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
  contratoAnual: {
    findUnique: jest.fn(),
  },
}

jest.unstable_mockModule('../db/prisma.js', () => ({
  getPrismaClient: () => mockPrisma,
}))

const {
  obtenerCierreMensual,
  obtenerCuadranteMensual,
  obtenerHorasAnuales,
  obtenerInformeOperativo,
  obtenerResumenOperativo,
} = await import('../services/operativo.service.js')

describe('operativo.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPrisma.contratoAnual.findUnique.mockResolvedValue(contratoRecord())
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

  it('incluye auxiliares programados en el resumen operativo', async () => {
    mockPrisma.horasContratoServicio.findMany.mockResolvedValue([])
    mockPrisma.puestoCobertura.findMany.mockResolvedValue([
      {
        ...puesto(401, 9, 'OCA San Francisco', 'Aux', 'OCA'),
        servicio: {
          perfilRequerido: 'AUXILIAR',
          tipoOperativo: 'Auxiliar',
        },
      },
    ])
    mockPrisma.turno.findMany.mockResolvedValue([
      turnoVerificado(21, 9, '2026-05-18', '06:00', '14:00', 'CUBIERTO', 401, 'CUBIERTO'),
    ])
    mockPrisma.sustitucion.findMany.mockResolvedValue([])

    const resumen = await obtenerResumenOperativo({ fecha: '2026-05-18', turno: 'M' })

    expect(resumen.serviciosVerificacion).toEqual(expect.arrayContaining([
      expect.objectContaining({
        nombre: 'OCA San Francisco',
        etiqueta: 'Aux',
        perfilRequerido: 'AUXILIAR',
        tipoOperativo: 'Auxiliar',
        estado: 'CUBIERTO',
      }),
    ]))
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

  it('refleja incidencias y descubiertos verificados en el cuadrante mensual', async () => {
    mockPrisma.servicio.findMany.mockResolvedValue([
      { id: 1, codigo: 'SERV_PAR_24H', nombre: 'Paraiso', tipoOperativo: 'Vigilancia', descripcion: '24/7', modalidad: '24/7' },
      { id: 2, codigo: 'SERV_VET_24H', nombre: 'Veterinaria', tipoOperativo: 'Vigilancia', descripcion: '24/7', modalidad: '24/7' },
    ])
    mockPrisma.calendarioLaboral.findMany.mockResolvedValue([])
    mockPrisma.turno.findMany.mockResolvedValue([
      turnoVerificado(1, 1, '2026-05-16', '06:00', '14:00', 'CUBIERTO', 101, 'DESCUBIERTO', 'dormido'),
      turnoVerificado(2, 2, '2026-05-16', '06:00', '14:00', 'CUBIERTO', 102, 'INCIDENCIA', 'llega tarde'),
    ])

    const cuadrante = await obtenerCuadranteMensual({ anio: 2026, mes: 5 })
    const paraisoDia16 = cuadrante.servicios[0].celdas[15].turnos[0]
    const veterinariaDia16 = cuadrante.servicios[1].celdas[15].turnos[0]

    expect(paraisoDia16.estado).toBe('CUBIERTO')
    expect(paraisoDia16.verificacionEstado).toBe('DESCUBIERTO')
    expect(paraisoDia16.verificacionResumen).toContain('dormido')
    expect(veterinariaDia16.verificacionEstado).toBe('INCIDENCIA')
    expect(veterinariaDia16.verificacionResumen).toContain('llega tarde')
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
    mockPrisma.contratoAnual.findUnique.mockResolvedValue(contratoRecord({
      bolsaVariableHoras: 2500,
      categorias: [
        categoriaContrato('LABORAL_DIURNO', 'Laboral diurno', 30000, 1),
        categoriaContrato('LABORAL_NOCTURNO', 'Laboral nocturno', 16000, 2),
        categoriaContrato('FESTIVO_DIURNO', 'Festivo diurno', 13000, 3),
        categoriaContrato('FESTIVO_NOCTURNO', 'Festivo nocturno', 7000, 4),
      ],
    }))

    const horas = await obtenerHorasAnuales({ anio: 2026 })

    expect(horas.contratoAnual).toBe(66000)
    expect(horas.acumuladoAnual).toBe(26140)
    expect(horas.variablesAnuales).toBe(2500)
    expect(horas.categorias).toHaveLength(4)
    expect(horas.categorias[0]).toMatchObject({
      codigo: 'LABORAL_DIURNO',
      categoria: 'Laboral diurno',
      contrato: 30000,
    })
  })

  it('genera informe diario con verificaciones de manana, tarde y noche', async () => {
    mockPrisma.horasContratoServicio.findMany.mockResolvedValue([
      { horasPlanificadas: 1488, horasEjecutadas: 1468, servicioId: 1, servicio: servicio('SERV_SF_24H', 'San Francisco', true, 2, '24/7') },
      { horasPlanificadas: 744, horasEjecutadas: 736, servicioId: 2, servicio: servicio('SERV_PAR_24H', 'Paraiso', true, 1, '24/7') },
    ])
    mockPrisma.puestoCobertura.findMany.mockImplementation(({ where }) => {
      const puestos = {
        M: [
          puesto(101, 1, 'San Francisco', 'Vig 1', 'SF1'),
          puesto(102, 2, 'Paraiso', null, 'PAR'),
        ],
        T: [
          puesto(201, 1, 'San Francisco', 'Vig 1', 'SF1'),
        ],
        N: [
          puesto(301, 2, 'Paraiso', null, 'PAR'),
        ],
      }
      return Promise.resolve(puestos[where.turnoCodigo] || [])
    })
    mockPrisma.turno.findMany.mockResolvedValue([
      turnoVerificado(1, 1, '2026-05-16', '06:00', '14:00', 'CUBIERTO', 101, 'CUBIERTO'),
      turnoVerificado(2, 2, '2026-05-16', '06:00', '14:00', 'CUBIERTO', 102, 'DESCUBIERTO', 'dormido'),
      turnoVerificado(3, 1, '2026-05-16', '14:00', '22:00', 'CUBIERTO', 201, 'INCIDENCIA', 'llega tarde'),
      turnoVerificado(4, 2, '2026-05-16', '22:00', '06:00', 'CUBIERTO', 301, 'CUBIERTO'),
    ])
    mockPrisma.sustitucion.findMany.mockResolvedValue([])

    const informe = await obtenerInformeOperativo({ tipo: 'diario', fecha: '2026-05-16' })

    expect(informe.kpis.find((item) => item.label === 'Servicios a verificar').value).toBe(4)
    expect(informe.kpis.find((item) => item.label === 'Incidencias activas').value).toBe(2)
    expect(informe.sections[0].title).toBe('Verificacion de los turnos del dia')
    expect(informe.sections[0].rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ turno: 'Turno mañana (06:00-14:00)', servicio: 'Paraiso', estado: 'DESCUBIERTO', nota: 'dormido' }),
      expect.objectContaining({ turno: 'Turno tarde (14:00-22:00)', servicio: 'San Francisco', estado: 'INCIDENCIA', nota: 'llega tarde' }),
      expect.objectContaining({ turno: 'Turno noche (22:00-06:00)', servicio: 'Paraiso', estado: 'CUBIERTO' }),
    ]))
    expect(informe.sections[1].rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ tipo: 'danger', titulo: 'Servicio descubierto - Paraiso', meta: expect.stringContaining('dormido') }),
      expect.objectContaining({ tipo: 'warn', titulo: 'Incidencia en San Francisco (Vig 1)', meta: expect.stringContaining('llega tarde') }),
    ]))
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

function turnoVerificado(id, servicioId, fecha, inicio, fin, estado, puestoId, estadoVerificacion, nota = '') {
  return {
    ...turno(id, servicioId, fecha, inicio, fin, estado),
    verificaciones: [
      {
        puestoId,
        estado: estadoVerificacion,
        nota,
      },
    ],
  }
}

function puesto(id, servicioId, nombre, etiqueta, iniciales) {
  return {
    id,
    servicioId,
    codigo: iniciales,
    nombre,
    etiqueta,
    meta: '24/7',
    iniciales,
  }
}

function contratoRecord(overrides = {}) {
  return {
    id: 1,
    anio: 2026,
    bolsaVariableHoras: 2000,
    observaciones: '',
    categorias: [
      categoriaContrato('LABORAL_DIURNO', 'Laboral diurno', 27656, 1),
      categoriaContrato('LABORAL_NOCTURNO', 'Laboral nocturno', 15944, 2),
      categoriaContrato('FESTIVO_DIURNO', 'Festivo diurno', 12740, 3),
      categoriaContrato('FESTIVO_NOCTURNO', 'Festivo nocturno', 7168, 4),
    ],
    ...overrides,
  }
}

function categoriaContrato(codigo, nombre, contratoHoras, orden) {
  return { codigo, nombre, contratoHoras, orden }
}
