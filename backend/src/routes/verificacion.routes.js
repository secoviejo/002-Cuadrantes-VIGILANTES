import { Router } from 'express'
import {
  listarVerificaciones,
  obtenerVerificacion,
  crearVerificacion,
  crearVerificacionesLote,
  actualizarVerificacion,
  eliminarVerificacion,
} from '../controllers/verificacion.controller.js'
import { authenticateToken } from '../middleware/auth.js'

export const verificacionRouter = Router()

verificacionRouter.get('/', listarVerificaciones)
verificacionRouter.post('/lote', authenticateToken, crearVerificacionesLote)
verificacionRouter.get('/:id', obtenerVerificacion)
verificacionRouter.post('/', authenticateToken, crearVerificacion)
verificacionRouter.put('/:id', actualizarVerificacion)
verificacionRouter.delete('/:id', eliminarVerificacion)
