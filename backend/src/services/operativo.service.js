import { getPrismaClient } from '../db/prisma.js'
import { PERIODOS_ACADEMICOS_2026 } from './calendario.service.js'
import { obtenerContratoAnual } from './contratoAnual.service.js'

const TURNOS = {
  M: { nombre: 'Turno mañana', rango: '06:00-14:00', horaInicio: 6 },
  T: { nombre: 'Turno tarde', rango: '14:00-22:00', horaInicio: 14 },
  N: { nombre: 'Turno noche', rango: '22:00-06:00', horaInicio: 22 },
  D: { nombre: 'Diurno', rango: '08:00-16:00', horaInicio: 8 },
}

const ACUMULADO_ANUAL_HORAS = 26140
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
  { codigo: 'LABORAL_DIURNO', ejecutadas: 11420 },
  { codigo: 'LABORAL_NOCTURNO', ejecutadas: 6580 },
  { codigo: 'FESTIVO_DIURNO', ejecutadas: 5250 },
  { codigo: 'FESTIVO_NOCTURNO', ejecutadas: 2890 },
]

const TURNOS_VERIFICABLES = ['M', 'T', 'N']

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

function getWeekday(anio, mes, dia) {
  const date = new Date(Date.UTC(anio, mes - 1, dia))
  return date.getUTCDay()
}

function isWeekday(anio, mes, dia) {
  return ![0, 6].includes(getWeekday(anio, mes, dia))
}

function parsePeriodoAcademico(periodo) {
  const match = /^(\d{2})\/(\d{2}) - (\d{2})\/(\d{2})$/.exec(periodo)
  if (!match) return null
  return {
    startDay: Number(match[1]),
    startMonth: Number(match[2]),
    endDay: Number(match[3]),
    endMonth: Number(match[4]),
  }
}

function dateValue(anio, mes, dia) {
  return Date.UTC(anio, mes - 1, dia)
}

function isDateInPeriodo(anio, mes, dia, periodo) {
  const range = parsePeriodoAcademico(periodo)
  if (!range) return false

  const current = dateValue(anio, mes, dia)
  const start = dateValue(anio, range.startMonth, range.startDay)
  const end = dateValue(anio, range.endMonth, range.endDay)

  if (start <= end) {
    return current >= start && current <= end
  }

  return current >= start || current <= end
}

function getEstadoAcademico(anio, mes, dia) {
  const periodo = PERIODOS_ACADEMICOS_2026.find((item) => isDateInPeriodo(anio, mes, dia, item.periodo))
  return periodo?.estado || 'LECTIVO'
}

function buildDiaInfo(anio, mes, dia, festivosPorFecha) {
  const fecha = ymd(anio, mes, dia)
  const weekday = getWeekday(anio, mes, dia)
  const finSemana = [0, 6].includes(weekday)
  const festivoOficial = festivosPorFecha.has(fecha)
  const estadoAcademico = getEstadoAcademico(anio, mes, dia)
  const noLectivo = ['NO_LECTIVO', 'CIERRE'].includes(estadoAcademico)
  const tipoDia = festivoOficial || finSemana
    ? 'FESTIVO'
    : noLectivo
      ? 'NO_LECTIVO'
      : 'NORMAL'

  return {
    dia,
    fecha,
    finSemana,
    festivo: tipoDia === 'FESTIVO',
    festivoOficial,
    estadoAcademico,
    tipoDia,
    tipoDiaLabel: tipoDia === 'FESTIVO'
      ? 'Festivo'
      : tipoDia === 'NO_LECTIVO'
        ? estadoAcademico === 'CIERRE' ? 'No lectivo - cierre universitario' : 'No lectivo'
        : 'Normal',
  }
}

function buildSyntheticTurnos(servicio, anio, mes, dia, diaInfo) {
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
    if (diaInfo?.tipoDia === 'FESTIVO' || diaInfo?.estadoAcademico === 'CIERRE') {
      addTurno('M')
      addTurno('T')
      addTurno('N')
    } else if (diaInfo?.tipoDia === 'NO_LECTIVO') {
      addTurno('T')
      addTurno('N')
    } else {
      addTurno('N')
    }
  }

  return turnos
}

