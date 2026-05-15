import { Router } from 'express'
import {
  listarAsignacionesTurno,
  obtenerAsignacionTurno,
} from '../controllers/asignacionTurno.controller.js'

export const asignacionTurnoRouter = Router()

asignacionTurnoRouter.get('/', listarAsignacionesTurno)
asignacionTurnoRouter.get('/:id', obtenerAsignacionTurno)
