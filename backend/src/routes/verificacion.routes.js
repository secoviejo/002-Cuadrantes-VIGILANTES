import { Router } from 'express'
import {
  listarVerificaciones,
  obtenerVerificacion,
  crearVerificacion,
  crearVerificacionesLote,
  actualizarVerificacion,
  eliminarVerificacion,
} from '../controllers/verificacion.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const verificacionRouter = Router()

verificacionRouter.use(authenticateToken)
verificacionRouter.get('/', requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ', 'CONTRATA'), listarVerificaciones)
verificacionRouter.post('/lote', requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ', 'CONTRATA'), crearVerificacionesLote)
verificacionRouter.get('/:id', requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ', 'CONTRATA'), obtenerVerificacion)
verificacionRouter.post('/', requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ', 'CONTRATA'), crearVerificacion)
verificacionRouter.put('/:id', requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'), actualizarVerificacion)
verificacionRouter.delete('/:id', requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'), eliminarVerificacion)
