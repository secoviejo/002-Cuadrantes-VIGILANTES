import * as asignacionTurnoRepository from '../repositories/asignacionTurno.repository.js'
import * as ausenciaRepository from '../repositories/ausencia.repository.js'
import { getPrismaClient } from '../db/prisma.js'

export async function validarAsignacion(turnoId, trabajadorId) {
  const errores = []
  const advertencias = []

  const prisma = getPrismaClient()
  const turno = await prisma.turno.findUnique({
    where: { id: turnoId },
    include: { servicio: true }
  })

  if (!turno) {
    errores.push('El turno no existe')
    return { valido: false, errores, advertencias }
  }

  const trabajador = await prisma.trabajador.findUnique({
    where: { id: trabajadorId }
  })

  if (!trabajador) {
    errores.push('El trabajador no existe')
    return { valido: false, errores, advertencias }
  }

  if (!trabajador.activo) {
    errores.push('El trabajador no esta activo')
    return { valido: false, errores, advertencias }
  }

  const existente = await asignacionTurnoRepository.findByTurnoYTrabajador(turnoId, trabajadorId)
  if (existente) {
    errores.push('Este trabajador ya esta asignado a este turno')
    return { valido: false, errores, advertencias }
  }

  const fechaTurno = new Date(turno.fecha)
  const diaInicio = new Date(fechaTurno)
  diaInicio.setHours(0, 0, 0, 0)
  const diaFin = new Date(fechaTurno)
  diaFin.setHours(23, 59, 59, 999)

  const ausencias = await ausenciaRepository.findPorRango(trabajadorId, diaInicio, diaFin)
  if (ausencias.length > 0) {
    advertencias.push({
      tipo: 'AUSENCIA',
      mensaje: `El trabajador tiene una ausencia registrada: ${ausencias[0].tipo}`,
      detalles: {
        tipoAusencia: ausencias[0].tipo,
        fechaInicio: ausencias[0].fechaInicio,
        fechaFin: ausencias[0].fechaFin,
        motivo: ausencias[0].motivo
      }
    })
  }

  const fechaStr = fechaTurno.toISOString().split('T')[0]
  const otrosTurnos = await prisma.turno.findMany({
    where: {
      fecha: { gte: diaInicio, lte: diaFin }
    },
    include: {
      asignaciones: {
        where: { trabajadorId },
        include: { trabajador: true }
      }
    }
  })

  for (const otroTurno of otrosTurnos) {
    if (otroTurno.id === turnoId) continue

    const asignacion = otroTurno.asignaciones[0]
    if (!asignacion) continue

    const inicio1 = new Date(turno.horaInicio)
    const fin1 = new Date(turno.horaFin)
    const inicio2 = new Date(otroTurno.horaInicio)
    const fin2 = new Date(otroTurno.horaFin)

    const solapan = inicio1 < fin2 && inicio2 < fin1

    if (solapan) {
      errores.push({
        tipo: 'CONFLICTO_HORARIO',
        mensaje: `Conflicto de horario con turno ${otroTurno.codigo} (${otroTurno.horaInicio}-${otroTurno.horaFin})`,
        detalles: {
          turnoConflictoId: otroTurno.id,
          turnoConflictoCodigo: otroTurno.codigo,
          servicioConflicto: otroTurno.servicio?.nombre
        }
      })
    }
  }

  if (turno.servicio.perfilRequerido !== 'CUALQUIERA') {
    const perfilRequerido = turno.servicio.perfilRequerido
    const tipoTrabajador = trabajador.tipo

    const tipoAbrev = tipoTrabajador === 'VIGILANTE' ? 'VIGILANTE' : tipoTrabajador === 'AUXILIAR' ? 'AUXILIAR' : null

    if (tipoAbrev && tipoAbrev !== perfilRequerido) {
      advertencias.push({
        tipo: 'PERFIL_DIFERENTE',
        mensaje: `El perfil del trabajador (${tipoTrabajador}) no coincide exactamente con el requerido (${perfilRequerido})`,
        detalles: {
          perfilRequerido,
          perfilTrabajador: tipoTrabajador
        }
      })
    }
  }

  return {
    valido: errores.length === 0,
    errores,
    advertencias,
    datos: {
      turno: { id: turno.id, codigo: turno.codigo, fecha: turno.fecha },
      trabajador: { id: trabajador.id, nombre: trabajador.nombre, tipo: trabajador.tipo }
    }
  }
}

export async function validarAsignacionesMasivas(asignaciones) {
  const resultados = []
  
  for (const asignacion of asignaciones) {
    const resultado = await validarAsignacion(asignacion.turnoId, asignacion.trabajadorId)
    resultados.push({
      turnoId: asignacion.turnoId,
      trabajadorId: asignacion.trabajadorId,
      ...resultado
    })
  }

  return resultados
}