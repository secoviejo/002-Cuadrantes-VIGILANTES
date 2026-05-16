import { Router } from 'express'
import {
  actualizarServicio,
  crearServicio,
  listarServicios,
  obtenerServicio,
} from '../controllers/servicio.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const servicioRouter = Router()

servicioRouter.use(authenticateToken)
servicioRouter.use(requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'))

servicioRouter.get('/', listarServicios)
servicioRouter.post('/', crearServicio)
servicioRouter.get('/:id', obtenerServicio)
servicioRouter.put('/:id', actualizarServicio)
