import { getPrismaClient } from '../db/prisma.js'

const TURNOS = {
  M: { nombre: 'Turno mañana', rango: '06:00-14:00', horaInicio: 6 },
  T: { nombre: 'Turno tarde', rango: '14:00-22:00', horaInicio: 14 },
  N: { nombre: 'Turno noche', rango: '22:00-06:00', horaInicio: 22 },
  D: { nombre: 'Diurno', rango: '08:00-16:00', horaInicio: 8 },
}

const CONTRATO_ANUAL_HORAS = 63508
const ACUMULADO_ANUAL_HORAS = 26140
const VARIABLES_ANUALES_HORAS = 2000
const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const DESGLOSE_CATEGORIAS_MAYO = [
  { categoria: 'Laboral diurno', planificadas: 2380, ejecutadas: 2358 },
  { categoria: 'Laboral nocturno', planificadas: 1380, ejecutadas: 1358 },
  { categoria: 'Festivo diurno', planificadas: 1040, ejecutadas: 1018 },
  { categoria: 'Festivo nocturno', planificadas: 594, ejecutadas: 574 },
]

const DESGLOSE_ANUAL_CATEGORIAS = [
  { categoria: 'Laboral diurno', ejecutadas: 11420, contrato: 27656 },
  { categoria: 'Laboral nocturno', ejecutadas: 6580, contrato: 15944 },
  { categoria: 'Festivo diurno', ejecutadas: 5250, contrato: 12740 },
  { categoria: 'Festivo nocturno', ejecutadas: 2890, contrato: 7168 },
]

function toDateOnly(date) {
  return new Date(`${date}T00:00:00.000Z`)
}

function ymd(anio, mes, dia) {
  return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}

function getTurnoCodigo(turno) {
  const hour = new Date(turno.horaInicio).getUTCHours()
  if (hour === 6) return 'M'
  if (hour === 14) return 'T'
  if (hour === 22) return 'N'
  return 'D'
}

function mapEstadoCobertura(estado) {
  if (estado === 'SIN_CUBRIR') return 'DESCUBIERTO'
  if (estado === 'INCIDENCIA' || estado === 'PARCIAL') return 'INCIDENCIA'
  return 'CUBIERTO'
}

function mapEstadoVerificacion(estado) {
  const estados = {
    ok: 'CUBIERTO',
    warn: 'INCIDENCIA',
    danger: 'DESCUBIERTO',
    CUBIERTO: 'CUBIERTO',
    INCIDENCIA: 'INCIDENCIA',
    DESCUBIERTO: 'DESCUBIERTO',
  }
  return estados[estado] || 'CUBIERTO'
}

function buildPeriodoLabel(anio, mes) {
  return `${MONTH_NAMES[mes - 1] || `Mes ${mes}`} ${anio}`
}

function isWeekday(anio, mes, dia) {
  const date = new Date(Date.UTC(anio, mes - 1, dia))
  return ![0, 6].includes(date.getUTCDay())
}

