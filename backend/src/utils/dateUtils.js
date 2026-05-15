export function parseDateTime(value) {
  if (value instanceof Date) return value
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) return date
  }

  throw new Error(`Fecha no valida: ${value}`)
}

export function obtenerRangoTurno(turno) {
  return {
    inicio: parseDateTime(turno.horaInicio ?? turno.inicio ?? turno.fechaInicio),
    fin: parseDateTime(turno.horaFin ?? turno.fin ?? turno.fechaFin),
  }
}

export function rangosSeSolapan(rangoA, rangoB) {
  const inicioA = parseDateTime(rangoA.inicio)
  const finA = parseDateTime(rangoA.fin)
  const inicioB = parseDateTime(rangoB.inicio)
  const finB = parseDateTime(rangoB.fin)

  return inicioA < finB && inicioB < finA
}

export function calcularHorasEntre(fechaA, fechaB) {
  const inicio = parseDateTime(fechaA)
  const fin = parseDateTime(fechaB)

  return Math.abs(fin.getTime() - inicio.getTime()) / (1000 * 60 * 60)
}

export function estaFechaDentroDeRango(fecha, rango) {
  const value = parseDateTime(fecha)
  const inicio = parseDateTime(rango.inicio)
  const fin = parseDateTime(rango.fin)

  return value >= inicio && value <= fin
}

export function normalizarRangoAusencia(ausencia) {
  return {
    inicio: parseDateTime(ausencia.fechaInicio ?? ausencia.inicio),
    fin: parseDateTime(ausencia.fechaFin ?? ausencia.fin),
  }
}
