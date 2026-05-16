import { Router } from 'express'
import {
  actualizarTrabajador,
  crearTrabajador,
  listarTrabajadores,
  obtenerTrabajador,
} from '../controllers/trabajador.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const trabajadorRouter = Router()

trabajadorRouter.use(authenticateToken)

trabajadorRouter.get('/', listarTrabajadores)
trabajadorRouter.post('/', requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'), crearTrabajador)
trabajadorRouter.get('/:id', obtenerTrabajador)
trabajadorRouter.put('/:id', requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'), actualizarTrabajador)
