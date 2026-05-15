import {
  calcularHorasEntre,
  normalizarRangoAusencia,
  obtenerRangoTurno,
  rangosSeSolapan,
} from '../utils/dateUtils.js'

const CODIGOS_OK = {
  ASIGNACION_VALIDA: 'ASIGNACION_VALIDA',
  SIN_SOLAPAMIENTO: 'SIN_SOLAPAMIENTO',
  DESCANSO_VALIDO: 'DESCANSO_VALIDO',
  PERFIL_VALIDO: 'PERFIL_VALIDO',
  TRABAJADOR_ACTIVO: 'TRABAJADOR_ACTIVO',
  SIN_AUSENCIA: 'SIN_AUSENCIA',
  DOTACION_CUBIERTA: 'DOTACION_CUBIERTA',
}

function resultado({ ok, bloqueante, codigo, mensaje, detalles = {} }) {
  return { ok, bloqueante, codigo, mensaje, detalles }
}

function ok(codigo, mensaje, detalles = {}) {
  return resultado({ ok: true, bloqueante: false, codigo, mensaje, detalles })
}

function problema(codigo, mensaje, { bloqueante = true, detalles = {} } = {}) {
  return resultado({ ok: false, bloqueante, codigo, mensaje, detalles })
}

function obtenerDotacionMinima({ turno, servicio }) {
  return Number(turno?.dotacionMinima ?? servicio?.dotacionMinima ?? 1)
}

function esAsignacionActiva(asignacion) {
  return !['CANCELADO', 'SUSTITUIDO'].includes(asignacion?.estado)
}

function contarAsignacionesActivas(asignaciones = []) {
  return asignaciones.filter(esAsignacionActiva).length
}

function contarAsignacionesConfirmadas(asignaciones = []) {
  return asignaciones.filter((asignacion) => asignacion?.estado === 'CONFIRMADO').length
}

export function validarSolapamientoTurnos({ turno, turnosTrabajador = [] }) {
  const rangoTurno = obtenerRangoTurno(turno)
  const turnoSolapado = turnosTrabajador.find((turnoExistente) =>
    rangosSeSolapan(rangoTurno, obtenerRangoTurno(turnoExistente)),
  )

  if (turnoSolapado) {
    return problema('SOLAPAMIENTO_TURNOS', 'El trabajador ya tiene otro turno solapado.', {
      detalles: {
        turnoId: turno.id,
        turnoSolapadoId: turnoSolapado.id,
        rangoTurno,
        rangoSolapado: obtenerRangoTurno(turnoSolapado),
      },
    })
  }

  return ok(CODIGOS_OK.SIN_SOLAPAMIENTO, 'El trabajador no tiene turnos solapados.', {
    turnoId: turno.id,
  })
}

export function validarDescansoMinimo({
  turno,
  turnosTrabajador = [],
  horasMinimasDescanso = 12,
}) {
  const rangoTurno = obtenerRangoTurno(turno)

  const incumplimiento = turnosTrabajador.find((turnoExistente) => {
    const rangoExistente = obtenerRangoTurno(turnoExistente)
    const terminaAntesDelNuevo = rangoExistente.fin <= rangoTurno.inicio
    const empiezaDespuesDelNuevo = rangoExistente.inicio >= rangoTurno.fin

    if (terminaAntesDelNuevo) {
      return calcularHorasEntre(rangoExistente.fin, rangoTurno.inicio) < horasMinimasDescanso
    }

    if (empiezaDespuesDelNuevo) {
      return calcularHorasEntre(rangoTurno.fin, rangoExistente.inicio) < horasMinimasDescanso
    }

    return false
  })

  if (incumplimiento) {
    return problema(
      'DESCANSO_MINIMO_INSUFICIENTE',
      `El descanso entre turnos es inferior a ${horasMinimasDescanso} horas.`,
      {
        bloqueante: false,
        detalles: {
          turnoId: turno.id,
          turnoRelacionadoId: incumplimiento.id,
          horasMinimasDescanso,
        },
      },
    )
  }

  return ok(CODIGOS_OK.DESCANSO_VALIDO, 'El descanso minimo entre turnos se cumple.', {
    horasMinimasDescanso,
  })
}

export function validarPerfilRequerido({ trabajador, servicio }) {
  const tipoTrabajador = trabajador?.tipo
  const perfilRequerido = servicio?.perfilRequerido ?? 'CUALQUIERA'

  if (perfilRequerido === 'CUALQUIERA') {
    return ok(CODIGOS_OK.PERFIL_VALIDO, 'El servicio permite cualquier perfil.', {
      tipoTrabajador,
      perfilRequerido,
    })
  }

  if (perfilRequerido === 'VIGILANTE' && tipoTrabajador === 'AUXILIAR') {
    return problema('PERFIL_INCOMPATIBLE', 'El servicio requiere vigilante y el trabajador es auxiliar.', {
      detalles: { tipoTrabajador, perfilRequerido },
    })
  }

  if (perfilRequerido === 'AUXILIAR' && ['VIGILANTE', 'JEFE_EQUIPO'].includes(tipoTrabajador)) {
    return problema(
      'PERFIL_SOBRECUALIFICADO',
      'El servicio requiere auxiliar; se permite vigilante como criterio provisional.',
      {
        bloqueante: false,
        detalles: { tipoTrabajador, perfilRequerido },
      },
    )
  }

  if (perfilRequerido !== tipoTrabajador) {
    return problema('PERFIL_INCOMPATIBLE', 'El perfil del trabajador no coincide con el requerido.', {
      detalles: { tipoTrabajador, perfilRequerido },
    })
  }

  return ok(CODIGOS_OK.PERFIL_VALIDO, 'El perfil del trabajador cumple el requisito del servicio.', {
    tipoTrabajador,
    perfilRequerido,
  })
}