function buildSyntheticTurnos(servicio, anio, mes, dia) {
  const baseId = `plan-${servicio.id}-${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
  const turnos = []
  const addTurno = (codigo) => {
    turnos.push({
      id: `${baseId}-${codigo}`,
      codigo,
      estado: 'CUBIERTO',
      origen: 'patron',
    })
  }

  if (servicio.modalidad === '24/7') {
    addTurno('M')
    addTurno('T')
    addTurno('N')
  }

  if (servicio.modalidad === 'LABORAL_DIURNO' && isWeekday(anio, mes, dia)) {
    addTurno('D')
  }

  if (servicio.modalidad === 'NOCTURNO' && mes !== 8) {
    addTurno('N')
  }

  if (servicio.modalidad === 'VARIABLE') {
    addTurno('N')
    if (!isWeekday(anio, mes, dia)) {
      addTurno('M')
      addTurno('T')
    }
  }

  return turnos
}

function buildKpis(horas) {
  const planificadas = horas.reduce((total, item) => total + item.horasPlanificadas, 0)
  const ejecutadas = horas.reduce((total, item) => total + (item.horasEjecutadas || 0), 0)
  const desviacion = ejecutadas - planificadas
  const avance = (ACUMULADO_ANUAL_HORAS / CONTRATO_ANUAL_HORAS) * 100

  return {
    coberturaMes: 98.4,
    horasPlanificadas: planificadas,
    horasEjecutadas: ejecutadas,
    desviacionHoras: desviacion,
    acumuladoAnual: ACUMULADO_ANUAL_HORAS,
    contratoAnual: CONTRATO_ANUAL_HORAS,
    avanceContrato: Number(avance.toFixed(1)),
  }
}

function sumHoras(horas) {
  const planificadas = horas.reduce((total, item) => total + item.horasPlanificadas, 0)
  const ejecutadas = horas.reduce((total, item) => total + (item.horasEjecutadas || 0), 0)
  return { planificadas, ejecutadas, desviacion: ejecutadas - planificadas }
}

function buildAlertasOperativas() {
  return [
    { tipo: 'danger', titulo: 'Franja descubierta - Huesca', meta: 'Sabado 10 mayo - 14:00-22:00 - Sin asignacion' },
    { tipo: 'warn', titulo: 'Falta jefe de equipo CECO', meta: 'Martes 6 y miercoles 14 mayo - Dia laborable sin cobertura diurna' },
    { tipo: 'warn', titulo: 'Desvio de horas mensual', meta: '86h menos ejecutadas vs planificadas (1,6%)' },
    { tipo: 'info', titulo: 'Refuerzo programado', meta: 'Viernes 23 mayo - Acto institucional Paraninfo - 4 auxiliares' },
  ]
}

export async function obtenerResumenOperativo({ fecha = '2026-05-16', turno = 'N' } = {}) {
  const prisma = getPrismaClient()
  const turnoCodigo = TURNOS[turno] ? turno : 'N'
  const fechaTurno = toDateOnly(fecha)

  const [horas, puestos, turnos, sustituciones] = await Promise.all([
    prisma.horasContratoServicio.findMany({
      where: { anio: 2026, mes: 5 },
      include: { servicio: { include: { edificio: { include: { campus: true } } } } },
      orderBy: { servicio: { orden: 'asc' } },
    }),
    prisma.puestoCobertura.findMany({
      where: { turnoCodigo, activo: true },
      include: { servicio: true },
      orderBy: { orden: 'asc' },
    }),
    prisma.turno.findMany({
      where: { fecha: fechaTurno },
      include: { verificaciones: { orderBy: { verificadaEn: 'desc' }, take: 1 } },
    }),
    prisma.sustitucion.findMany({
      take: 3,
      include: {
        turno: { include: { servicio: true } },
        trabajadorOriginal: true,
        trabajadorSustituto: true,
      },
      orderBy: { creadoEn: 'desc' },
    }),
  ])

  const turnosPorServicio = new Map(
    turnos
      .filter((item) => getTurnoCodigo(item) === turnoCodigo)
      .map((item) => [item.servicioId, item]),
  )

  const serviciosVerificacion = puestos.map((puesto) => {
    const turnoServicio = turnosPorServicio.get(puesto.servicioId)
    const ultima = turnoServicio?.verificaciones?.[0]
    return {
      puestoId: puesto.id,
      turnoId: turnoServicio?.id || null,
      codigo: puesto.codigo,
      nombre: puesto.nombre,
      etiqueta: puesto.etiqueta,
      meta: puesto.meta,
      iniciales: puesto.iniciales,
      estado: ultima?.estado || 'PENDIENTE',
      nota: ultima?.nota || '',
    }
  })

  const coberturaCampus = horas
    .filter((item) => item.servicio.visibleCuadrante)
    .map((item) => ({
      servicioId: item.servicioId,
      servicio: item.servicio.nombre,
      detalle: item.servicio.descripcion,
      dotacion: item.servicio.codigo === 'SERV_CECO_24H'
        ? '1 x 24h + 1 x 8h'
        : `${item.servicio.dotacionMinima} x ${item.servicio.modalidad === 'NOCTURNO' ? '10h' : item.servicio.modalidad === 'VARIABLE' ? 'variable' : '24h'}`,
      horasMes: item.horasPlanificadas,
      estado: item.servicio.codigo === 'SERV_HUE_VARIABLE'
        ? '1 franja sin cubrir'
        : item.servicio.codigo === 'SERV_CECO_24H'
          ? '2 dias sin jefe'
          : 'Cubierto',
      severidad: item.servicio.codigo === 'SERV_HUE_VARIABLE'
        ? 'danger'
        : item.servicio.codigo === 'SERV_CECO_24H'
          ? 'warn'
          : 'success',
    }))

  return {
    periodo: 'Mayo 2026',
    fecha,
    turno: {
      codigo: turnoCodigo,
      nombre: TURNOS[turnoCodigo].nombre,
      rango: TURNOS[turnoCodigo].rango,
    },
    kpis: buildKpis(horas),
    serviciosVerificacion,
    coberturaCampus,
    alertas: buildAlertasOperativas(),
    sustituciones: sustituciones.map((item) => ({
      id: item.id,
      fecha: item.turno?.fecha,
      turno: item.turno ? getTurnoCodigo(item.turno) : '',
      servicio: item.turno?.servicio?.nombre || '',
      original: item.trabajadorOriginal?.nombre || '',
      sustituto: item.trabajadorSustituto?.nombre || '',
      motivo: item.motivo,
      cumplePreaviso: item.cumplePreaviso,
    })),
  }
}

export async function obtenerHorasAnuales({ anio = 2026 } = {}) {
  const prisma = getPrismaClient()
  const horas = await prisma.horasContratoServicio.findMany({
    where: { anio, mes: 5 },
    include: { servicio: { include: { edificio: { include: { campus: true } } } } },
    orderBy: { servicio: { orden: 'asc' } },
  })

  return {
    anio,
    contratoAnual: CONTRATO_ANUAL_HORAS,
    acumuladoAnual: ACUMULADO_ANUAL_HORAS,
    variablesAnuales: VARIABLES_ANUALES_HORAS,
    variablesAcumuladas: 684,
    avanceContrato: Number(((ACUMULADO_ANUAL_HORAS / CONTRATO_ANUAL_HORAS) * 100).toFixed(1)),
    categorias: DESGLOSE_ANUAL_CATEGORIAS.map((item) => ({
      ...item,
      desviacionRitmo: item.ejecutadas - Math.round(item.contrato * (5 / 12)),
      avance: Number(((item.ejecutadas / item.contrato) * 100).toFixed(1)),
    })),
    servicios: horas
      .filter((item) => item.servicio.visibleCuadrante)
      .map((item) => ({
        servicioId: item.servicioId,
        servicio: item.servicio.nombre,
        campus: item.servicio.edificio?.campus?.nombre || '',
        mayoPlanificadas: item.horasPlanificadas,
        mayoEjecutadas: item.horasEjecutadas || 0,
        acumuladoEstimado: Math.round((item.horasEjecutadas || item.horasPlanificadas) * 4.925),
      })),
    variables: [
      { concepto: 'Actos institucionales', horas: 212, peso: 10.6, observaciones: 'Paraninfo y eventos protocolarios' },
      { concepto: 'Salas de estudio y examenes', horas: 328, peso: 16.4, observaciones: 'Aperturas ampliadas en periodos docentes criticos' },
      { concepto: 'Refuerzos de campus', horas: 144, peso: 7.2, observaciones: 'Coberturas puntuales por actividad extraordinaria' },
    ],
  }
}

export async function obtenerCierreMensual({ anio = 2026, mes = 5 } = {}) {
  const prisma = getPrismaClient()
  const horas = await prisma.horasContratoServicio.findMany({
    where: { anio, mes },
    include: { servicio: { include: { edificio: { include: { campus: true } } } } },
    orderBy: { servicio: { orden: 'asc' } },
  })
  const totales = sumHoras(horas)

  return {
    anio,
    mes,
    periodo: 'Mayo 2026',
    estado: 'Pendiente de validacion UZ',
    totales,
    categorias: DESGLOSE_CATEGORIAS_MAYO.map((item) => ({
      ...item,
      desviacion: item.ejecutadas - item.planificadas,
    })),
    servicios: horas
      .filter((item) => item.servicio.visibleCuadrante)
      .map((item) => ({
        servicioId: item.servicioId,
        servicio: item.servicio.nombre,
        campus: item.servicio.edificio?.campus?.nombre || '',
        planificadas: item.horasPlanificadas,
        ejecutadas: item.horasEjecutadas || 0,
        desviacion: (item.horasEjecutadas || 0) - item.horasPlanificadas,
      })),
    incidencias: buildAlertasOperativas().filter((item) => item.tipo !== 'info'),
    validacion: [
      'Comparar Excel ejecutado de fin de mes con planificacion importada.',
      'Revisar descubiertos de Huesca y CECO jefe antes de aprobar factura.',
      'Confirmar prestaciones variables fuera de bolsa fija antes de cierre.',
    ],
  }
}

export async function obtenerInformeOperativo({ tipo = 'mensual', fecha = '2026-05-16', anio = 2026, mes = 5 } = {}) {
  const informeTipo = ['diario', 'mensual', 'anual'].includes(tipo) ? tipo : 'mensual'
  const [resumen, cierre, horasAnuales] = await Promise.all([
    obtenerResumenOperativo({ fecha, turno: 'N' }),
    obtenerCierreMensual({ anio, mes }),
    obtenerHorasAnuales({ anio }),
  ])

  const base = {
    tipo: informeTipo,
    generadoEn: new Date().toISOString(),
    referencia: informeTipo === 'diario'
      ? `UZ-SEG-DIA-${fecha.replaceAll('-', '')}`
      : informeTipo === 'anual'
        ? `UZ-SEG-ANUAL-${anio}`
        : `UZ-SEG-MES-${anio}${String(mes).padStart(2, '0')}`,
  }

  if (informeTipo === 'diario') {
    return {
      ...base,
      titulo: 'Informe basico del dia actual',
      periodo: fecha,
      kpis: [
        { label: 'Servicios a verificar', value: resumen.serviciosVerificacion.length, unit: '' },
        { label: 'Cobertura mes', value: resumen.kpis.coberturaMes, unit: '%' },
        { label: 'Incidencias activas', value: resumen.alertas.filter((item) => item.tipo !== 'info').length, unit: '' },
        { label: 'Sustituciones recientes', value: resumen.sustituciones.length, unit: '' },
      ],
      sections: [
        { title: 'Verificacion del turno', rows: resumen.serviciosVerificacion.map((item) => ({ servicio: item.nombre, detalle: item.etiqueta || item.meta, estado: item.estado, nota: item.nota })) },
        { title: 'Alertas activas', rows: resumen.alertas },
      ],
    }
  }

  if (informeTipo === 'anual') {
    return {
      ...base,
      titulo: 'Informe resumen anual del servicio de vigilancia',
      periodo: `Ano ${anio}`,
      kpis: [
        { label: 'Avance anual', value: horasAnuales.avanceContrato, unit: '%' },
        { label: 'Horas acumuladas', value: horasAnuales.acumuladoAnual, unit: 'h' },
        { label: 'Contrato anual', value: horasAnuales.contratoAnual, unit: 'h' },
        { label: 'Variables acumuladas', value: horasAnuales.variablesAcumuladas, unit: 'h' },
      ],
      sections: [
        { title: 'Categorias de hora', rows: horasAnuales.categorias },
        { title: 'Servicios principales', rows: horasAnuales.servicios },
        { title: 'Prestaciones variables', rows: horasAnuales.variables },
      ],
    }
  }

  return {
    ...base,
    titulo: 'Informe de seguimiento mensual del servicio de vigilancia',
    periodo: cierre.periodo,
    kpis: [
      { label: 'Cobertura mensual', value: resumen.kpis.coberturaMes, unit: '%' },
      { label: 'Planificado', value: cierre.totales.planificadas, unit: 'h' },
      { label: 'Ejecutado', value: cierre.totales.ejecutadas, unit: 'h' },
      { label: 'Desviacion', value: cierre.totales.desviacion, unit: 'h' },
    ],
    sections: [
      { title: 'Cobertura por campus y servicio', rows: cierre.servicios },
      { title: 'Conciliacion horaria', rows: cierre.categorias },
      { title: 'Incidencias y alertas', rows: cierre.incidencias },
      { title: 'Validacion para factura', rows: cierre.validacion.map((texto) => ({ texto })) },
    ],
  }
}

export async function obtenerCuadranteMensual({ anio = 2026, mes = 5 } = {}) {
  const prisma = getPrismaClient()
  const diasMes = new Date(Date.UTC(anio, mes, 0)).getUTCDate()
  const fechaDesde = toDateOnly(ymd(anio, mes, 1))
  const fechaHasta = toDateOnly(ymd(anio, mes, diasMes))

  const [servicios, turnos, festivos] = await Promise.all([
    prisma.servicio.findMany({
      where: { visibleCuadrante: true, activo: true },
      include: { edificio: { include: { campus: true } } },
      orderBy: { orden: 'asc' },
    }),
    prisma.turno.findMany({
      where: { fecha: { gte: fechaDesde, lte: fechaHasta } },
      include: { servicio: true },
      orderBy: [{ fecha: 'asc' }, { horaInicio: 'asc' }],
    }),
    prisma.calendarioLaboral.findMany({
      where: { fecha: { gte: fechaDesde, lte: fechaHasta } },
      orderBy: { fecha: 'asc' },
    }),
  ])

  const hasPersistedTurnos = turnos.length > 0
  const festivosPorFecha = new Set(festivos.map((item) => item.fecha.toISOString().slice(0, 10)))
  const turnosPorServicioDia = new Map()
  for (const turno of turnos) {
    const dia = new Date(turno.fecha).getUTCDate()
    const key = `${turno.servicioId}:${dia}`
    const entries = turnosPorServicioDia.get(key) || []
    entries.push({
      id: turno.id,
      codigo: getTurnoCodigo(turno),
      estado: mapEstadoCobertura(turno.estado),
    })
    turnosPorServicioDia.set(key, entries)
  }

  return {
    anio,
    mes,
    etiqueta: buildPeriodoLabel(anio, mes),
    origen: hasPersistedTurnos ? 'persistido' : 'patron',
    dias: Array.from({ length: diasMes }, (_, index) => {
      const dia = index + 1
      const date = new Date(Date.UTC(anio, mes - 1, dia))
      const fecha = ymd(anio, mes, dia)
      return {
        dia,
        fecha,
        finSemana: [0, 6].includes(date.getUTCDay()),
        festivo: festivosPorFecha.has(fecha),
      }
    }),
    servicios: servicios.map((servicio) => ({
      id: servicio.id,
      codigo: servicio.codigo,
      nombre: servicio.nombre,
      tipo: servicio.tipoOperativo,
      subtitulo: servicio.descripcion,
      modalidad: servicio.modalidad,
      celdas: Array.from({ length: diasMes }, (_, index) => {
        const dia = index + 1
        return {
          dia,
          turnos: turnosPorServicioDia.get(`${servicio.id}:${dia}`)
            || (hasPersistedTurnos ? [] : buildSyntheticTurnos(servicio, anio, mes, dia)),
        }
      }),
    })),
  }
}

export async function registrarVerificacionesLote({ fecha, turno, verificaciones, usuarioId }) {
  const prisma = getPrismaClient()
  const turnoCodigo = TURNOS[turno] ? turno : 'N'
  const fechaTurno = toDateOnly(fecha || '2026-05-16')

  const puestos = await prisma.puestoCobertura.findMany({
    where: { id: { in: verificaciones.map((item) => Number(item.puestoId)) } },
  })
  const puestosPorId = new Map(puestos.map((puesto) => [puesto.id, puesto]))

  const turnos = await prisma.turno.findMany({
    where: {
      fecha: fechaTurno,
      servicioId: { in: puestos.map((puesto) => puesto.servicioId) },
    },
  })
  const turnoPorServicio = new Map(
    turnos
      .filter((item) => getTurnoCodigo(item) === turnoCodigo)
      .map((item) => [item.servicioId, item]),
  )

  const creadas = []
  for (const item of verificaciones) {
    const puesto = puestosPorId.get(Number(item.puestoId))
    if (!puesto) continue
    const turnoServicio = turnoPorServicio.get(puesto.servicioId)
    if (!turnoServicio) continue
    const creada = await prisma.verificacionCobertura.create({
      data: {
        turnoId: turnoServicio.id,
        usuarioId,
        puestoId: puesto.id,
        estado: mapEstadoVerificacion(item.estado),
        nota: item.nota || null,
      },
    })
    creadas.push(creada)
  }

  return creadas
}
