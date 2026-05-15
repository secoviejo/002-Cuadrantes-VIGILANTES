import { Router } from 'express'
import {
  actualizarAsignacionTurno,
  crearAsignacionTurno,
  eliminarAsignacionTurno,
  listarAsignacionesTurno,
  obtenerAsignacionTurno,
} from '../controllers/asignacionTurno.controller.js'

export const asignacionTurnoRouter = Router()

asignacionTurnoRouter.get('/', listarAsignacionesTurno)
asignacionTurnoRouter.get('/:id', obtenerAsignacionTurno)
asignacionTurnoRouter.post('/', crearAsignacionTurno)
asignacionTurnoRouter.put('/:id', actualizarAsignacionTurno)
asignacionTurnoRouter.delete('/:id', eliminarAsignacionTurno)