export function validarTrabajadorActivo({ trabajador }) {
  if (!trabajador?.activo) {
    return problema('TRABAJADOR_INACTIVO', 'El trabajador no esta activo.')
  }

  return ok(CODIGOS_OK.TRABAJADOR_ACTIVO, 'El trabajador esta activo.')
}

export function validarAusenciaTrabajador({ turno, ausenciasTrabajador = [] }) {
  const rangoTurno = obtenerRangoTurno(turno)
  const ausencia = ausenciasTrabajador.find((item) =>
    rangosSeSolapan(rangoTurno, normalizarRangoAusencia(item)),
  )

  if (ausencia) {
    return problema('TRABAJADOR_AUSENTE', 'El trabajador tiene una ausencia que coincide con el turno.', {
      detalles: { ausenciaId: ausencia.id, tipo: ausencia.tipo },
    })
  }

  return ok(CODIGOS_OK.SIN_AUSENCIA, 'No hay ausencias del trabajador para el turno.')
}

export function validarDotacionMinima({ turno, asignacionesTurno = [], servicio }) {
  const dotacionMinima = obtenerDotacionMinima({ turno, servicio })
  const asignacionesConfirmadas = contarAsignacionesConfirmadas(asignacionesTurno)

  if (asignacionesConfirmadas < dotacionMinima) {
    return problema('DOTACION_MINIMA_INSUFICIENTE', 'La dotacion minima del servicio no esta cubierta.', {
      bloqueante: false,
      detalles: { dotacionMinima, asignacionesConfirmadas },
    })
  }

  return ok(CODIGOS_OK.DOTACION_CUBIERTA, 'La dotacion minima del servicio esta cubierta.', {
    dotacionMinima,
    asignacionesConfirmadas,
  })
}

export function evaluarEstadoCobertura({ turno, asignacionesTurno = [], servicio }) {
  const dotacionMinima = obtenerDotacionMinima({ turno, servicio })
  const asignacionesConfirmadas = contarAsignacionesConfirmadas(asignacionesTurno)

  if (asignacionesConfirmadas <= 0) {
    return resultado({
      ok: true,
      bloqueante: false,
      codigo: 'COBERTURA_SIN_CUBRIR',
      mensaje: 'El turno no tiene asignaciones confirmadas.',
      detalles: { estado: 'SIN_CUBRIR', dotacionMinima, asignacionesConfirmadas },
    })
  }

  if (asignacionesConfirmadas < dotacionMinima) {
    return resultado({
      ok: true,
      bloqueante: false,
      codigo: 'COBERTURA_PARCIAL',
      mensaje: 'El turno tiene cobertura parcial.',
      detalles: { estado: 'PARCIAL', dotacionMinima, asignacionesConfirmadas },
    })
  }

  return resultado({
    ok: true,
    bloqueante: false,
    codigo: 'COBERTURA_CUBIERTA',
    mensaje: 'El turno esta cubierto.',
    detalles: { estado: 'CUBIERTO', dotacionMinima, asignacionesConfirmadas },
  })
}

export function validarAsignacionTurno({
  trabajador,
  turno,
  asignacionesExistentes = [],
  ausenciasTrabajador = [],
  servicio,
}) {
  const turnosTrabajador = asignacionesExistentes
    .filter((asignacion) => asignacion.trabajadorId === trabajador?.id && esAsignacionActiva(asignacion))
    .map((asignacion) => asignacion.turno)
    .filter(Boolean)

  const asignacionesTurno = asignacionesExistentes.filter(
    (asignacion) => asignacion.turnoId === turno?.id && esAsignacionActiva(asignacion),
  )

  const resultados = [
    validarTrabajadorActivo({ trabajador }),
    validarPerfilRequerido({ trabajador, servicio }),
    validarSolapamientoTurnos({ turno, turnosTrabajador }),
    validarDescansoMinimo({ turno, turnosTrabajador }),
    validarAusenciaTrabajador({ turno, ausenciasTrabajador }),
    validarDotacionMinima({ turno, asignacionesTurno, servicio }),
  ]

  const erroresBloqueantes = resultados.filter((item) => !item.ok && item.bloqueante)

  return resultado({
    ok: erroresBloqueantes.length === 0,
    bloqueante: erroresBloqueantes.length > 0,
    codigo: erroresBloqueantes.length > 0 ? 'ASIGNACION_RECHAZADA' : CODIGOS_OK.ASIGNACION_VALIDA,
    mensaje:
      erroresBloqueantes.length > 0
        ? 'La asignacion no cumple una o varias reglas bloqueantes.'
        : 'La asignacion cumple las reglas bloqueantes.',
    detalles: {
      resultados,
      estadoCobertura: evaluarEstadoCobertura({ turno, asignacionesTurno, servicio }).detalles.estado,
    },
  })
}
