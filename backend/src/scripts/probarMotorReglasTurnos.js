import {
  evaluarEstadoCobertura,
  validarAsignacionTurno,
  validarAusenciaTrabajador,
  validarDescansoMinimo,
  validarDotacionMinima,
  validarPerfilRequerido,
  validarSolapamientoTurnos,
  validarTrabajadorActivo,
} from '../services/motorReglasTurnos.service.js'
import {
  asignacionExistenteDescansoCorto,
  asignacionExistenteSolapada,
  asignacionTurnoActual,
  ausenciaCoincidente,
  servicioPermiteCualquiera,
  servicioRequiereVigilante,
  trabajadorAuxiliarActivo,
  trabajadorInactivo,
  trabajadorVigilanteActivo,
  turnoEjemplo,
} from '../services/motorReglasTurnos.examples.js'

function imprimirCaso(nombre, resultado) {
  console.log(`\n## ${nombre}`)
  console.log(JSON.stringify(resultado, null, 2))
}

imprimirCaso(
  'Asignacion correcta',
  validarAsignacionTurno({
    trabajador: trabajadorVigilanteActivo,
    turno: turnoEjemplo,
    asignacionesExistentes: [],
    ausenciasTrabajador: [],
    servicio: servicioPermiteCualquiera,
  }),
)

imprimirCaso(
  'Solapamiento',
  validarSolapamientoTurnos({
    turno: turnoEjemplo,
    turnosTrabajador: [asignacionExistenteSolapada.turno],
  }),
)

imprimirCaso(
  'Descanso menor de 12 horas',
  validarDescansoMinimo({
    turno: turnoEjemplo,
    turnosTrabajador: [asignacionExistenteDescansoCorto.turno],
  }),
)

imprimirCaso(
  'Auxiliar asignado a servicio que requiere vigilante',
  validarPerfilRequerido({
    trabajador: trabajadorAuxiliarActivo,
    servicio: servicioRequiereVigilante,
  }),
)

imprimirCaso('Trabajador inactivo', validarTrabajadorActivo({ trabajador: trabajadorInactivo }))

imprimirCaso(
  'Trabajador con ausencia',
  validarAusenciaTrabajador({
    turno: turnoEjemplo,
    ausenciasTrabajador: [ausenciaCoincidente],
  }),
)

imprimirCaso(
  'Dotacion minima insuficiente',
  validarDotacionMinima({
    turno: turnoEjemplo,
    asignacionesTurno: [asignacionTurnoActual],
    servicio: servicioRequiereVigilante,
  }),
)

imprimirCaso(
  'Estado de cobertura parcial',
  evaluarEstadoCobertura({
    turno: turnoEjemplo,
    asignacionesTurno: [asignacionTurnoActual],
    servicio: servicioRequiereVigilante,
  }),
)
