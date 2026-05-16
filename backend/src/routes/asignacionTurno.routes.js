import { Router } from 'express'
import {
  actualizarAsignacionTurno,
  crearAsignacionTurno,
  eliminarAsignacionTurno,
  listarAsignacionesTurno,
  obtenerAsignacionTurno,
} from '../controllers/asignacionTurno.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const asignacionTurnoRouter = Router()

asignacionTurnoRouter.use(authenticateToken)
asignacionTurnoRouter.use(requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'))

asignacionTurnoRouter.get('/', listarAsignacionesTurno)
asignacionTurnoRouter.get('/:id', obtenerAsignacionTurno)
asignacionTurnoRouter.post('/', crearAsignacionTurno)
asignacionTurnoRouter.put('/:id', actualizarAsignacionTurno)
asignacionTurnoRouter.delete('/:id', eliminarAsignacionTurno)
