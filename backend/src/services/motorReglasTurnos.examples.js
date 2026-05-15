export const trabajadorVigilanteActivo = {
  id: 1,
  codigo: 'TRAB_DEMO_VIGILANTE',
  nombre: 'Vigilante Demo',
  tipo: 'VIGILANTE',
  activo: true,
}

export const trabajadorAuxiliarActivo = {
  id: 2,
  codigo: 'TRAB_DEMO_AUXILIAR',
  nombre: 'Auxiliar Demo',
  tipo: 'AUXILIAR',
  activo: true,
}

export const trabajadorInactivo = {
  id: 3,
  codigo: 'TRAB_DEMO_INACTIVO',
  nombre: 'Trabajador Inactivo Demo',
  tipo: 'VIGILANTE',
  activo: false,
}

export const servicioRequiereVigilante = {
  id: 1,
  codigo: 'SERV_DEMO_VIGILANCIA',
  nombre: 'Servicio demo vigilancia',
  perfilRequerido: 'VIGILANTE',
  dotacionMinima: 2,
}

export const servicioPermiteCualquiera = {
  id: 2,
  codigo: 'SERV_DEMO_MIXTO',
  nombre: 'Servicio demo mixto',
  perfilRequerido: 'CUALQUIERA',
  dotacionMinima: 1,
}

export const turnoEjemplo = {
  id: 10,
  codigo: 'TURNO_DEMO_2026_05_15_M',
  servicioId: servicioRequiereVigilante.id,
  horaInicio: '2026-05-15T06:00:00.000Z',
  horaFin: '2026-05-15T14:00:00.000Z',
  dotacionMinima: 2,
}

export const turnoSolapado = {
  id: 11,
  codigo: 'TURNO_DEMO_SOLAPADO',
  servicioId: servicioRequiereVigilante.id,
  horaInicio: '2026-05-15T10:00:00.000Z',
  horaFin: '2026-05-15T18:00:00.000Z',
  dotacionMinima: 1,
}

export const turnoDescansoInsuficiente = {
  id: 12,
  codigo: 'TURNO_DEMO_DESCANSO',
  servicioId: servicioRequiereVigilante.id,
  horaInicio: '2026-05-14T22:00:00.000Z',
  horaFin: '2026-05-15T02:00:00.000Z',
  dotacionMinima: 1,
}

export const ausenciaCoincidente = {
  id: 20,
  trabajadorId: trabajadorVigilanteActivo.id,
  tipo: 'PERMISO',
  fechaInicio: '2026-05-15T00:00:00.000Z',
  fechaFin: '2026-05-15T23:59:59.000Z',
}

export const asignacionExistenteSolapada = {
  id: 100,
  turnoId: turnoSolapado.id,
  trabajadorId: trabajadorVigilanteActivo.id,
  estado: 'CONFIRMADO',
  turno: turnoSolapado,
}

export const asignacionExistenteDescansoCorto = {
  id: 101,
  turnoId: turnoDescansoInsuficiente.id,
  trabajadorId: trabajadorVigilanteActivo.id,
  estado: 'CONFIRMADO',
  turno: turnoDescansoInsuficiente,
}

export const asignacionTurnoActual = {
  id: 102,
  turnoId: turnoEjemplo.id,
  trabajadorId: trabajadorVigilanteActivo.id,
  estado: 'CONFIRMADO',
  turno: turnoEjemplo,
}
