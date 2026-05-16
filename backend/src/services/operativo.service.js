import { getPrismaClient } from '../db/prisma.js'

const TURNOS = {
  M: { nombre: 'Turno mañana', rango: '06:00-14:00', horaInicio: 6 },
  T: { nombre: 'Turno tarde', rango: '14:00-22:00', horaInicio: 14 },
  N: { nombre: 'Turno noche', rango: '22:00-06:00', horaInicio: 22 },
  D: { nombre: 'Diurno', rango: '08:00-16:00', horaInicio: 8 },
}

const CONTRATO_ANUAL_HORAS = 63508
const ACUMULADO_ANUAL_HORAS = 26140

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
    alertas: [
      { tipo: 'danger', titulo: 'Franja descubierta - Huesca', meta: 'Sabado 10 mayo - 14:00-22:00 - Sin asignacion' },
      { tipo: 'warn', titulo: 'Falta jefe de equipo CECO', meta: 'Martes 6 y miercoles 14 mayo - Dia laborable sin cobertura diurna' },
      { tipo: 'warn', titulo: 'Desvio de horas mensual', meta: '86h menos ejecutadas vs planificadas (1,6%)' },
      { tipo: 'info', titulo: 'Refuerzo programado', meta: 'Viernes 23 mayo - Acto institucional Paraninfo - 4 auxiliares' },
    ],
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

export async function obtenerCuadranteMensual({ anio = 2026, mes = 5 } = {}) {
  const prisma = getPrismaClient()
  const diasMes = new Date(Date.UTC(anio, mes, 0)).getUTCDate()
  const fechaDesde = toDateOnly(ymd(anio, mes, 1))
  const fechaHasta = toDateOnly(ymd(anio, mes, diasMes))

  const [servicios, turnos] = await Promise.all([
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
  ])

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
    etiqueta: 'Mayo 2026',
    dias: Array.from({ length: diasMes }, (_, index) => {
      const dia = index + 1
      const date = new Date(Date.UTC(anio, mes - 1, dia))
      return {
        dia,
        fecha: ymd(anio, mes, dia),
        finSemana: [0, 6].includes(date.getUTCDay()),
        festivo: dia === 1,
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
          turnos: turnosPorServicioDia.get(`${servicio.id}:${dia}`) || [],
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