function buildKpis(horas, contratoAnual) {
  const planificadas = horas.reduce((total, item) => total + item.horasPlanificadas, 0)
  const ejecutadas = horas.reduce((total, item) => total + (item.horasEjecutadas || 0), 0)
  const desviacion = ejecutadas - planificadas
  const avance = contratoAnual > 0 ? (ACUMULADO_ANUAL_HORAS / contratoAnual) * 100 : 0

  return {
    coberturaMes: 98.4,
    horasPlanificadas: planificadas,
    horasEjecutadas: ejecutadas,
    desviacionHoras: desviacion,
    acumuladoAnual: ACUMULADO_ANUAL_HORAS,
    contratoAnual,
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

function buildAlertasVerificacion(resumenes) {
  return resumenes.flatMap((resumen) => (
    resumen.serviciosVerificacion.flatMap((servicio) => {
      const suffix = servicio.etiqueta ? ` (${servicio.etiqueta})` : ''
      const nota = servicio.nota ? ` - ${servicio.nota}` : ''

      if (servicio.estado === 'DESCUBIERTO') {
        return [{
          tipo: 'danger',
          titulo: `Servicio descubierto - ${servicio.nombre}${suffix}`,
          meta: `${resumen.turno.nombre} - ${resumen.turno.rango} - Sin cobertura${nota}`,
        }]
      }

      if (servicio.estado === 'INCIDENCIA') {
        return [{
          tipo: 'warn',
          titulo: `Incidencia en ${servicio.nombre}${suffix}`,
          meta: `${resumen.turno.nombre} - ${resumen.turno.rango} - Requiere revision${nota}`,
        }]
      }

      return []
    })
  ))
}

export async function obtenerResumenOperativo({ fecha = '2026-05-16', turno = 'N' } = {}) {
  const prisma = getPrismaClient()
  const turnoCodigo = TURNOS[turno] ? turno : 'N'
  const fechaTurno = toDateOnly(fecha)

  const [horas, puestos, turnos, sustituciones, contrato] = await Promise.all([
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
    obtenerContratoAnual({ anio: 2026 }),
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
    kpis: buildKpis(horas, contrato.contratoAnual),
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
  const [horas, contrato] = await Promise.all([
    prisma.horasContratoServicio.findMany({
      where: { anio, mes: 5 },
      include: { servicio: { include: { edificio: { include: { campus: true } } } } },
      orderBy: { servicio: { orden: 'asc' } },
    }),
    obtenerContratoAnual({ anio }),
  ])
  const ejecutadasPorCodigo = new Map(DESGLOSE_ANUAL_CATEGORIAS.map((item) => [item.codigo, item.ejecutadas]))

  return {
    anio,
    contratoAnual: contrato.contratoAnual,
    acumuladoAnual: ACUMULADO_ANUAL_HORAS,
    variablesAnuales: contrato.bolsaVariableHoras,
    variablesAcumuladas: 684,
    avanceContrato: contrato.contratoAnual > 0
      ? Number(((ACUMULADO_ANUAL_HORAS / contrato.contratoAnual) * 100).toFixed(1))
      : 0,
    contrato,
    categorias: contrato.categorias.map((item) => ({
      codigo: item.codigo,
      categoria: item.nombre,
      ejecutadas: ejecutadasPorCodigo.get(item.codigo) || 0,
      contrato: item.contratoHoras,
      desviacionRitmo: (ejecutadasPorCodigo.get(item.codigo) || 0) - Math.round(item.contratoHoras * (5 / 12)),
      avance: item.contratoHoras > 0
        ? Number((((ejecutadasPorCodigo.get(item.codigo) || 0) / item.contratoHoras) * 100).toFixed(1))
        : 0,
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
  const resumenesDiariosPromise = informeTipo === 'diario'
    ? Promise.all(TURNOS_VERIFICABLES.map((turno) => obtenerResumenOperativo({ fecha, turno })))
    : Promise.resolve(null)
  const resumenBasePromise = informeTipo === 'diario'
    ? Promise.resolve(null)
    : obtenerResumenOperativo({ fecha, turno: 'N' })
  const [resumenesDiarios, resumen, cierre, horasAnuales] = await Promise.all([
    resumenesDiariosPromise,
    resumenBasePromise,
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
    const serviciosVerificacion = resumenesDiarios.flatMap((resumenTurno) => (
      resumenTurno.serviciosVerificacion.map((item) => ({
        turno: `${resumenTurno.turno.nombre} (${resumenTurno.turno.rango})`,
        servicio: item.nombre,
        detalle: item.etiqueta || item.meta,
        estado: item.estado,
        nota: item.nota,
      }))
    ))
    const alertasVerificacion = buildAlertasVerificacion(resumenesDiarios)
    const alertasOperativas = resumenesDiarios[0]?.alertas || []
    const incidenciasActivas = alertasVerificacion.length
      || alertasOperativas.filter((item) => item.tipo !== 'info').length

    return {
      ...base,
      titulo: 'Informe basico del dia actual',
      periodo: fecha,
      kpis: [
        { label: 'Servicios a verificar', value: serviciosVerificacion.length, unit: '' },
        { label: 'Cobertura mes', value: resumenesDiarios[0]?.kpis.coberturaMes || 0, unit: '%' },
        { label: 'Incidencias activas', value: incidenciasActivas, unit: '' },
        { label: 'Sustituciones recientes', value: resumenesDiarios[0]?.sustituciones.length || 0, unit: '' },
      ],
      sections: [
        { title: 'Verificacion de los turnos del dia', rows: serviciosVerificacion },
        { title: 'Incidencias y descubiertos confirmados', rows: alertasVerificacion },
        { title: 'Alertas operativas de seguimiento', rows: alertasOperativas },
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
  const dias = Array.from({ length: diasMes }, (_, index) => buildDiaInfo(anio, mes, index + 1, festivosPorFecha))
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
    dias,
    servicios: servicios.map((servicio) => ({
      id: servicio.id,
      codigo: servicio.codigo,
      nombre: servicio.nombre,
      tipo: servicio.tipoOperativo,
      subtitulo: servicio.descripcion,
      modalidad: servicio.modalidad,
      celdas: dias.map((diaInfo) => {
        const dia = diaInfo.dia
        return {
          dia,
          turnos: turnosPorServicioDia.get(`${servicio.id}:${dia}`)
            || (hasPersistedTurnos ? [] : buildSyntheticTurnos(servicio, anio, mes, dia, diaInfo)),
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
