import { Router } from 'express'
import {
  listarIncidencias,
  obtenerIncidencia,
  crearIncidencia,
  actualizarIncidencia,
  eliminarIncidencia,
} from '../controllers/incidencia.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const incidenciaRouter = Router()

incidenciaRouter.use(authenticateToken)
incidenciaRouter.use(requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'))

incidenciaRouter.get('/', listarIncidencias)
incidenciaRouter.get('/:id', obtenerIncidencia)
incidenciaRouter.post('/', crearIncidencia)
incidenciaRouter.put('/:id', actualizarIncidencia)
incidenciaRouter.delete('/:id', eliminarIncidencia)
